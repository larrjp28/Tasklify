import React, { useState } from 'react';
import './Dashboard.css';

function Dashboard() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['Importance', 'Lump', 'All', 'Finished', 'Ongoing', 'Missed'];

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dashboard</h2>
      
      <div className="dashboard-layout">
        <div className="filter-sidebar">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="dashboard-panels">
          <div className="panel">
            <h3>Finished Task:</h3>
            <div className="panel-content"></div>
          </div>
          
          <div className="panel">
            <h3>Missed Task:</h3>
            <div className="panel-content"></div>
          </div>
          
          <div className="panel">
            <h3>Reminders:</h3>
            <div className="panel-content"></div>
          </div>
        </div>
      </div>

      <div className="progress-bar">
        <label>Progress:</label>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: '0%' }}></div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
