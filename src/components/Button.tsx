// Enhanced Button component with multiple variants and animations

import React, { useRef } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useThemeContext } from '../context/ThemeContext';
import { getButtonStyles, getTextStyles } from '../utils/theme';
import { ButtonProps } from '../types';
import { createButtonPressAnimation, createSuccessAnimation, ANIMATION_DURATION } from '../utils/animations';

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  style,
  testID,
}) => {
  const { theme, isDarkMode } = useThemeContext();
  const scaleAnimation = useRef(new Animated.Value(1)).current;
  const opacityAnimation = useRef(new Animated.Value(1)).current;
  
  const buttonStyles = getButtonStyles(variant, theme, isDarkMode);
  const textStyles = getTextStyles('button', theme, isDarkMode);
  
  const sizeStyles = getSizeStyles(size, theme);
  const variantTextColor = getVariantTextColor(variant, theme, isDarkMode);
  
  const isDisabled = disabled || loading;
  
  const handlePress = () => {
    if (!isDisabled) {
      // Animate button press
      createButtonPressAnimation(scaleAnimation).start();
      onPress();
    }
  };

  const handlePressIn = () => {
    if (!isDisabled) {
      Animated.parallel([
        Animated.timing(scaleAnimation, {
          toValue: 0.95,
          duration: ANIMATION_DURATION.fast / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 0.8,
          duration: ANIMATION_DURATION.fast / 2,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (!isDisabled) {
      Animated.parallel([
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: ANIMATION_DURATION.fast / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: ANIMATION_DURATION.fast / 2,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnimation }],
        opacity: opacityAnimation,
      }}
    >
      <Pressable
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        style={[
          buttonStyles,
          sizeStyles.container,
          style,
          isDisabled && styles.disabled,
        ]}
        testID={testID}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        accessibilityLabel={title}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator
              size="small"
              color={variantTextColor}
              style={icon ? styles.iconSpacing : undefined}
            />
          ) : (
            icon && (
              <Icon
                name={icon}
                size={sizeStyles.iconSize}
                color={variantTextColor}
                style={variant !== 'icon' ? styles.iconSpacing : undefined}
              />
            )
          )}
          {variant !== 'icon' && (
            <Text
              style={[
                textStyles,
                sizeStyles.text,
                { color: variantTextColor },
                loading && icon && styles.textWithLoader,
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Helper function to get size-specific styles
const getSizeStyles = (size: 'small' | 'medium' | 'large', theme: any) => {
  switch (size) {
    case 'small':
      return {
        container: {
          paddingHorizontal: theme.spacing[3],
          paddingVertical: theme.spacing[2],
          minHeight: 36,
        },
        text: {
          fontSize: theme.typography.fontSize.sm,
        },
        iconSize: 16,
      };
    case 'large':
      return {
        container: {
          paddingHorizontal: theme.spacing[6],
          paddingVertical: theme.spacing[4],
          minHeight: 56,
        },
        text: {
          fontSize: theme.typography.fontSize.lg,
        },
        iconSize: 24,
      };
    default: // medium
      return {
        container: {
          paddingHorizontal: theme.spacing[4],
          paddingVertical: theme.spacing[3],
          minHeight: 48,
        },
        text: {
          fontSize: theme.typography.fontSize.base,
        },
        iconSize: 20,
      };
  }
};

// Helper function to get text color based on variant
const getVariantTextColor = (
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon',
  theme: any,
  isDarkMode: boolean
) => {
  switch (variant) {
    case 'primary':
      return '#FFFFFF';
    case 'secondary':
      return '#FFFFFF';
    case 'outline':
      return theme.colors.primary[500];
    case 'ghost':
    case 'icon':
      return isDarkMode ? theme.colors.neutral[300] : theme.colors.neutral[700];
    default:
      return '#FFFFFF';
  }
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSpacing: {
    marginRight: 8,
  },
  textWithLoader: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button;