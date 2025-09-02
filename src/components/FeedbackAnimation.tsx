// Feedback animation component for success/error states

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../hooks/useTheme';
import {
  createSuccessAnimation,
  createErrorShakeAnimation,
  ANIMATION_DURATION,
  EASING,
} from '../utils/animations';

interface FeedbackAnimationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  visible: boolean;
  onAnimationComplete?: () => void;
  style?: ViewStyle;
  duration?: number;
}

const FeedbackAnimation: React.FC<FeedbackAnimationProps> = ({
  type,
  message,
  visible,
  onAnimationComplete,
  style,
  duration = 3000,
}) => {
  const { colors, typography, spacing } = useTheme();
  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const opacityAnimation = useRef(new Animated.Value(0)).current;
  const translateYAnimation = useRef(new Animated.Value(-50)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const getIconName = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          background: colors.success,
          icon: '#FFFFFF',
          text: '#FFFFFF',
        };
      case 'error':
        return {
          background: colors.error,
          icon: '#FFFFFF',
          text: '#FFFFFF',
        };
      case 'warning':
        return {
          background: colors.warning,
          icon: '#FFFFFF',
          text: '#FFFFFF',
        };
      case 'info':
        return {
          background: colors.info,
          icon: '#FFFFFF',
          text: '#FFFFFF',
        };
      default:
        return {
          background: colors.neutral[600],
          icon: '#FFFFFF',
          text: '#FFFFFF',
        };
    }
  };

  useEffect(() => {
    if (visible) {
      // Entrance animation
      Animated.parallel([
        Animated.timing(scaleAnimation, {
          toValue: 1,
          duration: ANIMATION_DURATION.normal,
          easing: EASING.easeOut,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnimation, {
          toValue: 1,
          duration: ANIMATION_DURATION.normal,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnimation, {
          toValue: 0,
          duration: ANIMATION_DURATION.normal,
          easing: EASING.easeOut,
          useNativeDriver: true,
        }),
      ]).start();

      // Special animations based on type
      if (type === 'success') {
        setTimeout(() => {
          createSuccessAnimation(scaleAnimation).start();
        }, ANIMATION_DURATION.normal);
      } else if (type === 'error') {
        setTimeout(() => {
          createErrorShakeAnimation(shakeAnimation).start();
        }, ANIMATION_DURATION.normal);
      }

      // Auto-hide after duration
      const hideTimer = setTimeout(() => {
        hideAnimation();
      }, duration);

      return () => clearTimeout(hideTimer);
    } else {
      hideAnimation();
    }
  }, [visible, type, duration]);

  const hideAnimation = () => {
    Animated.parallel([
      Animated.timing(scaleAnimation, {
        toValue: 0.8,
        duration: ANIMATION_DURATION.fast,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: ANIMATION_DURATION.fast,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnimation, {
        toValue: -30,
        duration: ANIMATION_DURATION.fast,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Reset animations
      scaleAnimation.setValue(0);
      opacityAnimation.setValue(0);
      translateYAnimation.setValue(-50);
      shakeAnimation.setValue(0);
      
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  };

  if (!visible) {
    return null;
  }

  const feedbackColors = getColors();

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 60,
      left: spacing[4],
      right: spacing[4],
      zIndex: 1000,
      alignItems: 'center',
    },
    feedback: {
      backgroundColor: feedbackColors.background,
      borderRadius: 12,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: 56,
      shadowColor: colors.neutral[900],
      shadowOffset: {
        width: 0,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    icon: {
      marginRight: spacing[3],
    },
    message: {
      flex: 1,
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.medium,
      color: feedbackColors.text,
      lineHeight: 20,
    },
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.feedback,
          {
            opacity: opacityAnimation,
            transform: [
              { scale: scaleAnimation },
              { translateY: translateYAnimation },
              { translateX: shakeAnimation },
            ],
          },
        ]}
      >
        <Icon
          name={getIconName()}
          size={24}
          color={feedbackColors.icon}
          style={styles.icon}
        />
        <Text style={styles.message} numberOfLines={2}>
          {message}
        </Text>
      </Animated.View>
    </View>
  );
};

export default FeedbackAnimation;