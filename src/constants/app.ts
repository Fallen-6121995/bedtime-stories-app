// Application constants

export const APP_CONFIG = {
  name: 'Bedtime Stories',
  version: '1.0.0',
  description: 'A delightful bedtime stories app for children',
} as const;

export const SCREEN_NAMES = {
  // Auth Stack
  SPLASH: 'Splash',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  
  // Main Stack
  MAIN: 'Main',
  STORY_DETAIL: 'StoryDetail',
  SETTINGS: 'Settings',
  
  // Bottom Tabs
  HOME: 'Home',
  CATEGORIES: 'Categories',
  FAVORITES: 'Favorites',
  PROFILE: 'Profile',
  CREATE_STORY: 'CreateStory',
} as const;

export const CATEGORY_COLORS = {
  'Fairy Tales': '#FF6B9D',
  'Adventure': '#4ECDC4',
  'Moral Stories': '#45B7D1',
  'Bedtime Stories': '#96CEB4',
  'Fantasy': '#FFEAA7',
  'Animals': '#DDA0DD',
  'Science': '#98D8C8',
  'History': '#F7DC6F',
} as const;

export const AGE_GROUPS = [
  '2-4 years',
  '4-6 years',
  '6-8 years',
  '8-10 years',
  '10+ years',
] as const;

export const STORY_CATEGORIES = [
  'Fairy Tales',
  'Adventure',
  'Moral Stories',
  'Bedtime Stories',
  'Fantasy',
  'Animals',
  'Science',
  'History',
] as const;

export const READING_SPEEDS = {
  SLOW: 150, // words per minute
  AVERAGE: 200,
  FAST: 250,
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  SPLASH: 2000,
} as const;

export const TOUCH_TARGET_SIZE = {
  SMALL: 32,
  MEDIUM: 44, // iOS HIG minimum
  LARGE: 56,
} as const;

export const MAX_STORY_TITLE_LENGTH = 100;
export const MAX_STORY_DESCRIPTION_LENGTH = 500;
export const MAX_STORY_CONTENT_LENGTH = 10000;

export const DEFAULT_PAGINATION_LIMIT = 20;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Please check your internet connection and try again.',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  AUTH_ERROR: 'Authentication failed. Please try again.',
  PERMISSION_ERROR: 'Permission denied. Please check your settings.',
} as const;