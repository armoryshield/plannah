import React, { useState, useEffect } from 'react';
import { useTaskStorage } from '../../contexts/TaskStorageContext';

/**
 * Enhanced Task Item Component for left navigation
 * @param {Object} props
 * @param {Object} props.task - Task object
 * @param {string} props.phaseId - Phase identifier
 * @param {boolean} props.isSelected - Whether task is selected
 * @param {function} props.onClick - Click handler
 * @param {function} props.onUpdate - Update callback
 * @param {function} props.onEdit - Edit task callback
 * @param {boolean} props.isPlanLocked - Whether the plan is locked
 */
const TaskItem = ({ task, phaseId, isSelected, onClick, onUpdate, onEdit, isPlanLocked }) => {
  const storage = useTaskStorage();
  const [taskState, setTaskState] = useState({
    status: 'pending',
    assignee: '',
    isCompleted: false
  });

  // Load task state from storage
  useEffect(() => {
    const loadTaskState = async () => {
      try {
        const saved = await storage.loadTaskState(task.id);
        const status = saved?.status || task.status || 'pending';
        const assignee = saved?.assignee || task.assignee || '';

        setTaskState({
          status,
          assignee,
          isCompleted: status === 'completed'
        });
      } catch (error) {
        console.error('Failed to load task state:', error);
        setTaskState({
          status: task.status || 'pending',
          assignee: task.assignee || '',
          isCompleted: (task.status || 'pending') === 'completed'
        });
      }
    };

    loadTaskState();
  }, [task.id, storage, task.status, task.assignee]);

  const handleCheckboxChange = async (e) => {
    e.stopPropagation();
    if (isPlanLocked) return; // Prevent changes when locked

    const newStatus = e.target.checked ? 'completed' : 'pending';

    try {
      const currentState = await storage.loadTaskState(task.id) || {};
      const updatedState = {
        ...currentState,
        status: newStatus,
        completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : ''
      };

      await storage.saveTaskState(task.id, updatedState);

      setTaskState(prev => ({
        ...prev,
        status: newStatus,
        isCompleted: e.target.checked
      }));

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to save task status:', error);
    }
  };

  const getStatusPill = () => {
    const { status } = taskState;

    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            ✓ Complete
          </span>
        );
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
            ⏳ In Progress
          </span>
        );
      case 'blocked':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            🚫 Blocked
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            ○ Pending
          </span>
        );
    }
  };

  const getAssigneeAvatar = () => {
    if (!taskState.assignee) return null;

    const name = taskState.assignee.toLowerCase().replace(/\s+/g, '.');

    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-blue-100 text-blue-800 border border-blue-200">
        @{name}
      </span>
    );
  };

  return (
    <div
      className={`group relative border rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'bg-gray-700 border-gray-600 shadow-sm'
          : 'bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/80 hover:border-gray-600'
      }`}
      onClick={onClick}
    >
      {/* Main content area */}
      <div className="p-3 space-y-3">
        {/* Header row with checkbox and title */}
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={taskState.isCompleted}
            onChange={handleCheckboxChange}
            disabled={isPlanLocked}
            className={`mt-0.5 h-3.5 w-3.5 rounded border text-blue-600 focus:ring-blue-500 focus:ring-offset-0 focus:ring-1 ${
              isPlanLocked
                ? 'border-gray-600 bg-gray-800 cursor-not-allowed opacity-50'
                : 'border-gray-500 bg-gray-800 cursor-pointer'
            }`}
            onClick={(e) => e.stopPropagation()}
            title={isPlanLocked ? 'Plan is locked' : 'Toggle task completion'}
          />

          <div className="flex-1 min-w-0 space-y-1">
            {/* Title and edit button */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="font-medium text-sm leading-snug text-gray-100 truncate">
                {task.title}
              </h4>
              {onEdit && !isPlanLocked && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="opacity-0 group-hover:opacity-100 flex-shrink-0 p-1 text-gray-400 hover:text-gray-200 transition-opacity"
                  title="Edit task"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              )}
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Status and metadata row */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {getStatusPill()}
            {getAssigneeAvatar()}
          </div>

          {task.timeEstimate && (
            <span className="text-xs font-mono text-gray-400 bg-gray-800 px-2 py-0.5 rounded border border-gray-600">
              {task.timeEstimate}
            </span>
          )}
        </div>

        {/* Tags row (if any) */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs px-1.5 py-0.5 rounded text-gray-300 bg-gray-700 border border-gray-600"
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-xs text-gray-400 px-1">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-lg" />
      )}
    </div>
  );
};

export default TaskItem;