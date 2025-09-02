// Hook for managing feedback animations and notifications

import { useState, useCallback, useRef } from 'react';

interface FeedbackState {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  visible: boolean;
  id: string;
}

interface UseFeedbackReturn {
  feedback: FeedbackState | null;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  hideFeedback: () => void;
}

export const useFeedback = (): UseFeedbackReturn => {
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showFeedback = useCallback((
    type: FeedbackState['type'],
    message: string,
    duration: number = 3000
  ) => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const id = Date.now().toString();
    
    setFeedback({
      type,
      message,
      visible: true,
      id,
    });

    // Auto-hide after duration
    timeoutRef.current = setTimeout(() => {
      setFeedback(prev => prev ? { ...prev, visible: false } : null);
    }, duration);
  }, []);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showFeedback('success', message, duration);
  }, [showFeedback]);

  const showError = useCallback((message: string, duration?: number) => {
    showFeedback('error', message, duration);
  }, [showFeedback]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showFeedback('info', message, duration);
  }, [showFeedback]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showFeedback('warning', message, duration);
  }, [showFeedback]);

  const hideFeedback = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setFeedback(prev => prev ? { ...prev, visible: false } : null);
  }, []);

  return {
    feedback,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hideFeedback,
  };
};