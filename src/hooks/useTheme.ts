// Theme management hook

import { useState, useEffect, useCallback } from 'react';
import { theme as defaultTheme } from '../constants/theme';
import { Theme, UserPreferences } from '../types';
import { userPreferencesService } from '../services';

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Load theme preferences
  useEffect(() => {
    const loadThemePreferences = async () => {
      try {
        const preferences = await userPreferencesService.getPreferences();
        setIsDarkMode(preferences.theme === 'dark');
        setFontSize(preferences.fontSize);
        
        // Update theme based on preferences
        updateTheme(preferences);
      } catch (error) {
        console.error('Error loading theme preferences:', error);
      }
    };

    loadThemePreferences();
  }, []);

  const updateTheme = useCallback((preferences: UserPreferences) => {
    // Create theme with user preferences
    const updatedTheme: Theme = {
      ...defaultTheme,
      colors: preferences.theme === 'dark' ? getDarkColors() : defaultTheme.colors,
      typography: {
        ...defaultTheme.typography,
        fontSize: getFontSizeScale(preferences.fontSize),
      },
    };

    setCurrentTheme(updatedTheme);
  }, []);

  const toggleTheme = useCallback(async () => {
    try {
      const newTheme = isDarkMode ? 'light' : 'dark';
      await userPreferencesService.setTheme(newTheme);
      setIsDarkMode(!isDarkMode);
      
      const preferences = await userPreferencesService.getPreferences();
      updateTheme(preferences);
    } catch (error) {
      console.error('Error toggling theme:', error);
    }
  }, [isDarkMode, updateTheme]);

  const changeFontSize = useCallback(async (size: 'small' | 'medium' | 'large') => {
    try {
      await userPreferencesService.setFontSize(size);
      setFontSize(size);
      
      const preferences = await userPreferencesService.getPreferences();
      updateTheme(preferences);
    } catch (error) {
      console.error('Error changing font size:', error);
    }
  }, [updateTheme]);

  const getThemedStyles = useCallback((styles: any) => {
    // Helper function to apply theme-aware styles
    return {
      ...styles,
      backgroundColor: isDarkMode ? currentTheme.colors.neutral[900] : currentTheme.colors.neutral[50],
      color: isDarkMode ? currentTheme.colors.neutral[100] : currentTheme.colors.neutral[900],
    };
  }, [currentTheme, isDarkMode]);

  return {
    theme: currentTheme,
    colors: currentTheme.colors,
    typography: currentTheme.typography,
    spacing: currentTheme.spacing,
    isDarkMode,
    fontSize,
    toggleTheme,
    changeFontSize,
    getThemedStyles,
  };
};

// Helper function to get dark mode colors
const getDarkColors = () => ({
  ...defaultTheme.colors,
  neutral: {
    50: '#171717',
    100: '#262626',
    200: '#404040',
    300: '#525252',
    400: '#737373',
    500: '#A3A3A3',
    600: '#D4D4D4',
    700: '#E5E5E5',
    800: '#F5F5F5',
    900: '#FAFAFA',
  },
});

// Helper function to get font size scale based on preference
const getFontSizeScale = (size: 'small' | 'medium' | 'large') => {
  const baseScale = defaultTheme.typography.fontSize;
  const multiplier = size === 'small' ? 0.9 : size === 'large' ? 1.1 : 1;

  return {
    xs: Math.round(baseScale.xs * multiplier),
    sm: Math.round(baseScale.sm * multiplier),
    base: Math.round(baseScale.base * multiplier),
    lg: Math.round(baseScale.lg * multiplier),
    xl: Math.round(baseScale.xl * multiplier),
    '2xl': Math.round(baseScale['2xl'] * multiplier),
    '3xl': Math.round(baseScale['3xl'] * multiplier),
    '4xl': Math.round(baseScale['4xl'] * multiplier),
    '5xl': Math.round(baseScale['5xl'] * multiplier),
  };
};