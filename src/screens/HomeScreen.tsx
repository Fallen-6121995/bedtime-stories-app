import React, { useState, useEffect, useCallback } from 'react';
import {
  FlatList,
  Image,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Pressable,
  TextInput,
  RefreshControl,
  Alert,
  Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

import ScreenContainer from '../components/ScreenContainer';
import StoryCard from '../components/StoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import CategoryHeader from '../components/CategoryHeader';

import { useAuth } from '../hooks/useAuth';
import { useStories } from '../hooks/useStories';
import { useThemeContext } from '../context/ThemeContext';
import { getTextStyles } from '../utils/theme';
import storiesData from '../common/StoriesData';
// import ellipseImage from '../assets/Ellipse.png'; // Commented out - asset not found
import { Story, StoryCategory } from '../types';

const { width } = Dimensions.get('window');

function HomeScreen({ navigation }: any) {
  const { user, isAuthenticated } = useAuth();
  const { stories, favoriteStories, recentStories, isLoading, error, toggleFavorite, markAsRead, searchStories, clearError } = useStories();
  const { theme } = useThemeContext();
  const isDarkMode = useColorScheme() === 'dark';

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Story[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Get personalized welcome message
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = 'Hello';

    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 17) greeting = 'Good Afternoon';
    else greeting = 'Good Evening';

    const name = user?.name || 'Little Reader';
    return { greeting, name };
  };

  const { greeting, name } = getWelcomeMessage();

  // Handle search functionality
  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchStories(query);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
      Alert.alert('Search Error', 'Unable to search stories. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [searchStories]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

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

  // Handle category view all
  const handleViewAll = useCallback((categoryId: string, categoryName: string) => {
    navigation.navigate('Category', { categoryId, categoryName });
  }, [navigation]);

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      clearError();
      // Reload stories data would go here
      await new Promise<void>(resolve => setTimeout(() => resolve(), 1000)); // Simulate refresh
    } catch (err) {
      console.error('Refresh error:', err);
    } finally {
      setRefreshing(false);
    }
  }, [clearError]);

  // Toggle search visibility
  const toggleSearch = useCallback(() => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [showSearch]);

  // Render search bar
  const renderSearchBar = () => (
    <View style={[styles.searchBarContainer, { backgroundColor: theme.colors.neutral[50] }]}>
      <Icon name="search" size={20} color={theme.colors.neutral[400]} style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, { color: theme.colors.neutral[800] }]}
        placeholder="Search for stories..."
        placeholderTextColor={theme.colors.neutral[400]}
        value={searchQuery}
        onChangeText={setSearchQuery}
        autoFocus={showSearch}
      />
      {searchQuery.length > 0 && (
        <Pressable onPress={() => setSearchQuery('')} style={styles.clearButton}>
          <Icon name="x" size={20} color={theme.colors.neutral[400]} />
        </Pressable>
      )}
    </View>
  );

  // Render search results
  const renderSearchResults = () => (
    <View style={styles.searchResultsContainer}>
      <Text style={[getTextStyles('h3', theme, isDarkMode), styles.searchResultsTitle]}>
        Search Results ({searchResults.length})
      </Text>
      {isSearching ? (
        <LoadingSpinner size="small" />
      ) : searchResults.length > 0 ? (
        <FlatList
          data={searchResults}
          horizontal
          keyExtractor={(story) => story.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: story }) => (
            <StoryCard
              story={story}
              onPress={handleStoryPress}
              variant="horizontal"
              showFavorite={true}
              onFavoritePress={handleFavoritePress}
            />
          )}
          contentContainerStyle={styles.horizontalList}
        />
      ) : (
        <Text style={[getTextStyles('body', theme, isDarkMode), styles.noResultsText]}>
          No stories found for "{searchQuery}"
        </Text>
      )}
    </View>
  );

  // Render category section
  const renderCategorySection = ({ section }: { section: any }) => {
    const category = storiesData.categories.find(cat => cat.name === section.title);
    if (!category) return null;

    return (
      <CategoryHeader
        categoryName={section.title}
        categoryDescription={category.description}
        categoryColor={category.color}
        categoryIcon={category.icon}
        storyCount={category.stories.length}
        onViewAll={() => handleViewAll(category.id, section.title)}
        variant="default"
      />
    );
  };

  // Render story list for category
  const renderCategoryStories = ({ item }: { item: Story[] }) => (
    <FlatList
      data={item}
      horizontal
      keyExtractor={(story) => story.id}
      showsHorizontalScrollIndicator={false}
      renderItem={({ item: story }) => (
        <StoryCard
          story={story}
          onPress={handleStoryPress}
          variant="horizontal"
          showFavorite={true}
          onFavoritePress={handleFavoritePress}
        />
      )}
      contentContainerStyle={styles.horizontalList}
    />
  );

  // Show loading state
  if (isLoading && !refreshing) {
    return (
      <ScreenContainer>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="large" />
          <Text style={[getTextStyles('body', theme, isDarkMode), styles.loadingText]}>
            Loading your stories...
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  // Show error state
  if (error && !refreshing) {
    return (
      <ScreenContainer>
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={theme.colors.error} />
          <Text style={[getTextStyles('h3', theme, isDarkMode), styles.errorTitle]}>
            Oops! Something went wrong
          </Text>
          <Text style={[getTextStyles('body', theme, isDarkMode), styles.errorMessage]}>
            {error?.toString() || 'An unexpected error occurred'}
          </Text>
          <Pressable
            style={[styles.retryButton, { backgroundColor: theme.colors.primary[500] }]}
            onPress={handleRefresh}
          >
            <Text style={[getTextStyles('button', theme, isDarkMode), { color: '#FFFFFF' }]}>
              Try Again
            </Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        translucent={true}
        backgroundColor="transparent"
      />



      {/* Background decoration */}
      {/* <Image
        source={ellipseImage}
        style={styles.ellipseImg}
        resizeMode="cover"
      /> */}

      <SectionList
        sections={[
          // Add search results section if searching
          ...(searchQuery.trim() ? [{ title: 'Search Results', data: [searchResults] }] : []),
          // Add recent stories section if authenticated and has recent stories
          ...(isAuthenticated && recentStories.length > 0 ? [{ title: 'Continue Reading', data: [recentStories] }] : []),
          // Add favorite stories section if authenticated and has favorites
          ...(isAuthenticated && favoriteStories.length > 0 ? [{ title: 'Your Favorites', data: [favoriteStories] }] : []),
          // Add category sections
          ...storiesData.categories.map(cat => ({
            title: cat.name,
            data: [cat.stories]
          }))
        ]}
        keyExtractor={(item, index) => `${index}`}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary[500]]}
            tintColor={theme.colors.primary[500]}
          />
        }
        ListHeaderComponent={() => (
          <View style={styles.headerContainer}>
            {/* Welcome Section */}
            <View style={styles.welcomeContainer}>
              <View style={styles.welcomeTextContainer}>
                <Text style={[getTextStyles('h2', theme, isDarkMode), { color: theme.colors.primary[500] }]}>
                  {greeting},
                </Text>
                <Text style={[getTextStyles('h1', theme, isDarkMode), styles.userName]}>
                  {name}!
                </Text>
              </View>
              <Pressable onPress={toggleSearch} style={styles.searchToggle}>
                <Icon
                  name={showSearch ? "x" : "search"}
                  size={24}
                  color={theme.colors.neutral[600]}
                />
              </Pressable>
            </View>

            {/* Search Bar */}
            {showSearch && renderSearchBar()}

            {/* Welcome Message */}
            <Text style={[getTextStyles('body', theme, isDarkMode), styles.welcomeSubtext]}>
              {isAuthenticated ? "Ready for another adventure?" : "Discover magical stories"}
            </Text>
          </View>
        )}
        renderSectionHeader={({ section }) => {
          if (section.title === 'Search Results') {
            return searchQuery.trim() ? renderSearchResults() : null;
          }
          return renderCategorySection({ section });
        }}
        renderItem={({ item, section }) => {
          if (section.title === 'Search Results') {
            return null; // Handled in header
          }
          return renderCategoryStories({ item });
        }}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 100,
  },
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorTitle: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  ellipseImg: {
    position: 'absolute',
    top: -5,
    right: -13,
    width: 180,
    height: 180,
    zIndex: 0,
    opacity: 0.6,
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    zIndex: 1,
  },
  welcomeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  userName: {
    marginTop: 4,
  },
  welcomeSubtext: {
    marginTop: 8,
    opacity: 0.8,
  },
  searchToggle: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
  },
  searchResultsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchResultsTitle: {
    marginBottom: 16,
  },
  noResultsText: {
    textAlign: 'center',
    opacity: 0.6,
    paddingVertical: 20,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
});

export default HomeScreen;