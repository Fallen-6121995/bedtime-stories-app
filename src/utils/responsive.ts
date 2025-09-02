// Responsive design utilities

import { Dimensions, PixelRatio } from 'react-native';
import { breakpoints } from '../constants/theme';
import { ResponsiveValue, Breakpoints } from '../types';

// Get current screen dimensions
export const getScreenDimensions = () => {
  return Dimensions.get('window');
};

// Get current screen size category
export const getScreenSize = (): keyof Breakpoints => {
  const { width } = getScreenDimensions();
  
  if (width >= breakpoints.xl) return 'xl';
  if (width >= breakpoints.lg) return 'lg';
  if (width >= breakpoints.md) return 'md';
  return 'sm';
};

// Check if current screen is a specific size or larger
export const isScreenSize = (size: keyof Breakpoints): boolean => {
  const { width } = getScreenDimensions();
  return width >= breakpoints[size];
};

// Get responsive value based on current screen size
export const getResponsiveValue = <T>(value: ResponsiveValue<T>): T => {
  if (typeof value !== 'object' || value === null) {
    return value as T;
  }
  
  const screenSize = getScreenSize();
  const responsiveValue = value as { [key in keyof Breakpoints]?: T };
  
  // Return the value for current screen size or fall back to smaller sizes
  return (
    responsiveValue[screenSize] ||
    responsiveValue.lg ||
    responsiveValue.md ||
    responsiveValue.sm ||
    (Object.values(responsiveValue)[0] as T)
  );
};

// Scale size based on screen density
export const scaleSize = (size: number): number => {
  return PixelRatio.roundToNearestPixel(size);
};

// Scale font size based on screen density and accessibility settings
export const scaleFontSize = (size: number): number => {
  const scale = PixelRatio.getFontScale();
  return Math.round(size * scale);
};

// Check if device is tablet
export const isTablet = (): boolean => {
  const { width, height } = getScreenDimensions();
  const aspectRatio = width / height;
  const minDimension = Math.min(width, height);
  
  // Consider it a tablet if minimum dimension is >= 768 or aspect ratio is close to square
  return minDimension >= 768 || (aspectRatio > 0.6 && aspectRatio < 1.4);
};

// Get safe padding for different screen sizes
export const getSafePadding = () => {
  const screenSize = getScreenSize();
  
  switch (screenSize) {
    case 'xl':
      return 32;
    case 'lg':
      return 24;
    case 'md':
      return 20;
    default:
      return 16;
  }
};

// Get appropriate number of columns for grid layouts
export const getGridColumns = (itemWidth: number, spacing: number = 16): number => {
  const { width } = getScreenDimensions();
  const availableWidth = width - (getSafePadding() * 2);
  const columns = Math.floor(availableWidth / (itemWidth + spacing));
  return Math.max(1, columns);
};

// Create responsive styles helper
export const createResponsiveStyle = (baseStyle: any, responsiveProps: any) => {
  const screenSize = getScreenSize();
  const responsiveStyle = responsiveProps[screenSize] || {};
  
  return {
    ...baseStyle,
    ...responsiveStyle,
  };
};

// Get responsive spacing value
export const getResponsiveSpacing = (value: ResponsiveValue<number>): number => {
  return getResponsiveValue(value);
};

// Get responsive font size
export const getResponsiveFontSize = (value: ResponsiveValue<number>): number => {
  const fontSize = getResponsiveValue(value);
  return scaleFontSize(fontSize);
};

// Get adaptive layout configuration for different screen sizes
export const getLayoutConfig = () => {
  const screenSize = getScreenSize();
  const isTabletDevice = isTablet();
  const { width, height } = getScreenDimensions();
  const isLandscape = width > height;
  
  return {
    // Container configurations
    containerPadding: getSafePadding(),
    sectionSpacing: screenSize === 'sm' ? 16 : screenSize === 'md' ? 20 : 24,
    
    // Grid configurations
    storyCardWidth: isTabletDevice 
      ? (isLandscape ? 200 : 180) 
      : (screenSize === 'sm' ? 140 : 160),
    storyCardHeight: isTabletDevice 
      ? (isLandscape ? 280 : 260) 
      : (screenSize === 'sm' ? 200 : 220),
    
    // Typography configurations
    headingSize: isTabletDevice ? 28 : (screenSize === 'sm' ? 22 : 24),
    bodySize: isTabletDevice ? 18 : (screenSize === 'sm' ? 14 : 16),
    captionSize: isTabletDevice ? 14 : (screenSize === 'sm' ? 12 : 13),
    
    // Touch target configurations
    minTouchTarget: 44, // iOS HIG minimum
    buttonHeight: isTabletDevice ? 52 : (screenSize === 'sm' ? 44 : 48),
    iconSize: isTabletDevice ? 28 : (screenSize === 'sm' ? 20 : 24),
    
    // Layout flags
    useCompactLayout: screenSize === 'sm' || (!isTabletDevice && !isLandscape),
    showSidebar: isTabletDevice && isLandscape,
    useBottomTabs: !isTabletDevice || !isLandscape,
    maxContentWidth: isTabletDevice ? 800 : width,
  };
};

// Get responsive margin/padding values
export const getResponsiveEdgeInsets = () => {
  const screenSize = getScreenSize();
  const isTabletDevice = isTablet();
  
  const base = getSafePadding();
  
  return {
    horizontal: base,
    vertical: base * 0.75,
    small: base * 0.5,
    large: base * 1.5,
    section: isTabletDevice ? base * 1.25 : base,
  };
};

// Get responsive border radius values
export const getResponsiveBorderRadius = () => {
  const screenSize = getScreenSize();
  const isTabletDevice = isTablet();
  
  const multiplier = isTabletDevice ? 1.2 : screenSize === 'sm' ? 0.8 : 1;
  
  return {
    small: Math.round(4 * multiplier),
    medium: Math.round(8 * multiplier),
    large: Math.round(12 * multiplier),
    xlarge: Math.round(16 * multiplier),
  };
};

// Create adaptive styles for common UI patterns
export const createAdaptiveStyles = () => {
  const config = getLayoutConfig();
  const edgeInsets = getResponsiveEdgeInsets();
  const borderRadius = getResponsiveBorderRadius();
  
  return {
    container: {
      paddingHorizontal: edgeInsets.horizontal,
      paddingVertical: edgeInsets.vertical,
      maxWidth: config.maxContentWidth,
      alignSelf: 'center' as const,
    },
    
    section: {
      marginBottom: edgeInsets.section,
    },
    
    card: {
      borderRadius: borderRadius.medium,
      minHeight: config.minTouchTarget,
    },
    
    button: {
      height: config.buttonHeight,
      borderRadius: borderRadius.small,
      minWidth: config.minTouchTarget,
    },
    
    input: {
      height: config.buttonHeight,
      borderRadius: borderRadius.small,
      paddingHorizontal: edgeInsets.small,
    },
    
    heading: {
      fontSize: config.headingSize,
      marginBottom: edgeInsets.small,
    },
    
    body: {
      fontSize: config.bodySize,
      lineHeight: config.bodySize * 1.5,
    },
    
    caption: {
      fontSize: config.captionSize,
      lineHeight: config.captionSize * 1.4,
    },
  };
};

// Responsive hook for use in components (deprecated - use the one from hooks/useResponsive.ts)
export const useResponsive = () => {
  console.warn('useResponsive from utils/responsive.ts is deprecated. Use the one from hooks/useResponsive.ts instead.');
  
  const dimensions = getScreenDimensions();
  const screenSize = getScreenSize();
  
  return {
    dimensions,
    screenSize,
    isTablet: isTablet(),
    isSmall: screenSize === 'sm',
    isMedium: screenSize === 'md',
    isLarge: screenSize === 'lg',
    isExtraLarge: screenSize === 'xl',
    getResponsiveValue,
    getSafePadding: getSafePadding(),
    getGridColumns,
    createResponsiveStyle,
    getResponsiveSpacing,
    getResponsiveFontSize,
  };
};