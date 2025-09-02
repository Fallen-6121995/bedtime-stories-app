// Responsive screen wrapper with orientation and device adaptation

import React, { useCallback } from 'react';
import { View, ViewStyle, StyleSheet, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useResponsive } from '../hooks/useResponsive';
import { colors } from '../constants/theme';
import { BaseComponentProps } from '../types';

interface ResponsiveScreenProps extends BaseComponentProps {
  children: React.ReactNode;
  backgroundColor?: string;
  statusBarStyle?: 'light-content' | 'dark-content';
  statusBarBackgroundColor?: string;
  safeArea?: boolean;
  scrollable?: boolean;
  centerContent?: boolean;
  maxWidth?: number;
  onOrientationChange?: (orientation: 'portrait' | 'landscape') => void;
  adaptLayout?: boolean;
  showStatusBar?: boolean;
}

export const ResponsiveScreen: React.FC<ResponsiveScreenProps> = ({
  children,
  backgroundColor = colors.neutral[50],
  statusBarStyle = 'dark-content',
  statusBarBackgroundColor,
  safeArea = true,
  scrollable = false,
  centerContent = false,
  maxWidth,
  onOrientationChange,
  adaptLayout = true,
  showStatusBar = true,
  style,
  testID,
}) => {
  const {
    dimensions,
    isTablet,
    isLandscape,
    isPortrait,
    hasNotch,
    isIOS,
    isAndroid,
    getSafePadding,
    getAdaptiveSpacing,
    shouldUseCompactLayout,
  } = useResponsive(onOrientationChange);

  // Handle screen focus for status bar updates
  useFocusEffect(
    useCallback(() => {
      if (showStatusBar) {
        StatusBar.setBarStyle(statusBarStyle, true);
        if (isAndroid && statusBarBackgroundColor) {
          StatusBar.setBackgroundColor(statusBarBackgroundColor, true);
        }
      }
    }, [statusBarStyle, statusBarBackgroundColor, showStatusBar, isAndroid])
  );

  const getScreenStyles = (): ViewStyle => {
    const safePadding = getSafePadding();
    const adaptiveSpacing = getAdaptiveSpacing();

    let screenStyles: ViewStyle = {
      flex: 1,
      backgroundColor,
    };

    if (adaptLayout) {
      // Add safe area padding
      if (safeArea) {
        screenStyles.paddingTop = hasNotch ? safePadding : 0;
        screenStyles.paddingHorizontal = safePadding;
        screenStyles.paddingBottom = isIOS ? safePadding * 0.5 : 0;
      }

      // Add responsive spacing
      if (!safeArea) {
        screenStyles.paddingHorizontal = adaptiveSpacing;
        screenStyles.paddingVertical = adaptiveSpacing;
      }

      // Handle max width for tablets
      if (maxWidth || (isTablet && centerContent)) {
        screenStyles.maxWidth = maxWidth || (isTablet ? 800 : dimensions.width);
        screenStyles.alignSelf = 'center';
        screenStyles.width = '100%';
      }

      // Adjust layout for landscape on tablets
      if (isTablet && isLandscape) {
        screenStyles.paddingHorizontal = safePadding * 1.5;
      }

      // Compact layout adjustments
      if (shouldUseCompactLayout()) {
        screenStyles.paddingHorizontal = Math.max(safePadding * 0.75, 12);
      }
    }

    return screenStyles;
  };

  const screenStyles = getScreenStyles();
  const combinedStyles = [screenStyles, style];

  const content = (
    <View style={combinedStyles} testID={testID}>
      {children}
    </View>
  );

  return content;
};

// Responsive screen with automatic layout adaptation
interface AdaptiveScreenProps extends Omit<ResponsiveScreenProps, 'adaptLayout'> {
  variant?: 'default' | 'centered' | 'sidebar' | 'modal';
}

export const AdaptiveScreen: React.FC<AdaptiveScreenProps> = ({
  variant = 'default',
  centerContent,
  maxWidth,
  ...props
}) => {
  const { isTablet, isLandscape } = useResponsive();

  const getVariantProps = () => {
    switch (variant) {
      case 'centered':
        return {
          centerContent: true,
          maxWidth: maxWidth || (isTablet ? 600 : undefined),
        };

      case 'sidebar':
        return {
          centerContent: false,
          maxWidth: isTablet && isLandscape ? 1200 : maxWidth,
        };

      case 'modal':
        return {
          centerContent: true,
          maxWidth: maxWidth || (isTablet ? 500 : undefined),
          backgroundColor: colors.neutral[100],
        };

      default:
        return {
          centerContent: centerContent ?? false,
          maxWidth: maxWidth,
        };
    }
  };

  const variantProps = getVariantProps();

  return (
    <ResponsiveScreen
      adaptLayout={true}
      {...variantProps}
      {...props}
    />
  );
};

// Screen with responsive grid layout
interface ResponsiveGridScreenProps extends ResponsiveScreenProps {
  columns?: number;
  itemMinWidth?: number;
  itemSpacing?: number;
}

export const ResponsiveGridScreen: React.FC<ResponsiveGridScreenProps> = ({
  children,
  columns = 2,
  itemMinWidth = 150,
  itemSpacing,
  ...props
}) => {
  const { getOptimalColumns, getAdaptiveSpacing } = useResponsive();

  const optimalColumns = getOptimalColumns(itemMinWidth, columns);
  const spacing = itemSpacing || getAdaptiveSpacing();

  const gridStyles: ViewStyle = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing,
  };

  return (
    <ResponsiveScreen {...props}>
      <View style={gridStyles}>
        {children}
      </View>
    </ResponsiveScreen>
  );
};

const styles = StyleSheet.create({
  // Add any static styles here if needed
});