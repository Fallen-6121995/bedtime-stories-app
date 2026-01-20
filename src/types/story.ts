// TypeScript interfaces for backend data

export interface Story {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  category?: string;
  tags?: string[];
  duration?: number; // in minutes
  ageGroup?: string;
  author?: string;
  coverImage?: string;
  audioUrl?: string;
  createdAt?: string;
  isFavorite?: boolean;
  isNew?: boolean;
}

export interface Category {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  storyCount?: number;
  icon?: string; // Emoji icon from backend
  color?: string; // Hex color from backend
  slug?: string; // URL-friendly slug
  promptKey?: string; // Key for story generation
}

export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  favoriteStories?: string[];
  recentStories?: string[];
}
