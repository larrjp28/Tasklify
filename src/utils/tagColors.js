// Tag color configuration
export const TAG_COLORS = {
  work: '#3b82f6',      // blue
  personal: '#10b981',  // green
  urgent: '#ef4444',    // red
  important: '#f59e0b', // orange
  home: '#8b5cf6',      // purple
  health: '#ec4899',    // pink
  finance: '#14b8a6',   // teal
  learning: '#f97316',  // deep orange
  shopping: '#06b6d4',  // cyan
  default: '#6b7280',   // gray
};

// Get color for a tag (case-insensitive)
export const getTagColor = (tag) => {
  const lowerTag = tag.toLowerCase();
  return TAG_COLORS[lowerTag] || TAG_COLORS.default;
};

// Get all available tag colors
export const getAvailableTagColors = () => {
  return Object.entries(TAG_COLORS)
    .filter(([key]) => key !== 'default')
    .map(([name, color]) => ({ name, color }));
};
