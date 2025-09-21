import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Button } from './components/ui';
import { TaskDetailPanel, PhaseSection, ImportExportModal } from './components/features';
import TaskEditModal from './components/features/TaskEditModal';
import PhaseEditModal from './components/features/PhaseEditModal';
import { useLocalStorage, useTaskProgress, useImportExport } from './hooks';
import { defaultMasterPlan } from './data/defaultMasterPlan';
import './App.css';

/**
 * Main Manufacturing Checklist Application
 */
function App() {
  const [masterPlan, setMasterPlan] = useLocalStorage('manufacturing-plan', defaultMasterPlan);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showTaskEdit, setShowTaskEdit] = useState(false);
  const [showPhaseEdit, setShowPhaseEdit] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingPhase, setEditingPhase] = useState(null);
  const [addingTaskToPhase, setAddingTaskToPhase] = useState(null);
  const { totalProgress, calculateTotalProgress } = useTaskProgress(masterPlan);
  const { exportProgress } = useImportExport(masterPlan);

  const handleImportPlan = (newPlan) => {
    // Clear existing task data
    if (masterPlan && masterPlan.phases) {
      masterPlan.phases.forEach(phase => {
        phase.tasks.forEach(task => {
          localStorage.removeItem(`task-${task.id}`);
        });
      });
    }

    setMasterPlan(newPlan);
    setSelectedTask(null);
    calculateTotalProgress();
  };

  const handleTaskUpdate = () => {
    calculateTotalProgress();
  };

  const handleExportProgress = () => {
    try {
      exportProgress();
    } catch (error) {
      console.error('Export progress error:', error);
    }
  };

  // Drag and drop handler
  const handleDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    // If no destination, do nothing
    if (!destination) return;

    // If dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newMasterPlan = { ...masterPlan };

    // Find source and destination phases
    const sourcePhase = newMasterPlan.phases.find(p => p.id === source.droppableId);
    const destPhase = newMasterPlan.phases.find(p => p.id === destination.droppableId);

    if (!sourcePhase || !destPhase) return;

    // Remove task from source
    const [movedTask] = sourcePhase.tasks.splice(source.index, 1);

    // Add task to destination
    destPhase.tasks.splice(destination.index, 0, movedTask);

    setMasterPlan(newMasterPlan);
    calculateTotalProgress();
  };

  // Task management handlers
  const handleAddTask = (phaseId) => {
    setAddingTaskToPhase(phaseId);
    setEditingTask(null);
    setShowTaskEdit(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setAddingTaskToPhase(null);
    setShowTaskEdit(true);
  };

  const handleSaveTask = (taskData) => {
    const newMasterPlan = { ...masterPlan };
    const targetPhaseId = addingTaskToPhase || editingTask?.id?.split('-task-')[0] || taskData.id?.split('-task-')[0];
    const targetPhase = newMasterPlan.phases.find(p => p.id === targetPhaseId);

    if (!targetPhase) return;

    if (editingTask) {
      // Update existing task
      const taskIndex = targetPhase.tasks.findIndex(t => t.id === editingTask.id);
      if (taskIndex !== -1) {
        targetPhase.tasks[taskIndex] = { ...taskData };
      }
    } else {
      // Add new task
      targetPhase.tasks.push(taskData);
    }

    setMasterPlan(newMasterPlan);
    calculateTotalProgress();
  };

  const handleDeleteTask = (taskId) => {
    const newMasterPlan = { ...masterPlan };

    for (const phase of newMasterPlan.phases) {
      const taskIndex = phase.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        phase.tasks.splice(taskIndex, 1);
        // Also remove localStorage data
        localStorage.removeItem(`task-${taskId}`);
        break;
      }
    }

    setMasterPlan(newMasterPlan);
    calculateTotalProgress();
    setSelectedTask(null);
  };

  // Phase management handlers
  const handleAddPhase = () => {
    setEditingPhase(null);
    setShowPhaseEdit(true);
  };

  const handleSavePhase = (phaseData) => {
    const newMasterPlan = { ...masterPlan };

    if (editingPhase) {
      // Update existing phase
      const phaseIndex = newMasterPlan.phases.findIndex(p => p.id === editingPhase.id);
      if (phaseIndex !== -1) {
        newMasterPlan.phases[phaseIndex] = { ...newMasterPlan.phases[phaseIndex], ...phaseData };
      }
    } else {
      // Add new phase
      newMasterPlan.phases.push(phaseData);
    }

    setMasterPlan(newMasterPlan);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Left Panel */}
        <div className="w-1/3 border-r border-gray-700 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <h1 className="text-2xl font-bold mb-2">{masterPlan.title}</h1>
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${totalProgress}%` }}
                ></div>
              </div>
              <span className="text-sm font-bold">{totalProgress}%</span>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowImportExport(true)}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Import/Export
              </Button>
              <Button
                onClick={handleExportProgress}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Export Progress
              </Button>
            </div>
          </div>

          {/* Phases List */}
          <div className="flex-1 overflow-y-auto p-4">
            {masterPlan.phases.map(phase => (
              <PhaseSection
                key={phase.id}
                phase={phase}
                selectedTaskId={selectedTask?.id}
                onTaskSelect={setSelectedTask}
                onUpdate={calculateTotalProgress}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
              />
            ))}

            {/* Add Phase Button */}
            <div className="mt-4">
              <Button
                variant="ghost"
                onClick={handleAddPhase}
                className="w-full text-gray-400 hover:text-white border-2 border-dashed border-gray-600 hover:border-gray-500"
              >
                + Add New Phase
              </Button>
            </div>
          </div>
        </div>

      {/* Right Panel - Task Details */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-700 p-4 bg-gray-800">
          <h2 className="text-lg font-semibold">
            {selectedTask ? 'Task Details' : 'Manufacturing Plan Overview'}
          </h2>
        </div>
        <div className="flex-1">
          <TaskDetailPanel
            task={selectedTask}
            onUpdate={handleTaskUpdate}
            onClose={() => setSelectedTask(null)}
          />
        </div>
      </div>

        {/* Import/Export Modal */}
        <ImportExportModal
          isOpen={showImportExport}
          onClose={() => setShowImportExport(false)}
          onImport={handleImportPlan}
          masterPlan={masterPlan}
        />

        {/* Task Edit Modal */}
        <TaskEditModal
          isOpen={showTaskEdit}
          onClose={() => setShowTaskEdit(false)}
          onSave={handleSaveTask}
          onDelete={handleDeleteTask}
          task={editingTask}
          phaseId={addingTaskToPhase}
        />

        {/* Phase Edit Modal */}
        <PhaseEditModal
          isOpen={showPhaseEdit}
          onClose={() => setShowPhaseEdit(false)}
          onSave={handleSavePhase}
          phase={editingPhase}
        />
      </div>
    </DragDropContext>
  );
}

export default App;