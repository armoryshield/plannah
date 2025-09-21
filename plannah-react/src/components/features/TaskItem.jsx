import React, { useState, useEffect } from 'react';
import { Badge } from '../ui';
import { useTaskStorage } from '../../hooks';

/**
 * Task Item Component for left navigation
 * @param {Object} props
 * @param {Object} props.task - Task object
 * @param {string} props.phaseId - Phase identifier
 * @param {boolean} props.isSelected - Whether task is selected
 * @param {function} props.onClick - Click handler
 * @param {function} props.onUpdate - Update callback
 * @param {function} props.onEdit - Edit task callback
 */
const TaskItem = ({ task, phaseId, isSelected, onClick, onUpdate, onEdit }) => {
  const [taskData] = useTaskStorage(task.id);
  const [isCompleted, setIsCompleted] = useState(false);
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    setIsCompleted(taskData.status === 'completed');
    setStatus(taskData.status || 'pending');
  }, [taskData]);

  const handleCheckboxChange = (e) => {
    e.stopPropagation();
    const newStatus = e.target.checked ? 'completed' : 'pending';

    // Update localStorage directly for immediate checkbox response
    const storageKey = `task-${task.id}`;
    const savedData = localStorage.getItem(storageKey);
    const data = savedData ? JSON.parse(savedData) : {};
    data.status = newStatus;

    if (newStatus === 'completed') {
      data.completedDate = new Date().toISOString().split('T')[0];
    } else {
      data.completedDate = '';
    }

    localStorage.setItem(storageKey, JSON.stringify(data));
    setIsCompleted(e.target.checked);
    setStatus(newStatus);

    if (onUpdate) onUpdate();
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed': return <span className="text-green-400">✓</span>;
      case 'in-progress': return <span className="text-yellow-400">⏳</span>;
      case 'blocked': return <span className="text-red-400">🚫</span>;
      default: return <span className="text-gray-500">○</span>;
    }
  };

  return (
    <div
      className={`p-3 rounded-md cursor-pointer transition-colors ${
        isSelected
          ? 'bg-gray-700 text-white'
          : 'hover:bg-gray-800'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleCheckboxChange}
          className="mt-1 h-4 w-4 rounded border border-gray-500"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 group">
            {getStatusIcon()}
            <h4 className="font-medium text-sm leading-tight flex-1">{task.title}</h4>
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white text-xs px-1 transition-opacity"
              >
                ✏️
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
            {task.description}
          </p>
          <div className="flex flex-wrap gap-1 mt-2">
            <Badge variant="outline" className="text-xs px-1 py-0">
              {task.timeEstimate}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;