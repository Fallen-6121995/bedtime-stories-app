// User preferences management service

import { UserPreferences } from '../types';
import { storageService, STORAGE_KEYS } from './StorageService';
import { authService } from './AuthService';

export interface UserPreferencesService {
  getPreferences(): Promise<UserPreferences>;
  updatePreferences(preferences: Partial<UserPreferences>): Promise<UserPreferences>;
  resetPreferences(): Promise<UserPreferences>;
  getFontSize(): Promise<'small' | 'medium' | 'large'>;
  setFontSize(size: 'small' | 'medium' | 'large'): Promise<void>;
  getTheme(): Promise<'light' | 'dark'>;
  setTheme(theme: 'light' | 'dark'): Promise<void>;
  getFavoriteCategories(): Promise<string[]>;
  addFavoriteCategory(category: string): Promise<void>;
  removeFavoriteCategory(category: string): Promise<void>;
}

class UserPreferencesServiceImpl implements UserPreferencesService {
  private defaultPreferences: UserPreferences = {
    fontSize: 'medium',
    theme: 'light',
    favoriteCategories: [],
  };

  async getPreferences(): Promise<UserPreferences> {
    try {
      // First try to get from current user
      const currentUser = await authService.getCurrentUser();
      if (currentUser?.preferences) {
        return currentUser.preferences;
      }

      // Fallback to stored preferences for non-authenticated users
      const storedPreferences = await storageService.getObject<UserPreferences>(
        STORAGE_KEYS.USER_PREFERENCES,
        this.defaultPreferences
      );

      return storedPreferences;
    } catch (error) {
      console.error('Error getting preferences:', error);
      return this.defaultPreferences;
    }
  }

  async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const currentPreferences = await this.getPreferences();
      const updatedPreferences: UserPreferences = {
        ...currentPreferences,
        ...updates,
      };

      // Update authenticated user's preferences
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        await authService.updateProfile({
          preferences: updatedPreferences,
        });
      } else {
        // Store preferences for non-authenticated users
        await storageService.setObject(STORAGE_KEYS.USER_PREFERENCES, updatedPreferences);
      }

      return updatedPreferences;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  async resetPreferences(): Promise<UserPreferences> {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        await authService.updateProfile({
          preferences: this.defaultPreferences,
        });
      } else {
        await storageService.setObject(STORAGE_KEYS.USER_PREFERENCES, this.defaultPreferences);
      }

      return this.defaultPreferences;
    } catch (error) {
      console.error('Error resetting preferences:', error);
      throw error;
    }
  }

  async getFontSize(): Promise<'small' | 'medium' | 'large'> {
    const preferences = await this.getPreferences();
    return preferences.fontSize;
  }

  async setFontSize(size: 'small' | 'medium' | 'large'): Promise<void> {
    await this.updatePreferences({ fontSize: size });
  }

  async getTheme(): Promise<'light' | 'dark'> {
    const preferences = await this.getPreferences();
    return preferences.theme;
  }

  async setTheme(theme: 'light' | 'dark'): Promise<void> {
    await this.updatePreferences({ theme });
  }

  async getFavoriteCategories(): Promise<string[]> {
    const preferences = await this.getPreferences();
    return preferences.favoriteCategories;
  }

  async addFavoriteCategory(category: string): Promise<void> {
    const preferences = await this.getPreferences();
    const favoriteCategories = [...preferences.favoriteCategories];
    
    if (!favoriteCategories.includes(category)) {
      favoriteCategories.push(category);
      await this.updatePreferences({ favoriteCategories });
    }
  }

  async removeFavoriteCategory(category: string): Promise<void> {
    const preferences = await this.getPreferences();
    const favoriteCategories = preferences.favoriteCategories.filter(cat => cat !== category);
    await this.updatePreferences({ favoriteCategories });
  }

  // Helper methods for common preference operations
  async getReadingPreferences(): Promise<{
    fontSize: 'small' | 'medium' | 'large';
    theme: 'light' | 'dark';
  }> {
    const preferences = await this.getPreferences();
    return {
      fontSize: preferences.fontSize,
      theme: preferences.theme,
    };
  }

  async updateReadingPreferences(updates: {
    fontSize?: 'small' | 'medium' | 'large';
    theme?: 'light' | 'dark';
  }): Promise<void> {
    await this.updatePreferences(updates);
  }

  async isFirstTimeUser(): Promise<boolean> {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        // Check if user has any preferences set or favorite categories
        return !currentUser.preferences?.favoriteCategories.length;
      }

      // For non-authenticated users, check if preferences exist
      const storedPreferences = await storageService.getItem(STORAGE_KEYS.USER_PREFERENCES);
      return !storedPreferences;
    } catch (error) {
      console.error('Error checking first time user:', error);
      return true;
    }
  }

  async markOnboardingComplete(): Promise<void> {
    try {
      const preferences = await this.getPreferences();
      // Add a flag to indicate onboarding is complete
      await this.updatePreferences({
        ...preferences,
        // We can add an onboardingComplete flag to the UserPreferences type if needed
      });
    } catch (error) {
      console.error('Error marking onboarding complete:', error);
    }
  }
}

// Create singleton instance
export const userPreferencesService = new UserPreferencesServiceImpl();
export default userPreferencesService;