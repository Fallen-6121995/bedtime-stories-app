// Reading Statistics Card component

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../hooks/useTheme';
import { useReadingHistory } from '../hooks/useReadingHistory';
import { formatReadingTime } from '../utils/helpers';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';

interface ReadingStatsCardProps {
  onPress?: () => void;
  compact?: boolean;
  testID?: string;
}

const ReadingStatsCard: React.FC<ReadingStatsCardProps> = ({
  onPress,
  compact = false,
  testID,
}) => {
  const { colors, typography, spacing } = useTheme();
  const { readingStats, loading, getReadingGoalProgress } = useReadingHistory();

  const goalProgress = getReadingGoalProgress(1); // 1 story per day goal

  const styles = StyleSheet.create({
    container: {
      padding: spacing[4],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[4],
    },
    title: {
      fontSize: typography.fontSize.lg,
      fontFamily: typography.fontFamily.bold,
      color: colors.neutral[800],
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    viewAllText: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.medium,
      color: colors.primary[600],
      marginRight: spacing[1],
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing[3],
    },
    statItem: {
      flex: 1,
      minWidth: compact ? 80 : 100,
      alignItems: 'center',
      backgroundColor: colors.primary[50],
      padding: spacing[3],
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.primary[100],
    },
    statValue: {
      fontSize: compact ? typography.fontSize.lg : typography.fontSize['2xl'],
      fontFamily: typography.fontFamily.bold,
      color: colors.primary[700],
      marginBottom: spacing[1],
    },
    statLabel: {
      fontSize: typography.fontSize.xs,
      fontFamily: typography.fontFamily.medium,
      color: colors.primary[600],
      textAlign: 'center',
    },
    goalProgress: {
      marginTop: spacing[4],
      padding: spacing[3],
      backgroundColor: colors.secondary[50],
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.secondary[100],
    },
    goalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[2],
    },
    goalTitle: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.bold,
      color: colors.secondary[700],
    },
    goalPercentage: {
      fontSize: typography.fontSize.sm,
      fontFamily: typography.fontFamily.bold,
      color: colors.secondary[600],
    },
    progressBar: {
      height: 6,
      backgroundColor: colors.secondary[200],
      borderRadius: 3,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: colors.secondary[500],
      borderRadius: 3,
    },
    loadingContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[8],
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing[6],
    },
    emptyText: {
      fontSize: typography.fontSize.base,
      fontFamily: typography.fontFamily.regular,
      color: colors.neutral[500],
      textAlign: 'center',
      marginTop: spacing[2],
    },
  });

  if (loading) {
    return (
      <Card style={styles.container} testID={testID || undefined}>
        <View style={styles.loadingContainer}>
          <LoadingSpinner size="small" />
          <Text style={styles.emptyText}>Loading reading stats...</Text>
        </View>
      </Card>
    );
  }

  if (readingStats.totalStoriesRead === 0) {
    return (
      <Card style={styles.container} testID={testID || undefined}>
        <View style={styles.emptyState}>
          <Icon
            name="menu-book"
            size={48}
            color={colors.neutral[400]}
          />
          <Text style={styles.emptyText}>
            Start reading stories to see your statistics here!
          </Text>
        </View>
      </Card>
    );
  }

  const statsData = [
    {
      value: readingStats.totalStoriesRead.toString(),
      label: 'Stories Read',
      icon: 'menu-book',
    },
    {
      value: formatReadingTime(readingStats.totalReadingTime),
      label: 'Reading Time',
      icon: 'schedule',
    },
    {
      value: readingStats.favoriteStories.toString(),
      label: 'Favorites',
      icon: 'favorite',
    },
    {
      value: readingStats.readingStreak.toString(),
      label: 'Day Streak',
      icon: 'local-fire-department',
    },
  ];

  // Show only first 2 stats in compact mode
  const displayStats = compact ? statsData.slice(0, 2) : statsData;

  return (
    <Pressable onPress={onPress} disabled={!onPress} testID={testID}>
      <Card style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Reading Stats</Text>
          {onPress && (
            <View style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Icon
                name="chevron-right"
                size={16}
                color={colors.primary[600]}
              />
            </View>
          )}
        </View>

        <View style={styles.statsGrid}>
          {displayStats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {!compact && (
          <View style={styles.goalProgress}>
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Daily Goal</Text>
              <Text style={styles.goalPercentage}>
                {Math.round(goalProgress * 100)}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${goalProgress * 100}%` }
                ]}
              />
            </View>
          </View>
        )}
      </Card>
    </Pressable>
  );
};

export default ReadingStatsCard;