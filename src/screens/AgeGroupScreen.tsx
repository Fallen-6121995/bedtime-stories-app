import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { THEME } from '../theme/appTheme';

// Define the navigation types locally
type RootStackParamList = {
  AgeGroup: { ageGroup: string };
  StoryDetail: { storyId: string };
};

type AgeGroupRouteProp = RouteProp<RootStackParamList, 'AgeGroup'>;
type AgeGroupNavigationProp = StackNavigationProp<RootStackParamList, 'AgeGroup'>;

const AgeGroupScreen: React.FC = () => {
    const route = useRoute<AgeGroupRouteProp>();
    const navigation = useNavigation<AgeGroupNavigationProp>();
    const { ageGroup } = route.params;

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('newest');

    const ageGroupInfo = {
        '3-4': {
            icon: '👶',
            title: '3-4 Years',
            description: 'Simple stories with basic concepts, bright characters, and gentle themes',
            characteristics: ['Short attention span', 'Love repetition', 'Simple vocabulary', 'Colorful imagery'],
            color: '#f59e0b',
        },
        '5-6': {
            icon: '🧒',
            title: '5-6 Years',
            description: 'More complex stories with problem-solving and friendship themes',
            characteristics: ['Longer stories', 'Cause and effect', 'Social situations', 'Beginning readers'],
            color: '#10b981',
        },
        '7-8': {
            icon: '👦',
            title: '7-8 Years',
            description: 'Adventure stories with deeper themes and character development',
            characteristics: ['Complex plots', 'Moral lessons', 'Independent reading', 'Detailed descriptions'],
            color: '#6366f1',
        },
    };

    const categories = [
        { id: 'all', name: 'All Categories', icon: '📚' },
        { id: 'fairyTale', name: 'Fairy Tales', icon: '🧚‍♀️' },
        { id: 'adventure', name: 'Adventure', icon: '🗺️' },
        { id: 'animals', name: 'Animals', icon: '🐾' },
        { id: 'bedtime', name: 'Bedtime', icon: '🌙' },
        { id: 'friendship', name: 'Friendship', icon: '🤝' },
    ];

    const mockStories = [
        { id: '1', title: 'The Magic Forest Adventure', category: 'adventure', hasAudio: true, rating: 4.8 },
        { id: '2', title: 'Princess and the Dragon', category: 'fairyTale', hasAudio: false, rating: 4.6 },
        { id: '3', title: 'Friendly Animals Farm', category: 'animals', hasAudio: true, rating: 4.9 },
        { id: '4', title: 'Sleepy Moon Story', category: 'bedtime', hasAudio: true, rating: 4.7 },
        { id: '5', title: 'Best Friends Forever', category: 'friendship', hasAudio: false, rating: 4.5 },
        { id: '6', title: 'The Brave Little Mouse', category: 'animals', hasAudio: true, rating: 4.8 },
    ];

    const currentAgeGroup = ageGroupInfo[ageGroup as keyof typeof ageGroupInfo];

    const filteredStories = mockStories.filter(story => {
        return selectedCategory === 'all' || story.category === selectedCategory;
    });

    const sortedStories = [...filteredStories].sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return b.rating - a.rating;
            case 'alphabetical':
                return a.title.localeCompare(b.title);
            case 'newest':
            default:
                return 0;
        }
    });

    const handleStoryPress = (storyId: string) => {
        navigation.navigate('StoryDetail', { storyId });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Age Group Header */}
                <View style={[styles.ageGroupHeader, { backgroundColor: currentAgeGroup?.color + '20' }]}>
                    <View style={styles.ageGroupIconContainer}>
                        <Text style={styles.ageGroupIcon}>{currentAgeGroup?.icon}</Text>
                    </View>
                    <Text style={styles.ageGroupTitle}>{currentAgeGroup?.title}</Text>
                    <Text style={styles.ageGroupDescription}>{currentAgeGroup?.description}</Text>
                </View>

                {/* Age Group Characteristics */}
                <View style={styles.characteristicsContainer}>
                    <Text style={styles.characteristicsTitle}>🎯 Perfect For This Age</Text>
                    <View style={styles.characteristicsList}>
                        {currentAgeGroup?.characteristics.map((characteristic, index) => (
                            <View key={index} style={styles.characteristicItem}>
                                <Text style={styles.characteristicBullet}>✓</Text>
                                <Text style={styles.characteristicText}>{characteristic}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Filters */}
                <View style={styles.filtersContainer}>
                    {/* Category Filter */}
                    <View style={styles.filterSection}>
                        <Text style={styles.filterTitle}>📖 Categories</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.filterButtons}>
                                {categories.map((category) => (
                                    <TouchableOpacity
                                        key={category.id}
                                        style={[
                                            styles.filterButton,
                                            selectedCategory === category.id && styles.filterButtonActive
                                        ]}
                                        onPress={() => setSelectedCategory(category.id)}
                                    >
                                        <Text style={[
                                            styles.filterButtonText,
                                            selectedCategory === category.id && styles.filterButtonActiveText
                                        ]}>
                                            {category.icon} {category.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    {/* Sort Options */}
                    <View style={styles.filterSection}>
                        <Text style={styles.filterTitle}>🔄 Sort By</Text>
                        <View style={styles.sortButtons}>
                            {[
                                { id: 'newest', label: 'Newest' },
                                { id: 'rating', label: 'Highest Rated' },
                                { id: 'alphabetical', label: 'A to Z' },
                            ].map((option) => (
                                <TouchableOpacity
                                    key={option.id}
                                    style={[
                                        styles.sortButton,
                                        sortBy === option.id && styles.sortButtonActive
                                    ]}
                                    onPress={() => setSortBy(option.id)}
                                >
                                    <Text style={[
                                        styles.sortButtonText,
                                        sortBy === option.id && styles.sortButtonActiveText
                                    ]}>
                                        {option.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Stories */}
                <View style={styles.storiesContainer}>
                    <Text style={styles.storiesTitle}>
                        📚 {sortedStories.length} Age-Appropriate {sortedStories.length === 1 ? 'Story' : 'Stories'}
                    </Text>

                    <View style={styles.storiesGrid}>
                        {sortedStories.map((story) => (
                            <TouchableOpacity
                                key={story.id}
                                style={styles.storyCard}
                                onPress={() => handleStoryPress(story.id)}
                            >
                                <View style={styles.storyCardIcon}>
                                    <Text style={styles.storyCardIconText}>
                                        {story.category === 'fairyTale' ? '🧚‍♀️' :
                                            story.category === 'adventure' ? '🗺️' :
                                                story.category === 'animals' ? '🐾' :
                                                    story.category === 'bedtime' ? '🌙' :
                                                        story.category === 'friendship' ? '🤝' : '📖'}
                                    </Text>
                                </View>

                                <Text style={styles.storyCardTitle}>{story.title}</Text>

                                <View style={styles.storyCardMeta}>
                                    <Text style={styles.storyCardCategory}>
                                        ✨ {categories.find(c => c.id === story.category)?.name || story.category}
                                    </Text>
                                    <View style={styles.storyCardRating}>
                                        <Text style={styles.storyCardRatingText}>⭐ {story.rating}</Text>
                                    </View>
                                </View>

                                {story.hasAudio && (
                                    <View style={styles.audioIndicator}>
                                        <Text style={styles.audioIndicatorText}>🎧 Audio Available</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {sortedStories.length === 0 && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateIcon}>{currentAgeGroup?.icon}</Text>
                            <Text style={styles.emptyStateTitle}>No stories found</Text>
                            <Text style={styles.emptyStateText}>
                                Try selecting a different category or check back later for new stories
                            </Text>
                        </View>
                    )}
                </View>

                {/* Other Age Groups */}
                <View style={styles.otherAgeGroupsContainer}>
                    <Text style={styles.otherAgeGroupsTitle}>👶 Explore Other Age Groups</Text>
                    <View style={styles.otherAgeGroupsGrid}>
                        {Object.entries(ageGroupInfo)
                            .filter(([age]) => age !== ageGroup)
                            .map(([age, info]) => (
                                <TouchableOpacity
                                    key={age}
                                    style={styles.otherAgeGroupCard}
                                    onPress={() => navigation.replace('AgeGroup', { ageGroup: age })}
                                >
                                    <Text style={styles.otherAgeGroupIcon}>{info.icon}</Text>
                                    <Text style={styles.otherAgeGroupTitle}>{info.title}</Text>
                                    <Text style={styles.otherAgeGroupDescription} numberOfLines={2}>
                                        {info.description}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                    </View>
                </View>

                {/* Tips for Parents */}
                <View style={styles.tipsContainer}>
                    <Text style={styles.tipsTitle}>💡 Tips for Ages {ageGroup}</Text>
                    <View style={styles.tipsList}>
                        {ageGroup === '3-4' && [
                            'Read with animated voices and expressions',
                            'Ask simple questions about the story',
                            'Let them turn the pages',
                            'Repeat favorite stories often',
                        ].map((tip, index) => (
                            <View key={index} style={styles.tipItem}>
                                <Text style={styles.tipBullet}>💡</Text>
                                <Text style={styles.tipText}>{tip}</Text>
                            </View>
                        ))}

                        {ageGroup === '5-6' && [
                            'Encourage predictions about what happens next',
                            'Discuss characters\' feelings and motivations',
                            'Connect stories to real-life experiences',
                            'Let them retell the story in their own words',
                        ].map((tip, index) => (
                            <View key={index} style={styles.tipItem}>
                                <Text style={styles.tipBullet}>💡</Text>
                                <Text style={styles.tipText}>{tip}</Text>
                            </View>
                        ))}

                        {ageGroup === '7-8' && [
                            'Discuss the moral or lesson of the story',
                            'Ask about character development and growth',
                            'Encourage independent reading time',
                            'Explore different genres and themes',
                        ].map((tip, index) => (
                            <View key={index} style={styles.tipItem}>
                                <Text style={styles.tipBullet}>💡</Text>
                                <Text style={styles.tipText}>{tip}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.colors.background,
    },
    scrollView: {
        flex: 1,
    },
    ageGroupHeader: {
        padding: 24,
        alignItems: 'center',
        marginBottom: 12,
    },
    ageGroupIconContainer: {
        width: 80,
        height: 80,
        backgroundColor: THEME.colors.white,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        ...THEME.shadows.card,
    },
    ageGroupIcon: {
        fontSize: 40,
    },
    ageGroupTitle: {
        fontSize: 28,
        fontWeight: '800',
        color: THEME.colors.textDark,
        marginBottom: 8,
        fontFamily: THEME.fonts.heading,
    },
    ageGroupDescription: {
        fontSize: 16,
        color: THEME.colors.textMedium,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    characteristicsContainer: {
        backgroundColor: THEME.colors.white,
        padding: 20,
        marginBottom: 12,
    },
    characteristicsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: THEME.colors.textDark,
        marginBottom: 16,
        fontFamily: THEME.fonts.heading,
    },
    characteristicsList: {
        gap: 12,
    },
    characteristicItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    characteristicBullet: {
        fontSize: 16,
        color: THEME.colors.primary,
        marginRight: 12,
        fontWeight: '700',
    },
    characteristicText: {
        fontSize: 16,
        color: THEME.colors.textDark,
        flex: 1,
    },
    filtersContainer: {
        backgroundColor: THEME.colors.white,
        padding: 16,
        marginBottom: 12,
    },
    filterSection: {
        marginBottom: 16,
    },
    filterTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: THEME.colors.textDark,
        marginBottom: 8,
        fontFamily: THEME.fonts.heading,
    },
    filterButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: THEME.borderRadius.full,
        backgroundColor: THEME.colors.inputBg,
        borderWidth: 1,
        borderColor: THEME.colors.border,
    },
    filterButtonActive: {
        backgroundColor: THEME.colors.primary,
        borderColor: THEME.colors.primary,
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: THEME.colors.textMedium,
    },
    filterButtonActiveText: {
        color: THEME.colors.white,
    },
    sortButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    sortButton: {
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: THEME.borderRadius.m,
        backgroundColor: THEME.colors.inputBg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: THEME.colors.border,
    },
    sortButtonActive: {
        backgroundColor: THEME.colors.primary,
        borderColor: THEME.colors.primary,
    },
    sortButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: THEME.colors.textMedium,
    },
    sortButtonActiveText: {
        color: THEME.colors.white,
    },
    storiesContainer: {
        padding: 16,
    },
    storiesTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: THEME.colors.textDark,
        marginBottom: 16,
        fontFamily: THEME.fonts.heading,
    },
    storiesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    storyCard: {
        width: '48%',
        backgroundColor: THEME.colors.white,
        borderRadius: THEME.borderRadius.xl,
        padding: 16,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: THEME.colors.border,
        ...THEME.shadows.card,
    },
    storyCardIcon: {
        width: 60,
        height: 60,
        backgroundColor: THEME.colors.inputBg,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    storyCardIconText: {
        fontSize: 24,
    },
    storyCardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: THEME.colors.textDark,
        textAlign: 'center',
        marginBottom: 8,
        fontFamily: THEME.fonts.heading,
    },
    storyCardMeta: {
        width: '100%',
        marginBottom: 8,
    },
    storyCardCategory: {
        fontSize: 12,
        color: THEME.colors.textMedium,
        textAlign: 'center',
        marginBottom: 4,
    },
    storyCardRating: {
        alignItems: 'center',
    },
    storyCardRatingText: {
        fontSize: 12,
        color: THEME.colors.accent,
        fontWeight: '600',
    },
    audioIndicator: {
        backgroundColor: THEME.colors.primary + '15',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: THEME.borderRadius.m,
    },
    audioIndicatorText: {
        fontSize: 12,
        color: THEME.colors.primary,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: 16,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: THEME.colors.textDark,
        marginBottom: 8,
        fontFamily: THEME.fonts.heading,
    },
    emptyStateText: {
        fontSize: 16,
        color: THEME.colors.textMedium,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    otherAgeGroupsContainer: {
        backgroundColor: THEME.colors.white,
        padding: 16,
        marginBottom: 12,
    },
    otherAgeGroupsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: THEME.colors.textDark,
        marginBottom: 16,
        fontFamily: THEME.fonts.heading,
    },
    otherAgeGroupsGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    otherAgeGroupCard: {
        flex: 1,
        backgroundColor: THEME.colors.inputBg,
        borderRadius: THEME.borderRadius.m,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: THEME.colors.border,
    },
    otherAgeGroupIcon: {
        fontSize: 24,
        marginBottom: 8,
    },
    otherAgeGroupTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: THEME.colors.textDark,
        marginBottom: 4,
        textAlign: 'center',
        fontFamily: THEME.fonts.heading,
    },
    otherAgeGroupDescription: {
        fontSize: 12,
        color: THEME.colors.textMedium,
        textAlign: 'center',
    },
    tipsContainer: {
        backgroundColor: THEME.colors.white,
        padding: 20,
        marginBottom: 20,
    },
    tipsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: THEME.colors.textDark,
        marginBottom: 16,
        fontFamily: THEME.fonts.heading,
    },
    tipsList: {
        gap: 12,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    tipBullet: {
        fontSize: 16,
        marginRight: 12,
        marginTop: 2,
    },
    tipText: {
        fontSize: 16,
        color: THEME.colors.textDark,
        flex: 1,
        lineHeight: 24,
    },
});

export default AgeGroupScreen;