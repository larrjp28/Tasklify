import React from 'react';
import Dashboard from '../components/Dashboard';
import './DashboardPage.css';

function DashboardPage() {
  return (
    <div className="page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your tasks and progress</p>
      </div>
      
      <Dashboard />
    </div>
  );
}

export default DashboardPage;
