import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../components/TaskCard';
import './FocusMode.css';

function FocusMode() {
  const { tasks, updateTask } = useTask();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [editingTask, setEditingTask] = useState(null);

  // Filter to only ongoing tasks with deadlines
  const focusTasks = tasks
    .filter(task => task.status === 'ongoing' && task.deadline)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  const currentTask = focusTasks[currentIndex];

  useEffect(() => {
    // Close focus mode if no tasks
    if (focusTasks.length === 0) {
      navigate('/tasks');
    }
  }, [focusTasks.length, navigate]);

  const handleNext = () => {
    if (currentIndex < focusTasks.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop back to first
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      setCurrentIndex(focusTasks.length - 1); // Loop to last
    }
  };

  const handleExit = () => {
    navigate('/tasks');
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        handleExit();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, focusTasks.length]);

  if (!currentTask) {
    return null;
  }

  return (
    <div className="focus-mode">
      <div className="focus-overlay" onClick={handleExit}></div>
      
      <div className="focus-container">
        <div className="focus-header">
          <div className="focus-title">
            <span className="focus-icon">🎯</span>
            <h1>Focus Mode</h1>
          </div>
          <button className="focus-exit" onClick={handleExit} title="Exit (Esc)">
            ✕
          </button>
        </div>

        <div className="focus-progress">
          <span className="focus-count">
            {currentIndex + 1} of {focusTasks.length} tasks
          </span>
          <div className="focus-progress-bar">
            <div 
              className="focus-progress-fill"
              style={{ width: `${((currentIndex + 1) / focusTasks.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="focus-card-container">
          <TaskCard task={currentTask} onEdit={setEditingTask} />
        </div>

        <div className="focus-navigation">
          <button 
            className="focus-nav-btn"
            onClick={handlePrevious}
            disabled={focusTasks.length <= 1}
            title="Previous (←)"
          >
            ← Previous
          </button>
          <button 
            className="focus-nav-btn"
            onClick={handleNext}
            disabled={focusTasks.length <= 1}
            title="Next (→)"
          >
            Next →
          </button>
        </div>

        <div className="focus-tips">
          <p>💡 Use arrow keys (← →) to navigate | Press Esc to exit</p>
        </div>
      </div>
    </div>
  );
}

export default FocusMode;
