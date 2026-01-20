/**
 * API Configuration
 * Centralized configuration for API endpoints and keys
 */

export const API_CONFIG = {
  // Base URL for API
  BASE_URL: __DEV__
    ? 'https://155.248.247.127.nip.io/api'
    : 'https://155.248.247.127.nip.io/api',

  // Public API Key (required by backend)
  // Note: This is a public key meant for client-side use
  // It's safe to include in the app as it only identifies the client
  API_KEY: 'pk_Zt1cFQjpIqJA6gDOZsyWcWwZsxKxV9D6',

  // Mobile Client Credentials (required for mobile platform)
  // These identify the mobile app client
  MOBILE_CLIENT_ID: 'myapp',
  MOBILE_CLIENT_SECRET: 'somesecretvalue',

  // Platform identifier
  PLATFORM: 'mobile',

  // Timeout settings
  TIMEOUT: 30000, // 30 seconds

  // Retry settings
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

/**
 * API Endpoints
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },

  // User
  USER: {
    ME: '/user/me',
    PROFILE: '/user/profile',
    PREFERENCES: '/user/preferences',
    FAVORITES: '/user/favorites',
    HISTORY: '/user/history',
  },

  // Stories
  STORIES: {
    LIST: '/stories',
    DETAIL: (id: string) => `/stories/${id}`,
    FEATURED: '/stories/featured',
    SEARCH: '/stories/search',
    FAVORITES: '/stories/favorites',
    BY_CATEGORY: (categoryId: string) => `/stories?category=${categoryId}`,
    BY_AGE_GROUP: (ageGroup: string) => `/stories?ageGroup=${ageGroup}`,
  },

  // Categories
  CATEGORIES: {
    LIST: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
  },

  // Analytics
  ANALYTICS: {
    TRACK: '/analytics/track',
    STORY_VIEW: '/analytics/story-view',
    STORY_COMPLETE: '/analytics/story-complete',
  },

  // Audio
  AUDIO: {
    GENERATE: '/audio/generate',
    STREAM: (id: string) => `/audio/stream/${id}`,
  },
};

/**
 * HTTP Headers
 */
export const getDefaultHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': API_CONFIG.API_KEY,
    'x-platform': API_CONFIG.PLATFORM,
    'x-client-id': API_CONFIG.MOBILE_CLIENT_ID,
    'x-client-secret': API_CONFIG.MOBILE_CLIENT_SECRET,
  };

  return headers;
};

/**
 * Environment check
 */
export const isDevelopment = __DEV__;
export const isProduction = !__DEV__;
