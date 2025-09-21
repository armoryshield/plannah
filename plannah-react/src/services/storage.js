/**
 * Storage interface for task state management
 * Provides a pluggable backend system for different storage implementations
 */

/**
 * Interface for task storage backends
 * @interface ITaskStorage
 */
export class ITaskStorage {
  /**
   * Save task state
   * @param {string} taskId - Unique task identifier
   * @param {Object} state - Task state object
   * @returns {Promise<void>}
   */
  async saveTaskState(taskId, state) {
    throw new Error('saveTaskState must be implemented');
  }

  /**
   * Load task state
   * @param {string} taskId - Unique task identifier
   * @returns {Promise<Object|null>} Task state object or null if not found
   */
  async loadTaskState(taskId) {
    throw new Error('loadTaskState must be implemented');
  }

  /**
   * Delete task state
   * @param {string} taskId - Unique task identifier
   * @returns {Promise<void>}
   */
  async deleteTaskState(taskId) {
    throw new Error('deleteTaskState must be implemented');
  }

  /**
   * Check if task state exists
   * @param {string} taskId - Unique task identifier
   * @returns {Promise<boolean>}
   */
  async hasTaskState(taskId) {
    throw new Error('hasTaskState must be implemented');
  }
}

/**
 * LocalStorage implementation of the task storage interface
 */
export class LocalStorageTaskStorage extends ITaskStorage {
  constructor() {
    super();
    this.prefix = 'task-state-';
  }

  /**
   * Generate storage key for a task
   * @param {string} taskId
   * @returns {string}
   */
  _getKey(taskId) {
    return `${this.prefix}${taskId}`;
  }

  /**
   * Save task state to localStorage
   * @param {string} taskId
   * @param {Object} state
   */
  async saveTaskState(taskId, state) {
    try {
      const key = this._getKey(taskId);
      const serialized = JSON.stringify({
        taskId,
        state,
        timestamp: Date.now()
      });
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to save task state for ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Load task state from localStorage
   * @param {string} taskId
   * @returns {Object|null}
   */
  async loadTaskState(taskId) {
    try {
      const key = this._getKey(taskId);
      const serialized = localStorage.getItem(key);

      if (!serialized) {
        return null;
      }

      const data = JSON.parse(serialized);
      return data.state || null;
    } catch (error) {
      console.error(`Failed to load task state for ${taskId}:`, error);
      return null;
    }
  }

  /**
   * Delete task state from localStorage
   * @param {string} taskId
   */
  async deleteTaskState(taskId) {
    try {
      const key = this._getKey(taskId);
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to delete task state for ${taskId}:`, error);
      throw error;
    }
  }

  /**
   * Check if task state exists in localStorage
   * @param {string} taskId
   * @returns {boolean}
   */
  async hasTaskState(taskId) {
    try {
      const key = this._getKey(taskId);
      return localStorage.getItem(key) !== null;
    } catch (error) {
      console.error(`Failed to check task state for ${taskId}:`, error);
      return false;
    }
  }
}

/**
 * Create default storage instance
 */
export const createDefaultStorage = () => {
  return new LocalStorageTaskStorage();
};