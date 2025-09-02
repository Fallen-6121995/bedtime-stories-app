// Child-friendly scroll view with optimized gesture handling for small hands

import React, { useRef, useCallback } from 'react';
import {
  ScrollView,
  ScrollViewProps,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
} from 'react-native';
import { useResponsive } from '../hooks/useResponsive';
import { hapticFeedback } from '../utils/haptics';

interface ChildFriendlyScrollViewProps extends ScrollViewProps {
  // Child-friendly specific props
  enableHapticFeedback?: boolean;
  largerScrollIndicators?: boolean;
  enhancedBounce?: boolean;
  smoothScrolling?: boolean;
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
  hapticOnBounce?: boolean;
  optimizeForChildren?: boolean;
}

export const ChildFriendlyScrollView: React.FC<ChildFriendlyScrollViewProps> = ({
  children,
  enableHapticFeedback = true,
  largerScrollIndicators = true,
  enhancedBounce = true,
  smoothScrolling = true,
  onScrollStart,
  onScrollEnd,
  hapticOnBounce = true,
  optimizeForChildren = true,
  onScroll,
  onScrollBeginDrag,
  onScrollEndDrag,
  onMomentumScrollBegin,
  onMomentumScrollEnd,
  scrollIndicatorInsets,
  contentInset,
  ...props
}) => {
  const { isTablet, getAdaptiveSpacing } = useResponsive();
  
  const scrollViewRef = useRef<ScrollView>(null);
  const isScrolling = useRef(false);
  const scrollStartTime = useRef(0);
  const lastScrollY = useRef(0);
  const bounceHapticTriggered = useRef(false);

  // Enhanced scroll handling for children
  const handleScrollBeginDrag = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    isScrolling.current = true;
    scrollStartTime.current = Date.now();
    
    if (enableHapticFeedback) {
      hapticFeedback.scroll();
    }
    
    onScrollStart?.();
    onScrollBeginDrag?.(event);
  }, [enableHapticFeedback, onScrollStart, onScrollBeginDrag]);

  const handleScrollEndDrag = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    onScrollEndDrag?.(event);
  }, [onScrollEndDrag]);

  const handleMomentumScrollBegin = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    onMomentumScrollBegin?.(event);
  }, [onMomentumScrollBegin]);

  const handleMomentumScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    isScrolling.current = false;
    bounceHapticTriggered.current = false;
    
    onScrollEnd?.();
    onMomentumScrollEnd?.(event);
  }, [onScrollEnd, onMomentumScrollEnd]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const currentScrollY = contentOffset.y;
    
    // Detect bounce at top or bottom for haptic feedback
    if (hapticOnBounce && enableHapticFeedback && !bounceHapticTriggered.current) {
      const isAtTop = currentScrollY <= -10; // Bouncing at top
      const isAtBottom = currentScrollY >= (contentSize.height - layoutMeasurement.height + 10); // Bouncing at bottom
      
      if (isAtTop || isAtBottom) {
        hapticFeedback.scroll();
        bounceHapticTriggered.current = true;
      }
    }
    
    lastScrollY.current = currentScrollY;
    onScroll?.(event);
  }, [hapticOnBounce, enableHapticFeedback, onScroll]);

  // Get child-friendly scroll view props
  const getChildFriendlyProps = () => {
    const spacing = getAdaptiveSpacing();
    
    const baseProps = {
      // Enhanced bouncing for playful feel
      bounces: enhancedBounce,
      bouncesZoom: enhancedBounce,
      
      // Smooth scrolling optimizations
      decelerationRate: smoothScrolling ? (Platform.OS === 'ios' ? 'normal' : 0.985) : 'fast',
      scrollEventThrottle: smoothScrolling ? 16 : 50,
      
      // Larger scroll indicators for better visibility
      indicatorStyle: 'default',
      scrollIndicatorInsets: scrollIndicatorInsets || {
        top: spacing * 0.5,
        bottom: spacing * 0.5,
        left: 0,
        right: largerScrollIndicators ? 4 : 2,
      },
      
      // Content insets for better spacing
      contentInset: contentInset || (Platform.OS === 'ios' ? {
        top: 0,
        bottom: spacing,
        left: 0,
        right: 0,
      } : undefined),
      
      // Accessibility improvements
      accessible: true,
      accessibilityRole: 'scrollbar' as const,
      accessibilityLabel: 'Scrollable content',
      accessibilityHint: 'Swipe up or down to scroll through content',
    };

    if (optimizeForChildren) {
      return {
        ...baseProps,
        // Optimize for small hands
        pagingEnabled: false,
        snapToAlignment: 'start' as const,
        snapToInterval: undefined,
        
        // Enhanced momentum for easier scrolling
        maximumZoomScale: 1,
        minimumZoomScale: 1,
        
        // Better touch handling
        keyboardShouldPersistTaps: 'handled' as const,
        keyboardDismissMode: 'on-drag' as const,
        
        // Improved performance
        removeClippedSubviews: true,
        maintainVisibleContentPosition: undefined,
      };
    }

    return baseProps;
  };

  const childFriendlyProps = getChildFriendlyProps();

  return (
    <ScrollView
      ref={scrollViewRef}
      onScroll={handleScroll}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEndDrag}
      onMomentumScrollBegin={handleMomentumScrollBegin}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      {...childFriendlyProps}
      {...props}
    >
      {children}
    </ScrollView>
  );
};

// Horizontal scroll view optimized for children
export const ChildFriendlyHorizontalScrollView: React.FC<ChildFriendlyScrollViewProps> = ({
  children,
  ...props
}) => {
  return (
    <ChildFriendlyScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      {...props}
    >
      {children}
    </ChildFriendlyScrollView>
  );
};

export default ChildFriendlyScrollView;