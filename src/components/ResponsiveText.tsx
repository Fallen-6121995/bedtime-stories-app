// Responsive text component with adaptive font sizes and accessibility support

import React from 'react';
import { Text, TextStyle, StyleSheet } from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography } from '../constants/theme';
import { BaseComponentProps } from '../types';

interface ResponsiveTextProps extends BaseComponentProps {
  children: React.ReactNode;
  variant?: 'heading1' | 'heading2' | 'heading3' | 'body' | 'caption' | 'button';
  size?: 'small' | 'medium' | 'large';
  weight?: 'regular' | 'medium' | 'bold';
  color?: string;
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  adjustsFontSizeToFit?: boolean;
  minimumFontScale?: number;
  allowFontScaling?: boolean;
  accessible?: boolean;
  accessibilityRole?: 'header' | 'text' | 'button';
}

export const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  variant = 'body',
  size = 'medium',
  weight = 'regular',
  color,
  align = 'left',
  numberOfLines,
  adjustsFontSizeToFit = false,
  minimumFontScale = 0.8,
  allowFontScaling = true,
  accessible = true,
  accessibilityRole,
  style,
  testID,
}) => {
  const { 
    getAdaptiveFontSize, 
    isTablet, 
    shouldUseCompactLayout 
  } = useResponsive();

  const getVariantStyles = (): TextStyle => {
    const baseStyles: Record<string, TextStyle> = {
      heading1: {
        fontSize: getAdaptiveFontSize(isTablet ? 32 : 28),
        fontFamily: typography.fontFamily.bold,
        lineHeight: getAdaptiveFontSize(isTablet ? 40 : 36),
        color: color || colors.neutral[900],
      },
      heading2: {
        fontSize: getAdaptiveFontSize(isTablet ? 26 : 22),
        fontFamily: typography.fontFamily.bold,
        lineHeight: getAdaptiveFontSize(isTablet ? 32 : 28),
        color: color || colors.neutral[900],
      },
      heading3: {
        fontSize: getAdaptiveFontSize(isTablet ? 22 : 18),
        fontFamily: typography.fontFamily.medium,
        lineHeight: getAdaptiveFontSize(isTablet ? 28 : 24),
        color: color || colors.neutral[900],
      },
      body: {
        fontSize: getAdaptiveFontSize(isTablet ? 18 : 16),
        fontFamily: typography.fontFamily.regular,
        lineHeight: getAdaptiveFontSize(isTablet ? 27 : 24),
        color: color || colors.neutral[800],
      },
      caption: {
        fontSize: getAdaptiveFontSize(isTablet ? 14 : 12),
        fontFamily: typography.fontFamily.regular,
        lineHeight: getAdaptiveFontSize(isTablet ? 20 : 18),
        color: color || colors.neutral[600],
      },
      button: {
        fontSize: getAdaptiveFontSize(isTablet ? 18 : 16),
        fontFamily: typography.fontFamily.medium,
        lineHeight: getAdaptiveFontSize(isTablet ? 22 : 20),
        color: color || colors.primary[500],
      },
    };

    return baseStyles[variant] || baseStyles.body;
  };

  const getSizeModifier = (): number => {
    const modifiers = {
      small: 0.875,
      medium: 1,
      large: 1.125,
    };
    return modifiers[size];
  };

  const getWeightStyle = (): TextStyle => {
    const weightStyles: Record<string, TextStyle> = {
      regular: { fontFamily: typography.fontFamily.regular },
      medium: { fontFamily: typography.fontFamily.medium },
      bold: { fontFamily: typography.fontFamily.bold },
    };
    return weightStyles[weight];
  };

  const variantStyles = getVariantStyles();
  const sizeModifier = getSizeModifier();
  const weightStyle = getWeightStyle();

  const textStyles: TextStyle = {
    ...variantStyles,
    ...weightStyle,
    fontSize: variantStyles.fontSize! * sizeModifier,
    lineHeight: variantStyles.lineHeight! * sizeModifier,
    textAlign: align,
  };

  // Determine accessibility role
  const getAccessibilityRole = () => {
    if (accessibilityRole) return accessibilityRole;
    
    switch (variant) {
      case 'heading1':
      case 'heading2':
      case 'heading3':
        return 'header';
      case 'button':
        return 'button';
      default:
        return 'text';
    }
  };

  return (
    <Text
      style={[textStyles, style]}
      numberOfLines={numberOfLines}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      allowFontScaling={allowFontScaling}
      accessible={accessible}
      accessibilityRole={getAccessibilityRole()}
      testID={testID}
    >
      {children}
    </Text>
  );
};

// Specialized responsive text components
export const ResponsiveHeading: React.FC<Omit<ResponsiveTextProps, 'variant'> & { level?: 1 | 2 | 3 }> = ({
  level = 1,
  ...props
}) => {
  const variant = `heading${level}` as 'heading1' | 'heading2' | 'heading3';
  return <ResponsiveText variant={variant} {...props} />;
};

export const ResponsiveBody: React.FC<Omit<ResponsiveTextProps, 'variant'>> = (props) => {
  return <ResponsiveText variant="body" {...props} />;
};

export const ResponsiveCaption: React.FC<Omit<ResponsiveTextProps, 'variant'>> = (props) => {
  return <ResponsiveText variant="caption" {...props} />;
};

export const ResponsiveButtonText: React.FC<Omit<ResponsiveTextProps, 'variant'>> = (props) => {
  return <ResponsiveText variant="button" {...props} />;
};

// Responsive text with child-friendly styling
interface ChildFriendlyTextProps extends Omit<ResponsiveTextProps, 'variant'> {
  playful?: boolean;
  colorful?: boolean;
}

export const ChildFriendlyText: React.FC<ChildFriendlyTextProps> = ({
  playful = false,
  colorful = false,
  weight = 'medium',
  ...props
}) => {
  const textColor = colorful ? colors.primary[500] : props.color;
  const fontWeight = playful ? 'bold' : weight;

  return (
    <ResponsiveText
      weight={fontWeight}
      color={textColor}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  // Add any static styles here if needed
});