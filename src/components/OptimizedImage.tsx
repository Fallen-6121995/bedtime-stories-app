import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Image,
  ImageStyle,
  ViewStyle,
  Animated,
  Dimensions,
  ImageSourcePropType,
} from 'react-native';
import { LoadingSpinner } from './LoadingSpinner';

interface OptimizedImageProps {
  source: ImageSourcePropType;
  style?: ImageStyle;
  containerStyle?: ViewStyle;
  placeholder?: ImageSourcePropType;
  blurRadius?: number;
  lazy?: boolean;
  progressive?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  testID?: string;
}

const { width: screenWidth } = Dimensions.get('window');

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  style,
  containerStyle,
  placeholder,
  blurRadius = 10,
  lazy = true,
  progressive = true,
  onLoad,
  onError,
  testID,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(!lazy);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const blurAnim = useRef(new Animated.Value(progressive ? blurRadius : 0)).current;
  const viewRef = useRef<View>(null);

  // Lazy loading intersection observer simulation
  useEffect(() => {
    if (!lazy) return;

    const checkVisibility = () => {
      if (viewRef.current) {
        viewRef.current.measure((x, y, width, height, pageX, pageY) => {
          const isVisible = pageY < screenWidth && pageY + height > 0;
          if (isVisible && !shouldLoad) {
            setShouldLoad(true);
          }
        });
      }
    };

    // Check visibility after a short delay to ensure component is mounted
    const timer = setTimeout(checkVisibility, 100);
    return () => clearTimeout(timer);
  }, [lazy, shouldLoad]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageLoaded(true);
    onLoad?.();

    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Progressive blur removal
    if (progressive) {
      Animated.timing(blurAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const getOptimizedSource = (originalSource: ImageSourcePropType) => {
    if (typeof originalSource === 'object' && 'uri' in originalSource) {
      // Add image optimization parameters for remote images
      const uri = originalSource.uri;
      if (uri?.includes('http')) {
        // Add width parameter for image resizing (if using a CDN that supports it)
        const separator = uri.includes('?') ? '&' : '?';
        return {
          ...originalSource,
          uri: `${uri}${separator}w=${Math.round(screenWidth)}`,
        };
      }
    }
    return originalSource;
  };

  const renderPlaceholder = () => {
    if (placeholder) {
      return (
        <Image
          source={placeholder}
          style={[style, { position: 'absolute' }]}
          blurRadius={progressive ? blurRadius : 0}
        />
      );
    }

    return (
      <View
        style={[
          style,
          {
            backgroundColor: '#f0f0f0',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
          },
        ]}
      >
        {isLoading && <LoadingSpinner size="small" />}
      </View>
    );
  };

  const renderError = () => (
    <View
      style={[
        style,
        {
          backgroundColor: '#f5f5f5',
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      {/* You could add an error icon here */}
    </View>
  );

  if (hasError) {
    return <View style={containerStyle}>{renderError()}</View>;
  }

  return (
    <View ref={viewRef} style={containerStyle} testID={testID}>
      {renderPlaceholder()}

      {shouldLoad && (
        <Animated.View
          style={{
            opacity: fadeAnim,
          }}
        >
          <Animated.Image
            source={getOptimizedSource(source)}
            style={[
              style,
              progressive && {
                // @ts-ignore - blurRadius is supported but not in types
                blurRadius: blurAnim,
              },
            ]}
            onLoad={handleImageLoad}
            onError={handleImageError}
            resizeMode="cover"
          />
        </Animated.View>
      )}
    </View>
  );
};