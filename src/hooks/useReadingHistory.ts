// Hook for managing reading history and statistics

import { useState, useEffect } from 'react';
import { Story } from '../types';
import storyService from '../services/StoryService';
import { useAuth } from './useAuth';

interface ReadingStats {
  totalStoriesRead: number;
  totalReadingTime: number;
  favoriteStories: number;
  averageReadingTime: number;
  readingStreak: number;
  lastReadDate: Date | null;
}

interface ReadingHistoryEntry {
  storyId: string;
  story: Story;
  readDate: Date;
  readingTime: number;
  completed: boolean;
}

export const useReadingHistory = () => {
  const { isAuthenticated } = useAuth();
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [readingStats, setReadingStats] = useState<ReadingStats>({
    totalStoriesRead: 0,
    totalReadingTime: 0,
    favoriteStories: 0,
    averageReadingTime: 0,
    readingStreak: 0,
    lastReadDate: null,
  });
  const [readingHistory, setReadingHistory] = useState<ReadingHistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load reading history when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadReadingHistory();
    } else {
      // Clear data when not authenticated
      setRecentStories([]);
      setReadingStats({
        totalStoriesRead: 0,
        totalReadingTime: 0,
        favoriteStories: 0,
        averageReadingTime: 0,
        readingStreak: 0,
        lastReadDate: null,
      });
      setReadingHistory([]);
    }
  }, [isAuthenticated]);

  const loadReadingHistory = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);

      // Load recent stories
      const recent = await storyService.getRecentlyReadStories(10);
      setRecentStories(recent);

      // Load favorite stories count
      const favorites = await storyService.getFavoriteStories();
      
      // Calculate reading statistics
      const stats = await calculateReadingStats(recent, favorites);
      setReadingStats(stats);

      // Build reading history entries
      const historyEntries = await buildReadingHistory(recent);
      setReadingHistory(historyEntries);

    } catch (err) {
      console.error('Error loading reading history:', err);
      setError('Failed to load reading history');
    } finally {
      setLoading(false);
    }
  };

  const calculateReadingStats = async (
    recentStories: Story[],
    favoriteStories: Story[]
  ): Promise<ReadingStats> => {
    let totalReadingTime = 0;
    let totalStoriesRead = 0;
    let lastReadDate: Date | null = null;

    // Calculate total reading time and stories read
    for (const story of recentStories) {
      if (story.readCount && story.readCount > 0) {
        totalStoriesRead += story.readCount;
        if (story.readingTime) {
          totalReadingTime += story.readingTime * story.readCount;
        }
        
        if (story.lastRead) {
          const storyLastRead = new Date(story.lastRead);
          if (!lastReadDate || storyLastRead > lastReadDate) {
            lastReadDate = storyLastRead;
          }
        }
      }
    }

    const averageReadingTime = totalStoriesRead > 0 ? totalReadingTime / totalStoriesRead : 0;
    const readingStreak = calculateReadingStreak(recentStories);

    return {
      totalStoriesRead,
      totalReadingTime,
      favoriteStories: favoriteStories.length,
      averageReadingTime,
      readingStreak,
      lastReadDate,
    };
  };

  const calculateReadingStreak = (stories: Story[]): number => {
    if (stories.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);

    // Check each day going backwards
    for (let i = 0; i < 30; i++) { // Check last 30 days
      const hasReadToday = stories.some(story => {
        if (!story.lastRead) return false;
        const readDate = new Date(story.lastRead);
        readDate.setHours(0, 0, 0, 0);
        return readDate.getTime() === currentDate.getTime();
      });

      if (hasReadToday) {
        streak++;
      } else if (streak > 0) {
        // Streak broken
        break;
      }

      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  };

  const buildReadingHistory = async (stories: Story[]): Promise<ReadingHistoryEntry[]> => {
    const entries: ReadingHistoryEntry[] = [];

    for (const story of stories) {
      if (story.lastRead && story.readCount && story.readCount > 0) {
        entries.push({
          storyId: story.id,
          story,
          readDate: new Date(story.lastRead),
          readingTime: story.readingTime || 0,
          completed: true, // Assume completed if in recent list
        });
      }
    }

    // Sort by read date (most recent first)
    return entries.sort((a, b) => b.readDate.getTime() - a.readDate.getTime());
  };

  const markStoryAsRead = async (storyId: string): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      await storyService.updateReadingProgress(storyId);
      // Reload reading history to reflect changes
      await loadReadingHistory();
    } catch (err) {
      console.error('Error marking story as read:', err);
      throw new Error('Failed to update reading progress');
    }
  };

  const getReadingGoalProgress = (dailyGoal: number = 1): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayReads = readingHistory.filter(entry => {
      const entryDate = new Date(entry.readDate);
      entryDate.setHours(0, 0, 0, 0);
      return entryDate.getTime() === today.getTime();
    }).length;

    return Math.min(todayReads / dailyGoal, 1);
  };

  const getWeeklyReadingData = (): { day: string; count: number }[] => {
    const weekData = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const count = readingHistory.filter(entry => {
        const entryDate = new Date(entry.readDate);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      }).length;

      weekData.push({ day: dayName, count });
    }

    return weekData;
  };

  const getMostReadCategories = (): { category: string; count: number }[] => {
    const categoryCount: Record<string, number> = {};

    readingHistory.forEach(entry => {
      const category = entry.story.category || 'Uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    return Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 categories
  };

  const refreshReadingHistory = async (): Promise<void> => {
    await loadReadingHistory();
  };

  return {
    // Data
    recentStories,
    readingStats,
    readingHistory,
    loading,
    error,

    // Actions
    markStoryAsRead,
    refreshReadingHistory,

    // Computed values
    getReadingGoalProgress,
    getWeeklyReadingData,
    getMostReadCategories,
  };
};