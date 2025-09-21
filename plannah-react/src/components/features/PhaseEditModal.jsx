import React, { useState, useEffect } from 'react';
import { Button, Input, Textarea } from '../ui';

/**
 * Phase Edit Modal Component for creating/editing phases
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {function} props.onClose - Close modal handler
 * @param {function} props.onSave - Save phase handler
 * @param {Object} props.phase - Phase to edit (null for new phase)
 */
const PhaseEditModal = ({ isOpen, onClose, onSave, phase }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  // Initialize form data when phase changes
  useEffect(() => {
    if (phase) {
      setFormData({
        title: phase.title || '',
        description: phase.description || ''
      });
    } else {
      // Reset form for new phase
      setFormData({
        title: '',
        description: ''
      });
    }
    setErrors({});
  }, [phase, isOpen]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Phase title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Phase description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const phaseData = {
      ...formData,
      id: phase?.id || `phase-${Date.now()}`,
      tasks: phase?.tasks || []
    };

    onSave(phaseData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-lg w-full max-w-xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">
            {phase ? 'Edit Phase' : 'Create New Phase'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>✕</Button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Phase Title <span className="text-red-400">*</span>
              </label>
              <Input
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter phase title"
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
                placeholder="Enter phase description"
                rows={4}
                className={errors.description ? 'border-red-500' : ''}
              />
              {errors.description && (
                <p className="text-red-400 text-sm mt-1">{errors.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 p-6 border-t border-gray-700">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {phase ? 'Save Changes' : 'Create Phase'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhaseEditModal;