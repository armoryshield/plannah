import React, { createContext, useContext } from 'react';
import { createDefaultStorage } from '../services/storage';

/**
 * Context for task storage service
 */
const TaskStorageContext = createContext(null);

/**
 * Hook to use task storage service
 * @returns {ITaskStorage} Storage service instance
 */
export const useTaskStorage = () => {
  const storage = useContext(TaskStorageContext);
  if (!storage) {
    throw new Error('useTaskStorage must be used within a TaskStorageProvider');
  }
  return storage;
};

/**
 * Provider component for task storage context
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {ITaskStorage} [props.storage] - Optional storage implementation, defaults to LocalStorage
 */
export const TaskStorageProvider = ({ children, storage = null }) => {
  const storageInstance = storage || createDefaultStorage();

  return (
    <TaskStorageContext.Provider value={storageInstance}>
      {children}
    </TaskStorageContext.Provider>
  );
};