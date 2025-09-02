// Avatar component with fallback support

import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { getTextStyles } from '../utils/theme';

interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  testID?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  source,
  name,
  size = 'medium',
  style,
  imageStyle,
  testID,
}) => {
  const [imageError, setImageError] = useState(false);
  const { theme, isDarkMode } = useThemeContext();
  
  const sizeStyles = getSizeStyles(size, theme);
  const textStyles = getTextStyles('button', theme, isDarkMode);
  
  const initials = getInitials(name);
  const backgroundColor = getBackgroundColor(name, theme);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const showFallback = !source || imageError;

  return (
    <View
      style={[
        styles.container,
        sizeStyles.container,
        showFallback && { backgroundColor },
        style,
      ]}
      testID={testID}
    >
      {!showFallback ? (
        <Image
          source={source}
          style={[styles.image, sizeStyles.container, imageStyle]}
          onError={handleImageError}
          accessibilityLabel={name ? `${name}'s avatar` : 'User avatar'}
        />
      ) : (
        <Text
          style={[
            textStyles,
            sizeStyles.text,
            { color: '#FFFFFF' },
          ]}
          numberOfLines={1}
        >
          {initials}
        </Text>
      )}
    </View>
  );
};

// Helper function to get size-specific styles
const getSizeStyles = (size: 'small' | 'medium' | 'large' | 'xlarge', theme: any) => {
  switch (size) {
    case 'small':
      return {
        container: {
          width: 32,
          height: 32,
          borderRadius: 16,
        },
        text: {
          fontSize: theme.typography.fontSize.sm,
        },
      };
    case 'large':
      return {
        container: {
          width: 64,
          height: 64,
          borderRadius: 32,
        },
        text: {
          fontSize: theme.typography.fontSize.xl,
        },
      };
    case 'xlarge':
      return {
        container: {
          width: 96,
          height: 96,
          borderRadius: 48,
        },
        text: {
          fontSize: theme.typography.fontSize['2xl'],
        },
      };
    default: // medium
      return {
        container: {
          width: 48,
          height: 48,
          borderRadius: 24,
        },
        text: {
          fontSize: theme.typography.fontSize.base,
        },
      };
  }
};

// Helper function to get initials from name
const getInitials = (name?: string): string => {
  if (!name) return '?';
  
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

// Helper function to generate consistent background color from name
const getBackgroundColor = (name?: string, theme: any): string => {
  if (!name) return theme.colors.neutral[400];
  
  const colors = [
    theme.colors.primary[500],
    theme.colors.secondary[500],
    theme.colors.info,
    theme.colors.warning,
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#10B981', // Emerald
    '#F59E0B', // Amber
  ];
  
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
});

export default Avatar;