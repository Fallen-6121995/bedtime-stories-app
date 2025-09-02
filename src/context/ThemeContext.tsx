// Theme context provider

import React, { createContext, useContext, ReactNode } from 'react';
import { Theme } from '../types';
import { useTheme } from '../hooks';

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  toggleTheme: () => Promise<void>;
  changeFontSize: (size: 'small' | 'medium' | 'large') => Promise<void>;
  getThemedStyles: (styles: any) => any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const themeState = useTheme();

  return (
    <ThemeContext.Provider value={themeState}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};