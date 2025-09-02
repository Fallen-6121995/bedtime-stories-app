// Enhanced responsive design hook with orientation and device adaptation

import { useState, useEffect, useCallback } from 'react';
import { Dimensions, ScaledSize, Platform } from 'react-native';
import { 
  getScreenSize, 
  isTablet, 
  getSafePadding, 
  getGridColumns,
  getResponsiveValue,
  createResponsiveStyle,
  getResponsiveSpacing,
  getResponsiveFontSize,
  scaleSize,
  scaleFontSize
} from '../utils/responsive';
import { ResponsiveValue, Breakpoints } from '../types';

export interface ResponsiveHookReturn {
  // Current dimensions and screen info
  dimensions: ScaledSize;
  screenSize: keyof Breakpoints;
  isTablet: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  
  // Screen size checks
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
  isExtraLarge: boolean;
  
  // Responsive utilities
  getResponsiveValue: <T>(value: ResponsiveValue<T>) => T;
  getSafePadding: () => number;
  getGridColumns: (itemWidth: number, spacing?: number) => number;
  createResponsiveStyle: (baseStyle: any, responsiveProps: any) => any;
  getResponsiveSpacing: (value: ResponsiveValue<number>) => number;
  getResponsiveFontSize: (value: ResponsiveValue<number>) => number;
  scaleSize: (size: number) => number;
  scaleFontSize: (size: number) => number;
  
  // Layout helpers
  getOptimalColumns: (minItemWidth: number, maxColumns?: number) => number;
  getAdaptiveSpacing: () => number;
  getAdaptiveFontSize: (baseSize: number) => number;
  shouldUseCompactLayout: () => boolean;
  
  // Device-specific helpers
  isIOS: boolean;
  isAndroid: boolean;
  hasNotch: boolean;
  
  // Orientation change callback
  onOrientationChange?: (orientation: 'portrait' | 'landscape') => void;
}

export const useResponsive = (
  onOrientationChange?: (orientation: 'portrait' | 'landscape') => void
): ResponsiveHookReturn => {
  const [dimensions, setDimensions] = useState<ScaledSize>(Dimensions.get('window'));
  const [previousOrientation, setPreviousOrientation] = useState<'portrait' | 'landscape'>(
    dimensions.width > dimensions.height ? 'landscape' : 'portrait'
  );

  // Calculate derived values
  const screenSize = getScreenSize();
  const isTabletDevice = isTablet();
  const isLandscape = dimensions.width > dimensions.height;
  const isPortrait = !isLandscape;
  
  const isSmall = screenSize === 'sm';
  const isMedium = screenSize === 'md';
  const isLarge = screenSize === 'lg';
  const isExtraLarge = screenSize === 'xl';
  
  const isIOS = Platform.OS === 'ios';
  const isAndroid = Platform.OS === 'android';
  
  // Simple notch detection (more sophisticated detection would require additional libraries)
  const hasNotch = isIOS && dimensions.height >= 812;

  // Handle dimension changes and orientation detection
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
      
      const newOrientation = window.width > window.height ? 'landscape' : 'portrait';
      if (newOrientation !== previousOrientation) {
        setPreviousOrientation(newOrientation);
        onOrientationChange?.(newOrientation);
      }
    });

    return () => subscription?.remove();
  }, [previousOrientation, onOrientationChange]);

  // Get optimal number of columns for grid layouts
  const getOptimalColumns = useCallback((minItemWidth: number, maxColumns: number = 4): number => {
    const availableWidth = dimensions.width - (getSafePadding() * 2);
    const spacing = getAdaptiveSpacing();
    
    // Calculate how many items can fit
    let columns = Math.floor(availableWidth / (minItemWidth + spacing));
    
    // Apply constraints
    columns = Math.max(1, Math.min(columns, maxColumns));
    
    // Adjust for different screen sizes
    if (isTabletDevice && isLandscape) {
      columns = Math.min(columns + 1, maxColumns);
    } else if (isSmall) {
      columns = Math.min(columns, 2);
    }
    
    return columns;
  }, [dimensions.width, isTabletDevice, isLandscape, isSmall]);

  // Get adaptive spacing based on screen size and device type
  const getAdaptiveSpacing = useCallback((): number => {
    if (isTabletDevice) {
      return isLandscape ? 24 : 20;
    }
    
    switch (screenSize) {
      case 'xl':
        return 20;
      case 'lg':
        return 18;
      case 'md':
        return 16;
      default:
        return 12;
    }
  }, [isTabletDevice, isLandscape, screenSize]);

  // Get adaptive font size with accessibility considerations
  const getAdaptiveFontSize = useCallback((baseSize: number): number => {
    let adaptedSize = baseSize;
    
    // Scale up for tablets
    if (isTabletDevice) {
      adaptedSize *= 1.1;
    }
    
    // Scale for different screen sizes
    switch (screenSize) {
      case 'xl':
        adaptedSize *= 1.2;
        break;
      case 'lg':
        adaptedSize *= 1.1;
        break;
      case 'sm':
        adaptedSize *= 0.95;
        break;
    }
    
    return scaleFontSize(adaptedSize);
  }, [isTabletDevice, screenSize]);

  // Determine if compact layout should be used
  const shouldUseCompactLayout = useCallback((): boolean => {
    return isSmall || (isPortrait && !isTabletDevice);
  }, [isSmall, isPortrait, isTabletDevice]);

  return {
    // Current dimensions and screen info
    dimensions,
    screenSize,
    isTablet: isTabletDevice,
    isLandscape,
    isPortrait,
    
    // Screen size checks
    isSmall,
    isMedium,
    isLarge,
    isExtraLarge,
    
    // Responsive utilities
    getResponsiveValue,
    getSafePadding,
    getGridColumns,
    createResponsiveStyle,
    getResponsiveSpacing,
    getResponsiveFontSize,
    scaleSize,
    scaleFontSize,
    
    // Layout helpers
    getOptimalColumns,
    getAdaptiveSpacing,
    getAdaptiveFontSize,
    shouldUseCompactLayout,
    
    // Device-specific helpers
    isIOS,
    isAndroid,
    hasNotch,
  };
};