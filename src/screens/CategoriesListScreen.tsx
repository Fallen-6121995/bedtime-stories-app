import React, { useEffect, useState } from 'react';
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
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

// Imports
import { getCategoryTheme } from '../utils/storyThemes';
import type { Category } from '../types/story';
import { THEME, getNumColumns, getCardWidth } from '../theme/appTheme';

type RootStackParamList = {
  Category: { id: string; name: string, categoryId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface CategoryWithStats extends Category {
  storyCount: number;
  isPopular?: boolean;
}

const CategoriesListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { width } = useWindowDimensions();
  const [categories, setCategories] = useState<CategoryWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // --- RESPONSIVE LAYOUT ---
  const numColumns = getNumColumns(width);
  const gap = 16;
  const padding = 24; // Consistent with Home
  const cardWidth = getCardWidth(width, numColumns, gap, padding);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const CategoryService = (await import('../services/category/CategoryService')).default;
      const categoriesData = await CategoryService.getCategories();
      
      const transformedCategories: CategoryWithStats[] = categoriesData.map(cat => ({
        id: cat.promptKey,
        categoryId: cat.id,
        name: cat.name,
        description: cat.description || '',
        storyCount: cat.storyCount || 0,
        icon: cat.icon,
        color: cat.color,
        slug: cat.slug,
        isPopular: (cat.storyCount || 0) > 15,
      }));

      setCategories(transformedCategories);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        
        {/* --- HEADER --- */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Icon name="chevron-back" size={24} color={THEME.colors.textDark} />
          </TouchableOpacity>
          
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>All Worlds</Text>
            <Text style={styles.headerSubtitle}>
              {categories.length} magical topics
            </Text>
          </View>
        </View>

        {/* --- SEARCH CAPSULE --- */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Icon name="search" size={22} color={THEME.colors.textMedium} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories..."
              placeholderTextColor={THEME.colors.textLight}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Icon name="close-circle" size={20} color={THEME.colors.textLight} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* --- GRID --- */}
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.categoriesGrid, { gap, paddingHorizontal: padding }]}>
            {filteredCategories.map((category) => {
              const theme = getCategoryTheme(category.id);
              
              // Use API color or theme color
              const primaryColor = category.color || theme.colors[0];

              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryCard,
                    { 
                      width: cardWidth,
                      height: cardWidth * 1.25, // Slightly taller for description
                    }
                  ]}
                  onPress={() =>
                    navigation.navigate('Category', {
                      id: category.id,
                      categoryId: category.categoryId,
                      name: category.name,
                    })
                  }
                  activeOpacity={0.8}
                >
                    {/* Popular Badge */}
                    {category.isPopular && (
                      <View style={[styles.popularBadge, { backgroundColor: THEME.colors.accent }]}>
                        <Icon name="star" size={10} color="#FFF" />
                        <Text style={styles.popularBadgeText}>HOT</Text>
                      </View>
                    )}

                    <View style={styles.cardContent}>
                      {/* Icon Circle */}
                      <View style={[styles.iconCircle, { backgroundColor: primaryColor + '15' }]}>
                        <Icon 
                          name={category.icon || theme.icon} 
                          size={32} 
                          color={primaryColor} 
                        />
                      </View>

                      {/* Text Content */}
                      <View style={styles.textContainer}>
                        <Text 
                          style={styles.categoryTitle} 
                          numberOfLines={1}
                        >
                          {category.name}
                        </Text>
                        
                        {/* Optional: Show description or count */}
                        <Text style={styles.categorySubtitle}>
                          {category.storyCount} stories
                        </Text>
                      </View>

                      {/* Arrow Icon at bottom right */}
                      <View style={styles.actionIcon}>
                         <Icon name="arrow-forward-circle" size={24} color={THEME.colors.border} />
                      </View>
                    </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* --- EMPTY STATE --- */}
          {filteredCategories.length === 0 && (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                <Icon name="telescope-outline" size={64} color={THEME.colors.textLight} />
              </View>
              <Text style={styles.emptyStateTitle}>No worlds found</Text>
              <Text style={styles.emptyStateText}>
                Try searching for something else like "Space" or "Animals"
              </Text>
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

  // SEARCH
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.colors.white,
    borderRadius: THEME.borderRadius.full,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.soft,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: THEME.colors.textDark,
    marginLeft: 12,
    fontFamily: THEME.fonts.medium,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },

  // GRID
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  
  // CARD STYLING
  categoryCard: {
    marginBottom: 16,
    borderRadius: THEME.borderRadius.xl,
    backgroundColor: THEME.colors.white,
    ...THEME.shadows.card,
    overflow: 'hidden', // Ensures ripple or overflow items stay inside
  },
  cardContent: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // ICON CIRCLE (Replaces full gradient)
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  
  // TEXT
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  categoryTitle: {
    fontSize: 16,
    color: THEME.colors.textDark,
    fontFamily: THEME.fonts.heading,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  categorySubtitle: {
    fontSize: 12,
    color: THEME.colors.textLight,
    fontFamily: THEME.fonts.medium,
  },

  // DECORATIONS
  actionIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    opacity: 0.5,
  },
  popularBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    zIndex: 1,
  },
  popularBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // EMPTY STATE
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  },
  emptyStateText: {
    fontSize: 15,
    color: THEME.colors.textMedium,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default CategoriesListScreen;