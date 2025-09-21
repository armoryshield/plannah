import React, { useState, useRef } from 'react';
import { Button, Textarea } from '../ui';
import { useImportExport } from '../../hooks';

/**
 * Import/Export Modal Component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether modal is open
 * @param {function} props.onClose - Close modal handler
 * @param {function} props.onImport - Import callback
 * @param {Object} props.masterPlan - Current master plan
 */
const ImportExportModal = ({ isOpen, onClose, onImport, masterPlan }) => {
  const [activeTab, setActiveTab] = useState('export');
  const [importData, setImportData] = useState('');
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef();

  const { exportYAML, exportJSON, importPlan } = useImportExport(masterPlan, onImport);

  const handleExportYAML = () => {
    try {
      exportYAML();
    } catch (error) {
      console.error('Export YAML error:', error);
    }
  };

  const handleExportJSON = () => {
    try {
      exportJSON();
    } catch (error) {
      console.error('Export JSON error:', error);
    }
  };

  const handleImport = () => {
    try {
      setImportError('');
      importPlan(importData);
      setImportData('');
      onClose();
    } catch (error) {
      setImportError(error.message);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImportData(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 rounded-lg shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold">Import/Export Manufacturing Plan</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>✕</Button>
        </div>

        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <Button
              variant={activeTab === 'export' ? 'default' : 'outline'}
              onClick={() => setActiveTab('export')}
            >
              Export
            </Button>
            <Button
              variant={activeTab === 'import' ? 'default' : 'outline'}
              onClick={() => setActiveTab('import')}
            >
              Import
            </Button>
          </div>

          {activeTab === 'export' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Export your current manufacturing plan including all progress data.
              </p>
              <div className="flex space-x-4">
                <Button onClick={handleExportYAML} className="flex-1">
                  Export as YAML
                </Button>
                <Button onClick={handleExportJSON} variant="outline" className="flex-1">
                  Export as JSON
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'import' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-400">
                Import a new manufacturing plan from YAML or JSON format.
              </p>

              <div>
                <label className="block text-sm font-medium mb-2">Upload File</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".yaml,.yml,.json"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-muted-dark-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-dark file:text-primary-dark-foreground hover:file:bg-primary-dark/90"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Or Paste Content</label>
                <Textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your YAML or JSON content here..."
                  rows={10}
                  className="font-mono text-xs"
                />
              </div>

              {importError && (
                <div className="text-red-400 text-sm p-3 bg-red-950/20 rounded-md">
                  {importError}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={!importData.trim()}
                >
                  Import Plan
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;