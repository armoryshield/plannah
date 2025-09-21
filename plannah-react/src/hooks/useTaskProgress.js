import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for calculating task progress
 * @param {Object} masterPlan - Manufacturing plan object
 * @returns {Object} Progress calculation functions and total progress
 */
export const useTaskProgress = (masterPlan) => {
  const [totalProgress, setTotalProgress] = useState(0);

  // Calculate total progress across all phases
  const calculateTotalProgress = useCallback(() => {
    if (!masterPlan || !masterPlan.phases) return 0;

    let totalTasks = 0;
    let completedTasks = 0;

    masterPlan.phases.forEach(phase => {
      totalTasks += phase.tasks.length;
      phase.tasks.forEach(task => {
        const savedData = localStorage.getItem(`task-${task.id}`);
        if (savedData) {
          try {
            const data = JSON.parse(savedData);
            if (data.status === 'completed') completedTasks++;
          } catch (e) {
            console.error('Error parsing task data:', e);
          }
        }
      });
    });

    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    setTotalProgress(progress);
    return progress;
  }, [masterPlan]);

  // Calculate progress for a specific phase
  const calculatePhaseProgress = useCallback((phase) => {
    if (!phase || !phase.tasks) return { completed: 0, total: 0, percentage: 0 };

    let completedTasks = 0;
    const totalTasks = phase.tasks.length;

    phase.tasks.forEach(task => {
      const savedData = localStorage.getItem(`task-${task.id}`);
      if (savedData) {
        try {
          const data = JSON.parse(savedData);
          if (data.status === 'completed') completedTasks++;
        } catch (e) {
          console.error('Error parsing task data:', e);
        }
      }
    });

    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      completed: completedTasks,
      total: totalTasks,
      percentage
    };
  }, []);

  // Recalculate progress when master plan changes
  useEffect(() => {
    calculateTotalProgress();
  }, [calculateTotalProgress]);

  return {
    totalProgress,
    calculateTotalProgress,
    calculatePhaseProgress
  };
};