import React, { useState, useEffect } from 'react';
import { Button, Badge, Input, Textarea } from '../ui';
import { useTaskStorage } from '../../hooks';

/**
 * Task Detail Panel Component
 * @param {Object} props
 * @param {Object} props.task - Selected task object
 * @param {function} props.onUpdate - Callback when task is updated
 * @param {function} props.onClose - Callback to close the panel
 */
const TaskDetailPanel = ({ task, onUpdate, onClose }) => {
  const [taskData, updateTaskData] = useTaskStorage(task?.id);
  const [formData, setFormData] = useState(task || {});
  const [notes, setNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Update form data when task changes or when task data is loaded
  useEffect(() => {
    if (task) {
      setFormData({ ...task, ...taskData });
      setNotes(taskData.notes || '');
      setUploadedFiles(taskData.files || []);
    }
  }, [task, taskData]);

  // Auto-save changes
  useEffect(() => {
    if (task) {
      const dataToSave = {
        ...formData,
        notes: notes,
        files: uploadedFiles
      };
      updateTaskData(dataToSave);
      if (onUpdate) onUpdate();
    }
  }, [formData, notes, uploadedFiles, task, updateTaskData, onUpdate]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const fileNames = files.map(file => file.name);
    setUploadedFiles(prev => [...prev, ...fileNames]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in-progress': return 'warning';
      case 'blocked': return 'danger';
      default: return 'outline';
    }
  };

  if (!task) {
    return (
      <div className="flex items-center justify-center h-full text-muted-dark-foreground">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <p className="text-lg">Select a task to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">{task.title}</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          ✕
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Status and Basic Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={formData.status || 'pending'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full h-10 rounded-md border border-gray-600 bg-gray-800 text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Assignee</label>
            <Input
              value={formData.assignee || ''}
              onChange={(e) => handleInputChange('assignee', e.target.value)}
              placeholder="Enter assignee name"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Scheduled Date</label>
            <Input
              type="date"
              value={formData.scheduleDate || ''}
              onChange={(e) => handleInputChange('scheduleDate', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Completed Date</label>
            <Input
              type="date"
              value={formData.completedDate || ''}
              onChange={(e) => handleInputChange('completedDate', e.target.value)}
            />
          </div>
        </div>

        {/* Description and Time Estimate */}
        <div>
          <label className="block text-sm font-medium mb-2">Description</label>
          <p className="text-sm text-gray-300 p-3 bg-gray-800 rounded-md">
            {task.description}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Time Estimate</label>
          <Badge variant="outline">{task.timeEstimate}</Badge>
        </div>

        {/* SOP Document */}
        <div>
          <label className="block text-sm font-medium mb-2">SOP Document URL</label>
          <Input
            value={formData.sopDocument || ''}
            onChange={(e) => handleInputChange('sopDocument', e.target.value)}
            placeholder="Enter SOP document URL or path"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <div className="flex flex-wrap gap-1">
            {task.tags?.map(tag => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Dependencies */}
        {task.dependsOn && task.dependsOn.length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2">Dependencies</label>
            <div className="space-y-1">
              {task.dependsOn.map(depId => (
                <Badge key={depId} variant="outline" className="mr-1">{depId}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium mb-2">Notes & Progress</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes about your progress..."
            rows={6}
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Documents & Files</label>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="block w-full text-sm text-muted-dark-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-dark file:text-primary-dark-foreground hover:file:bg-primary-dark/90"
          />
          {uploadedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm font-medium">Uploaded Files:</p>
              {uploadedFiles.map((fileName, index) => (
                <div key={index} className="flex items-center justify-between bg-muted-dark p-2 rounded">
                  <span className="text-sm truncate">{fileName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPanel;