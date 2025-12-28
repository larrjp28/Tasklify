import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = (callbacks = {}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (e) => {
      // Only trigger if not typing in input/textarea
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Ctrl/Cmd + K - Focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        callbacks.onSearch?.();
      }

      // Ctrl/Cmd + N - New task (focus form)
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        callbacks.onNewTask?.();
      }

      // Ctrl/Cmd + D - Dashboard
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        navigate('/dashboard');
      }

      // Ctrl/Cmd + T - Tasks
      if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        navigate('/tasks');
      }

      // Ctrl/Cmd + U - Upcoming
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        navigate('/upcoming');
      }

      // Ctrl/Cmd + / - Show shortcuts help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        callbacks.onShowHelp?.();
      }

      // Ctrl/Cmd + Q - Quick add
      if ((e.ctrlKey || e.metaKey) && e.key === 'q') {
        e.preventDefault();
        callbacks.onQuickAdd?.();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [navigate, callbacks]);
};
