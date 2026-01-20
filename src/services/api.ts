import type { Story, Category } from '../types/story';

// Replace with your actual backend URL
const API_BASE_URL = 'http://localhost:3000/api'; // TODO: Update this

/**
 * Fetch featured stories from backend
 */
export const fetchFeaturedStories = async (): Promise<Story[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/featured`);
    if (!response.ok) {
      throw new Error('Failed to fetch stories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching featured stories:', error);
    throw error;
  }
};

/**
 * Fetch all categories from backend
 */
export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

/**
 * Fetch stories by category
 */
export const fetchStoriesByCategory = async (categoryId: string): Promise<Story[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories?category=${categoryId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch stories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching stories by category:', error);
    throw error;
  }
};

/**
 * Fetch single story details
 */
export const fetchStoryById = async (storyId: string): Promise<Story> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/${storyId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch story');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching story:', error);
    throw error;
  }
};

/**
 * Search stories
 */
export const searchStories = async (query: string): Promise<Story[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/stories/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) {
      throw new Error('Failed to search stories');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching stories:', error);
    throw error;
  }
};
