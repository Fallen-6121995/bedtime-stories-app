// Enhanced Story detail screen for reading full stories with metadata and reading features

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Pressable,
  Animated,
  Alert,
  Share,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { StoryDetailScreenProps } from '../types/navigation';
import { EnhancedStory } from '../types';
import ScreenContainer from '../components/ScreenContainer';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import StoryReader from '../components/StoryReader';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import storyService from '../services/StoryService';
import { formatReadingTime, formatLastRead } from '../utils/helpers';

// const { width } = Dimensions.get('window');

export const StoryDetailScreen: React.FC<StoryDetailScreenProps> = ({ 
  route, 
  navigation 
}) => {
  const { storyId, title } = route.params;
  const { colors, typography, spacing } = useTheme();
  const { isAuthenticated } = useAuth();
  
  // State management
  const [story, setStory] = useState<EnhancedStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [readerMode, setReaderMode] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  
  // Animation refs
  const favoriteScaleAnim = useRef(new Animated.Value(1)).current;
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  
  // Load story data
  useEffect(() => {
    loadStoryData();
  }, [storyId]);

  // Update reading progress when story is loaded
  useEffect(() => {
    if (story && isAuthenticated) {
      updateReadingProgress();
    }
  }, [story, isAuthenticated]);

  // Set up navigation header
  useEffect(() => {
    navigation.setOptions({
      title: story?.title || title || 'Story',
      headerRight: () => (
        <View style={styles.headerActions}>
          <Pressable
            onPress={toggleReaderMode}
            style={styles.headerButton}
            hitSlop={8}
          >
            <Icon
              name={readerMode ? 'chrome-reader-mode' : 'chrome-reader-mode-outlined'}
              size={24}
              color={readerMode ? colors.primary[500] : colors.neutral[600]}
            />
          </Pressable>
          
          {isAuthenticated && story && (
            <Pressable
              onPress={handleFavoritePress}
              style={styles.headerButton}
              hitSlop={8}
            >
              <Animated.View
                style={{
                  transform: [{ scale: favoriteScaleAnim }],
                }}
              >
                <Icon
                  name={story.isFavorite ? 'favorite' : 'favorite-border'}
                  size={24}
                  color={story.isFavorite ? colors.error : colors.neutral[600]}
                />
              </Animated.View>
            </Pressable>
          )}
          <Pressable
            onPress={handleSharePress}
            style={styles.headerButton}
            hitSlop={8}
          >
            <Icon
              name="share"
              size={24}
              color={colors.neutral[600]}
            />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, story, colors]);

  const loadStoryData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const storyData = await storyService.getEnhancedStory(storyId);
      
      if (storyData) {
        setStory(storyData);
      } else {
        setError('Story not found');
      }
    } catch (err) {
      console.error('Error loading story:', err);
      setError('Failed to load story. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateReadingProgress = async () => {
    try {
      await storyService.updateReadingProgress(storyId);
    } catch (err) {
      console.error('Error updating reading progress:', err);
    }
  };

  const handleFavoritePress = async () => {
    if (!story || !isAuthenticated) return;

    try {
      // Animate favorite button
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

      await storyService.toggleFavorite(storyId);
      
      // Update local state
      setStory(prev => prev ? {
        ...prev,
        isFavorite: !prev.isFavorite
      } : null);
      
    } catch (err) {
      console.error('Error toggling favorite:', err);
      Alert.alert('Error', 'Failed to update favorite status');
    }
  };

  const handleSharePress = async () => {
    if (!story) return;

    try {
      await Share.share({
        message: `Check out this story: "${story.title}"\n\n${story.description}`,
        title: story.title,
      });
    } catch (err) {
      console.error('Error sharing story:', err);
    }
  };

  const toggleReaderMode = () => {
    setReaderMode(!readerMode);
  };

  const handleReadingProgressUpdate = (progress: number) => {
    setReadingProgress(progress);
  };

  const handleReadingComplete = () => {
    // Story reading completed - could trigger achievements, etc.
    console.log('Story reading completed!');
  };

  const adjustFontSize = (size: 'small' | 'medium' | 'large') => {
    setFontSize(size);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const contentHeight = event.nativeEvent.contentSize.height;
        const scrollViewHeight = event.nativeEvent.layoutMeasurement.height;
        
        // Calculate reading progress
        const progress = Math.min(offsetY / (contentHeight - scrollViewHeight), 1);
        setReadingProgress(Math.max(0, progress));
        
        // Update header opacity based on scroll
        const opacity = Math.min(offsetY / 200, 1);
        headerOpacity.setValue(opacity);
      }
    }
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.neutral[50],
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing[8],
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing[8],
    },
    errorText: {
      fontSize: typography.fontSize.lg,
      fontFamily: typography.fontFamily.regular,
      color: colors.error,
      textAlign: 'center',
      marginBottom: spacing[4],
    },
    scrollContent: {
      paddingBottom: spacing[8],
    },
    heroSection: {
      position: 'relative',
      height: 300,
      marginBottom: spacing[6],
    },
    heroImage: {
      width: '100%',
      height: '100%',
    },
    heroImagePlaceholder: {
      backgroundColor: colors.neutral[200],
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroImageLoading: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    heroGradient: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      height: 120,
    },
    heroContent: {
      position: 'absolute',
      bottom: spacing[4],
      left: spacing[4],
      right: spacing[4],
    },
    heroTitle: {
      fontSize: typography.fontSize['3xl'],
      fontFamily: typography.fontFamily.bold,
      color: '#FFFFFF',
      marginBottom: spacing[2],
      textShadowColor: 'rgba(0, 0, 0, 0.5)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    heroSubtitle: {
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.regular,
      color: '#FFFFFF',
      opacity: 0.9,
      textShadowColor: 'rgba(0, 0, 0, 0.3)',
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 1,
    },
    contentSection: {
      paddingHorizontal: spacing[4],
    },
    metadataContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing[6],
      gap: spacing[3],
    },
    metadataItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.primary[50],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.primary[100],
    },
    metadataIcon: {
      marginRight: spacing[2],
    },
    metadataText: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.medium,
      color: colors.primary[700],
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: spacing[6],
      gap: spacing[2],
    },
    tag: {
      backgroundColor: colors.secondary[100],
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[1],
      borderRadius: 12,
    },
    tagText: {
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fontFamily.medium,
      color: colors.secondary[700],
    },
    storyContent: {
      fontSize: typography.fontSize.lg,
      fontFamily: typography.fontFamily.regular,
      color: colors.neutral[800],
      lineHeight: typography.lineHeight.relaxed * typography.fontSize.lg,
      marginBottom: spacing[8],
    },
    readingStats: {
      backgroundColor: colors.neutral[100],
      padding: spacing[4],
      borderRadius: 16,
      marginBottom: spacing[6],
    },
    readingStatsTitle: {
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.bold,
      color: colors.neutral[800],
      marginBottom: spacing[3],
    },
    readingStatsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing[2],
    },
    readingStatsLabel: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.regular,
      color: colors.neutral[600],
    },
    readingStatsValue: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.bold,
      color: colors.neutral[800],
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.neutral[200],
      borderRadius: 2,
      marginTop: spacing[2],
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.primary[500],
      borderRadius: 2,
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerButton: {
      marginLeft: spacing[3],
      padding: spacing[1],
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[6],
      backgroundColor: colors.neutral[100],
      borderTopWidth: 1,
      borderTopColor: colors.neutral[200],
    },
    fontSizeControls: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[3],
      backgroundColor: colors.neutral[100],
      borderBottomWidth: 1,
      borderBottomColor: colors.neutral[200],
    },
    fontSizeButton: {
      paddingHorizontal: spacing[3],
      paddingVertical: spacing[2],
      marginHorizontal: spacing[1],
      borderRadius: 16,
      backgroundColor: colors.neutral[200],
    },
    activeFontSizeButton: {
      backgroundColor: colors.primary[500],
    },
    fontSizeButtonText: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.medium,
      color: colors.neutral[700],
    },
    activeFontSizeButtonText: {
      color: '#FFFFFF',
    },
  });

  // Loading state
  if (loading) {
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <Text style={[styles.metadataText, { marginTop: spacing[4] }]}>
            Loading story...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  // Error state
  if (error || !story) {
    return (
      <ScreenContainer style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon
            name="error-outline"
            size={64}
            color={colors.error}
            style={{ marginBottom: spacing[4] }}
          />
          <Text style={styles.errorText}>
            {error || 'Story not found'}
          </Text>
          <Button
            title="Try Again"
            onPress={loadStoryData}
            variant="primary"
          />
        </View>
      </ScreenContainer>
    );
  }

  // If in reader mode, show the dedicated story reader
  if (readerMode && story) {
    return (
      <ScreenContainer style={styles.container} safeArea={false}>
        <StoryReader
          story={story}
          onReadingProgressUpdate={handleReadingProgressUpdate}
          onReadingComplete={handleReadingComplete}
          fontSize={fontSize}
          testID="story-reader"
        />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container} safeArea={false}>
      {/* Font Size Controls */}
      <View style={styles.fontSizeControls}>
        <Text style={[styles.metadataText, { marginRight: spacing[3] }]}>
          Font Size:
        </Text>
        {(['small', 'medium', 'large'] as const).map((size) => (
          <Pressable
            key={size}
            onPress={() => adjustFontSize(size)}
            style={[
              styles.fontSizeButton,
              fontSize === size && styles.activeFontSizeButton,
            ]}
          >
            <Text
              style={[
                styles.fontSizeButtonText,
                fontSize === size && styles.activeFontSizeButtonText,
              ]}
            >
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
          {!imageError ? (
            <Image
              source={{ uri: story.image }}
              style={styles.heroImage}
              resizeMode="cover"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <View style={[styles.heroImage, styles.heroImagePlaceholder]}>
              <Icon
                name="image"
                size={64}
                color={colors.neutral[400]}
              />
            </View>
          )}
          
          {imageLoading && (
            <View style={styles.heroImageLoading}>
              <LoadingSpinner size="large" />
            </View>
          )}
          
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            locations={[0.3, 1]}
            style={styles.heroGradient}
          />
          
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{story.title}</Text>
            <Text style={styles.heroSubtitle}>{story.description}</Text>
          </View>
        </View>

        <View style={styles.contentSection}>
          {/* Metadata Section */}
          <View style={styles.metadataContainer}>
            <View style={styles.metadataItem}>
              <Icon
                name="schedule"
                size={16}
                color={colors.primary[600]}
                style={styles.metadataIcon}
              />
              <Text style={styles.metadataText}>
                {formatReadingTime(story.readingTime)}
              </Text>
            </View>
            
            <View style={styles.metadataItem}>
              <Icon
                name="child-care"
                size={16}
                color={colors.primary[600]}
                style={styles.metadataIcon}
              />
              <Text style={styles.metadataText}>
                {story.ageGroup}
              </Text>
            </View>
            
            {story.readCount > 0 && (
              <View style={styles.metadataItem}>
                <Icon
                  name="visibility"
                  size={16}
                  color={colors.primary[600]}
                  style={styles.metadataIcon}
                />
                <Text style={styles.metadataText}>
                  Read {story.readCount} time{story.readCount !== 1 ? 's' : ''}
                </Text>
              </View>
            )}
          </View>

          {/* Tags Section */}
          {story.tags && story.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {story.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Reading Statistics for authenticated users */}
          {isAuthenticated && (story.readCount > 0 || story.lastRead) && (
            <View style={styles.readingStats}>
              <Text style={styles.readingStatsTitle}>Reading Statistics</Text>
              
              {story.readCount > 0 && (
                <View style={styles.readingStatsRow}>
                  <Text style={styles.readingStatsLabel}>Times Read:</Text>
                  <Text style={styles.readingStatsValue}>{story.readCount}</Text>
                </View>
              )}
              
              {story.lastRead && (
                <View style={styles.readingStatsRow}>
                  <Text style={styles.readingStatsLabel}>Last Read:</Text>
                  <Text style={styles.readingStatsValue}>
                    {formatLastRead(story.lastRead)}
                  </Text>
                </View>
              )}
              
              {/* Reading Progress Bar */}
              <View style={styles.progressBar}>
                <Animated.View
                  style={[
                    styles.progressFill,
                    { width: `${readingProgress * 100}%` }
                  ]}
                />
              </View>
            </View>
          )}

          {/* Story Content */}
          <Text 
            style={[
              styles.storyContent,
              fontSize === 'small' && { fontSize: typography.fontSize.base },
              fontSize === 'large' && { fontSize: typography.fontSize.xl },
            ]}
          >
            {story.content}
          </Text>
        </View>
      </Animated.ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <Button
          title="Reader Mode"
          onPress={toggleReaderMode}
          variant="primary"
          icon="chrome-reader-mode"
          size="medium"
        />
        
        {isAuthenticated && (
          <Button
            title={story.isFavorite ? "Unfavorite" : "Favorite"}
            onPress={handleFavoritePress}
            variant={story.isFavorite ? "secondary" : "outline"}
            icon={story.isFavorite ? "favorite" : "favorite-border"}
            size="medium"
          />
        )}
        
        <Button
          title="Share"
          onPress={handleSharePress}
          variant="ghost"
          icon="share"
          size="medium"
        />
      </View>
    </ScreenContainer>
  );
};