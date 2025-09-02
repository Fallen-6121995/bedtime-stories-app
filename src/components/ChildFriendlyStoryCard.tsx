// Child-friendly story card with enhanced touch interactions and accessibility

import React, { useState, useRef } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Animated,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useChildFriendlyTouch } from '../hooks/useChildFriendlyTouch';
import { useResponsive } from '../hooks/useResponsive';
import { colors, typography, shadows } from '../constants/theme';
import { StoryCardProps } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface ChildFriendlyStoryCardProps extends StoryCardProps {
  // Child-friendly specific props
  enableHapticFeedback?: boolean;
  largerTouchTargets?: boolean;
  enhancedVisualFeedback?: boolean;
  playfulAnimations?: boolean;
  accessibilityEnhanced?: boolean;
}

export const ChildFriendlyStoryCard: React.FC<ChildFriendlyStoryCardProps> = ({
  story,
  onPress,
  variant = 'horizontal',
  showFavorite = false,
  onFavoritePress,
  enableHapticFeedback = true,
  largerTouchTargets = true,
  enhancedVisualFeedback = true,
  playfulAnimations = true,
  accessibilityEnhanced = true,
  style,
  testID,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const {
    isTablet,
    getAdaptiveFontSize,
    getAdaptiveSpacing,
    getOptimalColumns,
  } = useResponsive();

  // Animation values for enhanced feedback
  const favoriteScaleAnim = useRef(new Animated.Value(1)).current;
  const favoriteRotateAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Main card touch interactions
  const {
    touchProps: cardTouchProps,
    animatedStyle: cardAnimatedStyle,
    touchTargetSize,
  } = useChildFriendlyTouch(
    {
      onPress: () => onPress(story),
    },
    {
      enableHapticFeedback,
      hapticType: 'light',
      enableVisualFeedback: enhancedVisualFeedback,
      scaleOnPress: true,
      scaleValue: 0.96,
      animationDuration: playfulAnimations ? 200 : 150,
      accessibilityLabel: `${story.title} story. ${story.description}`,
      accessibilityHint: 'Double tap to read this story',
      accessibilityRole: 'button',
    }
  );

  // Favorite button touch interactions
  const {
    touchProps: favoriteTouchProps,
    animatedStyle: favoriteAnimatedStyle,
  } = useChildFriendlyTouch(
    {
      onPress: () => handleFavoritePress(),
    },
    {
      enableHapticFeedback,
      hapticType: 'medium',
      enableVisualFeedback: true,
      scaleOnPress: true,
      scaleValue: 0.9,
      animationDuration: 150,
      accessibilityLabel: story.isFavorite ? 'Remove from favorites' : 'Add to favorites',
      accessibilityHint: story.isFavorite ? 'Double tap to remove from favorites' : 'Double tap to add to favorites',
      accessibilityRole: 'button',
    }
  );

  // Initialize favorite animation
  React.useEffect(() => {
    if (story.isFavorite) {
      Animated.parallel([
        Animated.timing(favoriteScaleAnim, {
          toValue: 1.1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(favoriteRotateAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(favoriteScaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(favoriteRotateAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [story.isFavorite, favoriteScaleAnim, favoriteRotateAnim]);

  // Shimmer effect for loading
  React.useEffect(() => {
    if (imageLoading) {
      const shimmerAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(shimmerAnim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      shimmerAnimation.start();
      return () => shimmerAnimation.stop();
    }
  }, [imageLoading, shimmerAnim]);

  const handleFavoritePress = () => {
    if (onFavoritePress) {
      // Playful favorite animation
      if (playfulAnimations) {
        Animated.sequence([
          Animated.parallel([
            Animated.timing(favoriteScaleAnim, {
              toValue: 1.4,
              duration: 150,
              useNativeDriver: true,
            }),
            Animated.timing(favoriteRotateAnim, {
              toValue: story.isFavorite ? 0 : 1,
              duration: 300,
              useNativeDriver: true,
            }),
          ]),
          Animated.timing(favoriteScaleAnim, {
            toValue: story.isFavorite ? 1 : 1.1,
            duration: 150,
            useNativeDriver: true,
          }),
        ]).start();
      }
      
      onFavoritePress(story);
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  // Get responsive card dimensions
  const getCardDimensions = () => {
    const { width } = Dimensions.get('window');
    const spacing = getAdaptiveSpacing();
    
    switch (variant) {
      case 'grid':
        const columns = getOptimalColumns(150, 2);
        const cardWidth = (width - (spacing * (columns + 1))) / columns;
        return {
          width: cardWidth,
          height: isTablet ? 260 : 220,
        };
      
      case 'featured':
        return {
          width: width - (spacing * 2),
          height: isTablet ? 360 : 320,
        };
      
      default: // horizontal
        return {
          width: isTablet ? 280 : 240,
          height: isTablet ? 320 : 280,
        };
    }
  };

  const cardDimensions = getCardDimensions();
  const spacing = getAdaptiveSpacing();

  // Enhanced touch target size for children
  const enhancedTouchTargetSize = largerTouchTargets 
    ? Math.max(touchTargetSize, isTablet ? 56 : 48)
    : touchTargetSize;

  const favoriteRotation = favoriteRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        cardDimensions,
        cardAnimatedStyle,
        variant === 'grid' && styles.gridVariant,
        variant === 'featured' && styles.featuredVariant,
        style,
      ]}
      {...cardTouchProps}
      testID={testID}
    >
      <View style={styles.imageContainer}>
        {!imageError ? (
          <Image
            source={{ uri: story.image }}
            style={styles.image}
            resizeMode="cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Icon
              name="auto-stories"
              size={isTablet ? 64 : 48}
              color={colors.primary[300]}
            />
            <Text style={styles.placeholderText}>Story Image</Text>
          </View>
        )}
        
        {imageLoading && (
          <Animated.View 
            style={[
              styles.loadingOverlay,
              {
                opacity: shimmerOpacity,
              }
            ]}
          >
            <LoadingSpinner size="small" color={colors.primary[500]} />
          </Animated.View>
        )}
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          locations={[0.5, 1]}
          style={styles.gradientOverlay}
        />
        
        {showFavorite && onFavoritePress && (
          <Animated.View
            style={[
              styles.favoriteButton,
              {
                minWidth: enhancedTouchTargetSize,
                minHeight: enhancedTouchTargetSize,
              },
              favoriteAnimatedStyle,
            ]}
            {...favoriteTouchProps}
          >
            <Animated.View
              style={{
                transform: [
                  { scale: favoriteScaleAnim },
                  { rotate: favoriteRotation },
                ],
              }}
            >
              <Icon
                name={story.isFavorite ? "favorite" : "favorite-border"}
                size={isTablet ? 28 : 24}
                color={story.isFavorite ? colors.error : colors.neutral[100]}
              />
            </Animated.View>
          </Animated.View>
        )}
        
        {/* Enhanced reading progress indicator */}
        {story.readCount && story.readCount > 0 && (
          <View style={styles.readingBadge}>
            <Icon name="visibility" size={isTablet ? 18 : 16} color="#FFFFFF" />
            <Text style={[styles.readingBadgeText, { fontSize: getAdaptiveFontSize(12) }]}>
              {story.readCount}
            </Text>
          </View>
        )}
        
        {/* Age group indicator with child-friendly styling */}
        {story.ageGroup && (
          <View style={styles.ageGroupBadge}>
            <Text style={[styles.ageGroupText, { fontSize: getAdaptiveFontSize(11) }]}>
              {story.ageGroup}
            </Text>
          </View>
        )}
        
        <Animated.View 
          style={[
            styles.textOverlay,
            {
              opacity: imageLoading ? 0 : 1,
            }
          ]}
        >
          <Text
            style={[
              styles.title,
              {
                fontSize: getAdaptiveFontSize(variant === 'grid' ? 16 : 18),
                fontFamily: typography.fontFamily.bold,
              }
            ]}
            numberOfLines={variant === 'grid' ? 2 : 1}
            accessible={accessibilityEnhanced}
            accessibilityRole="header"
          >
            {story.title}
          </Text>
          
          <Text
            numberOfLines={variant === 'grid' ? 2 : 3}
            style={[
              styles.description,
              {
                fontSize: getAdaptiveFontSize(variant === 'grid' ? 13 : 14),
                fontFamily: typography.fontFamily.regular,
              }
            ]}
            accessible={accessibilityEnhanced}
          >
            {story.description}
          </Text>
          
          {/* Enhanced reading time indicator */}
          {story.readingTime && (
            <View style={styles.readingTimeContainer}>
              <Icon 
                name="schedule" 
                size={isTablet ? 16 : 14} 
                color="#FFFFFF" 
              />
              <Text style={[
                styles.readingTimeText,
                { fontSize: getAdaptiveFontSize(12) }
              ]}>
                {story.readingTime} min read
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    ...shadows.large,
  },
  gridVariant: {
    marginBottom: 16,
  },
  featuredVariant: {
    marginBottom: 24,
    borderRadius: 24,
  },
  imageContainer: {
    flex: 1,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.primary[400],
    fontFamily: typography.fontFamily.medium,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary[50],
    borderRadius: 20,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  readingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  readingBadgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
    fontFamily: typography.fontFamily.medium,
  },
  ageGroupBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: colors.secondary[400],
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: colors.secondary[300],
  },
  ageGroupText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontFamily: typography.fontFamily.bold,
  },
  textOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 80, // Leave space for age group badge
  },
  title: {
    color: '#FFFFFF',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    color: '#FFFFFF',
    opacity: 0.95,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  readingTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    opacity: 0.9,
  },
  readingTimeText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: typography.fontFamily.medium,
  },
});

export default ChildFriendlyStoryCard;