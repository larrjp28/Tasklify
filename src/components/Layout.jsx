import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import QuickAddButton from '../components/QuickAddButton';
import AutoSaveIndicator from '../components/AutoSaveIndicator';
import { useTask } from '../context/TaskContext';
import './Layout.css';

function Layout() {
  const { isSaving } = useTask();
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const stored = localStorage.getItem('sidebarOpen');
    if (stored !== null) return stored === 'true';
    return window.innerWidth >= 900;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem('sidebarOpen');
      if (stored !== null) setSidebarOpen(stored === 'true');
    };
    
    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  return (
    <div className="layout">
      <Sidebar />
      <main className={`layout-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <Outlet />
      </main>
      <QuickAddButton />
      <AutoSaveIndicator isSaving={isSaving} />
    </div>
  );
}

export default Layout;
