// Authentication hook

import { useReducer, useEffect, useCallback } from 'react';
import { User, AuthState } from '../types';
import { authService } from '../services';
import { getErrorMessage } from '../utils';

// Auth action types
type AuthAction =
  | { type: 'AUTH_LOADING' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User } }
  | { type: 'AUTH_ERROR'; payload: { error: string } }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'AUTH_CLEAR_ERROR' }
  | { type: 'AUTH_UPDATE_USER'; payload: { user: User } };

// Auth reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_LOADING':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        isAuthenticated: true,
        user: action.payload.user,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        isLoading: false,
        error: action.payload.error,
      };
    case 'AUTH_LOGOUT':
      return {
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      };
    case 'AUTH_CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    case 'AUTH_UPDATE_USER':
      return {
        ...state,
        user: action.payload.user,
        isLoading: false,
      };
    default:
      return state;
  }
};

const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
  error: null,
};

export const useAuth = () => {
  const [authState, dispatch] = useReducer(authReducer, initialAuthState);

  // Initialize auth state and restore session
  useEffect(() => {
    const initializeAuth = async () => {
      dispatch({ type: 'AUTH_LOADING' });
      
      try {
        // Create demo user for testing
        await authService.createDemoUser();
        
        // Try to restore session
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
        } else {
          dispatch({ type: 'AUTH_LOGOUT' });
        }
      } catch (error) {
        dispatch({ type: 'AUTH_ERROR', payload: { error: getErrorMessage(error) } });
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      const user = await authService.login(email, password);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'AUTH_ERROR', payload: { error: errorMessage } });
      throw error;
    }
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      const user = await authService.signup(email, password, name);
      dispatch({ type: 'AUTH_SUCCESS', payload: { user } });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'AUTH_ERROR', payload: { error: errorMessage } });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      await authService.logout();
      dispatch({ type: 'AUTH_LOGOUT' });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'AUTH_ERROR', payload: { error: errorMessage } });
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>) => {
    if (!authState.user) return;

    dispatch({ type: 'AUTH_LOADING' });
    
    try {
      const updatedUser = await authService.updateProfile(updates);
      dispatch({ type: 'AUTH_UPDATE_USER', payload: { user: updatedUser } });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch({ type: 'AUTH_ERROR', payload: { error: errorMessage } });
      throw error;
    }
  }, [authState.user]);

  const clearError = useCallback(() => {
    dispatch({ type: 'AUTH_CLEAR_ERROR' });
  }, []);

  return {
    ...authState,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };
};