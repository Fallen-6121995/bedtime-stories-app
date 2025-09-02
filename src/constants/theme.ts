// Design system constants and theme configuration

import { Colors, Typography, Spacing, Theme, Breakpoints } from '../types';

// Color palette - warm and child-friendly
export const colors: Colors = {
  // Primary colors - warm and inviting
  primary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Main primary
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },
  
  // Secondary colors - soft and playful
  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Main secondary
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  
  // Neutral colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// Typography scale
export const typography: Typography = {
  // Font families
  fontFamily: {
    regular: 'System', // Platform default
    medium: 'System-Medium',
    bold: 'System-Bold',
    playful: 'ComicNeue-Regular', // For headings and fun elements
  },
  
  // Font sizes (responsive)
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing system
export const spacing: Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};

// Breakpoint system for responsive design
export const breakpoints: Breakpoints = {
  sm: 480,  // Small phones
  md: 768,  // Large phones / small tablets
  lg: 1024, // Tablets
  xl: 1280, // Large tablets
};

// Complete theme object
export const theme: Theme = {
  colors,
  typography,
  spacing,
};

// Shadow presets
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Border radius values
export const borderRadius = {
  none: 0,
  sm: 4,
  base: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Animation durations
export const animations = {
  fast: 150,
  normal: 300,
  slow: 500,
  splash: 2000,
};

// Z-index values
export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
};

// Theme utility functions
export const getColorWithOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba with opacity
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

// Get theme-aware text color based on background
export const getContrastTextColor = (backgroundColor: string, theme: Theme): string => {
  // Simple contrast calculation - in production, you might want a more sophisticated algorithm
  const isDark = backgroundColor === theme.colors.neutral[900] || 
                 backgroundColor === theme.colors.neutral[800] ||
                 backgroundColor === theme.colors.neutral[700];
  
  return isDark ? theme.colors.neutral[100] : theme.colors.neutral[900];
};

// Get semantic color variants
export const getSemanticColors = (theme: Theme) => ({
  success: {
    light: getColorWithOpacity(theme.colors.success, 0.1),
    main: theme.colors.success,
    dark: getColorWithOpacity(theme.colors.success, 0.8),
  },
  warning: {
    light: getColorWithOpacity(theme.colors.warning, 0.1),
    main: theme.colors.warning,
    dark: getColorWithOpacity(theme.colors.warning, 0.8),
  },
  error: {
    light: getColorWithOpacity(theme.colors.error, 0.1),
    main: theme.colors.error,
    dark: getColorWithOpacity(theme.colors.error, 0.8),
  },
  info: {
    light: getColorWithOpacity(theme.colors.info, 0.1),
    main: theme.colors.info,
    dark: getColorWithOpacity(theme.colors.info, 0.8),
  },
});

export default theme;