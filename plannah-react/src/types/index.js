// Type definitions for Manufacturing Plan application

/**
 * @typedef {'pending' | 'in-progress' | 'completed' | 'blocked'} TaskStatus
 */

/**
 * @typedef {Object} Task
 * @property {string} id - Unique task identifier
 * @property {string} title - Task title
 * @property {string} description - Task description
 * @property {string} timeEstimate - Estimated time to complete
 * @property {string} scheduleDate - Scheduled date (YYYY-MM-DD)
 * @property {string} completedDate - Completion date (YYYY-MM-DD)
 * @property {string} assignee - Person assigned to task
 * @property {string} sopDocument - SOP document URL
 * @property {string[]} tags - Task tags
 * @property {TaskStatus} status - Task status
 * @property {string[]} dependsOn - Array of task IDs this task depends on
 */

/**
 * @typedef {Object} Phase
 * @property {string} id - Unique phase identifier
 * @property {string} title - Phase title
 * @property {string} description - Phase description
 * @property {Task[]} tasks - Array of tasks in this phase
 */

/**
 * @typedef {Object} ManufacturingPlan
 * @property {string} title - Plan title
 * @property {Phase[]} phases - Array of phases
 */

/**
 * @typedef {Object} TaskProgress
 * @property {TaskStatus} status - Current status
 * @property {string} notes - Progress notes
 * @property {string[]} files - Uploaded file names
 * @property {string} assignee - Assigned person
 * @property {string} scheduleDate - Scheduled date
 * @property {string} completedDate - Completion date
 * @property {string} sopDocument - SOP document URL
 */

export {};