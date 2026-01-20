import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/auth.types';

/**
 * User Data Manager
 * Handles storage and retrieval of user information
 */
class UserManager {
  private static instance: UserManager;
  private readonly USER_DATA_KEY = '@bedtime_stories_user_data';

  private constructor() {}

  /**
   * Singleton pattern
   */
  public static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  /**
   * Save user data
   */
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user data:', error);
      throw new Error('Failed to save user data');
    }
  }

  /**
   * Get user data
   */
  async getUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(this.USER_DATA_KEY);
      if (!userData) {
        return null;
      }
      console.log("user>>>",JSON.parse(userData));
      return JSON.parse(userData) as User;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }

  /**
   * Clear user data
   */
  async clearUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.USER_DATA_KEY);
    } catch (error) {
      console.error('Error clearing user data:', error);
      throw new Error('Failed to clear user data');
    }
  }

  /**
   * Update user data
   */
  async updateUser(updates: Partial<User>): Promise<void> {
    try {
      const currentUser = await this.getUser();
      if (!currentUser) {
        throw new Error('No user data to update');
      }
      const updatedUser = { ...currentUser, ...updates };
      await this.saveUser(updatedUser);
    } catch (error) {
      console.error('Error updating user data:', error);
      throw new Error('Failed to update user data');
    }
  }
}

export default UserManager.getInstance();
