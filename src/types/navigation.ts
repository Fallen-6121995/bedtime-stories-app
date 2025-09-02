// Navigation type definitions for React Navigation

import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// Root Stack Navigator params
export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
  StoryDetail: {
    storyId: string;
    title?: string;
  };
  Settings: undefined;
};

// Authentication Stack params
export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
};

// Main Bottom Tab Navigator params
export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  Generate: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// Category Stack params (nested in Categories tab)
export type CategoryStackParamList = {
  CategoryList: undefined;
  CategoryDetail: {
    categoryId: string;
    categoryName: string;
  };
};

// Screen props types for type-safe navigation
export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = 
  NativeStackScreenProps<AuthStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> = 
  BottomTabScreenProps<MainTabParamList, T>;

export type CategoryStackScreenProps<T extends keyof CategoryStackParamList> = 
  NativeStackScreenProps<CategoryStackParamList, T>;

// Combined props for screens that need both navigation and route
export type HomeScreenProps = MainTabScreenProps<'Home'>;
export type CategoriesScreenProps = MainTabScreenProps<'Categories'>;
export type GenerateScreenProps = MainTabScreenProps<'Generate'>;
export type FavoritesScreenProps = MainTabScreenProps<'Favorites'>;
export type ProfileScreenProps = MainTabScreenProps<'Profile'>;
export type LoginScreenProps = AuthStackScreenProps<'Login'>;
export type SignupScreenProps = AuthStackScreenProps<'Signup'>;
export type SplashScreenProps = RootStackScreenProps<'Splash'>;
export type StoryDetailScreenProps = RootStackScreenProps<'StoryDetail'>;
export type SettingsScreenProps = RootStackScreenProps<'Settings'>;

// Navigation utilities
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}