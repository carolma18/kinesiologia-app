import React from 'react';

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      Modo {theme === 'light' ? 'Oscuro' : 'Claro'}
    </button>
  );
}

export default ThemeToggle;