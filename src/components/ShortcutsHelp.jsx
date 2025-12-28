import React from 'react';
import './ShortcutsHelp.css';

function ShortcutsHelp({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: 'Ctrl + N', description: 'Create new task (focus form)' },
    { keys: 'Ctrl + K', description: 'Focus search bar' },
    { keys: 'Ctrl + Q', description: 'Quick add task' },
    { keys: 'Ctrl + Z', description: 'Undo last delete' },
    { keys: 'Ctrl + D', description: 'Go to Dashboard' },
    { keys: 'Ctrl + T', description: 'Go to Tasks' },
    { keys: 'Ctrl + U', description: 'Go to Upcoming' },
    { keys: 'Ctrl + /', description: 'Show this help' },
    { keys: 'Esc', description: 'Close dialogs' },
  ];

  return (
    <div className="shortcuts-overlay" onClick={onClose}>
      <div className="shortcuts-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="shortcuts-header">
          <h2>⌨️ Keyboard Shortcuts</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="shortcuts-body">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="shortcut-item">
              <kbd className="shortcut-keys">{shortcut.keys}</kbd>
              <span className="shortcut-desc">{shortcut.description}</span>
            </div>
          ))}
        </div>
        <div className="shortcuts-footer">
          <p>💡 Tip: Press <kbd>Esc</kbd> to close this dialog</p>
        </div>
      </div>
    </div>
  );
}

export default ShortcutsHelp;
