// API constants and configuration

export const API_CONFIG = {
  BASE_URL: 'https://api.bedtimestories.com', // Replace with actual API URL
  TIMEOUT: 10000, // 10 seconds
  RETRY_ATTEMPTS: 3,
} as const;

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Stories
  STORIES: '/stories',
  STORY_BY_ID: '/stories/:id',
  STORIES_BY_CATEGORY: '/stories/category/:categoryId',
  SEARCH_STORIES: '/stories/search',
  
  // User
  USER_PROFILE: '/user/profile',
  USER_FAVORITES: '/user/favorites',
  USER_READING_PROGRESS: '/user/reading-progress',
  
  // Categories
  CATEGORIES: '/categories',
  
  // AI Story Generation
  GENERATE_STORY: '/ai/generate-story',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const REQUEST_HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept',
} as const;

export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
} as const;