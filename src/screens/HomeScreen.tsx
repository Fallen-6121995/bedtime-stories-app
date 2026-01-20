import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Imports from your project structure
import { getCategoryTheme } from '../utils/storyThemes';
import UserManager from '../services/storage/UserManager';
import { THEME, getNumColumns, getCardWidth } from '../theme/appTheme';

// --- TYPES ---
type Story = {
  id: string;
  title: string;
  subtitle?: string;
  duration?: string; // e.g., "5 min"
  category: string;
  tags?: string[];
  isPremium?: boolean;
};

type Category = {
  id: string;
  categoryId: string;
  name: string;
  storyCount: number;
  icon?: string;
  color?: string;
  slug?: string;
};

type RootStackParamList = {
  StoryDetail: { id: string };
  Category: { id: string; name: string; categoryId: string };
  AllCategories: undefined;
};

// --- HELPER COMPONENT: SECTION HEADER ---
const SectionHeader = ({ title, onPress }: { title: string; onPress?: () => void }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {onPress && (
      <TouchableOpacity onPress={onPress} activeOpacity={0.6}>
        <Text style={styles.viewAllText}>See All</Text>
      </TouchableOpacity>
    )}
  </View>
);

const HomeScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredStories, setFeaturedStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Friend');
  
  // Animations
  const scrollY = useRef(new Animated.Value(0)).current;

  // Responsive Layout Calcs
  const isTablet = width > 600;
  const numColumns = getNumColumns(width);
  const gap = 16;
  const padding = 24; // slightly more padding for modern look
  const categoryCardWidth = getCardWidth(width, numColumns, gap, padding);
  
  // Featured Card Width (Carousel)
  const featuredCardWidth = isTablet ? width * 0.5 : width * 0.75;

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadUserName();
    }, [])
  );

  const loadUserName = async () => {
    try {
      const user = await UserManager.getUser();
      if (user) {
        const firstName = user.name?.split(' ')[0] || (user.isGuest ? 'Guest' : 'Friend');
        setUserName(firstName);
      }
    } catch (e) { console.log(e); }
  };

  const fetchData = async () => {
    try {
      // 1. Fetch Categories
      const CategoryService = (await import('../services/category/CategoryService')).default;
      const categoriesData = await CategoryService.getCategories();
      
      const transformedCategories: Category[] = categoriesData.map((cat: any) => ({
        id: cat.promptKey,
        categoryId: cat.id,
        name: cat.name,
        storyCount: cat.storyCount || 0,
        icon: cat.icon,
        color: cat.color,
      }));

      // 2. Mock/Fetch Featured Stories
      // Note: Replace this with your actual Service call when backend is ready
      // For now, I'm creating dummy data that looks good
      const mockFeatured: Story[] = [
        { id: '1', title: 'The Moon\'s Lullaby', subtitle: 'Bedtime Adventure', duration: '8 min', category: 'sleep', tags: ['calm'] },
        { id: '2', title: 'Dragon\'s First Fire', subtitle: 'Courage & Friendship', duration: '5 min', category: 'adventure', tags: ['fantasy'] },
        { id: '3', title: 'The Busy Bee', subtitle: 'Learning about Nature', duration: '4 min', category: 'nature', tags: ['learning'] },
      ];

      setCategories(transformedCategories);
      setFeaturedStories(mockFeatured);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning,';
    if (hour < 17) return 'Good Afternoon,';
    return 'Good Evening,';
  };

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
        
        {/* --- CUSTOM HEADER --- */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.userNameText}>{userName} 👋</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={{ uri: 'https://ui-avatars.com/api/?name=' + userName + '&background=8B5CF6&color=fff' }} 
              style={styles.profileImage} 
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
          scrollEventThrottle={16}
        >
          
          {/* --- SEARCH CAPSULE --- */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Icon name="search" size={22} color={THEME.colors.textMedium} />
              <TextInput
                style={styles.searchInput}
                placeholder="What do you want to read?"
                placeholderTextColor={THEME.colors.textLight}
              />
              <View style={styles.micButton}>
                 <Icon name="mic" size={18} color={THEME.colors.primary} />
              </View>
            </View>
          </View>

          {/* --- FEATURED STORIES (HORIZONTAL SCROLL) --- */}
          {featuredStories.length > 0 && (
            <View style={styles.sectionContainer}>
              <SectionHeader title="Featured Stories" />
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredScrollContent}
                snapToInterval={featuredCardWidth + 16} // Width + Margin
                decelerationRate="fast"
              >
                {featuredStories.map((story, index) => {
                  // Alternate gradients for visual interest
                  const gradient = index % 2 === 0 ? THEME.gradients.primary : THEME.gradients.ocean;
                  
                  return (
                    <TouchableOpacity
                      key={story.id}
                      style={[
                        styles.featuredCard,
                        { width: featuredCardWidth },
                        // Add left margin to first item only
                        index === 0 ? { marginLeft: padding } : {}
                      ]}
                      onPress={() => navigation.navigate('StoryDetail', { id: story.id })}
                      activeOpacity={0.9}
                    >
                      <LinearGradient
                        colors={gradient}
                        style={styles.featuredGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        {/* Decorative Watermark Icon */}
                        <Icon name="book" size={120} color="rgba(255,255,255,0.1)" style={styles.watermarkIcon} />
                        
                        <View style={styles.featuredBadgeContainer}>
                           <View style={styles.glassBadge}>
                             <Text style={styles.glassBadgeText}>New</Text>
                           </View>
                        </View>

                        <View style={styles.featuredTextContainer}>
                          <Text style={styles.featuredTitle} numberOfLines={2}>{story.title}</Text>
                          <Text style={styles.featuredSubtitle} numberOfLines={1}>{story.subtitle}</Text>
                          
                          <View style={styles.featuredFooter}>
                             <View style={styles.durationTag}>
                                <Icon name="time-outline" size={12} color={THEME.colors.white} />
                                <Text style={styles.durationText}>{story.duration}</Text>
                             </View>
                             <View style={styles.playCircle}>
                                <Icon name="play" size={16} color={gradient[1]} />
                             </View>
                          </View>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* --- CATEGORIES GRID --- */}
          <View style={styles.sectionContainer}>
            <SectionHeader 
              title="Explore Worlds" 
              onPress={() => navigation.navigate('AllCategories')} 
            />
            
            <View style={[styles.gridContainer, { paddingHorizontal: padding, gap }]}>
              {categories.slice(0, 6).map((category) => { // Only show top 6
                const theme = getCategoryTheme(category.id);
                // Use API color if available, else theme
                const colors = category.color 
                  ? [category.color, category.color] // simple, or generate a gradient function
                  : theme.colors;
                
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryCard,
                      { width: categoryCardWidth, height: categoryCardWidth * 1.2 }
                    ]}
                    onPress={() => navigation.navigate('Category', {
                      id: category.id,
                      categoryId: category.categoryId,
                      name: category.name
                    })}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.categoryCardInner, { backgroundColor: THEME.colors.cardBg }]}>
                        {/* Icon Background Circle */}
                        <View style={[styles.iconCircle, { backgroundColor: colors[0] + '15' }]}>
                           {/* If you have API icons use them, otherwise theme icons */}
                           <Icon name={theme.icon} size={32} color={colors[0]} />
                        </View>
                        
                        <Text style={styles.categoryName} numberOfLines={1}>{category.name}</Text>
                        <Text style={styles.categoryCount}>{category.storyCount} stories</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          
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
  scrollView: {
    flex: 1,
  },

  // HEADER
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: THEME.colors.background,
  },
  greetingText: {
    fontSize: 14,
    color: THEME.colors.textMedium,
    fontFamily: THEME.fonts.medium,
  },
  userNameText: {
    fontSize: 22,
    color: THEME.colors.textDark,
    fontFamily: THEME.fonts.heading,
    fontWeight: '800',
  },
  profileButton: {
    padding: 2,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: THEME.colors.primary,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  // SEARCH
  searchContainer: {
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: THEME.borderRadius.xl,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.soft,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: THEME.colors.textDark,
    fontFamily: THEME.fonts.medium,
  },
  micButton: {
    backgroundColor: THEME.colors.inputBg,
    padding: 8,
    borderRadius: 12,
  },

  // HEADERS
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: THEME.colors.textDark,
    fontFamily: THEME.fonts.heading,
    fontWeight: '700',
  },
  viewAllText: {
    fontSize: 14,
    color: THEME.colors.primary,
    fontFamily: THEME.fonts.medium,
    fontWeight: '600',
  },

  // FEATURED CARDS
  featuredScrollContent: {
    paddingRight: 24, // End padding
  },
  featuredCard: {
    marginRight: 16,
    height: 220,
    borderRadius: THEME.borderRadius.xl,
    overflow: 'hidden',
    ...THEME.shadows.glow(THEME.colors.primary), // Dynamic glow based on primary
  },
  featuredGradient: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
    position: 'relative',
  },
  watermarkIcon: {
    position: 'absolute',
    right: -20,
    bottom: -20,
    transform: [{ rotate: '-15deg' }],
  },
  featuredBadgeContainer: {
    flexDirection: 'row',
  },
  glassBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.25)', // Glass effect
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  glassBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  featuredTextContainer: {
    zIndex: 1,
  },
  featuredTitle: {
    fontSize: 22,
    color: 'white',
    fontFamily: THEME.fonts.heading,
    fontWeight: '800',
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  featuredSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 12,
  },
  featuredFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  durationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  playCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // CATEGORY GRID
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryCard: {
    marginBottom: 16,
    borderRadius: THEME.borderRadius.xl,
    // Modern card styling: White bg with soft shadow
    backgroundColor: THEME.colors.white,
    ...THEME.shadows.card,
  },
  categoryCardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: THEME.borderRadius.xl,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 15,
    color: THEME.colors.textDark,
    fontFamily: THEME.fonts.heading,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: THEME.colors.textLight,
    fontFamily: THEME.fonts.medium,
  },
});

export default HomeScreen;