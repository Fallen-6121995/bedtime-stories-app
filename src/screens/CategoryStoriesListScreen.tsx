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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import { getStoryTheme, getCategoryTheme } from '../utils/storyThemes';
import type { Story } from '../types/story';
import { THEME, getNumColumns, getCardWidth } from '../theme/appTheme';

type RootStackParamList = {
  Category: { id: string; name: string, categoryId:string };
  StoryDetail: { id: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Category'>;
type CategoryRouteProp = RouteProp<RootStackParamList, 'Category'>;

const CategoryStoriesListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<CategoryRouteProp>();
  const { width } = useWindowDimensions();
  
  const { id: categoryId, name: categoryName, categoryId:categoryObjectId } = route.params;

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSort, setSelectedSort] = useState('popular');

  // Responsive grid
  const numColumns = getNumColumns(width);
  const gap = 16;
  const padding = 24;
  const cardWidth = getCardWidth(width, numColumns, gap, padding);

  useEffect(() => {
    fetchCategoryStories();
  }, [categoryId]);

  const fetchCategoryStories = async () => {
    try {
      const StoryService = (await import('../services/story/StoryService')).default;
      const response = await StoryService.getStoriesByCategory(categoryObjectId);
      
      const transformedStories: Story[] = response.stories.map(story => ({
        id: story.id,
        title: story.titles?.en || story.title || 'Untitled Story',
        subtitle: story.titles && Object.keys(story.titles).length > 1 
          ? `Available in ${Object.keys(story.titles).length} languages` 
          : undefined,
        duration: story.duration || 5,
        category: categoryId,
        tags: story.tags || [],
        ageGroup: story.ageGroup,
        imageUrl: story.imageUrl || story.imageUrls?.[0],
        createdAt: story.createdAt,
        isNew: story.createdAt 
          ? (new Date().getTime() - new Date(story.createdAt).getTime()) < 7 * 24 * 60 * 60 * 1000
          : false,
      }));

      setStories(transformedStories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching category stories:', error);
      setStories([]);
      setLoading(false);
    }
  };

  const sortOptions = [
    { id: 'popular', label: 'Popular', icon: 'flame' },
    { id: 'newest', label: 'Newest', icon: 'sparkles' },
    { id: 'shortest', label: 'Shortest', icon: 'time' },
  ];

  const categoryTheme = getCategoryTheme(categoryId);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={THEME.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={THEME.colors.background} />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="chevron-back" size={24} color={THEME.colors.textDark} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>{categoryName}</Text>
            <Text style={styles.headerSubtitle}>
              {stories.length} magical {stories.length === 1 ? 'story' : 'stories'}
            </Text>
          </View>
          <TouchableOpacity style={styles.searchButton} activeOpacity={0.7}>
            <Icon name="search" size={24} color={THEME.colors.textDark} />
          </TouchableOpacity>
        </View>

        {/* Sort Options */}
        <View style={styles.sortWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortContainer}
          >
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortChip,
                  selectedSort === option.id && styles.sortChipActive,
                ]}
                onPress={() => setSelectedSort(option.id)}
                activeOpacity={0.7}
              >
                <Icon
                  name={option.icon}
                  size={16}
                  color={selectedSort === option.id ? THEME.colors.primary : THEME.colors.textMedium}
                />
                <Text
                  style={[
                    styles.sortChipText,
                    selectedSort === option.id && styles.sortChipTextActive,
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stories Grid */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {stories.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Icon name="book-outline" size={64} color={THEME.colors.textLight} />
              </View>
              <Text style={styles.emptyStateTitle}>No Stories Yet</Text>
              <Text style={styles.emptyStateText}>
                This category is waiting for its first magical story.{'\n'}
                Check back soon for new adventures!
              </Text>
              <TouchableOpacity 
                style={styles.backToHomeButton}
                onPress={() => navigation.goBack()}
                activeOpacity={0.8}
              >
                <Icon name="arrow-back" size={20} color={THEME.colors.white} />
                <Text style={styles.backToHomeButtonText}>Back to Categories</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.storiesGrid, { gap, paddingHorizontal: padding }]}>
              {stories.map((story) => {
                const theme = getStoryTheme(story.category, story.tags);
                const primaryColor = theme.colors[0];

                return (
                  <TouchableOpacity
                    key={story.id}
                    style={[
                      styles.storyCard,
                      { 
                        width: cardWidth,
                        height: cardWidth * 1.3,
                      }
                    ]}
                    onPress={() => navigation.navigate('StoryDetail', { id: story.id })}
                    activeOpacity={0.9}
                  >
                    <View style={styles.cardContent}>
                      {/* New Badge */}
                      {story.isNew && (
                        <View style={[styles.newBadge, { backgroundColor: THEME.colors.accent }]}>
                          <Icon name="star" size={10} color="#FFF" />
                          <Text style={styles.newBadgeText}>NEW</Text>
                        </View>
                      )}

                      {/* Icon Circle */}
                      <View style={[styles.iconCircle, { backgroundColor: primaryColor + '15' }]}>
                        <Icon name={theme.icon} size={cardWidth * 0.25} color={primaryColor} />
                      </View>

                      {/* Story Info */}
                      <View style={styles.storyInfo}>
                        <Text 
                          style={[
                            styles.storyTitle,
                            { fontSize: Math.min(16, cardWidth * 0.1) }
                          ]} 
                          numberOfLines={2}
                        >
                          {story.title}
                        </Text>
                        <View style={styles.storyFooter}>
                          <View style={[styles.durationBadge, { backgroundColor: primaryColor + '20' }]}>
                            <Icon name="time-outline" size={12} color={primaryColor} />
                            <Text style={[styles.durationText, { color: primaryColor }]}>
                              {story.duration} min
                            </Text>
                          </View>
                          <View style={[styles.playButtonSmall, { backgroundColor: primaryColor }]}>
                            <Icon name="play" size={12} color={THEME.colors.white} />
                          </View>
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: THEME.colors.background,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    color: THEME.colors.textDark,
    fontFamily: THEME.fonts.heading,
    fontWeight: '800',
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.colors.textMedium,
    fontFamily: THEME.fonts.medium,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },

  // Sort Options
  sortWrapper: {
    marginBottom: 24,
  },
  sortContainer: {
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortChip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: THEME.borderRadius.full,
    backgroundColor: THEME.colors.white,
    marginRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.soft,
  },
  sortChipActive: {
    backgroundColor: THEME.colors.primary + '15',
    borderColor: THEME.colors.primary,
  },
  sortChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME.colors.textMedium,
    fontFamily: THEME.fonts.medium,
  },
  sortChipTextActive: {
    color: THEME.colors.primary,
  },

  // Stories Grid
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
  storyCard: {
    marginBottom: 16,
    borderRadius: THEME.borderRadius.xl,
    backgroundColor: THEME.colors.white,
    ...THEME.shadows.card,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Icon Circle
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  // New Badge
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    zIndex: 10,
    gap: 4,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
  },

  // Story Content
  storyInfo: {
    alignItems: 'center',
    width: '100%',
  },
  storyTitle: {
    fontWeight: '700',
    color: THEME.colors.textDark,
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: THEME.fonts.heading,
  },
  storyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.m,
    gap: 4,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
  },
  playButtonSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: THEME.colors.inputBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.textDark,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: THEME.fonts.heading,
  },
  emptyStateText: {
    fontSize: 15,
    color: THEME.colors.textMedium,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  backToHomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: THEME.borderRadius.full,
    gap: 8,
    ...THEME.shadows.glow(THEME.colors.primary),
  },
  backToHomeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default CategoryStoriesListScreen;
