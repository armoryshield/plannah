import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Button } from './components/ui';
import { TaskDetailPanel, PhaseSection, ImportExportModal, GanttChart } from './components/features';
import TaskEditModal from './components/features/TaskEditModal';
import PhaseEditModal from './components/features/PhaseEditModal';
import { TaskStorageProvider } from './contexts/TaskStorageContext';
import { useLocalStorage, useTaskProgress, useImportExport } from './hooks';
import { defaultMasterPlan } from './data/defaultMasterPlan';
import { ChevronRight, Lock, Unlock } from 'lucide-react';
import './App.css';

/**
 * Inner App Component (with storage context)
 */
function AppContent() {
  const [masterPlan, setMasterPlan] = useLocalStorage('manufacturing-plan', defaultMasterPlan);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showImportExport, setShowImportExport] = useState(false);
  const [showTaskEdit, setShowTaskEdit] = useState(false);
  const [showPhaseEdit, setShowPhaseEdit] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingPhase, setEditingPhase] = useState(null);
  const [addingTaskToPhase, setAddingTaskToPhase] = useState(null);
  const [showGanttView, setShowGanttView] = useState(false);

  // Sidebar resize state
  const [sidebarWidth, setSidebarWidth] = useLocalStorage('sidebar-width', 400);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const resizeHandleRef = useRef(null);

  // Plan lock state
  const [isPlanLocked, setIsPlanLocked] = useLocalStorage('plan-locked', false);

  const { totalProgress, calculateTotalProgress } = useTaskProgress(masterPlan);
  const { exportProgress, importPlan } = useImportExport(masterPlan);

  const handleImportPlan = async (newPlan) => {
    try {
      // The importPlan function now handles clearing task data with new storage system
      const imported = await importPlan(newPlan);

      setMasterPlan(imported);
      setSelectedTask(null);
      calculateTotalProgress();
    } catch (error) {
      console.error('Import plan error:', error);
      // Could add user notification here
    }
  };

  const handleTaskUpdate = () => {
    calculateTotalProgress();
  };

  const handleExportProgress = async () => {
    try {
      await exportProgress();
    } catch (error) {
      console.error('Export progress error:', error);
      // Could add user notification here
    }
  };

  // Sidebar resize functionality
  const isCollapsed = sidebarWidth < 50;
  const minWidth = 200;
  const maxWidth = 600;

  const startResize = useCallback((e) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const stopResize = useCallback(() => {
    setIsResizing(false);
  }, []);

  const onResize = useCallback((e) => {
    if (!isResizing) return;

    const newWidth = e.clientX;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    } else if (newWidth < minWidth / 2) {
      // Auto-collapse if dragged very narrow
      setSidebarWidth(40);
    }
  }, [isResizing, minWidth, maxWidth, setSidebarWidth]);

  const expandSidebar = () => {
    setSidebarWidth(400);
  };

  // Mouse event listeners for resize
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', onResize);
      document.addEventListener('mouseup', stopResize);
      return () => {
        document.removeEventListener('mousemove', onResize);
        document.removeEventListener('mouseup', stopResize);
      };
    }
  }, [isResizing, onResize, stopResize]);

  // Drag and drop handler for both tasks and phases
  const handleDragEnd = (result) => {
    // Prevent drag and drop when plan is locked
    if (isPlanLocked) return;

    const { destination, source, draggableId, type } = result;

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

    if (type === 'PHASE') {
      // Handle phase reordering
      const [movedPhase] = newMasterPlan.phases.splice(source.index, 1);
      newMasterPlan.phases.splice(destination.index, 0, movedPhase);
    } else {
      // Handle task reordering (existing logic)
      const sourcePhase = newMasterPlan.phases.find(p => p.id === source.droppableId);
      const destPhase = newMasterPlan.phases.find(p => p.id === destination.droppableId);

      if (!sourcePhase || !destPhase) return;

      // Remove task from source
      const [movedTask] = sourcePhase.tasks.splice(source.index, 1);

      // Add task to destination
      destPhase.tasks.splice(destination.index, 0, movedTask);
    }

    setMasterPlan(newMasterPlan);
    calculateTotalProgress();
  };

  // Task management handlers
  const handleAddTask = (phaseId) => {
    if (isPlanLocked) return;
    setAddingTaskToPhase(phaseId);
    setEditingTask(null);
    setShowTaskEdit(true);
  };

  const handleEditTask = (task) => {
    if (isPlanLocked) return;
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
    if (isPlanLocked) return;
    setEditingPhase(null);
    setShowPhaseEdit(true);
  };

  const handleMovePhase = (phaseId, direction) => {
    if (isPlanLocked) return;

    const newMasterPlan = { ...masterPlan };
    const currentIndex = newMasterPlan.phases.findIndex(p => p.id === phaseId);

    if (currentIndex === -1) return;

    let newIndex;
    if (direction === 'up' && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (direction === 'down' && currentIndex < newMasterPlan.phases.length - 1) {
      newIndex = currentIndex + 1;
    } else {
      return; // Can't move
    }

    // Swap phases
    const [movedPhase] = newMasterPlan.phases.splice(currentIndex, 1);
    newMasterPlan.phases.splice(newIndex, 0, movedPhase);

    setMasterPlan(newMasterPlan);
  };

  const handleDeletePhase = (phaseId) => {
    if (isPlanLocked) return;

    const phase = masterPlan.phases.find(p => p.id === phaseId);
    if (!phase) return;

    const hasTasksWithProgress = phase.tasks.some(task => {
      // Check if task has any saved progress data
      const savedState = localStorage.getItem(`task-${task.id}`);
      return savedState && JSON.parse(savedState).status !== 'pending';
    });

    const confirmMessage = hasTasksWithProgress
      ? `Are you sure you want to delete "${phase.title}"?\n\nThis phase contains ${phase.tasks.length} tasks with progress data. This action cannot be undone.`
      : `Are you sure you want to delete "${phase.title}"?\n\nThis phase contains ${phase.tasks.length} tasks. This action cannot be undone.`;

    if (window.confirm(confirmMessage)) {
      const newMasterPlan = { ...masterPlan };
      const phaseIndex = newMasterPlan.phases.findIndex(p => p.id === phaseId);

      if (phaseIndex !== -1) {
        // Clean up task storage data
        phase.tasks.forEach(task => {
          localStorage.removeItem(`task-${task.id}`);
        });

        // Remove phase
        newMasterPlan.phases.splice(phaseIndex, 1);
        setMasterPlan(newMasterPlan);
        calculateTotalProgress();

        // Clear selected task if it was in the deleted phase
        if (selectedTask && phase.tasks.some(t => t.id === selectedTask.id)) {
          setSelectedTask(null);
        }
      }
    }
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
      <div className={`flex h-screen bg-gray-900 text-white ${isResizing ? 'select-none' : ''}`}>
        {/* Left Panel - Resizable Sidebar */}
        <div
          ref={sidebarRef}
          className="border-r border-gray-700 flex flex-col relative transition-all duration-200"
          style={{ width: `${sidebarWidth}px`, minWidth: isCollapsed ? '40px' : `${minWidth}px` }}
        >
          {isCollapsed ? (
            // Collapsed sidebar - just expand button
            <div className="flex flex-col items-center justify-start p-2 h-full">
              <Button
                onClick={expandSidebar}
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
                title="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            // Full sidebar content
            <>
              {/* Resize Handle */}
              <div
                ref={resizeHandleRef}
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-gray-600 opacity-0 hover:opacity-100 hover:bg-blue-500 transition-all duration-200 z-10"
                onMouseDown={startResize}
                title="Drag to resize"
              />

              {/* Header */}
              <div className="p-6 border-b border-gray-700">
                <div className="flex items-center space-x-3 mb-2">
                  <img
                    src="https://cdn.prod.website-files.com/67583ac9535f63d84bfba030/67583ac9535f63d84bfba037_brand_logo_bow.svg"
                    alt="Surge Logo"
                    className="h-8 w-auto"
                  />
                  <h1 className="text-2xl font-bold">Surge Master Plan</h1>
                </div>
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
                    Plan Settings
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
                <div className="mt-3">
                  <Button
                    onClick={() => setShowGanttView(!showGanttView)}
                    variant={showGanttView ? "default" : "outline"}
                    size="sm"
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    <span>📊</span>
                    <span>{showGanttView ? 'Hide Gantt Chart' : 'Show Gantt Chart'}</span>
                  </Button>
                </div>
              </div>

              {/* Plan Title Section */}
              <div className="px-4 pt-4 border-b border-gray-600">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-200">Manufacturing Plan</h2>
                  <Button
                    onClick={() => setIsPlanLocked(!isPlanLocked)}
                    variant="ghost"
                    size="icon"
                    className={`h-6 w-6 p-0 ${isPlanLocked ? 'text-red-400 hover:text-red-300' : 'text-green-400 hover:text-green-300'}`}
                    title={isPlanLocked ? 'Plan is locked - Click to unlock' : 'Plan is unlocked - Click to lock'}
                  >
                    {isPlanLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  </Button>
                </div>
                {isPlanLocked && (
                  <div className="text-xs text-orange-400 mb-3 p-2 bg-orange-900/20 rounded">
                    🔒 Plan is locked. Editing, creating, and reordering are disabled.
                  </div>
                )}
              </div>

              {/* Phases List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {masterPlan.phases.map((phase, index) => (
                  <PhaseSection
                    key={phase.id}
                    phase={phase}
                    phaseIndex={index}
                    totalPhases={masterPlan.phases.length}
                    selectedTaskId={selectedTask?.id}
                    onTaskSelect={setSelectedTask}
                    onUpdate={calculateTotalProgress}
                    onAddTask={handleAddTask}
                    onEditTask={handleEditTask}
                    onMovePhase={handleMovePhase}
                    onDeletePhase={handleDeletePhase}
                    isPlanLocked={isPlanLocked}
                  />
                ))}

                {/* Add Phase Button */}
                <div className="mt-4">
                  <Button
                    variant="ghost"
                    onClick={handleAddPhase}
                    disabled={isPlanLocked}
                    className={`w-full border-2 border-dashed ${
                      isPlanLocked
                        ? 'text-gray-600 border-gray-700 cursor-not-allowed'
                        : 'text-gray-400 hover:text-white border-gray-600 hover:border-gray-500'
                    }`}
                  >
                    + Add New Phase
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

      {/* Right Panel - Task Details or Gantt Chart */}
      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-700 p-4 bg-gray-800">
          <h2 className="text-lg font-semibold">
            {showGanttView
              ? 'Gantt Chart Timeline'
              : selectedTask
                ? 'Task Details'
                : 'Manufacturing Plan Overview'
            }
          </h2>
        </div>
        <div className="flex-1">
          {showGanttView ? (
            <GanttChart
              masterPlan={masterPlan}
              onTaskSelect={setSelectedTask}
              selectedTaskId={selectedTask?.id}
            />
          ) : (
            <TaskDetailPanel
              task={selectedTask}
              onUpdate={handleTaskUpdate}
              onClose={() => setSelectedTask(null)}
            />
          )}
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

/**
 * Main App Component with Storage Provider
 */
function App() {
  return (
    <TaskStorageProvider>
      <AppContent />
    </TaskStorageProvider>
  );
}

export default App;