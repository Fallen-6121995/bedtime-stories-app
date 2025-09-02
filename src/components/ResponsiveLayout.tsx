// Responsive layout component that adapts to different screen sizes and orientations

import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { BaseComponentProps } from '../types';

interface ResponsiveLayoutProps extends BaseComponentProps {
  children: React.ReactNode;
  variant?: 'container' | 'section' | 'grid' | 'sidebar';
  maxWidth?: number;
  centerContent?: boolean;
  adaptPadding?: boolean;
  adaptSpacing?: boolean;
}

export const ResponsiveLayout: React.FC<ResponsiveLayoutProps> = ({
  children,
  variant = 'container',
  maxWidth,
  centerContent = false,
  adaptPadding = true,
  adaptSpacing = true,
  style,
  testID,
}) => {
  const {
    dimensions,
    isTablet,
    isLandscape,
    shouldUseCompactLayout,
    getAdaptiveSpacing,
    getSafePadding,
  } = useResponsive();

  const getLayoutStyles = (): ViewStyle => {
    const baseSpacing = getAdaptiveSpacing();
    const safePadding = getSafePadding();

    switch (variant) {
      case 'container':
        return {
          flex: 1,
          paddingHorizontal: adaptPadding ? safePadding : 0,
          paddingVertical: adaptPadding ? baseSpacing : 0,
          maxWidth: maxWidth || (isTablet ? 800 : dimensions.width),
          alignSelf: centerContent ? 'center' : 'stretch',
        };

      case 'section':
        return {
          marginBottom: adaptSpacing ? baseSpacing : 0,
          paddingHorizontal: adaptPadding ? safePadding : 0,
        };

      case 'grid':
        return {
          flexDirection: shouldUseCompactLayout() ? 'column' : 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          paddingHorizontal: adaptPadding ? safePadding : 0,
        };

      case 'sidebar':
        return {
          flexDirection: isTablet && isLandscape ? 'row' : 'column',
          flex: 1,
        };

      default:
        return {};
    }
  };

  const layoutStyles = getLayoutStyles();
  const combinedStyles = [layoutStyles, style];

  return (
    <View style={combinedStyles} testID={testID}>
      {children}
    </View>
  );
};

// Responsive grid item component
interface ResponsiveGridItemProps extends BaseComponentProps {
  children: React.ReactNode;
  columns?: number;
  minWidth?: number;
  maxWidth?: number;
}

export const ResponsiveGridItem: React.FC<ResponsiveGridItemProps> = ({
  children,
  columns = 2,
  minWidth = 150,
  maxWidth,
  style,
  testID,
}) => {
  const { dimensions, getOptimalColumns, getAdaptiveSpacing } = useResponsive();

  const spacing = getAdaptiveSpacing();
  const optimalColumns = getOptimalColumns(minWidth, columns);
  
  // Calculate item width based on available space and columns
  const availableWidth = dimensions.width - (spacing * 2); // Account for container padding
  const itemSpacing = spacing * (optimalColumns - 1); // Space between items
  const itemWidth = (availableWidth - itemSpacing) / optimalColumns;
  
  const finalWidth = maxWidth ? Math.min(itemWidth, maxWidth) : itemWidth;

  const itemStyles: ViewStyle = {
    width: finalWidth,
    marginBottom: spacing,
  };

  return (
    <View style={[itemStyles, style]} testID={testID}>
      {children}
    </View>
  );
};

// Responsive spacer component
interface ResponsiveSpacerProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  horizontal?: boolean;
  adaptive?: boolean;
}

export const ResponsiveSpacer: React.FC<ResponsiveSpacerProps> = ({
  size = 'medium',
  horizontal = false,
  adaptive = true,
}) => {
  const { getAdaptiveSpacing } = useResponsive();

  const getSpacingValue = () => {
    const baseSpacing = adaptive ? getAdaptiveSpacing() : 16;
    
    switch (size) {
      case 'small':
        return baseSpacing * 0.5;
      case 'medium':
        return baseSpacing;
      case 'large':
        return baseSpacing * 1.5;
      case 'xlarge':
        return baseSpacing * 2;
      default:
        return baseSpacing;
    }
  };

  const spacingValue = getSpacingValue();
  
  const spacerStyle: ViewStyle = horizontal
    ? { width: spacingValue }
    : { height: spacingValue };

  return <View style={spacerStyle} />;
};

// Responsive container with safe area handling
interface ResponsiveContainerProps extends BaseComponentProps {
  children: React.ReactNode;
  safeArea?: boolean;
  maxWidth?: number;
  centerContent?: boolean;
  backgroundColor?: string;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  safeArea = true,
  maxWidth,
  centerContent = true,
  backgroundColor,
  style,
  testID,
}) => {
  const { dimensions, isTablet, getSafePadding, hasNotch } = useResponsive();

  const containerStyles: ViewStyle = {
    flex: 1,
    backgroundColor,
    paddingTop: safeArea && hasNotch ? getSafePadding() : 0,
    paddingHorizontal: getSafePadding(),
    maxWidth: maxWidth || (isTablet ? 800 : dimensions.width),
    alignSelf: centerContent ? 'center' : 'stretch',
    width: '100%',
  };

  return (
    <View style={[containerStyles, style]} testID={testID}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  // Add any static styles here if needed
});