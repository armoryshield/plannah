import React, { useState, useEffect } from 'react';
import { Button, Input, Textarea, Badge } from '../ui';

/**
 * Task Edit Modal Component for creating/editing tasks
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {function} props.onClose - Close modal handler
 * @param {function} props.onSave - Save task handler
 * @param {function} props.onDelete - Delete task handler (only for existing tasks)
 * @param {Object} props.task - Task to edit (null for new task)
 * @param {string} props.phaseId - Phase ID where task belongs
 */
const TaskEditModal = ({ isOpen, onClose, onSave, onDelete, task, phaseId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeEstimate: '',
    tags: [],
    dependsOn: []
  });
  const [tagsInput, setTagsInput] = useState('');
  const [errors, setErrors] = useState({});

  // Initialize form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        timeEstimate: task.timeEstimate || '',
        tags: task.tags || [],
        dependsOn: task.dependsOn || []
      });
      setTagsInput(task.tags ? task.tags.join(', ') : '');
    } else {
      // Reset form for new task
      setFormData({
        title: '',
        description: '',
        timeEstimate: '',
        tags: [],
        dependsOn: []
      });
      setTagsInput('');
    }
    setErrors({});
  }, [task, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleTagsChange = (value) => {
    setTagsInput(value);
    // Convert comma-separated string to array
    const tagsArray = value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
    handleInputChange('tags', tagsArray);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.timeEstimate.trim()) {
      newErrors.timeEstimate = 'Time estimate is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const taskData = {
      ...formData,
      id: task?.id || `${phaseId}-task-${Date.now()}`,
      status: task?.status || 'pending',
      scheduleDate: task?.scheduleDate || '',
      completedDate: task?.completedDate || '',
      assignee: task?.assignee || '',
      sopDocument: task?.sopDocument || ''
    };

    onSave(taskData);
    onClose();
  };

  const handleDelete = () => {
    if (task && onDelete) {
      onDelete(task.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>✕</Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter task title"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter task description"
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>

            {/* Time Estimate */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Time Estimate <span className="text-red-400">*</span>
              </label>
              <Input
                value={formData.timeEstimate}
                onChange={(e) => handleInputChange('timeEstimate', e.target.value)}
                placeholder="e.g., 1-2 weeks, 3 days, 1 month"
                className={errors.timeEstimate ? 'border-red-500' : ''}
              />
              {errors.timeEstimate && (
                <p className="text-red-400 text-sm mt-1">{errors.timeEstimate}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Tags
              </label>
              <Input
                value={tagsInput}
                onChange={(e) => handleTagsChange(e.target.value)}
                placeholder="Enter tags separated by commas"
              />
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-6 border-t border-gray-700">
          <div>
            {task && onDelete && (
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                Delete Task
              </Button>
            )}
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {task ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskEditModal;