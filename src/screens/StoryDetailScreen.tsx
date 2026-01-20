import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { getStoryTheme } from '../utils/storyThemes';
import type { Story } from '../types/story';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RootStackParamList = {
  StoryDetail: { id: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'StoryDetail'>;
type StoryDetailRouteProp = RouteProp<RootStackParamList, 'StoryDetail'>;

const StoryDetailScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<StoryDetailRouteProp>();
  const { id: storyId } = route.params;

  console.log("route>>>>",route)

  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [progress, setProgress] = useState(0.35); // 35% progress for demo
  const [currentTime, setCurrentTime] = useState(168); // 2:48 in seconds
  const [totalTime, setTotalTime] = useState(480); // 8:00 in seconds

  useEffect(() => {
    fetchStoryDetails();
  }, [storyId]);

  const fetchStoryDetails = async () => {
    try {
      // Import StoryService dynamically
      const StoryService = (await import('../services/story/StoryService')).default;
      
      // Fetch story from API
      const apiStory = await StoryService.getStoryById(storyId);
      
      // Transform API response to match UI expectations
      const transformedStory: Story = {
        id: apiStory.id,
        title: apiStory.titles?.en || apiStory.title || 'Untitled Story',
        subtitle: apiStory.titles && Object.keys(apiStory.titles).length > 1 
          ? `Available in ${Object.keys(apiStory.titles).length} languages` 
          : undefined,
        description: apiStory.description || 'A wonderful bedtime story.',
        duration: apiStory.duration || 5,
        category: apiStory.category?.name || 'story',
        tags: apiStory.tags || [],
        author: apiStory.owner?.name || 'Storyteller AI',
        ageGroup: apiStory.ageGroup || 'All ages',
        isFavorite: false, // TODO: Get from user favorites
        coverImage: apiStory.imageUrl || apiStory.imageUrls?.[0],
        audioUrl: apiStory.audioUrls?.en || Object.values(apiStory.audioUrls || {})[0],
      };

      setStory(transformedStory);
      setIsFavorite(transformedStory.isFavorite || false);
      
      // Set total time based on duration
      if (transformedStory.duration) {
        setTotalTime(transformedStory.duration * 60); // Convert minutes to seconds
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching story:', error);
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  if (loading || !story) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Loading story...</Text>
      </View>
    );
  }

  const theme = getStoryTheme(story.category, story.tags);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={[...theme.colors, '#FAFAF9']}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.4 }}
      >
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Now Playing</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Icon name="ellipsis-horizontal" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Story Artwork */}
            <View style={styles.artworkContainer}>
              <LinearGradient
                colors={[...theme.colors].reverse()}
                style={styles.artwork}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Icon name={theme.icon} size={120} color="#FFFFFF" />
              </LinearGradient>
            </View>

            {/* Story Info */}
            <View style={styles.storyInfo}>
              <View style={styles.storyHeader}>
                <View style={styles.storyTitleContainer}>
                  <Text style={styles.storyTitle}>{story.title}</Text>
                  {story.subtitle && (
                    <Text style={styles.storySubtitle}>{story.subtitle}</Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={toggleFavorite}
                >
                  <Icon
                    name={isFavorite ? 'heart' : 'heart-outline'}
                    size={28}
                    color={isFavorite ? '#EF4444' : '#6B7280'}
                  />
                </TouchableOpacity>
              </View>

              {/* Story Meta */}
              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Icon name="person-outline" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>{story.author}</Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaItem}>
                  <Icon name="time-outline" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>{story.duration} min</Text>
                </View>
                <View style={styles.metaDivider} />
                <View style={styles.metaItem}>
                  <Icon name="people-outline" size={16} color="#6B7280" />
                  <Text style={styles.metaText}>{story.ageGroup}</Text>
                </View>
              </View>

              {/* Description */}
              {story.description && (
                <View style={styles.descriptionContainer}>
                  <Text style={styles.descriptionTitle}>About this story</Text>
                  <Text style={styles.descriptionText}>{story.description}</Text>
                </View>
              )}

              {/* Audio Player */}
              <View style={styles.playerContainer}>
                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressBar}>
                    <LinearGradient
                      colors={['#8B5CF6', '#7C3AED']}
                      style={[styles.progressFill, { width: `${progress * 100}%` }]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                  </View>
                  <View style={styles.timeLabels}>
                    <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                    <Text style={styles.timeText}>{formatTime(totalTime)}</Text>
                  </View>
                </View>

                {/* Playback Controls */}
                <View style={styles.controls}>
                  <TouchableOpacity style={styles.controlButton}>
                    <Icon name="play-skip-back" size={28} color="#374151" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.controlButton}>
                    <Icon name="play-back" size={32} color="#374151" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={togglePlayPause}
                  >
                    <LinearGradient
                      colors={['#8B5CF6', '#7C3AED']}
                      style={styles.playButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                    >
                      <Icon
                        name={isPlaying ? 'pause' : 'play'}
                        size={32}
                        color="#FFFFFF"
                        style={!isPlaying && styles.playIconOffset}
                      />
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.controlButton}>
                    <Icon name="play-forward" size={32} color="#374151" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.controlButton}>
                    <Icon name="play-skip-forward" size={28} color="#374151" />
                  </TouchableOpacity>
                </View>

                {/* Additional Controls */}
                <View style={styles.additionalControls}>
                  <TouchableOpacity style={styles.additionalButton}>
                    <Icon name="repeat" size={24} color="#6B7280" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.additionalButton}>
                    <Icon name="speedometer-outline" size={24} color="#6B7280" />
                    <Text style={styles.speedText}>1x</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.additionalButton}>
                    <Icon name="timer-outline" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  gradientBackground: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  moreButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Artwork
  artworkContainer: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    alignItems: 'center',
  },
  artwork: {
    width: SCREEN_WIDTH - 80,
    height: SCREEN_WIDTH - 80,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },

  // Story Info
  storyInfo: {
    backgroundColor: '#FAFAF9',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: 32,
    paddingHorizontal: 24,
    marginTop: -16,
  },
  storyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  storyTitleContainer: {
    flex: 1,
    marginRight: 16,
  },
  storyTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
    lineHeight: 34,
  },
  storySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 22,
  },
  favoriteButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // Meta Info
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E5E7EB',
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },

  // Description
  descriptionContainer: {
    marginBottom: 32,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 24,
  },

  // Player
  playerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 6,
  },
  progressContainer: {
    marginBottom: 32,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },

  // Controls
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
  },
  controlButton: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    marginHorizontal: 8,
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIconOffset: {
    marginLeft: 3,
  },

  // Additional Controls
  additionalControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  additionalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 8,
  },
  speedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
});

export default StoryDetailScreen;
