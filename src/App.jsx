import React, { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import Dashboard from './components/Dashboard';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import CalendarView from './components/CalendarView';
import PomodoroTimer from './components/PomodoroTimer';
import { LoadingState, EmptyState, ErrorState, SupabaseSetupNotice } from './components/StateViews';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // View Mode: 'list' or 'calendar'
  const [viewMode, setViewMode] = useState('list');

  // Active Task currently linked to Pomodoro Focus Sprint
  const [activeSprintTask, setActiveSprintTask] = useState(null);

  // 1. READ TASKS: Fetch all tasks from Supabase PostgreSQL table
  const fetchTasks = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setTasks(data || []);
    } catch (err) {
      console.error('Error fetching tasks from Supabase:', err);
      setError(err.message || 'Failed to fetch tasks from Supabase PostgreSQL.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 2. CREATE TASK: Insert new task into Supabase
  const handleAddTask = async (newTaskData, onSuccess) => {
    if (!isSupabaseConfigured || !supabase) {
      setActionError('Supabase is not configured yet. Please check your .env file.');
      return;
    }

    try {
      setIsSubmitting(true);
      setActionError(null);

      const payload = {
        title: newTaskData.title,
        subject: newTaskData.subject,
        due_date: newTaskData.due_date,
        completed: false,
      };

      const { data, error: insertError } = await supabase
        .from('tasks')
        .insert([payload])
        .select();

      if (insertError) {
        throw insertError;
      }

      // Prepend the newly inserted task to state
      if (data && data.length > 0) {
        setTasks((prev) => [data[0], ...prev]);
      } else {
        await fetchTasks();
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Error inserting task into Supabase:', err);
      setActionError(`Failed to add task: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. UPDATE TASK: Toggle completed status in Supabase
  const handleToggleStatus = async (task) => {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      setActionLoadingId(task.id);
      setActionError(null);

      const updatedStatus = !task.completed;

      const { error: updateError } = await supabase
        .from('tasks')
        .update({ completed: updatedStatus })
        .eq('id', task.id);

      if (updateError) {
        throw updateError;
      }

      // Update state
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? { ...t, completed: updatedStatus } : t))
      );

      // If this was the active sprint task and was marked completed, clear it
      if (activeSprintTask?.id === task.id && updatedStatus) {
        setActiveSprintTask(null);
      }
    } catch (err) {
      console.error('Error updating task in Supabase:', err);
      setActionError(`Failed to update task: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // 4. DELETE TASK: Remove task from Supabase
  const handleDeleteTask = async (taskId) => {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      setActionLoadingId(taskId);
      setActionError(null);

      const { error: deleteError } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (deleteError) {
        throw deleteError;
      }

      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      // If active sprint task was deleted, clear it
      if (activeSprintTask?.id === taskId) {
        setActiveSprintTask(null);
      }
    } catch (err) {
      console.error('Error deleting task from Supabase:', err);
      setActionError(`Failed to delete task: ${err.message}`);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Start sprint on selected task
  const handleStartSprint = (task) => {
    setActiveSprintTask(task);
    // Smooth scroll to pomodoro timer
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Metrics for the Dashboard
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  return (
    <div className="app-container">
      {/* Background ambient accents */}
      <div className="ambient-blob blob-1"></div>
      <div className="ambient-blob blob-2"></div>

      <div className="content-wrapper">
        {/* Dashboard Header with Brand & Live Metrics */}
        <Dashboard
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
        />

        {/* Global Action Error Alert */}
        {actionError && (
          <div className="action-error-banner" role="alert">
            <div className="action-error-content">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{actionError}</span>
            </div>
            <button
              className="banner-dismiss"
              onClick={() => setActionError(null)}
              aria-label="Dismiss error"
            >
              ✕
            </button>
          </div>
        )}

        {/* Supabase Notice if not configured */}
        {!isSupabaseConfigured && <SupabaseSetupNotice />}

        {/* Top Focus Row: Pomodoro Sprint Timer */}
        <PomodoroTimer
          activeTask={activeSprintTask}
          onClearActiveTask={() => setActiveSprintTask(null)}
        />

        {/* Add Task Form Component */}
        <TaskForm onAddTask={handleAddTask} isSubmitting={isSubmitting} />

        {/* View Mode Switcher (List vs Calendar View) */}
        <div className="view-mode-bar">
          <div className="view-mode-tabs">
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
              <span>List View</span>
            </button>
            <button
              type="button"
              className={`view-mode-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>Academic Calendar</span>
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="main-content">
          {isLoading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState error={error} onRetry={fetchTasks} />
          ) : tasks.length === 0 ? (
            <EmptyState />
          ) : viewMode === 'calendar' ? (
            <CalendarView
              tasks={tasks}
              onToggleStatus={handleToggleStatus}
              onDeleteTask={handleDeleteTask}
              onStartSprint={handleStartSprint}
              actionLoadingId={actionLoadingId}
            />
          ) : (
            <TaskList
              tasks={tasks}
              onToggleStatus={handleToggleStatus}
              onDeleteTask={handleDeleteTask}
              onStartSprint={handleStartSprint}
              actionLoadingId={actionLoadingId}
            />
          )}
        </main>

        
      </div>
    </div>
  );
}
