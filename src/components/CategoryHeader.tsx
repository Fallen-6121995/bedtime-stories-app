import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useThemeContext } from '../context/ThemeContext';
import { getTextStyles } from '../utils/theme';
import { BaseComponentProps } from '../types';

const { width } = Dimensions.get('window');

interface CategoryHeaderProps extends BaseComponentProps {
  categoryName: string;
  categoryDescription?: string;
  categoryColor?: string;
  categoryIcon?: string;
  storyCount: number;
  onViewAll?: () => void;
  showViewAll?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

const CategoryHeader: React.FC<CategoryHeaderProps> = ({
  categoryName,
  categoryDescription,
  categoryColor,
  categoryIcon = 'book',
  storyCount,
  onViewAll,
  showViewAll = true,
  variant = 'default',
  style,
  testID,
}) => {
  const { theme } = useThemeContext();
  
  const primaryColor = categoryColor || theme.colors.primary[500];
  const gradientColors = [
    primaryColor,
    `${primaryColor}CC`, // Add transparency
    `${primaryColor}80`,
  ];

  const renderCompactHeader = () => (
    <View style={[styles.compactContainer, style]} testID={testID}>
      <View style={styles.compactContent}>
        <View style={styles.compactTitleContainer}>
          <View style={[styles.iconContainer, { backgroundColor: primaryColor }]}>
            <Icon name={categoryIcon} size={20} color="#FFFFFF" />
          </View>
          <View style={styles.compactTextContainer}>
            <Text style={[getTextStyles('h4', theme), styles.compactTitle]}>
              {categoryName}
            </Text>
            <Text style={[getTextStyles('caption', theme), styles.storyCount]}>
              {storyCount} {storyCount === 1 ? 'story' : 'stories'}
            </Text>
          </View>
        </View>
        {showViewAll && onViewAll && (
          <Pressable 
            onPress={onViewAll}
            style={styles.compactViewAllButton}
            accessibilityRole="button"
            accessibilityLabel={`View all ${categoryName} stories`}
          >
            <Text style={[getTextStyles('body', theme), { color: primaryColor }]}>
              View All
            </Text>
            <Icon name="chevron-right" size={16} color={primaryColor} />
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderFeaturedHeader = () => (
    <View style={[styles.featuredContainer, style]} testID={testID}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featuredGradient}
      >
        <View style={styles.featuredContent}>
          <View style={styles.featuredIconContainer}>
            <Icon name={categoryIcon} size={32} color="#FFFFFF" />
          </View>
          <Text style={[getTextStyles('h2', theme), styles.featuredTitle]}>
            {categoryName}
          </Text>
          {categoryDescription && (
            <Text style={[getTextStyles('body', theme), styles.featuredDescription]}>
              {categoryDescription}
            </Text>
          )}
          <View style={styles.featuredStats}>
            <View style={styles.statItem}>
              <Icon name="library-books" size={16} color="#FFFFFF" />
              <Text style={styles.statText}>
                {storyCount} {storyCount === 1 ? 'Story' : 'Stories'}
              </Text>
            </View>
          </View>
          {showViewAll && onViewAll && (
            <Pressable 
              onPress={onViewAll}
              style={styles.featuredViewAllButton}
              accessibilityRole="button"
              accessibilityLabel={`View all ${categoryName} stories`}
            >
              <Text style={[getTextStyles('button', theme), styles.featuredViewAllText]}>
                Explore All Stories
              </Text>
              <Icon name="arrow-forward" size={20} color="#FFFFFF" />
            </Pressable>
          )}
        </View>
      </LinearGradient>
    </View>
  );

  const renderDefaultHeader = () => (
    <View style={[styles.defaultContainer, style]} testID={testID}>
      <View style={styles.defaultHeader}>
        <View style={styles.defaultTitleContainer}>
          <View style={[styles.defaultIconContainer, { backgroundColor: primaryColor }]}>
            <Icon name={categoryIcon} size={24} color="#FFFFFF" />
          </View>
          <View style={styles.defaultTextContainer}>
            <Text style={[getTextStyles('h3', theme), styles.defaultTitle]}>
              {categoryName}
            </Text>
            <Text style={[getTextStyles('caption', theme), styles.defaultStoryCount]}>
              {storyCount} {storyCount === 1 ? 'story' : 'stories'}
            </Text>
          </View>
        </View>
        {showViewAll && onViewAll && (
          <Pressable 
            onPress={onViewAll}
            style={styles.defaultViewAllButton}
            accessibilityRole="button"
            accessibilityLabel={`View all ${categoryName} stories`}
          >
            <Text style={[getTextStyles('body', theme), { color: primaryColor }]}>
              View All
            </Text>
            <Icon name="chevron-right" size={16} color={primaryColor} />
          </Pressable>
        )}
      </View>
      {categoryDescription && variant === 'default' && (
        <Text style={[getTextStyles('body', theme), styles.defaultDescription]}>
          {categoryDescription}
        </Text>
      )}
    </View>
  );

  switch (variant) {
    case 'compact':
      return renderCompactHeader();
    case 'featured':
      return renderFeaturedHeader();
    default:
      return renderDefaultHeader();
  }
};

export default CategoryHeader;

const styles = StyleSheet.create({
  // Compact variant styles
  compactContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  compactContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  compactTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  compactTitle: {
    marginBottom: 2,
  },
  compactViewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  // Featured variant styles
  featuredContainer: {
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  featuredGradient: {
    padding: 24,
  },
  featuredContent: {
    alignItems: 'center',
  },
  featuredIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  featuredTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuredDescription: {
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    marginBottom: 16,
    lineHeight: 22,
  },
  featuredStats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  featuredViewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  featuredViewAllText: {
    color: '#FFFFFF',
    marginRight: 8,
    fontWeight: '600',
  },

  // Default variant styles
  defaultContainer: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  defaultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  defaultTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  defaultIconContainer: {
    borderRadius: 12,
    padding: 8,
  },
  defaultTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  defaultTitle: {
    marginBottom: 2,
  },
  defaultStoryCount: {
    opacity: 0.7,
  },
  defaultDescription: {
    opacity: 0.8,
    lineHeight: 20,
    marginTop: 4,
  },
  defaultViewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },

  // Shared styles
  iconContainer: {
    borderRadius: 10,
    padding: 6,
  },
  storyCount: {
    opacity: 0.7,
  },
});