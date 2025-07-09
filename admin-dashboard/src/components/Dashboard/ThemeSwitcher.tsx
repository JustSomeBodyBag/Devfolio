import React from 'react';
import { useTheme } from '../../context/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        w-full px-3 py-2 rounded text-center
        transition-colors duration-300 ease-in-out
        ${theme === 'light' 
          ? 'bg-gray-200 text-gray-900 hover:bg-gray-300' 
          : 'bg-gray-700 text-gray-100 hover:bg-gray-600'}
      `}
      aria-label="Переключить тему"
    >
      {theme === 'light' ? '🌞 Светлая тема' : '🌙 Тёмная тема'}
    </button>
  );
};

export default ThemeSwitcher;
