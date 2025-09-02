// Child-friendly button component with enhanced touch interactions and accessibility

import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Text,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useChildFriendlyTouch } from '../hooks/useChildFriendlyTouch';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography, shadows } from '../constants/theme';
import { BaseComponentProps } from '../types';

interface ChildFriendlyButtonProps extends BaseComponentProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'fun' | 'playful';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right' | 'only';
  
  // Child-friendly specific props
  colorful?: boolean;
  rounded?: boolean;
  shadow?: boolean;
  hapticFeedback?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  
  // Touch interaction props
  enableLongPress?: boolean;
  onLongPress?: () => void;
  preventDoublePress?: boolean;
}

export const ChildFriendlyButton: React.FC<ChildFriendlyButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  colorful = false,
  rounded = true,
  shadow = true,
  hapticFeedback = true,
  accessibilityLabel,
  accessibilityHint,
  enableLongPress = false,
  onLongPress,
  preventDoublePress = true,
  style,
  testID,
}) => {
  const {
    isTablet,
    getAdaptiveFontSize,
    getAdaptiveSpacing,
  } = useResponsive();

  const {
    touchProps,
    animatedStyle,
    touchTargetSize,
  } = useChildFriendlyTouch(
    {
      onPress,
      onLongPress,
    },
    {
      enableHapticFeedback: hapticFeedback,
      hapticType: variant === 'fun' || variant === 'playful' ? 'medium' : 'light',
      enableVisualFeedback: true,
      scaleOnPress: true,
      scaleValue: 0.95,
      animationDuration: 150,
      enableLongPress,
      preventDoublePress,
      accessibilityLabel: accessibilityLabel || title,
      accessibilityHint,
      accessibilityRole: 'button',
    }
  );

  const isDisabled = disabled || loading;
  const showIconOnly = iconPosition === 'only';
  const showIcon = icon && !loading;
  const showTitle = !showIconOnly;

  // Get variant-specific styles
  const getVariantStyles = (): { container: ViewStyle; text: TextStyle } => {
    const baseContainer: ViewStyle = {
      minHeight: touchTargetSize,
      minWidth: showIconOnly ? touchTargetSize : touchTargetSize * 1.5,
      borderRadius: rounded ? (showIconOnly ? touchTargetSize / 2 : 12) : 4,
    };

    const baseText: TextStyle = {
      fontFamily: typography.fontFamily.medium,
      textAlign: 'center',
    };

    switch (variant) {
      case 'primary':
        return {
          container: {
            ...baseContainer,
            backgroundColor: colorful ? colors.primary[400] : colors.primary[500],
            ...shadow && shadows.medium,
          },
          text: {
            ...baseText,
            color: '#FFFFFF',
          },
        };

      case 'secondary':
        return {
          container: {
            ...baseContainer,
            backgroundColor: colorful ? colors.secondary[400] : colors.secondary[500],
            ...shadow && shadows.medium,
          },
          text: {
            ...baseText,
            color: '#FFFFFF',
          },
        };

      case 'outline':
        return {
          container: {
            ...baseContainer,
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: colorful ? colors.primary[400] : colors.primary[500],
          },
          text: {
            ...baseText,
            color: colorful ? colors.primary[400] : colors.primary[500],
          },
        };

      case 'ghost':
        return {
          container: {
            ...baseContainer,
            backgroundColor: 'transparent',
          },
          text: {
            ...baseText,
            color: colors.neutral[700],
          },
        };

      case 'fun':
        return {
          container: {
            ...baseContainer,
            backgroundColor: colors.secondary[400],
            borderRadius: rounded ? 20 : 8,
            ...shadow && shadows.large,
          },
          text: {
            ...baseText,
            color: '#FFFFFF',
            fontFamily: typography.fontFamily.bold,
          },
        };

      case 'playful':
        return {
          container: {
            ...baseContainer,
            backgroundColor: colors.primary[400],
            borderRadius: rounded ? touchTargetSize / 3 : 8,
            borderWidth: 3,
            borderColor: colors.primary[600],
            ...shadow && shadows.large,
          },
          text: {
            ...baseText,
            color: '#FFFFFF',
            fontFamily: typography.fontFamily.bold,
          },
        };

      default:
        return {
          container: baseContainer,
          text: baseText,
        };
    }
  };

  // Get size-specific styles
  const getSizeStyles = () => {
    const spacing = getAdaptiveSpacing();
    
    switch (size) {
      case 'small':
        return {
          container: {
            paddingHorizontal: spacing * 0.75,
            paddingVertical: spacing * 0.5,
          },
          text: {
            fontSize: getAdaptiveFontSize(isTablet ? 14 : 12),
          },
          iconSize: isTablet ? 18 : 16,
        };

      case 'large':
        return {
          container: {
            paddingHorizontal: spacing * 1.5,
            paddingVertical: spacing,
          },
          text: {
            fontSize: getAdaptiveFontSize(isTablet ? 20 : 18),
          },
          iconSize: isTablet ? 28 : 24,
        };

      case 'xlarge':
        return {
          container: {
            paddingHorizontal: spacing * 2,
            paddingVertical: spacing * 1.25,
          },
          text: {
            fontSize: getAdaptiveFontSize(isTablet ? 24 : 20),
          },
          iconSize: isTablet ? 32 : 28,
        };

      default: // medium
        return {
          container: {
            paddingHorizontal: spacing,
            paddingVertical: spacing * 0.75,
          },
          text: {
            fontSize: getAdaptiveFontSize(isTablet ? 18 : 16),
          },
          iconSize: isTablet ? 24 : 20,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  const containerStyles = [
    styles.container,
    variantStyles.container,
    sizeStyles.container,
    isDisabled && styles.disabled,
    style,
  ];

  const textStyles = [
    variantStyles.text,
    sizeStyles.text,
    isDisabled && styles.disabledText,
  ];

  const renderContent = () => {
    if (showIconOnly) {
      return loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyles.text.color}
        />
      ) : (
        showIcon && (
          <Icon
            name={icon}
            size={sizeStyles.iconSize}
            color={variantStyles.text.color}
          />
        )
      );
    }

    return (
      <View style={styles.content}>
        {loading && (
          <ActivityIndicator
            size="small"
            color={variantStyles.text.color}
            style={styles.loader}
          />
        )}
        
        {!loading && showIcon && iconPosition === 'left' && (
          <Icon
            name={icon}
            size={sizeStyles.iconSize}
            color={variantStyles.text.color}
            style={styles.iconLeft}
          />
        )}
        
        {showTitle && (
          <Text
            style={textStyles}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.8}
          >
            {title}
          </Text>
        )}
        
        {!loading && showIcon && iconPosition === 'right' && (
          <Icon
            name={icon}
            size={sizeStyles.iconSize}
            color={variantStyles.text.color}
            style={styles.iconRight}
          />
        )}
      </View>
    );
  };

  return (
    <Animated.View
      style={[containerStyles, animatedStyle]}
      {...touchProps}
      testID={testID}
    >
      {renderContent()}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginRight: 8,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.7,
  },
});

export default ChildFriendlyButton;