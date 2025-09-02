// Story management service

import { Story, EnhancedStory, StoryService } from '../types';
import { storageService, STORAGE_KEYS } from './StorageService';
import storiesData, { 
  getAllStories as getEnhancedStories, 
  getStoriesByCategory as getEnhancedStoriesByCategory,
  getStoryById as getEnhancedStoryById,
  transformEnhancedStoryToLegacy 
} from '../common/StoriesData';
import { calculateReadingTime } from '../utils';

class StoryServiceImpl implements StoryService {
  private favoriteStories: Set<string> = new Set();
  private readingProgress: Map<string, { lastRead: Date; readCount: number }> = new Map();
  private userGeneratedStories: Map<string, EnhancedStory> = new Map();

  constructor() {
    this.loadFavorites();
    this.loadReadingProgress();
    this.loadUserGeneratedStories();
  }

  async getAllStories(): Promise<Story[]> {
    const enhancedStories = getEnhancedStories();
    const userStories = Array.from(this.userGeneratedStories.values());
    
    // Combine built-in and user-generated stories
    const allEnhancedStories = [...enhancedStories, ...userStories];
    
    // Apply user preferences (favorites, reading progress)
    const storiesWithUserData = await Promise.all(
      allEnhancedStories.map(async (story) => {
        const enhancedStory = await this.applyUserDataToStory(story);
        return transformEnhancedStoryToLegacy(enhancedStory);
      })
    );

    return storiesWithUserData;
  }

  async getStoriesByCategory(categoryId: string): Promise<Story[]> {
    const enhancedStories = getEnhancedStoriesByCategory(categoryId);
    const userStories = Array.from(this.userGeneratedStories.values())
      .filter(story => story.category === categoryId);
    
    const allStories = [...enhancedStories, ...userStories];
    
    const storiesWithUserData = await Promise.all(
      allStories.map(async (story) => {
        const enhancedStory = await this.applyUserDataToStory(story);
        return transformEnhancedStoryToLegacy(enhancedStory);
      })
    );

    return storiesWithUserData;
  }

  async getStoryById(id: string): Promise<Story | null> {
    let enhancedStory = getEnhancedStoryById(id);
    
    // Check user-generated stories if not found in built-in stories
    if (!enhancedStory) {
      enhancedStory = this.userGeneratedStories.get(id) || null;
    }
    
    if (!enhancedStory) return null;
    
    const storyWithUserData = await this.applyUserDataToStory(enhancedStory);
    return transformEnhancedStoryToLegacy(storyWithUserData);
  }

  async getFavoriteStories(): Promise<Story[]> {
    const allStories = await this.getAllStories();
    return allStories.filter(story => this.favoriteStories.has(story.id));
  }

  async toggleFavorite(storyId: string): Promise<void> {
    if (this.favoriteStories.has(storyId)) {
      this.favoriteStories.delete(storyId);
    } else {
      this.favoriteStories.add(storyId);
    }
    
    await this.saveFavorites();
  }

  async updateReadingProgress(storyId: string): Promise<void> {
    const existing = this.readingProgress.get(storyId);
    const now = new Date();
    
    this.readingProgress.set(storyId, {
      lastRead: now,
      readCount: existing ? existing.readCount + 1 : 1,
    });

    await this.saveReadingProgress();
  }

  async getEnhancedStory(storyId: string): Promise<EnhancedStory | null> {
    let enhancedStory = getEnhancedStoryById(storyId);
    
    // Check user-generated stories if not found in built-in stories
    if (!enhancedStory) {
      enhancedStory = this.userGeneratedStories.get(storyId) || null;
    }
    
    if (!enhancedStory) return null;
    
    return await this.applyUserDataToStory(enhancedStory);
  }

  async addUserGeneratedStory(story: Omit<EnhancedStory, 'id' | 'isFavorite' | 'readCount'>): Promise<string> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const enhancedStory: EnhancedStory = {
      ...story,
      id,
      isFavorite: false,
      readCount: 0
    };
    
    this.userGeneratedStories.set(id, enhancedStory);
    await this.saveUserGeneratedStories();
    
    return id;
  }

  async deleteUserGeneratedStory(storyId: string): Promise<boolean> {
    if (this.userGeneratedStories.has(storyId)) {
      this.userGeneratedStories.delete(storyId);
      await this.saveUserGeneratedStories();
      
      // Also remove from favorites and reading progress
      this.favoriteStories.delete(storyId);
      this.readingProgress.delete(storyId);
      await this.saveFavorites();
      await this.saveReadingProgress();
      
      return true;
    }
    return false;
  }

  async getRecentlyReadStories(limit: number = 5): Promise<Story[]> {
    const allStories = await this.getAllStories();
    const recentStories = Array.from(this.readingProgress.entries())
      .sort(([, a], [, b]) => b.lastRead.getTime() - a.lastRead.getTime())
      .slice(0, limit)
      .map(([storyId]) => allStories.find(story => story.id === storyId))
      .filter(Boolean) as Story[];

    return recentStories;
  }

  async searchStories(query: string): Promise<Story[]> {
    const allStories = await this.getAllStories();
    const lowercaseQuery = query.toLowerCase();

    return allStories.filter(story =>
      story.title.toLowerCase().includes(lowercaseQuery) ||
      story.description.toLowerCase().includes(lowercaseQuery) ||
      story.category?.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Private methods
  private async applyUserDataToStory(story: EnhancedStory): Promise<EnhancedStory> {
    const progress = this.readingProgress.get(story.id);
    
    return {
      ...story,
      isFavorite: this.favoriteStories.has(story.id),
      lastRead: progress?.lastRead,
      readCount: progress?.readCount || 0,
    };
  }

  private async loadFavorites(): Promise<void> {
    try {
      const favorites = await storageService.getObject<string[]>(STORAGE_KEYS.FAVORITE_STORIES, []);
      this.favoriteStories = new Set(favorites);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  }

  private async saveFavorites(): Promise<void> {
    try {
      const favorites = Array.from(this.favoriteStories);
      await storageService.setObject(STORAGE_KEYS.FAVORITE_STORIES, favorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  }

  private async loadReadingProgress(): Promise<void> {
    try {
      const progress = await storageService.getObject<Record<string, { lastRead: string; readCount: number }>>(
        STORAGE_KEYS.READING_PROGRESS,
        {}
      );
      
      this.readingProgress = new Map(
        Object.entries(progress).map(([id, data]) => [
          id,
          { ...data, lastRead: new Date(data.lastRead) }
        ])
      );
    } catch (error) {
      console.error('Error loading reading progress:', error);
    }
  }

  private async saveReadingProgress(): Promise<void> {
    try {
      const progress = Object.fromEntries(
        Array.from(this.readingProgress.entries()).map(([id, data]) => [
          id,
          { ...data, lastRead: data.lastRead.toISOString() }
        ])
      );
      
      await storageService.setObject(STORAGE_KEYS.READING_PROGRESS, progress);
    } catch (error) {
      console.error('Error saving reading progress:', error);
    }
  }

  private async loadUserGeneratedStories(): Promise<void> {
    try {
      const stories = await storageService.getObject<Record<string, EnhancedStory>>(
        STORAGE_KEYS.USER_GENERATED_STORIES,
        {}
      );
      
      this.userGeneratedStories = new Map(Object.entries(stories));
    } catch (error) {
      console.error('Error loading user generated stories:', error);
    }
  }

  private async saveUserGeneratedStories(): Promise<void> {
    try {
      const stories = Object.fromEntries(this.userGeneratedStories.entries());
      await storageService.setObject(STORAGE_KEYS.USER_GENERATED_STORIES, stories);
    } catch (error) {
      console.error('Error saving user generated stories:', error);
    }
  }

  // Enhanced methods with error handling
  async getStoriesWithErrorHandling(): Promise<{ success: boolean; data?: Story[]; error?: string }> {
    try {
      const stories = await this.getAllStories();
      return { success: true, data: stories };
    } catch (error) {
      console.error('Error getting stories:', error);
      return { 
        success: false, 
        error: 'Failed to load stories. Please try again.' 
      };
    }
  }

  async validateAndAddUserStory(storyData: Omit<EnhancedStory, 'id' | 'isFavorite' | 'readCount'>): Promise<{ success: boolean; storyId?: string; error?: string }> {
    try {
      // Validate story data
      const validation = await import('../utils/dataValidation');
      const validationResult = validation.validateStory({
        ...storyData,
        id: 'temp', // Temporary ID for validation
        isFavorite: false,
        readCount: 0
      });

      if (!validationResult.isValid) {
        return {
          success: false,
          error: `Invalid story data: ${validationResult.errors.join(', ')}`
        };
      }

      const storyId = await this.addUserGeneratedStory(storyData);
      return { success: true, storyId };
    } catch (error) {
      console.error('Error adding user story:', error);
      return {
        success: false,
        error: 'Failed to save story. Please try again.'
      };
    }
  }
}

// Create singleton instance
export const storyService = new StoryServiceImpl();
export default storyService;