import { useState, useEffect } from 'react';

/**
 * Custom hook for localStorage with state management
 * @param {string} key - localStorage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @returns {[any, function]} State value and setter function
 */
export const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  const setValue = (value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Custom hook for task-specific localStorage
 * @param {string} taskId - Task identifier
 * @returns {[Object, function]} Task progress data and setter
 */
export const useTaskStorage = (taskId) => {
  const storageKey = `task-${taskId}`;
  const [taskData, setTaskData] = useLocalStorage(storageKey, {});

  const updateTaskData = (updates) => {
    setTaskData(prev => ({ ...prev, ...updates }));
  };

  return [taskData, updateTaskData];
};