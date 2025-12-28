import React, { useState, useEffect } from 'react';
import './AutoSaveIndicator.css';

function AutoSaveIndicator({ isSaving }) {
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (isSaving) {
      setShowSaved(false);
    } else {
      // Show "Saved" message briefly after saving completes
      setShowSaved(true);
      const timer = setTimeout(() => {
        setShowSaved(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaving]);

  if (!isSaving && !showSaved) return null;

  return (
    <div className={`auto-save-indicator ${isSaving ? 'saving' : 'saved'}`}>
      {isSaving ? (
        <>
          <span className="save-spinner">⟳</span>
          Saving...
        </>
      ) : (
        <>
          <span className="save-check">✓</span>
          Saved
        </>
      )}
    </div>
  );
}

export default AutoSaveIndicator;
