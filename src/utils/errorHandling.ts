// Error handling utilities for services and data operations

import { AppError } from '../types';

// Error types
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  DATA_ERROR = 'DATA_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Error codes
export enum ErrorCode {
  // Validation errors
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Storage errors
  STORAGE_READ_FAILED = 'STORAGE_READ_FAILED',
  STORAGE_WRITE_FAILED = 'STORAGE_WRITE_FAILED',
  STORAGE_DELETE_FAILED = 'STORAGE_DELETE_FAILED',
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
  
  // Network errors
  NETWORK_UNAVAILABLE = 'NETWORK_UNAVAILABLE',
  REQUEST_TIMEOUT = 'REQUEST_TIMEOUT',
  SERVER_ERROR = 'SERVER_ERROR',
  
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  
  // Data errors
  STORY_NOT_FOUND = 'STORY_NOT_FOUND',
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  DATA_CORRUPTION = 'DATA_CORRUPTION',
  
  // Unknown errors
  UNKNOWN = 'UNKNOWN',
}

// Create standardized error
export const createAppError = (
  code: ErrorCode,
  message: string,
  details?: any
): AppError => ({
  code,
  message,
  details,
});

// Error factory functions
export const createValidationError = (message: string, details?: any): AppError =>
  createAppError(ErrorCode.INVALID_INPUT, message, details);

export const createStorageError = (operation: string, details?: any): AppError =>
  createAppError(ErrorCode.STORAGE_READ_FAILED, `Storage ${operation} failed`, details);

export const createNetworkError = (message: string, details?: any): AppError =>
  createAppError(ErrorCode.NETWORK_UNAVAILABLE, message, details);

export const createAuthError = (message: string, details?: any): AppError =>
  createAppError(ErrorCode.UNAUTHORIZED, message, details);

export const createDataError = (message: string, details?: any): AppError =>
  createAppError(ErrorCode.STORY_NOT_FOUND, message, details);

// Error handling wrapper for async operations
export const handleAsyncOperation = async <T>(
  operation: () => Promise<T>,
  errorContext: string
): Promise<{ success: true; data: T } | { success: false; error: AppError }> => {
  try {
    const data = await operation();
    return { success: true, data };
  } catch (error) {
    const appError = normalizeError(error, errorContext);
    console.error(`Error in ${errorContext}:`, appError);
    return { success: false, error: appError };
  }
};

// Error handling wrapper for sync operations
export const handleSyncOperation = <T>(
  operation: () => T,
  errorContext: string
): { success: true; data: T } | { success: false; error: AppError } => {
  try {
    const data = operation();
    return { success: true, data };
  } catch (error) {
    const appError = normalizeError(error, errorContext);
    console.error(`Error in ${errorContext}:`, appError);
    return { success: false, error: appError };
  }
};

// Normalize different error types to AppError
export const normalizeError = (error: any, context: string): AppError => {
  // If it's already an AppError, return as is
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    return error as AppError;
  }

  // Handle different error types
  if (error instanceof Error) {
    // Network errors
    if (error.message.includes('Network') || error.message.includes('fetch')) {
      return createNetworkError(error.message, { originalError: error, context });
    }
    
    // Storage errors
    if (error.message.includes('AsyncStorage') || error.message.includes('storage')) {
      return createStorageError('operation', { originalError: error, context });
    }
    
    // Authentication errors
    if (error.message.includes('auth') || error.message.includes('unauthorized')) {
      return createAuthError(error.message, { originalError: error, context });
    }
    
    // Generic error
    return createAppError(ErrorCode.UNKNOWN, error.message, { originalError: error, context });
  }

  // Handle string errors
  if (typeof error === 'string') {
    return createAppError(ErrorCode.UNKNOWN, error, { context });
  }

  // Handle unknown error types
  return createAppError(
    ErrorCode.UNKNOWN,
    'An unknown error occurred',
    { originalError: error, context }
  );
};

// Retry mechanism for operations
export const retryOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  backoffMultiplier: number = 2
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying with exponential backoff
      const waitTime = delay * Math.pow(backoffMultiplier, attempt - 1);
      await new Promise<void>(resolve => setTimeout(() => resolve(), waitTime));
    }
  }
  
  throw lastError;
};

// Error recovery strategies
export const recoverFromStorageError = async <T>(
  operation: () => Promise<T>,
  fallbackValue: T
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.warn('Storage operation failed, using fallback value:', error);
    return fallbackValue;
  }
};

export const recoverFromNetworkError = async <T>(
  operation: () => Promise<T>,
  cacheOperation: () => Promise<T>
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.warn('Network operation failed, trying cache:', error);
    return await cacheOperation();
  }
};

// Error logging and reporting
export const logError = (error: AppError, context?: string): void => {
  const logData = {
    timestamp: new Date().toISOString(),
    code: error.code,
    message: error.message,
    details: error.details,
    context,
  };
  
  console.error('App Error:', logData);
  
  // In a production app, you might want to send this to a logging service
  // reportErrorToService(logData);
};

// User-friendly error messages
export const getUserFriendlyErrorMessage = (error: AppError): string => {
  switch (error.code) {
    case ErrorCode.NETWORK_UNAVAILABLE:
      return 'Please check your internet connection and try again.';
    
    case ErrorCode.STORAGE_QUOTA_EXCEEDED:
      return 'Storage is full. Please free up some space and try again.';
    
    case ErrorCode.UNAUTHORIZED:
      return 'Please log in to continue.';
    
    case ErrorCode.SESSION_EXPIRED:
      return 'Your session has expired. Please log in again.';
    
    case ErrorCode.STORY_NOT_FOUND:
      return 'The requested story could not be found.';
    
    case ErrorCode.INVALID_INPUT:
      return 'Please check your input and try again.';
    
    case ErrorCode.SERVER_ERROR:
      return 'Something went wrong on our end. Please try again later.';
    
    default:
      return 'Something went wrong. Please try again.';
  }
};

// Error boundary helpers
export const shouldShowErrorBoundary = (error: AppError): boolean => {
  // Show error boundary for critical errors
  const criticalErrors = [
    ErrorCode.DATA_CORRUPTION,
    ErrorCode.UNKNOWN,
  ];
  
  return criticalErrors.includes(error.code as ErrorCode);
};

export const getErrorBoundaryMessage = (_error: AppError): string => {
  return 'Something went wrong. Please restart the app or contact support if the problem persists.';
};

// Validation error helpers
export const formatValidationErrors = (errors: string[]): string => {
  if (errors.length === 1) {
    return errors[0];
  }
  
  return `Multiple errors: ${errors.join(', ')}`;
};

export const createValidationErrorFromArray = (errors: string[]): AppError => {
  return createValidationError(formatValidationErrors(errors), { errors });
};

// Service error handlers
export const handleServiceError = (
  error: any,
  serviceName: string,
  operation: string
): AppError => {
  const context = `${serviceName}.${operation}`;
  const normalizedError = normalizeError(error, context);
  logError(normalizedError, context);
  return normalizedError;
};

// Async error boundary
export const asyncErrorBoundary = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      const appError = normalizeError(error, fn.name);
      logError(appError);
      throw appError;
    }
  };
};