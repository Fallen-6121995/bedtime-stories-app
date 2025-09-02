// Navigation utilities and helper functions

import React from 'react';
import { NavigationContainerRef, CommonActions } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

// Navigation reference for navigating outside of React components
export const navigationRef = React.createRef<NavigationContainerRef<RootStackParamList>>();

// Navigation helper functions
export const NavigationUtils = {
  // Navigate to a screen
  navigate: (name: keyof RootStackParamList, params?: any) => {
    navigationRef.current?.navigate(name as never, params as never);
  },

  // Go back to previous screen
  goBack: () => {
    navigationRef.current?.goBack();
  },

  // Reset navigation stack
  reset: (routeName: keyof RootStackParamList, params?: any) => {
    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName as never, params }],
      })
    );
  },

  // Navigate to story detail
  navigateToStoryDetail: (storyId: string, title?: string) => {
    navigationRef.current?.navigate('StoryDetail', { 
      storyId, 
      ...(title && { title }) 
    });
  },

  // Navigate to settings
  navigateToSettings: () => {
    navigationRef.current?.navigate('Settings');
  },

  // Navigate to main app (after authentication)
  navigateToMain: () => {
    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      })
    );
  },

  // Navigate to authentication (after logout)
  navigateToAuth: () => {
    navigationRef.current?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      })
    );
  },

  // Get current route name
  getCurrentRouteName: (): string | undefined => {
    return navigationRef.current?.getCurrentRoute()?.name;
  },

  // Check if we can go back
  canGoBack: (): boolean => {
    return navigationRef.current?.canGoBack() ?? false;
  },
};

// Deep linking configuration
export const linkingConfig = {
  prefixes: ['bedtimestories://'],
  config: {
    screens: {
      Splash: 'splash',
      Auth: {
        screens: {
          Login: 'login',
          Signup: 'signup',
        },
      },
      Main: {
        screens: {
          Home: 'home',
          Categories: 'categories',
          Generate: 'create',
          Favorites: 'favorites',
          Profile: 'profile',
        },
      },
      StoryDetail: 'story/:storyId',
      Settings: 'settings',
    },
  },
};

// Navigation state management
export interface NavigationState {
  isReady: boolean;
  initialRouteName?: keyof RootStackParamList;
}

export const initialNavigationState: NavigationState = {
  isReady: false,
  initialRouteName: 'Splash',
};

// Navigation event listeners
export const NavigationListeners = {
  onStateChange: (state: any) => {
    // Track navigation state changes for analytics or debugging
    const currentRouteName = state?.routes[state?.index]?.name;
    console.log('Navigation changed to:', currentRouteName);
  },

  onReady: () => {
    // Called when navigation is ready
    console.log('Navigation is ready');
  },
};