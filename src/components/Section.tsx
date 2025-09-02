// Section component for content organization

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { getTextStyles } from '../utils/theme';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  spacing?: 'none' | 'small' | 'medium' | 'large';
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  testID?: string;
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  subtitle,
  spacing = 'medium',
  style,
  titleStyle,
  subtitleStyle,
  testID,
}) => {
  const { theme, isDarkMode } = useThemeContext();
  
  const titleStyles = getTextStyles('h3', theme, isDarkMode);
  const subtitleStyles = getTextStyles('body', theme, isDarkMode);
  
  const spacingStyles = getSpacingStyles(spacing, theme);

  return (
    <View style={[styles.container, spacingStyles, style]} testID={testID}>
      {title && (
        <Text style={[titleStyles, styles.title, titleStyle]}>
          {title}
        </Text>
      )}
      {subtitle && (
        <Text style={[subtitleStyles, styles.subtitle, subtitleStyle]}>
          {subtitle}
        </Text>
      )}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

// Helper function to get spacing styles
const getSpacingStyles = (spacing: 'none' | 'small' | 'medium' | 'large', theme: any) => {
  switch (spacing) {
    case 'none':
      return {};
    case 'small':
      return {
        marginBottom: theme.spacing[3],
      };
    case 'large':
      return {
        marginBottom: theme.spacing[8],
      };
    default: // medium
      return {
        marginBottom: theme.spacing[6],
      };
  }
};

const styles = StyleSheet.create({
  container: {
    // Base container styles
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 16,
    opacity: 0.8,
  },
  content: {
    // Content wrapper styles
  },
});

export default Section;