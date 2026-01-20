import TokenManager from '../storage/TokenManager';
import { ApiError } from '../types/auth.types';
import { API_CONFIG } from '../../config/api.config';

/**
 * Base API Client with interceptors
 * Handles HTTP requests with automatic token refresh
 * Following Open/Closed Principle - open for extension, closed for modification
 */
class ApiClient {
  private static instance: ApiClient;
  private baseURL: string;
  private isRefreshing: boolean = false;
  private refreshSubscribers: Array<(token: string) => void> = [];

  private constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
  }

  /**
   * Singleton pattern
   */
  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  /**
   * Set base URL (useful for testing or environment changes)
   */
  public setBaseURL(url: string): void {
    this.baseURL = url;
  }

  /**
   * Add subscriber for token refresh
   */
  private subscribeTokenRefresh(callback: (token: string) => void): void {
    this.refreshSubscribers.push(callback);
  }

  /**
   * Notify all subscribers when token is refreshed
   */
  private onTokenRefreshed(token: string): void {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  /**
   * Refresh access token using refresh token
   * NOTE: This does NOT use Authorization header - refresh token is sent in body
   */
  private async refreshAccessToken(): Promise<string> {
    console.log('🔄 refreshAccessToken: Getting refresh token from storage...');
    const refreshToken = await TokenManager.getRefreshToken();
    
    if (!refreshToken) {
      console.log('❌ No refresh token available');
      throw new Error('No refresh token available');
    }

    console.log('🔄 Refresh token found:', refreshToken.substring(0, 20) + '...');
    console.log('🔄 Calling POST /auth/refresh...');

    // NOTE: No Authorization header - refresh token is in the body
    const headers = {
      'Content-Type': 'application/json',
      'x-api-key': API_CONFIG.API_KEY,
      'x-platform': API_CONFIG.PLATFORM,
      'x-client-id': API_CONFIG.MOBILE_CLIENT_ID,
      'x-client-secret': API_CONFIG.MOBILE_CLIENT_SECRET,
    };

    console.log('📋 Refresh request headers:', JSON.stringify(headers, null, 2));
    console.log('📦 Refresh request body:', JSON.stringify({ refreshToken: refreshToken.substring(0, 20) + '...' }));

    const response = await fetch(`${this.baseURL}/auth/refresh`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ refreshToken }),
    });

    console.log('📥 Refresh response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Refresh failed:', errorData);
      // Refresh token is invalid, clear tokens
      await TokenManager.clearTokens();
      throw new Error('Session expired. Please login again.');
    }

    const data = await response.json();
    console.log('✅ Refresh successful, got new tokens');
    
    // Save new tokens
    await TokenManager.saveTokens({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    });

    console.log('💾 New tokens saved to storage');
    return data.accessToken;
  }

  /**
   * Make HTTP request with automatic token refresh
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    console.log('🌐 API Request:', options.method || 'GET', url);
    
    const accessToken = await TokenManager.getAccessToken();
    console.log('🔑 Access token exists:', !!accessToken);
    if (accessToken) {
      console.log('🔑 Token preview:', accessToken.substring(0, 20) + '...');
    }

    // Prepare headers with required API key, platform, and client credentials
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'x-api-key': API_CONFIG.API_KEY,
      'x-platform': API_CONFIG.PLATFORM,
      'x-client-id': API_CONFIG.MOBILE_CLIENT_ID,
      'x-client-secret': API_CONFIG.MOBILE_CLIENT_SECRET,
      ...(options.headers as Record<string, string>),
    };

    // Add authorization header if token exists
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    console.log('📋 Request headers:', JSON.stringify(headers, null, 2));

    try {
      console.log('📤 Sending request...');
      const response = await fetch(url, {
        ...options,
        headers,
      });

      console.log('📥 Response status:', response.status, response.statusText);

      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        console.log('🔄 Got 401, attempting token refresh...');
        
        // Check if we're already refreshing
        if (!this.isRefreshing) {
          this.isRefreshing = true;
          console.log('🔄 Starting token refresh...');

          try {
            const newAccessToken = await this.refreshAccessToken();
            console.log('✅ Token refreshed successfully');
            this.isRefreshing = false;
            this.onTokenRefreshed(newAccessToken);

            // Retry original request with new token
            console.log('🔄 Retrying original request with new token...');
            headers['Authorization'] = `Bearer ${newAccessToken}`;
            const retryResponse = await fetch(url, {
              ...options,
              headers,
            });

            console.log('📥 Retry response status:', retryResponse.status);
            return this.handleResponse<T>(retryResponse);
          } catch (refreshError) {
            console.error('❌ Token refresh failed:', refreshError);
            this.isRefreshing = false;
            throw refreshError;
          }
        } else {
          console.log('⏳ Token refresh already in progress, waiting...');
          // Wait for token refresh to complete
          return new Promise((resolve, reject) => {
            this.subscribeTokenRefresh(async (newToken: string) => {
              try {
                console.log('🔄 Retrying with refreshed token...');
                headers['Authorization'] = `Bearer ${newToken}`;
                const retryResponse = await fetch(url, {
                  ...options,
                  headers,
                });
                resolve(this.handleResponse<T>(retryResponse));
              } catch (error) {
                reject(error);
              }
            });
          });
        }
      }

      return this.handleResponse<T>(response);
    } catch (error) {
      console.error('💥 API Request Error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw this.createApiError(data, response.status);
    }

    return data as T;
  }

  /**
   * Create API error object
   */
  private createApiError(data: any, statusCode: number): ApiError {
    return {
      message: data.message || 'An error occurred',
      errors: data.errors || [],
      statusCode,
    };
  }

  /**
   * Handle network or other errors
   */
  private handleError(error: any): ApiError {
    if (error.message) {
      return {
        message: error.message,
        errors: [],
      };
    }
    return {
      message: 'Network error. Please check your connection.',
      errors: [],
    };
  }

  /**
   * Convenience methods for HTTP verbs
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  async patch<T>(
    endpoint: string,
    body?: any,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}

export default ApiClient.getInstance();
