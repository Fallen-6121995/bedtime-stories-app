// Loading spinner component with theme support and custom animations

import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Animated,
} from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { getTextStyles } from '../utils/theme';
import { createLoadingAnimation, ANIMATION_DURATION } from '../utils/animations';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  message?: string;
  overlay?: boolean;
  style?: ViewStyle;
  testID?: string;
  customAnimation?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color,
  message,
  overlay = false,
  style,
  testID,
  customAnimation = false,
}) => {
  const { theme, isDarkMode } = useThemeContext();
  const fadeAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnimation = useRef(new Animated.Value(0.8)).current;
  const rotateAnimation = useRef(new Animated.Value(0)).current;
  
  const spinnerColor = color || theme.colors.primary[500];
  const textStyles = getTextStyles('body', theme, isDarkMode);
  
  const containerStyle = overlay ? styles.overlay : styles.container;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: ANIMATION_DURATION.normal,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnimation, {
        toValue: 1,
        duration: ANIMATION_DURATION.normal,
        useNativeDriver: true,
      }),
    ]).start();

    // Custom rotation animation if enabled
    if (customAnimation) {
      const rotateLoop = Animated.loop(
        Animated.timing(rotateAnimation, {
          toValue: 1,
          duration: ANIMATION_DURATION.slow * 2,
          useNativeDriver: true,
        })
      );
      rotateLoop.start();
      return () => rotateLoop.stop();
    }
  }, [fadeAnimation, scaleAnimation, rotateAnimation, customAnimation]);

  const spin = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        containerStyle,
        overlay && {
          backgroundColor: isDarkMode 
            ? 'rgba(0, 0, 0, 0.7)' 
            : 'rgba(255, 255, 255, 0.9)'
        },
        style,
        {
          opacity: fadeAnimation,
          transform: [{ scale: scaleAnimation }],
        },
      ]}
      testID={testID}
    >
      {customAnimation ? (
        <Animated.View
          style={[
            styles.customSpinner,
            {
              transform: [{ rotate: spin }],
              width: size === 'large' ? 40 : 24,
              height: size === 'large' ? 40 : 24,
              borderColor: spinnerColor,
            },
          ]}
        />
      ) : (
        <ActivityIndicator
          size={size}
          color={spinnerColor}
          style={message ? styles.spinnerWithMessage : undefined}
        />
      )}
      {message && (
        <Animated.Text 
          style={[
            textStyles, 
            styles.message,
            {
              opacity: fadeAnimation,
            },
          ]}
        >
          {message}
        </Animated.Text>
      )}
    </Animated.View>
  );
};

// Centered loading spinner for full screen loading
export const FullScreenLoader: React.FC<Omit<LoadingSpinnerProps, 'overlay'>> = (props) => (
  <LoadingSpinner {...props} overlay={true} />
);

// Inline loading spinner for smaller areas
export const InlineLoader: React.FC<Omit<LoadingSpinnerProps, 'overlay' | 'size'>> = (props) => (
  <LoadingSpinner {...props} size="small" />
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  spinnerWithMessage: {
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    marginTop: 8,
  },
  customSpinner: {
    borderWidth: 3,
    borderRadius: 20,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    marginBottom: 12,
  },
});

export default LoadingSpinner;