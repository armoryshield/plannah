import React, { useState, useEffect } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '../ui';
import { useTaskProgress } from '../../hooks';
import TaskItem from './TaskItem';

/**
 * Phase Section Component for left navigation
 * @param {Object} props
 * @param {Object} props.phase - Phase object
 * @param {string} props.selectedTaskId - Currently selected task ID
 * @param {function} props.onTaskSelect - Task selection handler
 * @param {function} props.onUpdate - Update callback
 * @param {function} props.onAddTask - Add task callback
 * @param {function} props.onEditTask - Edit task callback
 */
const PhaseSection = ({ phase, selectedTaskId, onTaskSelect, onUpdate, onAddTask, onEditTask }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { calculatePhaseProgress } = useTaskProgress();
  const [phaseProgress, setPhaseProgress] = useState({ completed: 0, total: 0, percentage: 0 });

  const updatePhaseProgress = () => {
    const progress = calculatePhaseProgress(phase);
    setPhaseProgress(progress);
  };

  useEffect(() => {
    updatePhaseProgress();
  }, [phase, calculatePhaseProgress]);

  const handleTaskUpdate = () => {
    updatePhaseProgress();
    if (onUpdate) onUpdate();
  };

  const isPhaseCompleted = phaseProgress.completed === phaseProgress.total && phaseProgress.total > 0;

  return (
    <div className="mb-4">
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between p-3 h-auto text-left hover:bg-gray-800"
      >
        <div className="flex items-center space-x-3">
          <div className={`text-lg ${isPhaseCompleted ? 'text-green-400' : 'text-gray-500'}`}>
            {isPhaseCompleted ? '✓' : '○'}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight">{phase.title}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className="text-xs text-gray-400">
                {phaseProgress.completed}/{phaseProgress.total}
              </div>
              <div className="flex-1 bg-gray-700 rounded-full h-1 max-w-20">
                <div
                  className="bg-green-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${phaseProgress.percentage}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">{phaseProgress.percentage}%</span>
            </div>
          </div>
        </div>
        <div className={`transform transition-transform text-gray-400 ${isExpanded ? 'rotate-180' : ''}`}>
          ↓
        </div>
      </Button>
      {isExpanded && (
        <div className="ml-4 mt-2 border-l border-gray-600 pl-4">
          <Droppable droppableId={phase.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-2 ${snapshot.isDraggingOver ? 'bg-gray-800/50 rounded-md p-2' : ''}`}
              >
                {phase.tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={snapshot.isDragging ? 'bg-gray-700 rounded-md' : ''}
                      >
                        <TaskItem
                          task={task}
                          phaseId={phase.id}
                          isSelected={selectedTaskId === task.id}
                          onClick={() => onTaskSelect(task)}
                          onUpdate={handleTaskUpdate}
                          onEdit={() => onEditTask(task)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Add Task Button */}
          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onAddTask(phase.id)}
              className="text-xs h-7 px-2 text-gray-400 hover:text-white"
            >
              + Add Task
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhaseSection;