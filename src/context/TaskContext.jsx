import React, { createContext, useContext, useState, useEffect } from 'react';
import localforage from 'localforage';
import { useToast } from './ToastContext';

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError, showInfo } = useToast();

  // Load tasks from localforage on mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await localforage.getItem('tasks');
        if (storedTasks) {
          setTasks(storedTasks);
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  // Save tasks to localforage whenever they change
  useEffect(() => {
    if (!loading) {
      setIsSaving(true);
      localforage.setItem('tasks', tasks)
        .then(() => {
          setTimeout(() => setIsSaving(false), 300); // Brief delay to show indicator
        })
        .catch((error) => {
          console.error('Error saving tasks:', error);
          setIsSaving(false);
        });
    }
  }, [tasks, loading]);

  // Create a new task
  const addTask = (task) => {
    const newTask = {
      id: Date.now().toString(),
      ...task,
      status: 'ongoing',
      tags: task.tags || [],
      subtasks: task.subtasks || [],
      recurrence: task.recurrence || null,
      isPinned: task.isPinned || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    showSuccess('Task created successfully!');
    return newTask;
  };

  // Update an existing task
  const updateTask = (id, updates) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      )
    );
    if (!updates.notified) {
      showSuccess('Task updated successfully!');
    }
  };

  // Delete a task
  const deleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete) {
      setDeletedTasks(prev => [...prev.slice(-9), { task: taskToDelete, timestamp: Date.now() }]);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      showSuccess('Task deleted! Click undo to restore.');
    }
  };

  // Undo last delete
  const undoDelete = () => {
    if (deletedTasks.length > 0) {
      const lastDeleted = deletedTasks[deletedTasks.length - 1];
      setTasks(prev => [lastDeleted.task, ...prev]);
      setDeletedTasks(prev => prev.slice(0, -1));
      showInfo('Task restored!');
    }
  };

  // Mark task as finished
  const markAsFinished = (id) => {
    const task = tasks.find(t => t.id === id);
    updateTask(id, { status: 'finished', finishedAt: new Date().toISOString() });
    showSuccess('Task marked as finished! 🎉');
    
    // Handle recurring tasks
    if (task && task.recurrence && task.recurrence !== 'none') {
      const nextDeadline = calculateNextDeadline(task.deadline, task.recurrence);
      const newRecurringTask = {
        title: task.title,
        details: task.details,
        priority: task.priority,
        tags: task.tags,
        recurrence: task.recurrence,
        deadline: nextDeadline,
        subtasks: task.subtasks ? task.subtasks.map(st => ({ ...st, completed: false })) : [],
      };
      setTimeout(() => addTask(newRecurringTask), 500);
    }
  };
  
  const calculateNextDeadline = (currentDeadline, recurrence) => {
    if (!currentDeadline) return null;
    const current = new Date(currentDeadline);
    const next = new Date(current);
    
    switch (recurrence) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      default:
        return null;
    }
    
    return next.toISOString().slice(0, 16);
  };

  // Duplicate a task
  const duplicateTask = (id) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const duplicatedTask = {
        title: `${task.title} (Copy)`,
        details: task.details,
        priority: task.priority,
        tags: task.tags ? [...task.tags] : [],
        deadline: task.deadline,
        recurrence: task.recurrence,
        subtasks: task.subtasks ? task.subtasks.map(st => ({ ...st, id: Date.now().toString() + Math.random() })) : [],
      };
      addTask(duplicatedTask);
    }
  };

  // Toggle task pin status
  const togglePin = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, isPinned: !task.isPinned, updatedAt: new Date().toISOString() }
          : task
      )
    );
    const task = tasks.find(t => t.id === id);
    if (task) {
      showInfo(task.isPinned ? 'Task unpinned' : 'Task pinned to top');
    }
  };

  // Mark task as missed
  const markAsMissed = (id) => {
    updateTask(id, { status: 'missed' });
  };

  // Get tasks by status
  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  // Get upcoming tasks (within next 7 days)
  const getUpcomingTasks = () => {
    const now = new Date();
    const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return tasks
      .filter((task) => {
        if (!task.deadline || task.status === 'finished') return false;
        const deadline = new Date(task.deadline);
        return deadline >= now && deadline <= weekFromNow;
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  };

  // Check for missed tasks
  useEffect(() => {
    const checkMissedTasks = () => {
      const now = new Date();
      tasks.forEach((task) => {
        if (
          task.deadline &&
          task.status === 'ongoing' &&
          new Date(task.deadline) < now
        ) {
          markAsMissed(task.id);
        }
      });
    };
    
    checkMissedTasks();
    const interval = setInterval(checkMissedTasks, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [tasks]);

  // Check for upcoming task notifications
  useEffect(() => {
    const checkNotifications = () => {
      if (!('Notification' in window)) return;
      
      const now = new Date();
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      
      tasks.forEach((task) => {
        if (
          task.deadline &&
          task.status === 'ongoing' &&
          !task.notified
        ) {
          const deadline = new Date(task.deadline);
          
          // Notify if deadline is within 1 hour
          if (deadline > now && deadline <= oneHourFromNow) {
            if (Notification.permission === 'granted') {
              new Notification('Task Deadline Approaching!', {
                body: `"${task.title}" is due in less than 1 hour!`,
                icon: '/favicon.ico',
                tag: task.id,
              });
              updateTask(task.id, { notified: true });
            } else if (Notification.permission !== 'denied') {
              Notification.requestPermission();
            }
          }
        }
      });
    };

    checkNotifications();
    const interval = setInterval(checkNotifications, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(interval);
  }, [tasks]);

  const value = {
    tasks,
    loading,
    isSaving,
    addTask,
    updateTask,
    deleteTask,
    undoDelete,
    markAsFinished,
    markAsMissed,
    duplicateTask,
    togglePin,
    getTasksByStatus,
    getUpcomingTasks,
    canUndo: deletedTasks.length > 0,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
