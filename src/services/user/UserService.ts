import ApiClient from '../api/ApiClient';
import UserManager from '../storage/UserManager';
import { API_ENDPOINTS } from '../../config/api.config';
import { User } from '../types/auth.types';

/**
 * User Service
 * Handles all user-related operations
 * Following the same structure as AuthService
 */
class UserService {
  private static instance: UserService;

  private constructor() {}

  /**
   * Singleton pattern
   */
  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Get current user details from server
   */
  async getMe(): Promise<User | null> {
    try {
      const response = await ApiClient.get<{ user: User }>(API_ENDPOINTS.USER.ME);
      
      // Save updated user data to storage
      await UserManager.saveUser(response.user);
      
      return response.user;
    } catch (error) {
      console.error('Get user details error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(data: { name?: string; mobileNumber?: string }): Promise<User | null> {
    try {
      const response = await ApiClient.put<{ user: User; message: string }>(
        API_ENDPOINTS.USER.PROFILE,
        data
      );
      
      // Save updated user data to storage
      await UserManager.saveUser(response.user);
      
      return response.user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(preferences: Record<string, any>): Promise<Record<string, any> | null> {
    try {
      const response = await ApiClient.put<{ preferences: Record<string, any>; message: string }>(
        API_ENDPOINTS.USER.PREFERENCES,
        { preferences }
      );
      
      // Update local user data with new preferences
      const currentUser = await UserManager.getUser();
      if (currentUser) {
        await UserManager.saveUser({
          ...currentUser,
          preferences: response.preferences,
        });
      }
      
      return response.preferences;
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  }

  /**
   * Get user favorites
   */
  async getFavorites(): Promise<any[]> {
    try {
      const response = await ApiClient.get<{ favorites: any[] }>(
        API_ENDPOINTS.USER.FAVORITES
      );
      
      return response.favorites || [];
    } catch (error) {
      console.error('Get favorites error:', error);
      return [];
    }
  }

  /**
   * Get user history
   */
  async getHistory(): Promise<any[]> {
    try {
      const response = await ApiClient.get<{ history: any[] }>(
        API_ENDPOINTS.USER.HISTORY
      );
      
      return response.history || [];
    } catch (error) {
      console.error('Get history error:', error);
      return [];
    }
  }
}

export default UserService.getInstance();
