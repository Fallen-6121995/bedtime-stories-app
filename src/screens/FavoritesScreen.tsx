import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Imports
import { getStoryTheme } from '../utils/storyThemes';
import type { Story } from '../types/story';
import { THEME, getNumColumns, getCardWidth } from '../theme/appTheme';

// Define a local "Rose" theme for the favorites screen to make it special
const ROSE_COLOR = '#F43F5E'; // Pink/Red
const ROSE_GRADIENT = ['#FB7185', '#F43F5E'];

type RootStackParamList = {
  StoryDetail: { id: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  
  // State
  const [favorites, setFavorites] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');

  // --- RESPONSIVE LAYOUT ---
  const numColumns = getNumColumns(width);
  const gap = 16;
  const padding = 24;
  const cardWidth = getCardWidth(width, numColumns, gap, padding);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      // Mock data - replace with actual API call
      const mockFavorites: Story[] = [
        {
          id: '1',
          title: 'The Moonlight Adventure',
          subtitle: 'A magical journey through the stars',
          duration: 8,
          category: 'space',
          tags: ['moon', 'adventure'],
          isFavorite: true,
        },
        {
          id: '2',
          title: 'Forest of Dreams',
          subtitle: 'Where trees whisper secrets',
          duration: 6,
          category: 'nature',
          tags: ['forest', 'magic'],
          isFavorite: true,
        },
        {
          id: '3',
          title: 'Ocean Tales',
          subtitle: 'Dive into underwater wonders',
          duration: 7,
          category: 'ocean',
          tags: ['sea', 'adventure'],
          isFavorite: true,
        },
      ];
      setFavorites(mockFavorites);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setLoading(false);
    }
  };

  const confirmRemoveFavorite = (storyId: string) => {
    Alert.alert(
      "Remove from Favorites?",
      "Are you sure you want to remove this story?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive", 
          onPress: () => setFavorites(prev => prev.filter(s => s.id !== storyId)) 
        }
      ]
    );
  };

  const filters = [
    { id: 'all', label: 'All', icon: 'apps' },
    { id: 'recent', label: 'Recent', icon: 'time-outline' },
    { id: 'sleep', label: 'Sleep', icon: 'moon-outline' },
  ];

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={ROSE_COLOR} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Your Collection</Text>
            <Text style={styles.headerSubtitle}>
              {favorites.length} stories you love ❤️
            </Text>
          </View>
          {/* Decorative Icon Circle */}
          <View style={styles.headerIconCircle}>
            <Icon name="heart" size={24} color={ROSE_COLOR} />
          </View>
        </View>

        {/* --- FILTERS --- */}
        {favorites.length > 0 && (
          <View style={styles.filterSection}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {filters.map((filter) => {
                const isActive = selectedFilter === filter.id;
                return (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      styles.filterChip,
                      isActive && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedFilter(filter.id)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={filter.icon}
                      size={16}
                      color={isActive ? '#FFF' : THEME.colors.textMedium}
                    />
                    <Text
                      style={[
                        styles.filterText,
                        isActive && styles.filterTextActive,
                      ]}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* --- GRID --- */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {favorites.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Icon name="heart-dislike-outline" size={56} color={ROSE_COLOR} />
              </View>
              <Text style={styles.emptyStateTitle}>No favorites yet</Text>
              <Text style={styles.emptyStateText}>
                Tap the heart icon on any story to save it here for later!
              </Text>
            </View>
          ) : (
            <View style={[styles.storiesGrid, { gap, paddingHorizontal: padding }]}>
              {favorites.map((story) => {
                const theme = getStoryTheme(story.category, story.tags);
                // Fallback gradient if no image
                const gradientColors = theme.colors;

                return (
                  <TouchableOpacity
                    key={story.id}
                    style={[
                      styles.storyCard,
                      { 
                        width: cardWidth,
                        height: cardWidth * 1.4, // Poster aspect ratio
                      }
                    ]}
                    onPress={() => navigation.navigate('StoryDetail', { id: story.id })}
                    activeOpacity={0.9}
                  >
                    {/* TOP HALF: Image/Gradient */}
                    <View style={styles.cardImageContainer}>
                      <LinearGradient
                        colors={gradientColors}
                        style={styles.cardGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                         {/* Watermark Icon */}
                         <Icon name={theme.icon} size={80} color="rgba(255,255,255,0.15)" style={styles.watermarkIcon} />
                         
                         {/* Main Icon */}
                         <Icon name={theme.icon} size={48} color="#FFF" style={styles.mainIcon} />

                         {/* Remove Button (Heart) */}
                         <TouchableOpacity
                            style={styles.removeButton}
                            onPress={() => confirmRemoveFavorite(story.id)}
                            activeOpacity={0.8}
                         >
                            <View style={styles.removeButtonBlur} />
                            <Icon name="heart" size={18} color={ROSE_COLOR} />
                         </TouchableOpacity>
                         
                         {/* Duration Pill */}
                         <View style={styles.durationPill}>
                            <Icon name="time" size={10} color="#FFF" />
                            <Text style={styles.durationText}>{story.duration} min</Text>
                         </View>
                      </LinearGradient>
                    </View>

                    {/* BOTTOM HALF: Info */}
                    <View style={styles.cardContent}>
                      <Text style={styles.storyTitle} numberOfLines={2}>
                        {story.title}
                      </Text>
                      
                      <View style={styles.cardFooter}>
                        <Text style={styles.storySubtitle} numberOfLines={1}>
                          {story.subtitle}
                        </Text>
                        
                        <View style={[styles.playButton, { backgroundColor: gradientColors[0] + '15' }]}>
                           <Icon name="play" size={14} color={gradientColors[0]} />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.colors.background,
  },
  safeArea: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: THEME.colors.background,
  },
  headerTitle: {
    fontSize: 28,
    color: THEME.colors.textDark,
    fontFamily: THEME.fonts.heading,
    fontWeight: '800',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.colors.textMedium,
    fontFamily: THEME.fonts.medium,
  },
  headerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ROSE_COLOR + '15', // Light pink bg
    alignItems: 'center',
    justifyContent: 'center',
  },

  // FILTERS
  filterSection: {
    marginBottom: 20,
  },
  filterScroll: {
    paddingHorizontal: 24,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.white,
    marginRight: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    gap: 6,
    ...THEME.shadows.small,
  },
  filterChipActive: {
    backgroundColor: ROSE_COLOR,
    borderColor: ROSE_COLOR,
    ...THEME.shadows.colored(ROSE_COLOR, 0.4),
  },
  filterText: {
    fontSize: 14,
    color: THEME.colors.textMedium,
    fontFamily: THEME.fonts.medium,
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#FFF',
  },

  // GRID
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  storiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  // CARD
  storyCard: {
    marginBottom: 16,
    borderRadius: THEME.borderRadius.l,
    backgroundColor: THEME.colors.white,
    ...THEME.shadows.card,
    overflow: 'hidden',
  },
  
  // CARD TOP
  cardImageContainer: {
    flex: 2,
    backgroundColor: '#F0F0F0',
    position: 'relative',
  },
  cardGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainIcon: {
    zIndex: 1,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  watermarkIcon: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    transform: [{ rotate: '-15deg' }],
  },
  
  // Remove Button (Heart)
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  removeButtonBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 16,
  },
  
  // Duration
  durationPill: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },

  // CARD BOTTOM
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  storyTitle: {
    fontSize: 16,
    color: THEME.colors.textDark,
    fontFamily: THEME.fonts.heading,
    fontWeight: '700',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  storySubtitle: {
    fontSize: 12,
    color: THEME.colors.textMedium,
    fontFamily: THEME.fonts.medium,
    flex: 1,
    marginRight: 8,
  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // EMPTY STATE
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: ROSE_COLOR + '10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: THEME.colors.textDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 15,
    color: THEME.colors.textMedium,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FavoritesScreen;