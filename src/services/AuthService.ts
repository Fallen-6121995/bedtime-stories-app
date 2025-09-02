// Authentication service

import { User, AuthState } from '../types';
import { storageService, STORAGE_KEYS } from './StorageService';
import { isValidEmail, isValidPassword, generateId, createAppError } from '../utils';

export interface AuthService {
  getCurrentUser(): Promise<User | null>;
  login(email: string, password: string): Promise<User>;
  signup(email: string, password: string, name: string): Promise<User>;
  logout(): Promise<void>;
  isAuthenticated(): Promise<boolean>;
  updateProfile(user: Partial<User>): Promise<User>;
}

class AuthServiceImpl implements AuthService {
  private currentUser: User | null = null;

  async getCurrentUser(): Promise<User | null> {
    if (this.currentUser) return this.currentUser;

    try {
      const userData = await storageService.getObject<User | null>(STORAGE_KEYS.USER_SESSION, null);
      this.currentUser = userData;
      return userData;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  async login(email: string, password: string): Promise<User> {
    // Validate input
    if (!email || !password) {
      throw createAppError('INVALID_INPUT', 'Email and password are required');
    }

    if (!isValidEmail(email)) {
      throw createAppError('INVALID_EMAIL', 'Please enter a valid email address');
    }

    // In a real app, this would make an API call to authenticate
    // For now, we'll simulate authentication with stored user data
    try {
      const storedUsers = await storageService.getObject<Record<string, { password: string; user: User }>>(
        'stored_users',
        {}
      );

      const userRecord = storedUsers[email];
      if (!userRecord || userRecord.password !== password) {
        throw createAppError('INVALID_CREDENTIALS', 'Invalid email or password');
      }

      const user = userRecord.user;
      this.currentUser = user;
      await storageService.setObject(STORAGE_KEYS.USER_SESSION, user);

      return user;
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        throw error;
      }
      throw createAppError('LOGIN_FAILED', 'Login failed. Please try again.');
    }
  }

  async signup(email: string, password: string, name: string): Promise<User> {
    // Validate input
    if (!email || !password || !name) {
      throw createAppError('INVALID_INPUT', 'All fields are required');
    }

    if (!isValidEmail(email)) {
      throw createAppError('INVALID_EMAIL', 'Please enter a valid email address');
    }

    if (!isValidPassword(password)) {
      throw createAppError(
        'INVALID_PASSWORD',
        'Password must be at least 8 characters with uppercase, lowercase, and number'
      );
    }

    if (name.trim().length < 2) {
      throw createAppError('INVALID_NAME', 'Name must be at least 2 characters long');
    }

    try {
      // Check if user already exists
      const storedUsers = await storageService.getObject<Record<string, { password: string; user: User }>>(
        'stored_users',
        {}
      );

      if (storedUsers[email]) {
        throw createAppError('USER_EXISTS', 'An account with this email already exists');
      }

      // Create new user
      const user: User = {
        id: generateId(),
        email: email.toLowerCase(),
        name: name.trim(),
        preferences: {
          fontSize: 'medium',
          theme: 'light',
          favoriteCategories: [],
        },
      };

      // Store user data
      storedUsers[email] = { password, user };
      await storageService.setObject('stored_users', storedUsers);

      // Set as current user
      this.currentUser = user;
      await storageService.setObject(STORAGE_KEYS.USER_SESSION, user);

      return user;
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error) {
        throw error;
      }
      throw createAppError('SIGNUP_FAILED', 'Account creation failed. Please try again.');
    }
  }

  async logout(): Promise<void> {
    try {
      this.currentUser = null;
      await storageService.removeItem(STORAGE_KEYS.USER_SESSION);
    } catch (error) {
      console.error('Error during logout:', error);
      throw createAppError('LOGOUT_FAILED', 'Logout failed. Please try again.');
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return user !== null;
  }

  async updateProfile(updates: Partial<User>): Promise<User> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) {
      throw createAppError('NOT_AUTHENTICATED', 'User not authenticated');
    }

    try {
      const updatedUser: User = {
        ...currentUser,
        ...updates,
        id: currentUser.id, // Ensure ID cannot be changed
        email: currentUser.email, // Ensure email cannot be changed
      };

      // Update stored user data
      const storedUsers = await storageService.getObject<Record<string, { password: string; user: User }>>(
        'stored_users',
        {}
      );

      if (storedUsers[currentUser.email]) {
        storedUsers[currentUser.email].user = updatedUser;
        await storageService.setObject('stored_users', storedUsers);
      }

      // Update current session
      this.currentUser = updatedUser;
      await storageService.setObject(STORAGE_KEYS.USER_SESSION, updatedUser);

      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw createAppError('UPDATE_FAILED', 'Profile update failed. Please try again.');
    }
  }

  // Helper method to create a demo user for testing
  async createDemoUser(): Promise<void> {
    const demoEmail = 'demo@bedtimestories.com';
    const demoPassword = 'Demo123!';
    const demoName = 'Demo User';

    try {
      const storedUsers = await storageService.getObject<Record<string, { password: string; user: User }>>(
        'stored_users',
        {}
      );

      if (!storedUsers[demoEmail]) {
        const demoUser: User = {
          id: 'demo-user-id',
          email: demoEmail,
          name: demoName,
          preferences: {
            fontSize: 'medium',
            theme: 'light',
            favoriteCategories: ['Fairy Tales', 'Bedtime Stories'],
          },
        };

        storedUsers[demoEmail] = { password: demoPassword, user: demoUser };
        await storageService.setObject('stored_users', storedUsers);
      }
    } catch (error) {
      console.error('Error creating demo user:', error);
    }
  }
}

// Create singleton instance
export const authService = new AuthServiceImpl();
export default authService;