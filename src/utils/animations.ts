// Animation utilities and configurations for screen transitions and micro-interactions

import { Animated, Easing } from 'react-native';
import { TransitionSpec, StackCardInterpolationProps } from '@react-navigation/stack';

// Animation timing configurations
export const ANIMATION_DURATION = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Easing functions for different animation types
export const EASING = {
  easeInOut: Easing.bezier(0.4, 0, 0.2, 1),
  easeOut: Easing.bezier(0, 0, 0.2, 1),
  easeIn: Easing.bezier(0.4, 0, 1, 1),
  spring: Easing.elastic(1.2),
};

// Screen transition specifications
export const transitionSpecs: {
  open: TransitionSpec;
  close: TransitionSpec;
} = {
  open: {
    animation: 'timing',
    config: {
      duration: ANIMATION_DURATION.normal,
      easing: EASING.easeOut,
    },
  },
  close: {
    animation: 'timing',
    config: {
      duration: ANIMATION_DURATION.fast,
      easing: EASING.easeIn,
    },
  },
};

// Custom screen transition animations
export const screenTransitions = {
  // Slide from right (default)
  slideFromRight: (props: StackCardInterpolationProps) => {
    const { current, layouts } = props;
    
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },

  // Slide from bottom (modal style)
  slideFromBottom: (props: StackCardInterpolationProps) => {
    const { current, layouts } = props;
    
    return {
      cardStyle: {
        transform: [
          {
            translateY: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.height, 0],
            }),
          },
        ],
      },
    };
  },

  // Fade transition
  fade: (props: StackCardInterpolationProps) => {
    const { current } = props;
    
    return {
      cardStyle: {
        opacity: current.progress,
      },
    };
  },

  // Scale and fade (for story detail)
  scaleAndFade: (props: StackCardInterpolationProps) => {
    const { current } = props;
    
    return {
      cardStyle: {
        opacity: current.progress,
        transform: [
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1],
            }),
          },
        ],
      },
    };
  },

  // Push from right with overlay
  pushFromRight: (props: StackCardInterpolationProps) => {
    const { current, next, layouts } = props;
    
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
      overlayStyle: {
        opacity: current.progress.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        }),
      },
    };
  },
};

// Tab switching animations
export const createTabSwitchAnimation = (fromIndex: number, toIndex: number) => {
  const direction = toIndex > fromIndex ? 1 : -1;
  
  return {
    transform: [
      {
        translateX: direction * 50,
      },
    ],
    opacity: 0,
  };
};

// Micro-interaction animations
export const createButtonPressAnimation = (animatedValue: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 0.95,
      duration: ANIMATION_DURATION.fast / 2,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: ANIMATION_DURATION.fast / 2,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
  ]);
};

export const createCardHoverAnimation = (animatedValue: Animated.Value, isHovered: boolean) => {
  return Animated.timing(animatedValue, {
    toValue: isHovered ? 1.02 : 1,
    duration: ANIMATION_DURATION.fast,
    easing: EASING.easeOut,
    useNativeDriver: true,
  });
};

export const createLoadingAnimation = (animatedValue: Animated.Value) => {
  return Animated.loop(
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: ANIMATION_DURATION.slow,
        easing: EASING.easeInOut,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: ANIMATION_DURATION.slow,
        easing: EASING.easeInOut,
        useNativeDriver: true,
      }),
    ])
  );
};

export const createSuccessAnimation = (animatedValue: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 1.1,
      duration: ANIMATION_DURATION.fast,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: ANIMATION_DURATION.fast,
      easing: EASING.easeOut,
      useNativeDriver: true,
    }),
  ]);
};

export const createErrorShakeAnimation = (animatedValue: Animated.Value) => {
  return Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: -10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 10,
      duration: 50,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 50,
      useNativeDriver: true,
    }),
  ]);
};

// Story card to detail transition animation
export const createStoryCardTransition = (
  animatedValue: Animated.Value,
  isTransitioning: boolean
) => {
  return Animated.timing(animatedValue, {
    toValue: isTransitioning ? 0 : 1,
    duration: ANIMATION_DURATION.normal,
    easing: EASING.easeInOut,
    useNativeDriver: true,
  });
};