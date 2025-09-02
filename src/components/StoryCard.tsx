import React, { useState, useRef } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  Pressable,
  Dimensions,
  Animated,
  PanResponder,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useThemeContext } from '../context/ThemeContext';
import { getTextStyles } from '../utils/theme';
import { StoryCardProps } from '../types';
import LoadingSpinner from './LoadingSpinner';


const StoryCard: React.FC<StoryCardProps> = ({
  story,
  onPress,
  variant = 'horizontal',
  showFavorite = false,
  onFavoritePress,
  style,
  testID,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { theme } = useThemeContext();

  // Animation values
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const favoriteScaleAnim = useRef(new Animated.Value(1)).current;
  const favoriteOpacityAnim = useRef(new Animated.Value(0)).current;

  const titleStyles = getTextStyles('h4', theme, false); // Always white on dark overlay
  const descriptionStyles = getTextStyles('body', theme, false);

  // Initialize favorite animation based on story state
  React.useEffect(() => {
    Animated.timing(favoriteOpacityAnim, {
      toValue: story.isFavorite ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [story.isFavorite, favoriteOpacityAnim]);

  const handlePress = () => {
    // Press animation
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Return to normal state
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();

      // Call the onPress callback
      onPress(story);
    });
  };

  const handleFavoritePress = () => {
    if (onFavoritePress) {
      // Favorite button animation
      Animated.sequence([
        Animated.timing(favoriteScaleAnim, {
          toValue: 1.3,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(favoriteScaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Toggle favorite opacity
      Animated.timing(favoriteOpacityAnim, {
        toValue: story.isFavorite ? 0 : 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

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

  // Create pan responder for subtle hover effect on long press
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderGrant: () => {
        // Subtle scale down on touch start
        Animated.timing(scaleAnim, {
          toValue: 0.98,
          duration: 100,
          useNativeDriver: true,
        }).start();
      },
      onPanResponderRelease: () => {
        // Return to normal scale
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
        style,
      ]}
      {...panResponder.panHandlers}
    >
      <Pressable
        onPress={handlePress}
        style={[
          styles.container,
          variant === 'grid' && styles.gridVariant,
          variant === 'featured' && styles.featuredVariant,
          variant === 'horizontal' && styles.horizontalVariant,
        ]}
        testID={testID}
        accessibilityRole="button"
        accessibilityLabel={`${story.title} story`}
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
                name="image"
                size={48}
                color={theme.colors.neutral[400]}
              />
            </View>
          )}

          {imageLoading && (
            <Animated.View
              style={[
                styles.loadingOverlay,
                {
                  opacity: imageLoading ? 1 : 0,
                }
              ]}
            >
              <LoadingSpinner size="small" />
            </Animated.View>
          )}

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            locations={[0.4, 1]}
            style={styles.gradientOverlay}
          />

          {showFavorite && onFavoritePress && (
            <Pressable
              onPress={handleFavoritePress}
              style={styles.favoriteButton}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={`${story.isFavorite ? 'Remove from' : 'Add to'} favorites`}
            >
              <Animated.View
                style={{
                  transform: [{ scale: favoriteScaleAnim }],
                }}
              >
                <Icon
                  name={story.isFavorite ? "favorite" : "favorite-border"}
                  size={24}
                  color={story.isFavorite ? theme.colors.error : "#FFFFFF"}
                />
              </Animated.View>
            </Pressable>
          )}

          {/* Reading progress indicator for enhanced stories */}
          {story.readCount && story.readCount > 0 && (
            <View style={styles.readingBadge}>
              <Icon name="visibility" size={16} color="#FFFFFF" />
              <Text style={styles.readingBadgeText}>{story.readCount}</Text>
            </View>
          )}

          {/* Age group indicator */}
          {story.ageGroup && (
            <View style={styles.ageGroupBadge}>
              <Text style={styles.ageGroupText}>{story.ageGroup}</Text>
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
                titleStyles,
                styles.title,
                variant === 'grid' && styles.gridTitle,
                { color: '#FFFFFF' },
              ]}
              numberOfLines={variant === 'grid' ? 2 : 1}
            >
              {story.title}
            </Text>
            <Text
              numberOfLines={variant === 'grid' ? 2 : 3}
              style={[
                descriptionStyles,
                styles.description,
                variant === 'grid' && styles.gridDescription,
                { color: '#FFFFFF' },
              ]}
            >
              {story.description}
            </Text>

            {/* Reading time indicator for enhanced stories */}
            {story.readingTime && (
              <View style={styles.readingTimeContainer}>
                <Icon name="schedule" size={14} color="#FFFFFF" />
                <Text style={styles.readingTimeText}>
                  {story.readingTime} min read
                </Text>
              </View>
            )}
          </Animated.View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

export default StoryCard

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    // Enhanced shadow for better elevation
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  horizontalVariant: {
    width: 240,
    height: 280,
    marginRight: 16,
  },
  gridVariant: {
    width: (width - 48) / 2, // 2 columns with proper spacing
    height: 220,
    marginBottom: 16,
  },
  featuredVariant: {
    width: width - 32,
    height: 320,
    marginHorizontal: 16,
    marginBottom: 24,
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
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    borderRadius: 24,
    padding: 10,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteIconOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  readingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  readingBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  ageGroupBadge: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ageGroupText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  textOverlay: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 80, // Leave space for age group badge
  },
  title: {
    fontWeight: '700',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  gridTitle: {
    fontSize: 16,
    lineHeight: 20,
  },
  description: {
    opacity: 0.95,
    lineHeight: 18,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  gridDescription: {
    fontSize: 13,
    lineHeight: 16,
  },
  readingTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  readingTimeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});  