import React, { useState, useEffect } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from '../ui';
import { useTaskProgress } from '../../hooks';
import { ChevronDown, ChevronUp, ChevronsUpDown, ListChevronsDownUp, Trash2 } from 'lucide-react';
import TaskItem from './TaskItem';

/**
 * Phase Section Component for left navigation
 * @param {Object} props
 * @param {Object} props.phase - Phase object
 * @param {number} props.phaseIndex - Index of this phase in the list
 * @param {number} props.totalPhases - Total number of phases
 * @param {string} props.selectedTaskId - Currently selected task ID
 * @param {function} props.onTaskSelect - Task selection handler
 * @param {function} props.onUpdate - Update callback
 * @param {function} props.onAddTask - Add task callback
 * @param {function} props.onEditTask - Edit task callback
 * @param {function} props.onMovePhase - Phase movement handler
 * @param {function} props.onDeletePhase - Phase deletion handler
 * @param {boolean} props.isPlanLocked - Whether the plan is locked
 */
const PhaseSection = ({
  phase,
  phaseIndex,
  totalPhases,
  selectedTaskId,
  onTaskSelect,
  onUpdate,
  onAddTask,
  onEditTask,
  onMovePhase,
  onDeletePhase,
  isPlanLocked
}) => {
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

  // Phase movement helpers
  const canMoveUp = phaseIndex > 0;
  const canMoveDown = phaseIndex < totalPhases - 1;
  const isFirstPhase = phaseIndex === 0;
  const isLastPhase = phaseIndex === totalPhases - 1;

  const getMoveIcon = () => {
    if (isFirstPhase) return ChevronDown;
    if (isLastPhase) return ChevronUp;
    return ChevronsUpDown;
  };

  const handleMoveClick = (e, direction) => {
    e.stopPropagation(); // Prevent phase collapse/expand
    onMovePhase(phase.id, direction);
  };

  return (
    <div className="mb-4">
      <div
        className="flex items-center justify-between p-3 hover:bg-gray-800 rounded-md cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3 flex-1">
          {/* Left side: Collapse Toggle */}
          <div
            className="h-5 w-5 flex items-center justify-center text-gray-400 hover:text-gray-200 flex-shrink-0"
            title={isExpanded ? 'Collapse phase' : 'Expand phase'}
          >
            <ListChevronsDownUp className={`h-3 w-3 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </div>

          {/* Phase Status and Content */}
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

        {/* Right side: Delete and Movement Controls - Only show when not locked */}
        {!isPlanLocked && (
          <div className="flex items-center space-x-1">
            {/* Delete Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDeletePhase(phase.id);
              }}
              className="h-5 w-5 p-0 text-gray-400 hover:text-red-400"
              title="Delete phase"
            >
              <Trash2 className="h-3 w-3" />
            </Button>

            {/* Phase Movement Controls */}
            <div className="flex flex-col items-center space-y-0.5">
              {isFirstPhase ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-4 w-4 p-0 ${
                    !canMoveDown
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={(e) => handleMoveClick(e, 'down')}
                  disabled={!canMoveDown}
                  title="Move phase down"
                >
                  <ChevronDown className="h-3 w-3" />
                </Button>
              ) : isLastPhase ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-4 w-4 p-0 ${
                    !canMoveUp
                      ? 'text-gray-600 cursor-not-allowed'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                  onClick={(e) => handleMoveClick(e, 'up')}
                  disabled={!canMoveUp}
                  title="Move phase up"
                >
                  <ChevronUp className="h-3 w-3" />
                </Button>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-3 w-3 p-0 ${
                      !canMoveUp
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    onClick={(e) => handleMoveClick(e, 'up')}
                    disabled={!canMoveUp}
                    title="Move phase up"
                  >
                    <ChevronUp className="h-2.5 w-2.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-3 w-3 p-0 ${
                      !canMoveDown
                        ? 'text-gray-600 cursor-not-allowed'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                    onClick={(e) => handleMoveClick(e, 'down')}
                    disabled={!canMoveDown}
                    title="Move phase down"
                  >
                    <ChevronDown className="h-2.5 w-2.5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {isExpanded && (
        <div className="ml-4 mt-2 border-l border-gray-600 pl-4">
          <Droppable droppableId={phase.id} isDropDisabled={isPlanLocked}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-2 ${
                  snapshot.isDraggingOver && !isPlanLocked ? 'bg-gray-800/50 rounded-md p-2' : ''
                }`}
              >
                {phase.tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index} isDragDisabled={isPlanLocked}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...(!isPlanLocked ? provided.dragHandleProps : {})}
                        className={`${
                          snapshot.isDragging && !isPlanLocked ? 'bg-gray-700 rounded-md' : ''
                        } ${isPlanLocked ? 'cursor-default' : ''}`}
                      >
                        <TaskItem
                          task={task}
                          phaseId={phase.id}
                          isSelected={selectedTaskId === task.id}
                          onClick={() => onTaskSelect(task)}
                          onUpdate={handleTaskUpdate}
                          onEdit={() => onEditTask(task)}
                          isPlanLocked={isPlanLocked}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Add Task Button - Only show when not locked */}
          {!isPlanLocked && (
            <div className="mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddTask(phase.id)}
                className="text-xs h-7 px-2 text-gray-400 hover:text-white"
                title="Add new task"
              >
                + Add Task
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PhaseSection;