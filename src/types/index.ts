// Core application types and interfaces

import { ViewStyle } from 'react-native';
import { NavigationProp, RouteProp } from '@react-navigation/native';

// Base component interfaces
export interface BaseComponentProps {
  testID?: string;
  style?: ViewStyle | ViewStyle[];
}

export interface ScreenProps extends BaseComponentProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

// Story-related interfaces
export interface Story {
  id: string;
  title: string;
  description: string;
  image: string;
  content?: string;
  category?: string;
  readingTime?: number; // Estimated reading time in minutes
  ageGroup?: string; // Target age group
  tags?: string[]; // Story tags for filtering
  isFavorite?: boolean; // User favorite status
  lastRead?: Date | undefined; // Last read timestamp
  readCount?: number; // Number of times read
}

export interface EnhancedStory extends Story {
  content: string; // Full story content for reading
  readingTime: number; // Estimated reading time in minutes
  ageGroup: string; // Target age group
  tags: string[]; // Story tags for filtering
  isFavorite: boolean; // User favorite status
  lastRead?: Date | undefined; // Last read timestamp
  readCount: number; // Number of times read
}

export interface Category {
  id: string;
  name: string;
  stories: Story[];
}

export interface StoryCategory {
  id: string;
  name: string;
  description: string;
  color: string; // Category theme color
  icon: string; // Category icon name
  stories: EnhancedStory[];
}

// User interfaces
export interface User {
  id: string;
  email: string;
  name: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
  favoriteCategories: string[];
}

// Authentication interfaces
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  clearError: () => void;
}

// Re-export navigation types
export * from './navigation';

// Theme interfaces
export interface ColorPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface Colors {
  primary: ColorPalette;
  secondary: ColorPalette;
  neutral: ColorPalette;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface Typography {
  fontFamily: {
    regular: string;
    medium: string;
    bold: string;
    playful: string;
  };
  fontSize: {
    xs: number;
    sm: number;
    base: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface Spacing {
  0: number;
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
  6: number;
  8: number;
  10: number;
  12: number;
  16: number;
  20: number;
  24: number;
}

export interface Theme {
  colors: Colors;
  typography: Typography;
  spacing: Spacing;
}

// Component prop types
export interface ButtonProps extends BaseComponentProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'icon';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
}

export interface InputProps extends BaseComponentProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string | undefined;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  disabled?: boolean;
}

export interface CardProps extends BaseComponentProps {
  children: React.ReactNode;
  variant?: 'horizontal' | 'grid' | 'featured' | 'compact';
  onPress?: () => void;
  shadow?: boolean;
}

export interface StoryCardProps extends BaseComponentProps {
  story: Story;
  onPress: (story: Story) => void;
  variant?: 'horizontal' | 'grid' | 'featured';
  showFavorite?: boolean;
  onFavoritePress?: (story: Story) => void;
}

// API and service interfaces
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface StorageService {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

export interface StoryService {
  getAllStories: () => Promise<Story[]>;
  getStoriesByCategory: (categoryId: string) => Promise<Story[]>;
  getStoryById: (id: string) => Promise<Story | null>;
  getFavoriteStories: () => Promise<Story[]>;
  toggleFavorite: (storyId: string) => Promise<void>;
  updateReadingProgress: (storyId: string) => Promise<void>;
  getEnhancedStory: (storyId: string) => Promise<EnhancedStory | null>;
  addUserGeneratedStory: (story: Omit<EnhancedStory, 'id' | 'isFavorite' | 'readCount'>) => Promise<string>;
  deleteUserGeneratedStory: (storyId: string) => Promise<boolean>;
  getRecentlyReadStories: (limit?: number) => Promise<Story[]>;
  searchStories: (query: string) => Promise<Story[]>;
}

// Error handling interfaces
export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Responsive design types
export interface Breakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
}

export type ResponsiveValue<T> = T | { [key in keyof Breakpoints]?: T };

// Animation types
export interface AnimationConfig {
  duration: number;
  delay?: number;
  easing?: string;
}

export interface SplashAnimationConfig {
  logo: {
    scale: number[];
    opacity: number[];
    duration: number;
  };
  title: {
    translateY: number[];
    opacity: number[];
    delay: number;
    duration: number;
  };
  background: {
    colors: string[];
    duration: number;
  };
}

// Form validation types
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
}

export interface FormField {
  value: string;
  error?: string | undefined;
  touched: boolean;
  rules?: ValidationRule[];
}

export interface FormState {
  [key: string]: FormField;
}

// Create Story types (for AI generation)
export interface CreateStoryRequest {
  prompt: string;
  ageGroup: string;
  category: string;
}

export interface CreateStoryResponse {
  story: Story;
  success: boolean;
  error?: string;
}