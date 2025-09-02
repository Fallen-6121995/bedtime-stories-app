import React, { useState, useCallback, useEffect } from 'react';
import { 
  FlatList, 
  StyleSheet, 
  Text, 
  View, 
  Pressable,
  RefreshControl,
  Alert,
  StatusBar,
  useColorScheme
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ScreenContainer from '../components/ScreenContainer';
import StoryCard from '../components/StoryCard';
import CategoryHeader from '../components/CategoryHeader';
import LoadingSpinner from '../components/LoadingSpinner';

import { useAuth } from '../hooks/useAuth';
import { useStories } from '../hooks/useStories';
import { useThemeContext } from '../context/ThemeContext';
import { getTextStyles } from '../utils/theme';
import storiesData from '../common/StoriesData';
import { Story } from '../types';

type CategoryScreenProps = {
  route: {
    params: {
      categoryId: string;
      categoryName: string;
    };
  };
  navigation: any;
};

function CategoryScreen({ route, navigation }: CategoryScreenProps) {
  const { categoryId, categoryName } = route.params;
  const { isAuthenticated } = useAuth();
  const { toggleFavorite, markAsRead, isLoading, error } = useStories();
  const { theme } = useThemeContext();
  const isDarkMode = useColorScheme() === 'dark';
  
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'title' | 'readingTime'>('default');
  const [filterBy, setFilterBy] = useState<'all' | 'unread' | 'favorites'>('all');
  
  // Find the category data
  const category = storiesData.categories.find(cat => cat.id === categoryId);
  const allStories = category?.stories || [];
  
  // Apply filtering and sorting
  const getFilteredAndSortedStories = useCallback(() => {
    let filteredStories = [...allStories];
    
    // Apply filters
    switch (filterBy) {
      case 'unread':
        filteredStories = filteredStories.filter(story => !story.readCount || story.readCount === 0);
        break;
      case 'favorites':
        filteredStories = filteredStories.filter(story => story.isFavorite);
        break;
      default:
        break;
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'title':
        filteredStories.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'readingTime':
        filteredStories.sort((a, b) => (a.readingTime || 0) - (b.readingTime || 0));
        break;
      default:
        // Keep default order
        break;
    }
    
    return filteredStories;
  }, [allStories, sortBy, filterBy]);

  const stories = getFilteredAndSortedStories();

  // Handle story press
  const handleStoryPress = useCallback(async (story: Story) => {
    try {
      await markAsRead(story.id);
      navigation.navigate('StoryDetail', { story });
    } catch (err) {
      console.error('Error marking story as read:', err);
      navigation.navigate('StoryDetail', { story });
    }
  }, [navigation, markAsRead]);

  // Handle favorite toggle
  const handleFavoritePress = useCallback(async (story: Story) => {
    try {
      await toggleFavorite(story.id);
    } catch (err) {
      console.error('Error toggling favorite:', err);
      Alert.alert('Error', 'Unable to update favorites. Please try again.');
    }
  }, [toggleFavorite]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // Render filter and sort options
  const renderFilterSortBar = () => (
    <View style={[styles.filterSortBar, { backgroundColor: theme.colors.neutral[50] }]}>
      <View style={styles.filterContainer}>
        <Text style={[getTextStyles('caption', theme), styles.filterLabel]}>Filter:</Text>
        <View style={styles.filterButtons}>
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'favorites', label: 'Favorites' },
          ].map((filter) => (
            <Pressable
              key={filter.key}
              onPress={() => setFilterBy(filter.key as any)}
              style={[
                styles.filterButton,
                filterBy === filter.key && { backgroundColor: theme.colors.primary[500] },
              ]}
            >
              <Text
                style={[
                  getTextStyles('caption', theme),
                  styles.filterButtonText,
                  filterBy === filter.key && { color: '#FFFFFF' },
                ]}
              >
                {filter.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
      
      <View style={styles.sortContainer}>
        <Text style={[getTextStyles('caption', theme), styles.sortLabel]}>Sort:</Text>
        <Pressable
          onPress={() => {
            const options = ['default', 'title', 'readingTime'];
            const currentIndex = options.indexOf(sortBy);
            const nextIndex = (currentIndex + 1) % options.length;
            setSortBy(options[nextIndex] as any);
          }}
          style={styles.sortButton}
        >
          <Text style={[getTextStyles('caption', theme), styles.sortButtonText]}>
            {sortBy === 'default' ? 'Default' : 
             sortBy === 'title' ? 'A-Z' : 'Reading Time'}
          </Text>
          <Icon name="sort" size={16} color={theme.colors.neutral[600]} />
        </Pressable>
      </View>
    </View>
  );

  // Render story item
  const renderStoryItem = ({ item, index }: { item: Story; index: number }) => (
    <View style={[
      styles.storyItem,
      index % 2 === 0 ? styles.storyItemLeft : styles.storyItemRight,
    ]}>
      <StoryCard
        story={item}
        onPress={handleStoryPress}
        variant="grid"
        showFavorite={isAuthenticated}
        onFavoritePress={handleFavoritePress}
      />
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Icon 
        name={filterBy === 'favorites' ? 'favorite-border' : 'library-books'} 
        size={64} 
        color={theme.colors.neutral[400]} 
      />
      <Text style={[getTextStyles('h3', theme), styles.emptyTitle]}>
        {filterBy === 'favorites' ? 'No Favorites Yet' : 
         filterBy === 'unread' ? 'All Stories Read!' : 'No Stories Found'}
      </Text>
      <Text style={[getTextStyles('body', theme), styles.emptyMessage]}>
        {filterBy === 'favorites' ? 'Start adding stories to your favorites by tapping the heart icon.' :
         filterBy === 'unread' ? 'Great job! You\'ve read all the stories in this category.' :
         'There are no stories in this category yet.'}
      </Text>
    </View>
  );

  // Show loading state
  if (isLoading && !refreshing) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <Text style={[getTextStyles('body', theme), styles.loadingText]}>
            Loading stories...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        translucent={false}
        backgroundColor={theme.colors.neutral[50]} 
      />
      
      <View>
        <CategoryHeader
          categoryName={categoryName}
          categoryDescription={category?.description}
          categoryColor={category?.color}
          categoryIcon={category?.icon}
          storyCount={allStories.length}
          variant="featured"
          showViewAll={false}
        />
        {renderFilterSortBar()}
        
        <FlatList
          data={stories}
          renderItem={renderStoryItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContainer,
            stories.length === 0 && styles.emptyListContainer,
          ]}
        />
      </View>
    </ScreenContainer>
  );
}

export default CategoryScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },
  filterSortBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  filterLabel: {
    marginRight: 8,
    fontWeight: '600',
  },
  filterButtons: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    marginRight: 8,
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  sortButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  listContainer: {
    paddingBottom: 100,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  row: {
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  storyItem: {
    width: '48%',
    marginBottom: 16,
  },
  storyItemLeft: {
    marginRight: 8,
  },
  storyItemRight: {
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyMessage: {
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 22,
  },
});
