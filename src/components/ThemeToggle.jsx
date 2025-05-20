import React from 'react';

function ThemeToggle({ toggleTheme, theme }) {
  return (
    <button onClick={toggleTheme} className="theme-toggle-button">
      {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
    </button>
  );
}

export default ThemeToggle;
