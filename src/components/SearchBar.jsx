import React, { forwardRef } from 'react';
import './SearchBar.css';

const SearchBar = forwardRef(({ searchTerm, onSearchChange, placeholder = "Search tasks..." }, ref) => {
  return (
    <div className="search-bar">
      <span className="search-icon">🔍</span>
      <input
        ref={ref}
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      {searchTerm && (
        <button 
          className="clear-search" 
          onClick={() => onSearchChange('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
