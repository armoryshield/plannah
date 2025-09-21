import { useCallback } from 'react';
import { simpleYamlToJson, jsonToYaml } from '../utils/yamlConverter';
import { downloadFile } from '../utils/downloadUtils';

/**
 * Custom hook for import/export functionality
 * @param {Object} masterPlan - Current manufacturing plan
 * @param {function} onImport - Callback when plan is imported
 * @returns {Object} Import/export functions
 */
export const useImportExport = (masterPlan, onImport) => {

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

  // Export complete progress data
  const exportProgress = useCallback(() => {
    const progressData = {};

    if (masterPlan && masterPlan.phases) {
      masterPlan.phases.forEach(phase => {
        phase.tasks.forEach(task => {
          const savedData = localStorage.getItem(`task-${task.id}`);
          if (savedData) {
            try {
              progressData[task.id] = JSON.parse(savedData);
            } catch (e) {
              console.error('Error parsing task data for export:', e);
            }
          }
        });
      });
    }

    const exportData = {
      ...masterPlan,
      progressData
    };

    const jsonStr = JSON.stringify(exportData, null, 2);
    downloadFile(jsonStr, 'manufacturing-progress-complete.json', 'application/json');
  }, [masterPlan]);

  // Import plan from data
  const importPlan = useCallback((importData) => {
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

      // Clear existing task data if importing new plan
      if (masterPlan && masterPlan.phases) {
        masterPlan.phases.forEach(phase => {
          phase.tasks.forEach(task => {
            localStorage.removeItem(`task-${task.id}`);
          });
        });
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
  }, [masterPlan, onImport]);

  return {
    exportYAML,
    exportJSON,
    exportProgress,
    importPlan
  };
};