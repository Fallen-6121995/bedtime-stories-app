import { Platform, Dimensions } from 'react-native';

// --- CENTRALIZED APP THEME ---
export const THEME = {
  // A harmonious, magical palette
  colors: {
    background: '#F8FAFC', // Very neutral cool gray/white
    textDark: '#1E293B',   // Slate 800
    textMedium: '#64748B', // Slate 500
    textLight: '#94A3B8',  // Slate 400
    
    // Brand Colors
    primary: '#8B5CF6',    // Violet
    secondary: '#0EA5E9',  // Sky Blue
    accent: '#F59E0B',     // Amber/Gold
    rose: '#F43F5E',       // Rose (for hearts/likes)
    
    white: '#FFFFFF',
    cardBg: '#FFFFFF',
    
    // UI Elements
    border: '#E2E8F0',
    inputBg: '#F1F5F9',
  },

  // Premium Gradients
  gradients: {
    primary: ['#A78BFA', '#8B5CF6'],    // Soft Violet
    ocean: ['#38BDF8', '#0EA5E9'],      // Blue
    sunset: ['#FBBF24', '#F59E0B'],     // Gold/Orange
    jungle: ['#34D399', '#10B981'],     // Green
    berry: ['#F472B6', '#DB2777'],      // Pink
    dark: ['#334155', '#1E293B'],       // Night mode/Dark
  },

  // Typography
  fonts: {
    regular: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    medium: Platform.OS === 'ios' ? 'System' : 'sans-serif-medium',
    bold: Platform.OS === 'ios' ? 'System' : 'sans-serif',
    heading: Platform.OS === 'ios' ? 'Futura-Medium' : 'sans-serif-black', 
    playful: Platform.OS === 'ios' ? 'AvenirNext-DemiBold' : 'sans-serif-medium',
  },

  // Spacing & Layout
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 40,
  },

  borderRadius: {
    m: 16,
    l: 24,
    xl: 32,
    full: 9999,
  },

  // --- SHADOWS ---
  shadows: {
    // 1. Standard Elevations
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    // ✅ ADDED THIS MISSING PROPERTY
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
    
    // 2. Premium Effects
    soft: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.08,
      shadowRadius: 20,
      elevation: 3,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
      elevation: 4,
    },

    // 3. Dynamic Color Shadows
    glow: (color: string) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 8,
    }),
    colored: (color: string, opacity: number = 0.2) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: opacity,
      shadowRadius: 8,
      elevation: 4,
    }),
  },
};

// --- RESPONSIVE UTILITIES ---
export const getResponsiveValue = (currentWidth: number, mobile: number, tablet: number) => {
  return currentWidth > 600 ? tablet : mobile;
};

export const getNumColumns = (currentWidth: number) => {
  if (currentWidth > 1024) return 4;
  if (currentWidth > 600) return 3;
  return 2;
};

export const getCardWidth = (currentWidth: number, numColumns: number, gap: number = 16, padding: number = 24) => {
  return (currentWidth - (padding * 2) - (gap * (numColumns - 1))) / numColumns;
};