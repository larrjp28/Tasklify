import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTask } from '../context/TaskContext';
import localforage from 'localforage';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const { tasks, getTasksByStatus } = useTask();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedUsername = localStorage.getItem('username') || 'User';
    const storedEmail = localStorage.getItem('email') || '';
    setUsername(storedUsername);
    setEmail(storedEmail);
  }, []);

  const handleSave = () => {
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    alert('Profile updated successfully!');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('isAuthenticated');
      navigate('/');
    }
  };

  const handleClearAllTasks = () => {
    if (window.confirm('Are you sure you want to delete ALL tasks? This cannot be undone!')) {
      localStorage.removeItem('tasks');
      window.location.reload();
    }
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support notifications');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      alert('Notifications enabled! You will be notified about upcoming tasks.');
    }
  };

  const exportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasklify-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importTasks = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const importedTasks = JSON.parse(e.target.result);
        if (!Array.isArray(importedTasks)) {
          throw new Error('Invalid format');
        }

        const confirmed = window.confirm(
          `Import ${importedTasks.length} tasks? This will add to your existing tasks.`
        );
        
        if (confirmed) {
          const currentTasks = await localforage.getItem('tasks') || [];
          await localforage.setItem('tasks', [...currentTasks, ...importedTasks]);
          window.location.reload();
        }
      } catch (error) {
        alert('Error importing tasks. Please check the file format.');
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const totalTasks = tasks.length;
  const finishedTasks = getTasksByStatus('finished').length;
  const ongoingTasks = getTasksByStatus('ongoing').length;
  const missedTasks = getTasksByStatus('missed').length;
  const completionRate = totalTasks > 0 ? ((finishedTasks / totalTasks) * 100).toFixed(1) : 0;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Manage your account and preferences</p>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2 className="section-title">Account Information</h2>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <button onClick={handleSave} className="save-btn">
            💾 Save Changes
          </button>
        </div>

        <div className="profile-section">
          <h2 className="section-title">Statistics</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{totalTasks}</div>
              <div className="stat-label">Total Tasks</div>
            </div>
            <div className="stat-card finished">
              <div className="stat-icon">✓</div>
              <div className="stat-value">{finishedTasks}</div>
              <div className="stat-label">Finished</div>
            </div>
            <div className="stat-card ongoing">
              <div className="stat-icon">⏳</div>
              <div className="stat-value">{ongoingTasks}</div>
              <div className="stat-label">Ongoing</div>
            </div>
            <div className="stat-card missed">
              <div className="stat-icon">✗</div>
              <div className="stat-value">{missedTasks}</div>
              <div className="stat-label">Missed</div>
            </div>
          </div>
          <div className="completion-rate">
            <div className="completion-label">Completion Rate</div>
            <div className="completion-value">{completionRate}%</div>
            <div className="completion-bar">
              <div 
                className="completion-fill" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="profile-section danger-zone">
          <h2 className="section-title">Settings</h2>
          <button onClick={requestNotificationPermission} className="settings-btn">
            🔔 Enable Notifications
          </button>
          <p className="settings-help">Get notified when tasks are due within 1 hour</p>
        </div>

        <div className="profile-section">
          <h2 className="section-title">Data Management</h2>
          <button onClick={exportTasks} className="export-btn">
            📥 Export Tasks
          </button>
          <p className="settings-help">Download all tasks as JSON backup</p>
          
          <label htmlFor="import-file" className="import-btn">
            📤 Import Tasks
          </label>
          <input
            id="import-file"
            type="file"
            accept=".json"
            onChange={importTasks}
            style={{ display: 'none' }}
          />
          <p className="settings-help">Upload previously exported tasks</p>
        </div>

        <div className="profile-section danger-zone">
          <h2 className="section-title">Danger Zone</h2>
          <button onClick={handleClearAllTasks} className="danger-btn">
            🗑️ Clear All Tasks
          </button>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
