import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  ImageStyle,
  ViewStyle,
  ImageSourcePropType,
  findNodeHandle,
} from 'react-native';
import { OptimizedImage } from './OptimizedImage';

interface LazyImageProps {
  source: ImageSourcePropType;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  placeholder?: ImageSourcePropType;
  threshold?: number; // Distance from viewport to start loading
  onLoad?: () => void;
  onError?: () => void;
  testID?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  source,
  style,
  containerStyle,
  placeholder,
  threshold = 100,
  onLoad,
  onError,
  testID,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const viewRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView | null>(null);

  // Find the nearest ScrollView parent
  const findScrollView = useCallback(() => {
    let parent = viewRef.current;
    while (parent) {
      // This is a simplified approach - in a real app you might need
      // a more sophisticated way to find the scroll container
      const nodeHandle = findNodeHandle(parent);
      if (nodeHandle) {
        // Check if this is a ScrollView (this is simplified)
        break;
      }
      parent = parent.parent as any;
    }
  }, []);

  const checkVisibility = useCallback(() => {
    if (!viewRef.current) return;

    viewRef.current.measureInWindow((x, y, width, height) => {
      const windowHeight = require('react-native').Dimensions.get('window').height;
      const windowWidth = require('react-native').Dimensions.get('window').width;

      const isInViewport = 
        y + height + threshold >= 0 && // Bottom edge is above top of screen (with threshold)
        y - threshold <= windowHeight && // Top edge is below bottom of screen (with threshold)
        x + width >= 0 && // Right edge is to the right of left edge of screen
        x <= windowWidth; // Left edge is to the left of right edge of screen

      if (isInViewport && !isVisible) {
        setIsVisible(true);
      }
    });
  }, [isVisible, threshold]);

  useEffect(() => {
    // Initial visibility check
    const timer = setTimeout(checkVisibility, 100);
    return () => clearTimeout(timer);
  }, [checkVisibility]);

  // Set up intersection observer alternative for React Native
  useEffect(() => {
    if (isVisible) return;

    const interval = setInterval(checkVisibility, 500);
    return () => clearInterval(interval);
  }, [checkVisibility, isVisible]);

  return (
    <View ref={viewRef} style={containerStyle} testID={testID}>
      {isVisible ? (
        <OptimizedImage
          source={source}
          style={style}
          placeholder={placeholder}
          lazy={false} // Already handled lazy loading at this level
          progressive={true}
          onLoad={onLoad}
          onError={onError}
        />
      ) : (
        <View
          style={[
            style,
            {
              backgroundColor: '#f0f0f0',
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
        />
      )}
    </View>
  );
};