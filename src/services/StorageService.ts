// Local storage service using AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageService } from '../types';
import { safeJsonParse, safeJsonStringify } from '../utils';

class AsyncStorageService implements StorageService {
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error('AsyncStorage getItem error:', error);
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('AsyncStorage setItem error:', error);
      throw error;
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('AsyncStorage removeItem error:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('AsyncStorage clear error:', error);
      throw error;
    }
  }

  // Convenience methods for JSON data
  async getObject<T>(key: string, fallback: T): Promise<T> {
    const json = await this.getItem(key);
    if (!json) return fallback;
    return safeJsonParse(json, fallback);
  }

  async setObject<T>(key: string, value: T): Promise<void> {
    const json = safeJsonStringify(value);
    await this.setItem(key, json);
  }
}

// Storage keys constants
export const STORAGE_KEYS = {
  USER_SESSION: 'user_session',
  USER_PREFERENCES: 'user_preferences',
  FAVORITE_STORIES: 'favorite_stories',
  READING_PROGRESS: 'reading_progress',
  STORY_CACHE: 'story_cache',
  LAST_READ_STORIES: 'last_read_stories',
  USER_GENERATED_STORIES: 'user_generated_stories',
} as const;

// Create singleton instance
export const storageService = new AsyncStorageService();
export default storageService;