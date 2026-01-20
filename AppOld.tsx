/**
 * Bedtime Stories App
 * A magical React Native app for children's bedtime stories
 *
 * @format
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Simple Home Screen
function HomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.homeContainer}>
      <ScrollView style={styles.homeScrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.homeHeader}>
          <View style={styles.welcomeSection}>
            <View style={styles.avatarSmall}>
              <Text style={styles.avatarSmallText}>👤</Text>
            </View>
            <View style={styles.welcomeText}>
              <Text style={styles.welcomeBack}>Welcome back</Text>
              <Text style={styles.userName}>Emma!</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Text style={styles.notificationIcon}>🔔</Text>
            </TouchableOpacity>
          </View>
          
          {/* Search Bar */}
          <TouchableOpacity 
            style={styles.searchBar}
            onPress={() => navigation.navigate('Search')}
          >
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>Search for a story</Text>
            <View style={styles.searchButton}>
              <Text style={styles.searchButtonIcon}>🎯</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Story Categories */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>Story Categories</Text>
          <View style={styles.categoriesGrid}>
            <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#FFE5E5' }]}>
              <Text style={styles.categoryEmoji}>🦋</Text>
              <Text style={styles.categoryLabel}>Animals</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#E5F3FF' }]}>
              <Text style={styles.categoryEmoji}>🎈</Text>
              <Text style={styles.categoryLabel}>Adventure</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#F0E5FF' }]}>
              <Text style={styles.categoryEmoji}>🎭</Text>
              <Text style={styles.categoryLabel}>Magic</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryItem, { backgroundColor: '#FFF5E5' }]}>
              <Text style={styles.categoryEmoji}>😴</Text>
              <Text style={styles.categoryLabel}>Calming</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended Stories */}
        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recommendedScroll}>
            <TouchableOpacity 
              style={styles.storyCard}
              onPress={() => navigation.navigate('StoryDetail', { storyId: '1' })}
            >
              <View style={styles.storyImageContainer}>
                <View style={[styles.storyImage, { backgroundColor: '#4A5568' }]}>
                  <Text style={styles.storyImageEmoji}>🌙</Text>
                  <Text style={styles.storyImageText}>The Moon Rabbit</Text>
                </View>
                <TouchableOpacity style={styles.playButton}>
                  <Text style={styles.playButtonIcon}>▶️</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.storyCard}
              onPress={() => navigation.navigate('StoryDetail', { storyId: '2' })}
            >
              <View style={styles.storyImageContainer}>
                <View style={[styles.storyImage, { backgroundColor: '#2D3748' }]}>
                  <Text style={styles.storyImageEmoji}>🦁</Text>
                  <Text style={styles.storyImageText}>The Brave Lion</Text>
                </View>
                <TouchableOpacity style={styles.playButton}>
                  <Text style={styles.playButtonIcon}>▶️</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Redesigned Stories Screen
function StoriesScreen({ navigation }: any) {
  const mockStories = [
    { 
      id: '1', 
      title: 'The Brave Little Bunny', 
      duration: '10 mins',
      backgroundColor: '#FFE5D9',
      emoji: '🐰',
      description: 'A brave bunny goes on an adventure'
    },
    { 
      id: '2', 
      title: 'Leo the Lost Lion Cub', 
      duration: '15 mins',
      backgroundColor: '#E5F3FF',
      emoji: '🦁',
      description: 'A lion cub finds his way home'
    },
    { 
      id: '3', 
      title: 'Daisy the Dancing Dolphin', 
      duration: '12 mins',
      backgroundColor: '#F0E5FF',
      emoji: '🐬',
      description: 'A dolphin loves to dance in the waves'
    },
  ];

  return (
    <SafeAreaView style={styles.storiesContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.storiesHeader}>
          <Text style={styles.storiesTitle}>📚 Story Library</Text>
          <Text style={styles.storiesSubtitle}>Discover magical stories</Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="🔍 Search stories..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryFilter}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[
                styles.categoryButtonText,
                selectedCategory === category.id && styles.categoryButtonActiveText
              ]}>
                {category.icon} {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stories List */}
        <View style={styles.storiesContent}>
          <Text style={styles.resultsText}>
            {filteredStories.length} {filteredStories.length === 1 ? 'Story' : 'Stories'}
          </Text>

          <View style={styles.storiesGrid}>
            {filteredStories.map((story) => (
              <TouchableOpacity
                key={story.id}
                style={styles.storyCard}
                onPress={() => navigation.navigate('StoryDetail', { storyId: story.id })}
              >
                <View style={styles.storyIcon}>
                  <Text style={styles.storyIconText}>
                    {story.category === 'fairyTale' ? '🧚‍♀️' :
                      story.category === 'adventure' ? '🗺️' :
                        story.category === 'animals' ? '🐾' :
                          story.category === 'bedtime' ? '🌙' : '📖'}
                  </Text>
                </View>

                <Text style={styles.storyTitle}>{story.title}</Text>

                <View style={styles.storyMeta}>
                  <Text style={styles.storyMetaText}>👶 Ages {story.ageGroup}</Text>
                  {story.hasAudio && <Text style={styles.audioIndicator}>🎧 Audio</Text>}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Blog Screen
function BlogScreen({ navigation }: any) {
  const mockBlogs = [
    {
      id: '1',
      title: 'The Magic of Bedtime Stories: Why They Matter More Than Ever',
      excerpt: 'Discover the incredible benefits of bedtime stories for child development...',
      category: 'parenting',
      readTime: 5,
      author: 'Sarah Johnson',
    },
    {
      id: '2',
      title: 'Creating the Perfect Bedtime Routine: A Step-by-Step Guide',
      excerpt: 'Learn how to establish a calming bedtime routine that helps children...',
      category: 'sleep',
      readTime: 7,
      author: 'Dr. Michael Chen',
    },
  ];

  return (
    <SafeAreaView style={styles.storiesContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.storiesHeader}>
          <Text style={styles.storiesTitle}>📝 Parenting Blog</Text>
          <Text style={styles.storiesSubtitle}>Expert insights and tips</Text>
        </View>

        <View style={styles.storiesContent}>
          {mockBlogs.map((blog) => (
            <TouchableOpacity
              key={blog.id}
              style={styles.blogCard}
              onPress={() => navigation.navigate('BlogDetail', { blogId: blog.id })}
            >
              <View style={styles.blogIcon}>
                <Text style={styles.storyIconText}>📝</Text>
              </View>

              <View style={styles.blogContent}>
                <Text style={styles.blogTitle}>{blog.title}</Text>
                <Text style={styles.blogExcerpt} numberOfLines={2}>{blog.excerpt}</Text>

                <View style={styles.blogMeta}>
                  <Text style={styles.storyMetaText}>👤 {blog.author}</Text>
                  <Text style={styles.storyMetaText}>⏱️ {blog.readTime} min</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Favorites Screen
function FavoritesScreen() {
  const [activeTab, setActiveTab] = React.useState('stories');

  return (
    <SafeAreaView style={styles.storiesContainer}>
      <View style={styles.storiesHeader}>
        <Text style={styles.storiesTitle}>❤️ My Favorites</Text>
        <Text style={styles.storiesSubtitle}>Your saved stories and articles</Text>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'stories' && styles.activeTab]}
          onPress={() => setActiveTab('stories')}
        >
          <Text style={[styles.tabText, activeTab === 'stories' && styles.activeTabText]}>
            📚 Stories
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'articles' && styles.activeTab]}
          onPress={() => setActiveTab('articles')}
        >
          <Text style={[styles.tabText, activeTab === 'articles' && styles.activeTabText]}>
            📝 Articles
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.emptyState}>
        <Text style={styles.emptyStateIcon}>
          {activeTab === 'stories' ? '📚' : '📝'}
        </Text>
        <Text style={styles.emptyStateTitle}>No favorites yet</Text>
        <Text style={styles.emptyStateText}>
          Start exploring and save your favorite {activeTab}!
        </Text>
      </View>
    </SafeAreaView>
  );
}

// Profile Screen
function ProfileScreen({ navigation }: any) {
  const stats = [
    { label: 'Stories Read', value: '24', icon: '📚' },
    { label: 'Favorites', value: '8', icon: '❤️' },
    { label: 'Reading Time', value: '2.5h', icon: '⏱️' },
  ];

  return (
    <SafeAreaView style={styles.storiesContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.profileName}>Guest User</Text>
          <Text style={styles.profileEmail}>Welcome to Bedtime Stories!</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 Your Reading Stats</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Blog')}
          >
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>📝</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Parenting Blog</Text>
              <Text style={styles.menuSubtitle}>Expert insights and bedtime tips</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate('Settings')}
          >
            <View style={styles.menuIcon}>
              <Text style={styles.menuIconText}>⚙️</Text>
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Settings</Text>
              <Text style={styles.menuSubtitle}>App preferences and configuration</Text>
            </View>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ffffff',
              elevation: 0,
              shadowOpacity: 0,
              borderBottomWidth: 1,
              borderBottomColor: '#e5e7eb',
            },
            headerTintColor: '#374151',
            headerTitleStyle: {
              fontWeight: '600',
              fontSize: 18,
            },
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={TabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StoryDetail"
            component={StoryDetailScreen}
            options={{
              title: '📖 Story',
              headerBackTitle: 'Back'
            }}
          />
          <Stack.Screen
            name="BlogDetail"
            component={BlogDetailScreen}
            options={{
              title: '📝 Article',
              headerBackTitle: 'Back'
            }}
          />
          <Stack.Screen
            name="Blog"
            component={BlogScreen}
            options={{
              title: '📝 Blog',
              headerBackTitle: 'Back'
            }}
          />
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
            options={{
              title: '⚙️ Settings',
              headerBackTitle: 'Back'
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // Home Screen Styles
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
  },

  // Stories Screen Styles
  storiesContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  storiesHeader: {
    padding: 20,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  storiesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  storiesSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  categoryFilter: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f3f4f6',
  },
  categoryButtonActive: {
    backgroundColor: '#4A90E2',
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  categoryButtonActiveText: {
    color: '#ffffff',
  },
  storiesContent: {
    flex: 1,
    padding: 16,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  storiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  storyCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  storyIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#f3f4f6',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  storyIconText: {
    fontSize: 24,
  },
  storyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  storyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  storyMetaText: {
    fontSize: 12,
    color: '#6b7280',
  },
  audioIndicator: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '600',
  },

  // Blog Styles
  blogCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  blogIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#f3f4f6',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  blogContent: {
    flex: 1,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  blogExcerpt: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  blogMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  // Favorites Styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4A90E2',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },

  // Profile Styles
  profileHeader: {
    backgroundColor: '#ffffff',
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#4A90E2',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 32,
    color: '#ffffff',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  menuSection: {
    backgroundColor: '#ffffff',
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  menuArrow: {
    fontSize: 20,
    color: '#9ca3af',
  },

  // Story Detail Styles
  storyHeader: {
    backgroundColor: '#ffffff',
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  storyIconLarge: {
    width: 80,
    height: 80,
    backgroundColor: '#f3f4f6',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  storyIconLargeText: {
    fontSize: 40,
  },
  storyDetailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  storyDetailMeta: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  fontControls: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 12,
  },
  fontControlsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  fontSizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fontSizeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginHorizontal: 2,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  fontSizeButtonActive: {
    backgroundColor: '#4A90E2',
  },
  fontSizeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  fontSizeButtonActiveText: {
    color: '#ffffff',
  },
  storyContent: {
    backgroundColor: '#ffffff',
    padding: 24,
    marginBottom: 12,
  },
  storyText: {
    lineHeight: 28,
    color: '#1f2937',
    textAlign: 'left',
  },

  // Settings Styles
  settingsSection: {
    backgroundColor: '#ffffff',
    marginBottom: 12,
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#4A90E2',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
});

export default App;

// Story Detail Screen
function StoryDetailScreen({ route }: any) {
  const { storyId } = route.params;
  const [fontSize, setFontSize] = React.useState('medium');

  const story = {
    id: storyId,
    title: 'The Magic Forest Adventure',
    category: 'adventure',
    content: `Once upon a time, in a magical forest far, far away, there lived a brave little rabbit named Luna. Luna had the softest white fur and the brightest blue eyes you could ever imagine.

Every morning, Luna would hop through the forest, greeting all her friends - the wise old owl, the playful squirrels, and the gentle deer. But today was different. Today, Luna discovered something extraordinary.

Hidden behind a curtain of sparkling vines, Luna found a secret clearing where the trees seemed to glow with a warm, golden light. In the center of the clearing stood the most beautiful tree she had ever seen, with leaves that shimmered like stars.

As Luna approached the magical tree, she heard a soft whisper: "Welcome, brave little rabbit. You have found the Heart of the Forest. Make a wish, and it shall come true."

Luna closed her eyes and made a wish for all the forest animals to live in harmony and happiness forever. The tree's leaves began to dance in the breeze, and a shower of golden sparkles fell gently around her.

From that day forward, the forest was filled with even more joy and laughter. Luna had learned that the greatest magic comes from caring for others and making wishes that help everyone.

And they all lived happily ever after.

The End.`,
  };

  const fontSizes = [
    { id: 'small', label: 'Small', size: 14 },
    { id: 'medium', label: 'Medium', size: 16 },
    { id: 'large', label: 'Large', size: 18 },
  ];

  const getCurrentFontSize = () => {
    const currentSize = fontSizes.find(size => size.id === fontSize);
    return currentSize ? currentSize.size : 16;
  };

  return (
    <SafeAreaView style={styles.storiesContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Story Header */}
        <View style={styles.storyHeader}>
          <View style={styles.storyIconLarge}>
            <Text style={styles.storyIconLargeText}>🗺️</Text>
          </View>
          <Text style={styles.storyDetailTitle}>{story.title}</Text>
          <Text style={styles.storyDetailMeta}>✨ Adventure • 👶 Ages 5-6 • ⏱️ 8 min</Text>
        </View>

        {/* Font Size Controls */}
        <View style={styles.fontControls}>
          <Text style={styles.fontControlsTitle}>📝 Text Size</Text>
          <View style={styles.fontSizeButtons}>
            {fontSizes.map((size) => (
              <TouchableOpacity
                key={size.id}
                style={[
                  styles.fontSizeButton,
                  fontSize === size.id && styles.fontSizeButtonActive
                ]}
                onPress={() => setFontSize(size.id)}
              >
                <Text style={[
                  styles.fontSizeButtonText,
                  fontSize === size.id && styles.fontSizeButtonActiveText
                ]}>
                  {size.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Story Content */}
        <View style={styles.storyContent}>
          <Text style={[styles.storyText, { fontSize: getCurrentFontSize() }]}>
            {story.content}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Blog Detail Screen
function BlogDetailScreen({ route }: any) {
  const { blogId } = route.params;

  return (
    <SafeAreaView style={styles.storiesContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.storyHeader}>
          <View style={styles.storyIconLarge}>
            <Text style={styles.storyIconLargeText}>📝</Text>
          </View>
          <Text style={styles.storyDetailTitle}>The Magic of Bedtime Stories</Text>
          <Text style={styles.storyDetailMeta}>👨‍👩‍👧‍👦 Parenting Tips • ⏱️ 5 min read</Text>
        </View>

        <View style={styles.storyContent}>
          <Text style={styles.storyText}>
            In our fast-paced digital world, the simple act of reading a bedtime story to your child might seem old-fashioned. However, research continues to show that this timeless tradition offers incredible benefits that extend far beyond just helping children fall asleep.
            {'\n\n'}
            Bedtime stories create a special bonding time between parents and children. This quiet, intimate moment at the end of the day allows for emotional connection and helps children feel secure and loved.
            {'\n\n'}
            Regular exposure to stories significantly enhances a child's vocabulary and language skills. Children who are read to regularly tend to have larger vocabularies, better comprehension skills, and improved communication abilities.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Settings Screen
function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [darkMode, setDarkMode] = React.useState(false);

  return (
    <SafeAreaView style={styles.storiesContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.storiesHeader}>
          <Text style={styles.storiesTitle}>⚙️ Settings</Text>
          <Text style={styles.storiesSubtitle}>Customize your app experience</Text>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>🔧 General</Text>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSubtitle}>Get notified about new stories</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, notifications && styles.toggleActive]}
              onPress={() => setNotifications(!notifications)}
            >
              <View style={[styles.toggleThumb, notifications && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>Dark Mode</Text>
              <Text style={styles.settingSubtitle}>Use dark theme for reading</Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, darkMode && styles.toggleActive]}
              onPress={() => setDarkMode(!darkMode)}
            >
              <View style={[styles.toggleThumb, darkMode && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Tab Navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4A90E2',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: '🏠 Home',
        }}
      />
      <Tab.Screen
        name="Stories"
        component={StoriesScreen}
        options={{
          title: '📚 Stories',
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          title: '❤️ Favorites',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: '👤 Profile',
        }}
      />
    </Tab.Navigator>
  );
}