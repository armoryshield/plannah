import React, { useState, useEffect, useMemo } from 'react';
import { useTaskStorage } from '../../contexts/TaskStorageContext';

/**
 * Gantt Chart Component for Manufacturing Plan Timeline View
 * @param {Object} props
 * @param {Object} props.masterPlan - Manufacturing plan with phases and tasks
 * @param {function} props.onTaskSelect - Callback when task is selected
 * @param {string} props.selectedTaskId - Currently selected task ID
 */
const GanttChart = ({ masterPlan, onTaskSelect, selectedTaskId }) => {
  const storage = useTaskStorage();
  const [tasksWithSchedule, setTasksWithSchedule] = useState([]);
  const [timelineRange, setTimelineRange] = useState({ start: null, end: null });

  // Load task scheduling data from storage
  useEffect(() => {
    const loadTaskSchedules = async () => {
      if (!masterPlan?.phases) return;

      const scheduledTasks = [];

      for (const phase of masterPlan.phases) {
        for (const task of phase.tasks) {
          try {
            const taskState = await storage.loadTaskState(task.id);
            const scheduleDate = taskState?.scheduleDate || task.scheduleDate;
            const scheduleEndDate = taskState?.scheduleEndDate || task.scheduleEndDate;

            if (scheduleDate && scheduleEndDate) {
              scheduledTasks.push({
                ...task,
                phaseTitle: phase.title,
                phaseId: phase.id,
                scheduleDate,
                scheduleEndDate,
                status: taskState?.status || task.status || 'pending',
                assignee: taskState?.assignee || task.assignee || ''
              });
            }
          } catch (error) {
            console.warn(`Failed to load schedule for task ${task.id}:`, error);
          }
        }
      }

      setTasksWithSchedule(scheduledTasks);
    };

    loadTaskSchedules();
  }, [masterPlan, storage]);

  // Calculate timeline range based on scheduled tasks
  const calculatedTimelineRange = useMemo(() => {
    if (tasksWithSchedule.length === 0) {
      const today = new Date();
      const nextMonth = new Date(today);
      nextMonth.setMonth(today.getMonth() + 1);

      return {
        start: today.toISOString().split('T')[0],
        end: nextMonth.toISOString().split('T')[0]
      };
    }

    const dates = tasksWithSchedule.flatMap(task => [
      new Date(task.scheduleDate),
      new Date(task.scheduleEndDate)
    ]);

    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    // Add padding
    minDate.setDate(minDate.getDate() - 7);
    maxDate.setDate(maxDate.getDate() + 7);

    return {
      start: minDate.toISOString().split('T')[0],
      end: maxDate.toISOString().split('T')[0]
    };
  }, [tasksWithSchedule]);

  useEffect(() => {
    setTimelineRange(calculatedTimelineRange);
  }, [calculatedTimelineRange]);

  // Generate timeline days
  const timelineDays = useMemo(() => {
    if (!timelineRange.start || !timelineRange.end) return [];

    const days = [];
    const current = new Date(timelineRange.start);
    const end = new Date(timelineRange.end);

    while (current <= end) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [timelineRange]);

  // Calculate task bar position and width
  const getTaskBarStyle = (task) => {
    if (!timelineRange.start) return { display: 'none' };

    const timelineStart = new Date(timelineRange.start);
    const taskStart = new Date(task.scheduleDate);
    const taskEnd = new Date(task.scheduleEndDate);

    const totalDays = timelineDays.length;
    const startOffset = Math.max(0, (taskStart - timelineStart) / (1000 * 60 * 60 * 24));
    const duration = (taskEnd - taskStart) / (1000 * 60 * 60 * 24) + 1; // +1 to include end day

    const leftPercent = (startOffset / totalDays) * 100;
    const widthPercent = (duration / totalDays) * 100;

    return {
      left: `${leftPercent}%`,
      width: `${Math.max(widthPercent, 0.5)}%` // Minimum width for visibility
    };
  };

  // Get status color for task bars
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-orange-500';
      case 'blocked': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  // Group tasks by phase
  const tasksByPhase = useMemo(() => {
    const grouped = {};
    tasksWithSchedule.forEach(task => {
      if (!grouped[task.phaseId]) {
        grouped[task.phaseId] = {
          title: task.phaseTitle,
          tasks: []
        };
      }
      grouped[task.phaseId].tasks.push(task);
    });
    return grouped;
  }, [tasksWithSchedule]);

  if (tasksWithSchedule.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-lg mb-2">No scheduled tasks found</p>
          <p className="text-sm">Add start and end dates to tasks to see them in the Gantt chart</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gray-900">
      {/* Header */}
      <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-4 z-10">
        <h2 className="text-lg font-semibold text-white">Gantt Chart View</h2>
        <p className="text-sm text-gray-400 mt-1">
          {timelineRange.start} to {timelineRange.end} • {tasksWithSchedule.length} scheduled tasks
        </p>
      </div>

      {/* Timeline */}
      <div className="p-4">
        {/* Timeline Header */}
        <div className="flex mb-4">
          <div className="w-64 flex-shrink-0"></div>
          <div className="flex-1 relative">
            <div className="flex border-b border-gray-600">
              {timelineDays.map((day, index) => (
                <div
                  key={index}
                  className="flex-1 text-xs text-center py-2 border-r border-gray-700 text-gray-300"
                  style={{ minWidth: '30px' }}
                >
                  <div className="font-medium">
                    {day.toLocaleDateString('en-US', { day: 'numeric' })}
                  </div>
                  <div className="text-gray-500">
                    {day.toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks by Phase */}
        {Object.entries(tasksByPhase).map(([phaseId, phase]) => (
          <div key={phaseId} className="mb-6">
            {/* Phase Header */}
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-200 bg-gray-700 px-3 py-1 rounded">
                {phase.title}
              </h3>
            </div>

            {/* Phase Tasks */}
            {phase.tasks.map((task) => (
              <div
                key={task.id}
                className={`flex mb-2 cursor-pointer transition-colors ${
                  selectedTaskId === task.id ? 'bg-gray-700' : 'hover:bg-gray-800'
                }`}
                onClick={() => onTaskSelect(task)}
              >
                {/* Task Info */}
                <div className="w-64 flex-shrink-0 px-3 py-2 border-r border-gray-700">
                  <div className="text-sm font-medium text-white truncate">
                    {task.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {task.assignee && (
                      <span className="mr-2">@{task.assignee}</span>
                    )}
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-700 text-gray-300">
                      {task.status}
                    </span>
                  </div>
                </div>

                {/* Timeline Bar */}
                <div className="flex-1 relative py-3 px-2">
                  <div className="relative h-6 bg-gray-800 rounded">
                    <div
                      className={`absolute top-0 h-6 rounded transition-colors ${getStatusColor(task.status)} ${
                        selectedTaskId === task.id ? 'ring-2 ring-blue-400' : ''
                      }`}
                      style={getTaskBarStyle(task)}
                      title={`${task.title}: ${task.scheduleDate} to ${task.scheduleEndDate}`}
                    >
                      <div className="h-full flex items-center justify-center text-xs text-white font-medium px-2 truncate">
                        {task.title}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;