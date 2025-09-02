// Stories management hook

import { useState, useEffect, useCallback } from 'react';
import { Story, EnhancedStory } from '../types';
import { storyService } from '../services';
import { getErrorMessage } from '../utils';

export const useStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [favoriteStories, setFavoriteStories] = useState<Story[]>([]);
  const [recentStories, setRecentStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data
  useEffect(() => {
    loadStories();
    loadFavorites();
    loadRecentStories();
  }, []);

  const loadStories = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const allStories = await storyService.getAllStories();
      setStories(allStories);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFavorites = useCallback(async () => {
    try {
      const favorites = await storyService.getFavoriteStories();
      setFavoriteStories(favorites);
    } catch (err) {
      console.error('Error loading favorites:', err);
    }
  }, []);

  const loadRecentStories = useCallback(async () => {
    try {
      const recent = await storyService.getRecentlyReadStories(5);
      setRecentStories(recent);
    } catch (err) {
      console.error('Error loading recent stories:', err);
    }
  }, []);

  const getStoriesByCategory = useCallback(async (categoryId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const categoryStories = await storyService.getStoriesByCategory(categoryId);
      return categoryStories;
    } catch (err) {
      setError(getErrorMessage(err));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStoryById = useCallback(async (storyId: string) => {
    try {
      const story = await storyService.getStoryById(storyId);
      return story;
    } catch (err) {
      console.error('Error getting story by ID:', err);
      return null;
    }
  }, []);

  const getEnhancedStory = useCallback(async (story: Story): Promise<EnhancedStory | null> => {
    try {
      const enhancedStory = await storyService.getEnhancedStory(story);
      return enhancedStory;
    } catch (err) {
      console.error('Error getting enhanced story:', err);
      return null;
    }
  }, []);

  const toggleFavorite = useCallback(async (storyId: string) => {
    try {
      await storyService.toggleFavorite(storyId);
      // Reload favorites to update the UI
      await loadFavorites();
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  }, [loadFavorites]);

  const markAsRead = useCallback(async (storyId: string) => {
    try {
      await storyService.updateReadingProgress(storyId);
      // Reload recent stories to update the UI
      await loadRecentStories();
    } catch (err) {
      console.error('Error marking story as read:', err);
    }
  }, [loadRecentStories]);

  const searchStories = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const searchResults = await storyService.searchStories(query);
      return searchResults;
    } catch (err) {
      setError(getErrorMessage(err));
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isFavorite = useCallback((storyId: string) => {
    return favoriteStories.some(story => story.id === storyId);
  }, [favoriteStories]);

  const getStoriesByTag = useCallback((tag: string) => {
    // This would require enhanced stories with tags
    // For now, we'll filter by category or description content
    return stories.filter(story => 
      story.category?.toLowerCase().includes(tag.toLowerCase()) ||
      story.description.toLowerCase().includes(tag.toLowerCase()) ||
      story.title.toLowerCase().includes(tag.toLowerCase())
    );
  }, [stories]);

  const getRandomStory = useCallback(() => {
    if (stories.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * stories.length);
    return stories[randomIndex];
  }, [stories]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    stories,
    favoriteStories,
    recentStories,
    isLoading,
    error,
    loadStories,
    getStoriesByCategory,
    getStoryById,
    getEnhancedStory,
    toggleFavorite,
    markAsRead,
    searchStories,
    isFavorite,
    getStoriesByTag,
    getRandomStory,
    clearError,
  };
};