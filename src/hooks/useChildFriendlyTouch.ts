// Hook for child-friendly touch interactions with appropriate feedback and sizing

import { useCallback, useRef } from 'react';
import { Animated, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';
import { useResponsive } from './useResponsive';
import { hapticFeedback } from '../utils/haptics';

export interface ChildFriendlyTouchConfig {
  // Touch target configuration
  minTouchTarget?: number;
  expandTouchArea?: boolean;
  
  // Feedback configuration
  enableHapticFeedback?: boolean;
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection';
  enableVisualFeedback?: boolean;
  
  // Animation configuration
  scaleOnPress?: boolean;
  scaleValue?: number;
  animationDuration?: number;
  
  // Interaction configuration
  delayLongPress?: number;
  enableLongPress?: boolean;
  preventDoublePress?: boolean;
  doublePressDelay?: number;
  
  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
}

export interface ChildFriendlyTouchHandlers {
  onPress?: () => void;
  onLongPress?: () => void;
  onDoublePress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
}

export const useChildFriendlyTouch = (
  handlers: ChildFriendlyTouchHandlers,
  config: ChildFriendlyTouchConfig = {}
) => {
  const {
    minTouchTarget = 44,
    expandTouchArea = true,
    enableHapticFeedback = true,
    hapticType = 'light',
    enableVisualFeedback = true,
    scaleOnPress = true,
    scaleValue = 0.95,
    animationDuration = 150,
    delayLongPress = 500,
    enableLongPress = false,
    preventDoublePress = false,
    doublePressDelay = 300,
  } = config;

  const { isTablet, getAdaptiveSpacing } = useResponsive();
  
  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  
  // Touch state tracking
  const lastPressTime = useRef(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressing = useRef(false);

  // Calculate optimal touch target size
  const getTouchTargetSize = useCallback(() => {
    const baseSize = Math.max(minTouchTarget, isTablet ? 48 : 44);
    return baseSize + getAdaptiveSpacing() * 0.5;
  }, [minTouchTarget, isTablet, getAdaptiveSpacing]);

  // Visual feedback animations
  const animatePress = useCallback((pressed: boolean) => {
    if (!enableVisualFeedback) return;

    const animations = [];

    if (scaleOnPress) {
      animations.push(
        Animated.timing(scaleAnim, {
          toValue: pressed ? scaleValue : 1,
          duration: animationDuration,
          useNativeDriver: true,
        })
      );
    }

    animations.push(
      Animated.timing(opacityAnim, {
        toValue: pressed ? 0.7 : 1,
        duration: animationDuration,
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start();
  }, [enableVisualFeedback, scaleOnPress, scaleAnim, scaleValue, animationDuration, opacityAnim]);

  // Handle press in
  const handlePressIn = useCallback(() => {
    animatePress(true);
    
    if (enableHapticFeedback) {
      switch (hapticType) {
        case 'light':
          hapticFeedback.buttonPress();
          break;
        case 'medium':
          hapticFeedback.cardTap();
          break;
        case 'heavy':
          hapticFeedback.longPress();
          break;
        case 'selection':
          hapticFeedback.toggle();
          break;
      }
    }

    // Start long press timer
    if (enableLongPress && handlers.onLongPress) {
      longPressTimer.current = setTimeout(() => {
        isLongPressing.current = true;
        if (enableHapticFeedback) {
          hapticFeedback.longPress();
        }
        handlers.onLongPress?.();
      }, delayLongPress);
    }

    handlers.onPressIn?.();
  }, [
    animatePress,
    enableHapticFeedback,
    hapticType,
    enableLongPress,
    handlers,
    delayLongPress,
  ]);

  // Handle press out
  const handlePressOut = useCallback(() => {
    animatePress(false);
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    handlers.onPressOut?.();
  }, [animatePress, handlers]);

  // Handle press
  const handlePress = useCallback(() => {
    // Don't trigger press if it was a long press
    if (isLongPressing.current) {
      isLongPressing.current = false;
      return;
    }

    const currentTime = Date.now();
    
    // Handle double press
    if (preventDoublePress || handlers.onDoublePress) {
      const timeSinceLastPress = currentTime - lastPressTime.current;
      
      if (timeSinceLastPress < doublePressDelay) {
        if (handlers.onDoublePress) {
          handlers.onDoublePress();
          return;
        } else if (preventDoublePress) {
          return; // Ignore double press
        }
      }
    }

    lastPressTime.current = currentTime;
    handlers.onPress?.();
  }, [handlers, preventDoublePress, doublePressDelay]);

  // Get touch area expansion
  const getTouchAreaExpansion = useCallback(() => {
    if (!expandTouchArea) return {};

    const touchTargetSize = getTouchTargetSize();
    const expansion = Math.max(0, (touchTargetSize - minTouchTarget) / 2);

    return {
      hitSlop: {
        top: expansion,
        bottom: expansion,
        left: expansion,
        right: expansion,
      },
    };
  }, [expandTouchArea, getTouchTargetSize, minTouchTarget]);

  // Create pan responder for advanced touch handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        handlePressIn();
      },
      
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        handlePressOut();
        
        // Check if the release is within the touch area
        const { dx, dy } = gestureState;
        const touchTargetSize = getTouchTargetSize();
        const maxDistance = touchTargetSize / 2;
        
        if (Math.abs(dx) <= maxDistance && Math.abs(dy) <= maxDistance) {
          handlePress();
        }
      },
      
      onPanResponderTerminate: () => {
        handlePressOut();
      },
    })
  ).current;

  // Get animated style
  const getAnimatedStyle = useCallback(() => {
    return {
      transform: [{ scale: scaleAnim }],
      opacity: opacityAnim,
    };
  }, [scaleAnim, opacityAnim]);

  // Get touch props for simple touch handling
  const getTouchProps = useCallback(() => {
    return {
      onPressIn: handlePressIn,
      onPressOut: handlePressOut,
      onPress: handlePress,
      onLongPress: enableLongPress ? handlers.onLongPress : undefined,
      delayLongPress: enableLongPress ? delayLongPress : undefined,
      ...getTouchAreaExpansion(),
      accessible: true,
      accessibilityLabel: config.accessibilityLabel,
      accessibilityHint: config.accessibilityHint,
      accessibilityRole: config.accessibilityRole as any,
    };
  }, [
    handlePressIn,
    handlePressOut,
    handlePress,
    enableLongPress,
    handlers.onLongPress,
    delayLongPress,
    getTouchAreaExpansion,
    config.accessibilityLabel,
    config.accessibilityHint,
    config.accessibilityRole,
  ]);

  return {
    // Touch handling
    touchProps: getTouchProps(),
    panResponder: panResponder.panHandlers,
    
    // Styling
    animatedStyle: getAnimatedStyle(),
    touchTargetSize: getTouchTargetSize(),
    
    // Utilities
    animatePress,
    triggerHaptic: () => {
      if (enableHapticFeedback) {
        hapticFeedback[hapticType === 'selection' ? 'toggle' : 'buttonPress']();
      }
    },
  };
};