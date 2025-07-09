import React, { createContext, useContext, useEffect, useState } from 'react';
import tinycolor from 'tinycolor2';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    return saved || 'light';
  });

  const [primaryColor, setPrimaryColorState] = useState<string>(() => {
    return localStorage.getItem('primaryColor') || '#3B82F6';
  });

  // Установить тему
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Установить кастомные цвета
  useEffect(() => {
    document.documentElement.style.setProperty('--custom-color', primaryColor);

    // Вычисляем темный цвет с помощью tinycolor
    const darkColor = tinycolor(primaryColor).darken(15).toString();
    document.documentElement.style.setProperty('--custom-color-dark', darkColor);

    localStorage.setItem('primaryColor', primaryColor);
  }, [primaryColor]);

  // При монтировании
  useEffect(() => {
    document.documentElement.style.setProperty('--custom-color', primaryColor);
    const darkColor = tinycolor(primaryColor).darken(15).toString();
    document.documentElement.style.setProperty('--custom-color-dark', darkColor);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
