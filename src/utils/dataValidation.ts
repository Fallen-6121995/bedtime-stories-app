// Data validation utilities for story data and services

import { EnhancedStory, StoryCategory, User, UserPreferences, CreateStoryRequest } from '../types';

// Story validation
export const validateStory = (story: Partial<EnhancedStory>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields
  if (!story.id || story.id.trim().length === 0) {
    errors.push('Story ID is required');
  }

  if (!story.title || story.title.trim().length === 0) {
    errors.push('Story title is required');
  } else if (story.title.length > 100) {
    errors.push('Story title must be 100 characters or less');
  }

  if (!story.description || story.description.trim().length === 0) {
    errors.push('Story description is required');
  } else if (story.description.length > 500) {
    errors.push('Story description must be 500 characters or less');
  }

  if (!story.content || story.content.trim().length === 0) {
    errors.push('Story content is required');
  } else if (story.content.length > 50000) {
    errors.push('Story content must be 50,000 characters or less');
  }

  if (!story.image || story.image.trim().length === 0) {
    errors.push('Story image URL is required');
  } else if (!isValidUrl(story.image)) {
    errors.push('Story image must be a valid URL');
  }

  // Optional but validated fields
  if (story.readingTime !== undefined && (story.readingTime < 1 || story.readingTime > 120)) {
    errors.push('Reading time must be between 1 and 120 minutes');
  }

  if (story.ageGroup && !isValidAgeGroup(story.ageGroup)) {
    errors.push('Age group must be in format "X-Y years" (e.g., "4-8 years")');
  }

  if (story.tags && (!Array.isArray(story.tags) || story.tags.some(tag => typeof tag !== 'string'))) {
    errors.push('Tags must be an array of strings');
  }

  if (story.readCount !== undefined && (story.readCount < 0 || !Number.isInteger(story.readCount))) {
    errors.push('Read count must be a non-negative integer');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Story category validation
export const validateStoryCategory = (category: Partial<StoryCategory>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!category.id || category.id.trim().length === 0) {
    errors.push('Category ID is required');
  }

  if (!category.name || category.name.trim().length === 0) {
    errors.push('Category name is required');
  } else if (category.name.length > 50) {
    errors.push('Category name must be 50 characters or less');
  }

  if (!category.description || category.description.trim().length === 0) {
    errors.push('Category description is required');
  } else if (category.description.length > 200) {
    errors.push('Category description must be 200 characters or less');
  }

  if (!category.color || !isValidHexColor(category.color)) {
    errors.push('Category color must be a valid hex color (e.g., #FF6B9D)');
  }

  if (!category.icon || category.icon.trim().length === 0) {
    errors.push('Category icon is required');
  }

  if (!category.stories || !Array.isArray(category.stories)) {
    errors.push('Category must have a stories array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// User preferences validation
export const validateUserPreferences = (preferences: Partial<UserPreferences>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (preferences.fontSize && !['small', 'medium', 'large'].includes(preferences.fontSize)) {
    errors.push('Font size must be "small", "medium", or "large"');
  }

  if (preferences.theme && !['light', 'dark'].includes(preferences.theme)) {
    errors.push('Theme must be "light" or "dark"');
  }

  if (preferences.favoriteCategories) {
    if (!Array.isArray(preferences.favoriteCategories)) {
      errors.push('Favorite categories must be an array');
    } else if (preferences.favoriteCategories.some(cat => typeof cat !== 'string')) {
      errors.push('Favorite categories must be an array of strings');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Create story request validation
export const validateCreateStoryRequest = (request: Partial<CreateStoryRequest>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!request.prompt || request.prompt.trim().length === 0) {
    errors.push('Story prompt is required');
  } else if (request.prompt.length < 10) {
    errors.push('Story prompt must be at least 10 characters');
  } else if (request.prompt.length > 500) {
    errors.push('Story prompt must be 500 characters or less');
  }

  if (!request.ageGroup || !isValidAgeGroup(request.ageGroup)) {
    errors.push('Valid age group is required (e.g., "4-8 years")');
  }

  if (!request.category || request.category.trim().length === 0) {
    errors.push('Story category is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// User validation
export const validateUser = (user: Partial<User>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!user.id || user.id.trim().length === 0) {
    errors.push('User ID is required');
  }

  if (!user.email || user.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!isValidEmail(user.email)) {
    errors.push('Email must be a valid email address');
  }

  if (!user.name || user.name.trim().length === 0) {
    errors.push('Name is required');
  } else if (user.name.length > 100) {
    errors.push('Name must be 100 characters or less');
  }

  if (user.preferences) {
    const preferencesValidation = validateUserPreferences(user.preferences);
    if (!preferencesValidation.isValid) {
      errors.push(...preferencesValidation.errors);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper validation functions
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidHexColor = (color: string): boolean => {
  const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  return hexColorRegex.test(color);
};

export const isValidAgeGroup = (ageGroup: string): boolean => {
  const ageGroupRegex = /^\d+-\d+\s+years?$/i;
  return ageGroupRegex.test(ageGroup);
};

// Data sanitization functions
export const sanitizeStoryContent = (content: string): string => {
  return content
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n{3,}/g, '\n\n'); // Replace multiple newlines with double newline
};

export const sanitizeUserInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 1000); // Limit length
};

// Data transformation validation
export const validateDataTransformation = <T>(
  originalData: any,
  transformedData: T,
  requiredFields: (keyof T)[]
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Check if transformation preserved required fields
  for (const field of requiredFields) {
    if (transformedData[field] === undefined || transformedData[field] === null) {
      errors.push(`Required field '${String(field)}' is missing after transformation`);
    }
  }

  // Check if transformation didn't introduce invalid data
  if (typeof transformedData !== 'object' || transformedData === null) {
    errors.push('Transformed data must be an object');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Batch validation for arrays
export const validateStoryArray = (stories: Partial<EnhancedStory>[]): { isValid: boolean; errors: string[]; validStories: EnhancedStory[] } => {
  const errors: string[] = [];
  const validStories: EnhancedStory[] = [];

  stories.forEach((story, index) => {
    const validation = validateStory(story);
    if (!validation.isValid) {
      errors.push(`Story at index ${index}: ${validation.errors.join(', ')}`);
    } else {
      validStories.push(story as EnhancedStory);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    validStories
  };
};

// Storage data validation
export const validateStorageData = (key: string, data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!key || key.trim().length === 0) {
    errors.push('Storage key is required');
  }

  if (data === undefined) {
    errors.push('Storage data cannot be undefined');
  }

  // Check if data can be serialized
  try {
    JSON.stringify(data);
  } catch (error) {
    errors.push('Storage data must be serializable to JSON');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};