import { useCallback } from 'react';
import { simpleYamlToJson, jsonToYaml } from '../utils/yamlConverter';
import { downloadFile } from '../utils/downloadUtils';
import { useTaskStorage } from '../contexts/TaskStorageContext';

/**
 * Custom hook for import/export functionality with new storage system
 * @param {Object} masterPlan - Current manufacturing plan
 * @param {function} onImport - Callback when plan is imported
 * @returns {Object} Import/export functions
 */
export const useImportExport = (masterPlan, onImport) => {
  const storage = useTaskStorage();

  // Export plan as YAML
  const exportYAML = useCallback(() => {
    try {
      const yamlStr = jsonToYaml(masterPlan);
      downloadFile(yamlStr, 'manufacturing-plan.yaml', 'text/yaml');
    } catch (error) {
      console.error('Export YAML error:', error);
      throw error;
    }
  }, [masterPlan]);

  // Export plan as JSON
  const exportJSON = useCallback(() => {
    try {
      const jsonStr = JSON.stringify(masterPlan, null, 2);
      downloadFile(jsonStr, 'manufacturing-plan.json', 'application/json');
    } catch (error) {
      console.error('Export JSON error:', error);
      throw error;
    }
  }, [masterPlan]);

  // Export complete progress data using new storage system
  const exportProgress = useCallback(async () => {
    try {
      const progressData = {};

      if (masterPlan && masterPlan.phases) {
        // Collect all task state data from the new storage system
        for (const phase of masterPlan.phases) {
          for (const task of phase.tasks) {
            try {
              const taskState = await storage.loadTaskState(task.id);
              if (taskState) {
                progressData[task.id] = taskState;
              }
            } catch (error) {
              console.warn(`Failed to load state for task ${task.id}:`, error);
            }
          }
        }
      }

      const exportData = {
        ...masterPlan,
        progressData,
        exportedAt: new Date().toISOString(),
        exportVersion: '2.0' // Mark this as using the new storage system
      };

      const jsonStr = JSON.stringify(exportData, null, 2);
      downloadFile(jsonStr, 'manufacturing-progress-complete.json', 'application/json');
    } catch (error) {
      console.error('Export progress error:', error);
      throw error;
    }
  }, [masterPlan, storage]);

  // Import plan from data with new storage system
  const importPlan = useCallback(async (importData) => {
    try {
      let parsed;

      // Try to parse as YAML first, then JSON
      try {
        parsed = simpleYamlToJson(importData);
      } catch (e) {
        try {
          parsed = JSON.parse(importData);
        } catch (e2) {
          throw new Error('Invalid YAML or JSON format');
        }
      }

      // Validate the structure
      if (!parsed.title || !parsed.phases || !Array.isArray(parsed.phases)) {
        throw new Error('Invalid manufacturing plan structure');
      }

      // Clear existing task data using new storage system
      if (masterPlan && masterPlan.phases) {
        for (const phase of masterPlan.phases) {
          for (const task of phase.tasks) {
            try {
              await storage.deleteTaskState(task.id);
            } catch (error) {
              console.warn(`Failed to clear task state for ${task.id}:`, error);
            }
          }
        }
      }

      // Import progress data if available (from new format exports)
      if (parsed.progressData && parsed.exportVersion === '2.0') {
        for (const [taskId, taskState] of Object.entries(parsed.progressData)) {
          try {
            await storage.saveTaskState(taskId, taskState);
          } catch (error) {
            console.warn(`Failed to import progress for task ${taskId}:`, error);
          }
        }
      }

      // Call the import callback
      if (onImport) {
        onImport(parsed);
      }

      return parsed;
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    }
  }, [masterPlan, onImport, storage]);

  return {
    exportYAML,
    exportJSON,
    exportProgress,
    importPlan
  };
};