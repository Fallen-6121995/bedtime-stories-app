// Haptic feedback utilities for child-friendly interactions

import { Platform, Vibration } from 'react-native';

// Haptic feedback types
export type HapticFeedbackType = 
  | 'light' 
  | 'medium' 
  | 'heavy' 
  | 'success' 
  | 'warning' 
  | 'error' 
  | 'selection';

// Check if haptic feedback is available
export const isHapticFeedbackAvailable = (): boolean => {
  return Platform.OS === 'ios' || Platform.OS === 'android';
};

// Trigger haptic feedback
export const triggerHapticFeedback = (type: HapticFeedbackType = 'light'): void => {
  if (!isHapticFeedbackAvailable()) {
    return;
  }

  try {
    if (Platform.OS === 'ios') {
      // iOS haptic feedback using React Native's built-in support
      // Note: In a real app, you might want to use @react-native-haptic-feedback
      // or react-native-haptic-feedback for more precise control
      
      switch (type) {
        case 'light':
          // Light impact feedback
          Vibration.vibrate(10);
          break;
        case 'medium':
          // Medium impact feedback
          Vibration.vibrate(20);
          break;
        case 'heavy':
          // Heavy impact feedback
          Vibration.vibrate(30);
          break;
        case 'success':
          // Success notification feedback
          Vibration.vibrate([0, 10, 50, 10]);
          break;
        case 'warning':
          // Warning notification feedback
          Vibration.vibrate([0, 15, 30, 15]);
          break;
        case 'error':
          // Error notification feedback
          Vibration.vibrate([0, 20, 100, 20, 100, 20]);
          break;
        case 'selection':
          // Selection feedback
          Vibration.vibrate(5);
          break;
        default:
          Vibration.vibrate(10);
      }
    } else if (Platform.OS === 'android') {
      // Android haptic feedback
      switch (type) {
        case 'light':
          Vibration.vibrate(10);
          break;
        case 'medium':
          Vibration.vibrate(25);
          break;
        case 'heavy':
          Vibration.vibrate(40);
          break;
        case 'success':
          Vibration.vibrate([0, 10, 50, 10]);
          break;
        case 'warning':
          Vibration.vibrate([0, 20, 40, 20]);
          break;
        case 'error':
          Vibration.vibrate([0, 30, 100, 30, 100, 30]);
          break;
        case 'selection':
          Vibration.vibrate(8);
          break;
        default:
          Vibration.vibrate(15);
      }
    }
  } catch (error) {
    console.warn('Haptic feedback failed:', error);
  }
};

// Haptic feedback for different interaction types
export const hapticFeedback = {
  // Button press feedback
  buttonPress: () => triggerHapticFeedback('light'),
  
  // Card tap feedback
  cardTap: () => triggerHapticFeedback('light'),
  
  // Toggle/switch feedback
  toggle: () => triggerHapticFeedback('selection'),
  
  // Success action feedback
  success: () => triggerHapticFeedback('success'),
  
  // Error action feedback
  error: () => triggerHapticFeedback('error'),
  
  // Warning feedback
  warning: () => triggerHapticFeedback('warning'),
  
  // Long press feedback
  longPress: () => triggerHapticFeedback('medium'),
  
  // Swipe/scroll feedback
  scroll: () => triggerHapticFeedback('selection'),
  
  // Navigation feedback
  navigation: () => triggerHapticFeedback('light'),
  
  // Favorite/heart tap feedback
  favorite: () => triggerHapticFeedback('medium'),
  
  // Story selection feedback
  storySelect: () => triggerHapticFeedback('light'),
};

// Hook for haptic feedback
export const useHapticFeedback = () => {
  return {
    triggerHapticFeedback,
    hapticFeedback,
    isAvailable: isHapticFeedbackAvailable(),
  };
};