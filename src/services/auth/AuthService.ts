import ApiClient from '../api/ApiClient';
import TokenManager from '../storage/TokenManager';
import UserManager from '../storage/UserManager';
import DeviceInfo from 'react-native-device-info';
import { API_ENDPOINTS, API_CONFIG } from '../../config/api.config';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types/auth.types';

/**
 * Authentication Service
 * Handles all authentication operations
 * Following Interface Segregation Principle
 */
class AuthService {
  private static instance: AuthService;

  private constructor() { }

  /**
   * Singleton pattern
   */
  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Get or generate device ID
   */
  private async getDeviceId(): Promise<string> {
    let deviceId = await TokenManager.getDeviceId();

    if (!deviceId) {
      // Generate unique device ID
      deviceId = await DeviceInfo.getUniqueId();
      await TokenManager.saveDeviceId(deviceId);
    }

    return deviceId;
  }

  /**
   * Register as guest user
   * Allows users to explore the app without creating an account
   */
  async registerAsGuest(): Promise<AuthResponse> {
    try {
      const deviceId = await this.getDeviceId();

      const response = await ApiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        { deviceId }
      );

      // Save tokens
      if (response.refreshToken) {
        await TokenManager.saveTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
      }

      // Save user data
      await UserManager.saveUser(response.user);

      return response;
    } catch (error) {
      console.error('Guest registration error:', error);
      throw error;
    }
  }

  /**
   * Register new user account
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const deviceId = await this.getDeviceId();

      const response = await ApiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        { ...credentials, deviceId }
      );

      // Save tokens
      if (response.refreshToken) {
        await TokenManager.saveTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
      }

      console.log('Registration response:', response);
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Upgrade guest account to full user account
   * Preserves user's data and preferences
   */
  async upgradeGuestAccount(
    credentials: Omit<RegisterCredentials, 'deviceId'>
  ): Promise<AuthResponse> {
    try {
      const accessToken = await TokenManager.getAccessToken();

      if (!accessToken) {
        throw new Error('No active guest session found');
      }

      const response = await ApiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.REGISTER,
        credentials,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Save new tokens
      if (response.refreshToken) {
        await TokenManager.saveTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
      }

      return response;
    } catch (error) {
      console.error('Guest upgrade error:', error);
      throw error;
    }
  }

  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await ApiClient.post<AuthResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // Save tokens
      if (response.refreshToken) {
        await TokenManager.saveTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        });
      }

      console.log('Login response:', response);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout user and clear all tokens
   */
  async logout(): Promise<void> {
    try {
      const refreshToken = await TokenManager.getRefreshToken();

      // Call logout endpoint to revoke tokens on server
      if (refreshToken) {
        await ApiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server request fails
    } finally {
      // Always clear local tokens and user data
      await TokenManager.clearTokens();
      await UserManager.clearUser();
    }
  }

  /**
   * Get current user information from storage
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      // Get user data from storage
      const user = await UserManager.getUser();
      return user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  /**
   * Fetch current user details from server
   * Validates token and updates local user data
   */
  async fetchUserDetails(): Promise<User | null> {
    try {
      console.log('📡 Calling API:', API_ENDPOINTS.USER.ME);
      const response = await ApiClient.get<{ user: User }>(API_ENDPOINTS.USER.ME);

      console.log('✅ API Response received:', JSON.stringify(response, null, 2));

      // Save updated user data to storage
      await UserManager.saveUser(response.user);
      console.log('💾 User data saved to storage');

      return response.user;
    } catch (error: any) {
      console.error('❌ Fetch user details error:', error);
      console.error('❌ Error message:', error?.message);
      console.error('❌ Error details:', JSON.stringify(error, null, 2));
      return null;
    }
  }

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    return await TokenManager.isAuthenticated();
  }

  /**
   * Check if current user is a guest
   */
  async isGuest(): Promise<boolean> {
    try {
      const accessToken = await TokenManager.getAccessToken();

      if (!accessToken) {
        return false;
      }

      const decoded = TokenManager.decodeToken(accessToken);
      return decoded?.type === 'guest';
    } catch (error) {
      return false;
    }
  }

  /**
   * Refresh access token manually
   * NOTE: This bypasses ApiClient to avoid adding Authorization header
   */
  async refreshToken(): Promise<string> {
    try {
      console.log('🔄 AuthService.refreshToken: Getting refresh token...');
      const refreshToken = await TokenManager.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      console.log('🔄 Calling refresh endpoint WITHOUT Authorization header...');
      
      // Direct fetch call to avoid Authorization header being added by ApiClient
      const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`;
      console.log('🌐 Refresh URL:', url);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_CONFIG.API_KEY,
          'x-platform': API_CONFIG.PLATFORM,
          'x-client-id': API_CONFIG.MOBILE_CLIENT_ID,
          'x-client-secret': API_CONFIG.MOBILE_CLIENT_SECRET,
          // ❌ NO Authorization header
        },
        body: JSON.stringify({ refreshToken }),
      });

      console.log('📥 Refresh response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('❌ Refresh failed:', errorData);
        await TokenManager.clearTokens();
        throw new Error(errorData.error || 'Token refresh failed');
      }

      const data: AuthResponse = await response.json();
      console.log('✅ Refresh successful');

      // Save new tokens
      if (data.refreshToken) {
        await TokenManager.saveTokens({
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
        });
        console.log('💾 New tokens saved');
      }

      return data.accessToken;
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      // Clear tokens if refresh fails
      await TokenManager.clearTokens();
      throw error;
    }
  }

  /**
   * Validate current session
   * Returns true if session is valid, false otherwise
   */
  async validateSession(): Promise<boolean> {
    try {
      console.log('🔍 Validating session...');
      const accessToken = await TokenManager.getAccessToken();

      if (!accessToken) {
        console.log('❌ No access token found');
        return false;
      }

      console.log('✅ Access token found');

      // Check if token is expired
      const isExpired = TokenManager.isTokenExpired(accessToken);
      console.log('⏰ Token expired:', isExpired);

      if (isExpired) {
        // Try to refresh
        console.log('🔄 Token expired, attempting refresh...');
        try {
          await this.refreshToken();
          console.log('✅ Token refresh successful');
          return true;
        } catch (error) {
          console.error('❌ Token refresh failed:', error);
          return false;
        }
      }

      console.log('✅ Token is still valid');
      return true;
    } catch (error) {
      console.error('❌ Session validation error:', error);
      return false;
    }
  }
}

export default AuthService.getInstance();
