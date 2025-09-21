import React, { useState, useEffect, useRef } from 'react';
import { Button, Badge, Input, Textarea } from '../ui';
import { useTaskStorage } from '../../contexts/TaskStorageContext';

/**
 * Task Detail Panel Component with new storage architecture
 * @param {Object} props
 * @param {Object} props.task - Selected task object
 * @param {function} props.onUpdate - Callback when task is updated
 * @param {function} props.onClose - Callback to close the panel
 */
const TaskDetailPanel = ({ task, onUpdate, onClose }) => {
  const storage = useTaskStorage();

  // Local state for form data
  const [formData, setFormData] = useState({
    status: 'pending',
    assignee: '',
    scheduleDate: '',
    completedDate: '',
    sopDocument: ''
  });
  const [notes, setNotes] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Refs for managing saves and autosave
  const autosaveTimeoutRef = useRef(null);
  const currentTaskIdRef = useRef(null);
  const isDirtyRef = useRef(false);

  // Initialize form data when task changes
  useEffect(() => {
    const loadTaskData = async () => {
      if (!task || !task.id) {
        // Clear form when no task selected
        setFormData({
          status: 'pending',
          assignee: '',
          scheduleDate: '',
          completedDate: '',
          sopDocument: ''
        });
        setNotes('');
        setUploadedFiles([]);
        currentTaskIdRef.current = null;
        isDirtyRef.current = false;
        return;
      }

      // Clear autosave timeout when switching tasks
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }

      currentTaskIdRef.current = task.id;

      try {
        // Load saved state from storage
        const savedState = await storage.loadTaskState(task.id);

        if (savedState && currentTaskIdRef.current === task.id) {
          // Use saved state if available
          setFormData({
            status: savedState.status || task.status || 'pending',
            assignee: savedState.assignee || task.assignee || '',
            scheduleDate: savedState.scheduleDate || task.scheduleDate || '',
            completedDate: savedState.completedDate || task.completedDate || '',
            sopDocument: savedState.sopDocument || task.sopDocument || ''
          });
          setNotes(savedState.notes || '');
          setUploadedFiles(savedState.files || []);
          setLastSaved(savedState.timestamp || null);
        } else {
          // Use base task data if no saved state
          setFormData({
            status: task.status || 'pending',
            assignee: task.assignee || '',
            scheduleDate: task.scheduleDate || '',
            completedDate: task.completedDate || '',
            sopDocument: task.sopDocument || ''
          });
          setNotes('');
          setUploadedFiles([]);
          setLastSaved(null);
        }

        isDirtyRef.current = false;
        startAutosave();
      } catch (error) {
        console.error('Failed to load task data:', error);
      }
    };

    loadTaskData();

    // Cleanup on unmount or task change
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
        autosaveTimeoutRef.current = null;
      }
    };
  }, [task?.id, storage]);

  // Start autosave timer (5 seconds)
  const startAutosave = () => {
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }
    autosaveTimeoutRef.current = setTimeout(handleAutosave, 5000);
  };

  // Save current state to storage
  const saveToStorage = async (showIndicator = true) => {
    if (!task?.id || !currentTaskIdRef.current || currentTaskIdRef.current !== task.id) {
      return false;
    }

    try {
      if (showIndicator) setIsSaving(true);

      const stateToSave = {
        ...formData,
        notes,
        files: uploadedFiles,
        timestamp: Date.now()
      };

      await storage.saveTaskState(task.id, stateToSave);

      isDirtyRef.current = false;
      setLastSaved(Date.now());

      if (onUpdate) onUpdate();

      return true;
    } catch (error) {
      console.error('Failed to save task state:', error);
      return false;
    } finally {
      if (showIndicator) setIsSaving(false);
    }
  };

  // Auto-save handler
  const handleAutosave = async () => {
    if (isDirtyRef.current) {
      await saveToStorage(false);
    }
    startAutosave(); // Restart autosave timer
  };

  // Manual save handler
  const handleManualSave = async () => {
    const success = await saveToStorage(true);
    if (success) {
      // Visual feedback could be added here
    }
  };

  // Field change handlers with onBlur save
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    isDirtyRef.current = true;
  };

  const handleInputBlur = async () => {
    if (isDirtyRef.current) {
      await saveToStorage(false);
    }
  };

  const handleNotesChange = (value) => {
    setNotes(value);
    isDirtyRef.current = true;
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const fileNames = files.map(file => file.name);
    setUploadedFiles(prev => [...prev, ...fileNames]);
    isDirtyRef.current = true;
    // Save immediately for file operations
    setTimeout(() => saveToStorage(false), 100);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    isDirtyRef.current = true;
    // Save immediately for file operations
    setTimeout(() => saveToStorage(false), 100);
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
              onBlur={handleInputBlur}
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
              onBlur={handleInputBlur}
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
              onBlur={handleInputBlur}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Completed Date</label>
            <Input
              type="date"
              value={formData.completedDate || ''}
              onChange={(e) => handleInputChange('completedDate', e.target.value)}
              onBlur={handleInputBlur}
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
            onBlur={handleInputBlur}
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
            onChange={(e) => handleNotesChange(e.target.value)}
            onBlur={handleInputBlur}
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

        {/* Save Section */}
        <div className="sticky bottom-0 bg-gray-900 border-t border-gray-700 p-4 mt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {lastSaved ? (
                <span>Last saved: {new Date(lastSaved).toLocaleTimeString()}</span>
              ) : (
                <span>Not saved</span>
              )}
              {isDirtyRef.current && (
                <span className="ml-2 text-yellow-400">• Unsaved changes</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {isSaving && (
                <div className="flex items-center text-sm text-blue-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400 mr-2"></div>
                  Saving...
                </div>
              )}
              <Button
                onClick={handleManualSave}
                disabled={isSaving}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <span>💾</span>
                <span>Save</span>
              </Button>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Auto-saves every 5 seconds • Saves on field blur • Manual save available
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetailPanel;