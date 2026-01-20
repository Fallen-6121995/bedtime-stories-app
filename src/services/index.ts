/**
 * Services Index
 * Central export point for all services
 */

// Authentication
export { default as AuthService } from './auth/AuthService';

// User
export { default as UserService } from './user/UserService';

// Storage
export { default as TokenManager } from './storage/TokenManager';
export { default as UserManager } from './storage/UserManager';

// API
export { default as ApiClient } from './api/ApiClient';

// Category
export { default as CategoryService } from './category/CategoryService';

// Story
export { default as StoryService } from './story/StoryService';

// Types
export * from './types/auth.types';

// Re-export existing API functions for backward compatibility
export * from './api';
