import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { getStoryTheme, getCategoryTheme } from '../utils/storyThemes';
import type { Story, Category } from '../types/story';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type RootStackParamList = {
  StoryDetail: { id: string };
  Category: { id: string; name: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SearchScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Story[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Moon stories',
    'Adventure',
    'Bedtime',
  ]);
  const [popularCategories, setPopularCategories] = useState<Category[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchPopularCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      performSearch(searchQuery);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const fetchPopularCategories = async () => {
    // Mock data
    const mockCategories: Category[] = [
      { id: 'animals', name: 'Animals', storyCount: 24 },
      { id: 'adventure', name: 'Adventure', storyCount: 18 },
      { id: 'magic', name: 'Magic', storyCount: 15 },
      { id: 'bedtime', name: 'Bedtime', storyCount: 22 },
    ];
    setPopularCategories(mockCategories);
  };

  const performSearch = async (query: string) => {
    setIsSearching(true);
    
    // Mock search - replace with actual API call
    setTimeout(() => {
      const mockResults: Story[] = [
        {
          id: '1',
          title: 'The Moonlight Adventure',
          subtitle: 'A magical journey through the stars',
          duration: 8,
          category: 'space',
          tags: ['moon', 'adventure'],
        },
        {
          id: '2',
          title: 'Forest of Dreams',
          subtitle: 'Where trees whisper secrets',
          duration: 6,
          category: 'nature',
          tags: ['forest', 'magic'],
        },
        {
          id: '3',
          title: 'Ocean Tales',
          subtitle: 'Dive into underwater wonders',
          duration: 7,
          category: 'ocean',
          tags: ['sea', 'adventure'],
        },
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const handleSearch = (query: string) => {
    if (query.trim().length > 0 && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeRecentSearch = (search: string) => {
    setRecentSearches(recentSearches.filter((s) => s !== search));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAF9" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header with Search */}
        <View style={styles.header}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={22} color="#8B5CF6" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search stories, categories..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => handleSearch(searchQuery)}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
                <Icon name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {searchQuery.length === 0 ? (
            // Default State - Recent & Popular
            <>
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Searches</Text>
                    <TouchableOpacity onPress={() => setRecentSearches([])}>
                      <Text style={styles.clearAllText}>Clear all</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.recentSearches}>
                    {recentSearches.map((search, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.recentSearchItem}
                        onPress={() => setSearchQuery(search)}
                      >
                        <Icon name="time-outline" size={20} color="#6B7280" />
                        <Text style={styles.recentSearchText}>{search}</Text>
                        <TouchableOpacity
                          onPress={() => removeRecentSearch(search)}
                          style={styles.removeButton}
                        >
                          <Icon name="close" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {/* Popular Categories */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Popular Categories</Text>
                <View style={styles.categoriesGrid}>
                  {popularCategories.map((category) => {
                    const theme = getCategoryTheme(category.id);
                    return (
                      <TouchableOpacity
                        key={category.id}
                        style={styles.categoryCard}
                        onPress={() =>
                          navigation.navigate('Category', {
                            id: category.id,
                            name: category.name,
                          })
                        }
                        activeOpacity={0.8}
                      >
                        <LinearGradient
                          colors={theme.colors}
                          style={styles.categoryGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Icon name={theme.icon} size={32} color="#FFFFFF" />
                          <Text style={styles.categoryName}>{category.name}</Text>
                          <Text style={styles.categoryCount}>
                            {category.storyCount} stories
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Search Tips */}
              <View style={styles.tipsSection}>
                <View style={styles.tipCard}>
                  <Icon name="bulb-outline" size={24} color="#F59E0B" />
                  <View style={styles.tipContent}>
                    <Text style={styles.tipTitle}>Search Tips</Text>
                    <Text style={styles.tipText}>
                      Try searching by theme, character, or mood like "brave animals" or "sleepy time"
                    </Text>
                  </View>
                </View>
              </View>
            </>
          ) : (
            // Search Results
            <>
              {isSearching ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#8B5CF6" />
                  <Text style={styles.loadingText}>Searching...</Text>
                </View>
              ) : searchResults.length > 0 ? (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>
                    {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
                  </Text>
                  <View style={styles.resultsGrid}>
                    {searchResults.map((story, index) => {
                      const theme = getStoryTheme(story.category, story.tags);
                      const isLeft = index % 2 === 0;

                      return (
                        <TouchableOpacity
                          key={story.id}
                          style={[
                            styles.resultCard,
                            isLeft ? styles.resultCardLeft : styles.resultCardRight,
                          ]}
                          onPress={() => navigation.navigate('StoryDetail', { id: story.id })}
                          activeOpacity={0.9}
                        >
                          <LinearGradient
                            colors={theme.colors}
                            style={styles.resultGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                          >
                            <View style={styles.resultIconContainer}>
                              <Icon name={theme.icon} size={40} color="#FFFFFF" />
                            </View>
                            <View style={styles.resultInfo}>
                              <Text style={styles.resultTitle} numberOfLines={2}>
                                {story.title}
                              </Text>
                              {story.subtitle && (
                                <Text style={styles.resultSubtitle} numberOfLines={1}>
                                  {story.subtitle}
                                </Text>
                              )}
                              <View style={styles.resultFooter}>
                                <View style={styles.durationBadge}>
                                  <Icon name="time-outline" size={12} color="#FFFFFF" />
                                  <Text style={styles.durationText}>
                                    {story.duration} min
                                  </Text>
                                </View>
                                <View style={styles.playButtonSmall}>
                                  <Icon name="play" size={12} color="#FFFFFF" />
                                </View>
                              </View>
                            </View>
                          </LinearGradient>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              ) : (
                // No Results
                <View style={styles.emptyState}>
                  <View style={styles.emptyIconContainer}>
                    <Icon name="search-outline" size={64} color="#D1D5DB" />
                  </View>
                  <Text style={styles.emptyStateTitle}>No results found</Text>
                  <Text style={styles.emptyStateText}>
                    Try different keywords or browse our categories
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAF9',
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },

  // Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },

  // Section
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  clearAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8B5CF6',
  },

  // Recent Searches
  recentSearches: {
    gap: 12,
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  recentSearchText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
  },
  removeButton: {
    padding: 4,
  },

  // Categories Grid
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  categoryGradient: {
    padding: 20,
    minHeight: 140,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },

  // Tips
  tipsSection: {
    paddingHorizontal: 20,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFBEB',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FEF3C7',
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#92400E',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#78350F',
    lineHeight: 20,
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },

  // Results Grid
  resultsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resultCard: {
    width: (SCREEN_WIDTH - 52) / 2,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  resultCardLeft: {
    marginRight: 6,
  },
  resultCardRight: {
    marginLeft: 6,
  },
  resultGradient: {
    padding: 16,
    minHeight: 200,
    justifyContent: 'space-between',
  },
  resultIconContainer: {
    marginBottom: 12,
  },
  resultInfo: {
    marginTop: 'auto',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    lineHeight: 20,
  },
  resultSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 12,
  },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  playButtonSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
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
    marginBottom: 24,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default SearchScreen;
