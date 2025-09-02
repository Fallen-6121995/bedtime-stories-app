// AsyncStorage hook for data persistence

import { useState, useEffect, useCallback } from 'react';
import { storageService } from '../services';
import { safeJsonParse, safeJsonStringify } from '../utils';

export const useAsyncStorage = <T>(key: string, defaultValue: T) => {
  const [value, setValue] = useState<T>(defaultValue);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial value
  useEffect(() => {
    const loadValue = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const storedValue = await storageService.getItem(key);
        if (storedValue !== null) {
          const parsedValue = safeJsonParse<T>(storedValue, defaultValue);
          setValue(parsedValue);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
        console.error(`Error loading ${key} from storage:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [key, defaultValue]);

  const updateValue = useCallback(async (newValue: T) => {
    try {
      setError(null);
      const serializedValue = safeJsonStringify(newValue);
      await storageService.setItem(key, serializedValue);
      setValue(newValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save data');
      console.error(`Error saving ${key} to storage:`, err);
      throw err;
    }
  }, [key]);

  const removeValue = useCallback(async () => {
    try {
      setError(null);
      await storageService.removeItem(key);
      setValue(defaultValue);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to remove data');
      console.error(`Error removing ${key} from storage:`, err);
      throw err;
    }
  }, [key, defaultValue]);

  const refreshValue = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const storedValue = await storageService.getItem(key);
      if (storedValue !== null) {
        const parsedValue = safeJsonParse<T>(storedValue, defaultValue);
        setValue(parsedValue);
      } else {
        setValue(defaultValue);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh data');
      console.error(`Error refreshing ${key} from storage:`, err);
    } finally {
      setIsLoading(false);
    }
  }, [key, defaultValue]);

  return {
    value,
    setValue: updateValue,
    removeValue,
    refreshValue,
    isLoading,
    error,
  };
};