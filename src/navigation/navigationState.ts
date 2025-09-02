// Navigation state management utilities

import { createContext, useContext } from 'react';

// Navigation state interface
export interface NavigationStateType {
  currentRoute: string | null;
  previousRoute: string | null;
  isNavigating: boolean;
  canGoBack: boolean;
}

// Initial navigation state
export const initialNavigationState: NavigationStateType = {
  currentRoute: null,
  previousRoute: null,
  isNavigating: false,
  canGoBack: false,
};

// Navigation state context
export const NavigationStateContext = createContext<{
  state: NavigationStateType;
  updateState: (updates: Partial<NavigationStateType>) => void;
} | null>(null);

// Hook to use navigation state
export const useNavigationState = () => {
  const context = useContext(NavigationStateContext);
  if (!context) {
    throw new Error('useNavigationState must be used within NavigationStateProvider');
  }
  return context;
};

// Navigation state actions
export const NavigationStateActions = {
  setCurrentRoute: (route: string) => ({
    type: 'SET_CURRENT_ROUTE' as const,
    payload: route,
  }),
  
  setPreviousRoute: (route: string) => ({
    type: 'SET_PREVIOUS_ROUTE' as const,
    payload: route,
  }),
  
  setNavigating: (isNavigating: boolean) => ({
    type: 'SET_NAVIGATING' as const,
    payload: isNavigating,
  }),
  
  setCanGoBack: (canGoBack: boolean) => ({
    type: 'SET_CAN_GO_BACK' as const,
    payload: canGoBack,
  }),
};

export type NavigationStateAction = ReturnType<typeof NavigationStateActions[keyof typeof NavigationStateActions]>;

// Navigation state reducer
export const navigationStateReducer = (
  state: NavigationStateType,
  action: NavigationStateAction
): NavigationStateType => {
  switch (action.type) {
    case 'SET_CURRENT_ROUTE':
      return {
        ...state,
        previousRoute: state.currentRoute,
        currentRoute: action.payload,
      };
    case 'SET_PREVIOUS_ROUTE':
      return {
        ...state,
        previousRoute: action.payload,
      };
    case 'SET_NAVIGATING':
      return {
        ...state,
        isNavigating: action.payload,
      };
    case 'SET_CAN_GO_BACK':
      return {
        ...state,
        canGoBack: action.payload,
      };
    default:
      return state;
  }
};