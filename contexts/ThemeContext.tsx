import React, { createContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. Check localStorage for a saved theme
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }
    // 2. If no theme in localStorage, check user's system preference
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return userPrefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    
    // Update the class on the root element
    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(theme);

    // Persist the theme to localStorage
    try {
      localStorage.setItem('theme', theme);
    } catch (error) {
      console.error("Failed to save theme to localStorage:", error);
    }

  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};