import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokens } from '../types/auth.types';

/**
 * Secure Token Manager
 * Handles storage and retrieval of authentication tokens
 * Following Single Responsibility Principle
 */
class TokenManager {
  private static instance: TokenManager;
  private readonly ACCESS_TOKEN_KEY = '@bedtime_stories_access_token';
  private readonly REFRESH_TOKEN_KEY = '@bedtime_stories_refresh_token';
  private readonly DEVICE_ID_KEY = '@bedtime_stories_device_id';

  private constructor() { }

  /**
   * Singleton pattern to ensure single instance
   */
  public static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  /**
   * Save authentication tokens securely
   */
  async saveTokens(tokens: AuthTokens): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken),
        AsyncStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken),
      ]);
    } catch (error) {
      console.error('Error saving tokens:', error);
      throw new Error('Failed to save authentication tokens');
    }
  }

  /**
   * Get access token
   */
  async getAccessToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.ACCESS_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  /**
   * Get refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  /**
   * Get both tokens
   */
  async getTokens(): Promise<AuthTokens | null> {
    try {
      const [accessToken, refreshToken] = await Promise.all([
        this.getAccessToken(),
        this.getRefreshToken(),
      ]);

      if (!accessToken || !refreshToken) {
        return null;
      }

      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error getting tokens:', error);
      return null;
    }
  }

  /**
   * Clear all authentication tokens
   */
  async clearTokens(): Promise<void> {
    try {
      await Promise.all([
        AsyncStorage.removeItem(this.ACCESS_TOKEN_KEY),
        AsyncStorage.removeItem(this.REFRESH_TOKEN_KEY),
      ]);
    } catch (error) {
      console.error('Error clearing tokens:', error);
      throw new Error('Failed to clear authentication tokens');
    }
  }

  /**
   * Save device ID
   */
  async saveDeviceId(deviceId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(this.DEVICE_ID_KEY, deviceId);
    } catch (error) {
      console.error('Error saving device ID:', error);
      throw new Error('Failed to save device ID');
    }
  }

  /**
   * Get device ID
   */
  async getDeviceId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.DEVICE_ID_KEY);
    } catch (error) {
      console.error('Error getting device ID:', error);
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const tokens = await this.getTokens();
    return tokens !== null;
  }

  /**
   * Decode JWT token (without verification - for client-side info only)
   */
  decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }
}

export default TokenManager.getInstance();
