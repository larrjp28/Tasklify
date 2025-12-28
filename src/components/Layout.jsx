import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import QuickAddButton from '../components/QuickAddButton';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { useTask } from '../context/TaskContext';
import './Layout.css';

function Layout() {
  const { isSaving } = useTask();
  
  return (
    <div className="layout">
      <Sidebar />
      <main className="layout-main">
        <Outlet />
      </main>
      <QuickAddButton />
      <AutoSaveIndicator isSaving={isSaving} />
    </div>
  );
}

export default Layout;
