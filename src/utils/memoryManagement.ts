import { AppState, AppStateStatus } from 'react-native';

interface MemoryCleanupCallback {
  id: string;
  cleanup: () => void;
  priority: 'high' | 'medium' | 'low';
}

class MemoryManager {
  private cleanupCallbacks: Map<string, MemoryCleanupCallback> = new Map();
  private isAppInBackground = false;
  private memoryWarningListeners: Set<() => void> = new Set();

  constructor() {
    this.setupAppStateListener();
    this.setupMemoryWarningListener();
  }

  /**
   * Register a cleanup callback that will be called when memory needs to be freed
   */
  registerCleanupCallback(
    id: string,
    cleanup: () => void,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ): void {
    this.cleanupCallbacks.set(id, { id, cleanup, priority });
  }

  /**
   * Unregister a cleanup callback
   */
  unregisterCleanupCallback(id: string): void {
    this.cleanupCallbacks.delete(id);
  }

  /**
   * Register a memory warning listener
   */
  addMemoryWarningListener(listener: () => void): void {
    this.memoryWarningListeners.add(listener);
  }

  /**
   * Remove a memory warning listener
   */
  removeMemoryWarningListener(listener: () => void): void {
    this.memoryWarningListeners.delete(listener);
  }

  /**
   * Manually trigger memory cleanup
   */
  performCleanup(priority?: 'high' | 'medium' | 'low'): void {
    const callbacks = Array.from(this.cleanupCallbacks.values());
    
    // Sort by priority (high first)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    callbacks.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    callbacks.forEach(callback => {
      if (!priority || callback.priority === priority) {
        try {
          callback.cleanup();
        } catch (error) {
          console.warn(`Memory cleanup failed for ${callback.id}:`, error);
        }
      }
    });
  }

  /**
   * Get memory usage statistics (simplified for React Native)
   */
  getMemoryStats(): { registeredCallbacks: number; isAppInBackground: boolean } {
    return {
      registeredCallbacks: this.cleanupCallbacks.size,
      isAppInBackground: this.isAppInBackground,
    };
  }

  private setupAppStateListener(): void {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  private handleAppStateChange = (nextAppState: AppStateStatus): void => {
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      this.isAppInBackground = true;
      // Perform cleanup when app goes to background
      this.performCleanup('low');
    } else if (nextAppState === 'active') {
      this.isAppInBackground = false;
    }
  };

  private setupMemoryWarningListener(): void {
    // React Native doesn't have a direct memory warning API
    // This is a placeholder for potential native module integration
    // or custom memory monitoring implementation
  }

  /**
   * Cleanup when the manager is destroyed
   */
  destroy(): void {
    AppState.removeEventListener('change', this.handleAppStateChange);
    this.cleanupCallbacks.clear();
    this.memoryWarningListeners.clear();
  }
}

// Export singleton instance
export const memoryManager = new MemoryManager();

/**
 * Hook for component-level memory management
 */
export const useMemoryManagement = (componentId: string) => {
  const registerCleanup = (
    cleanup: () => void,
    priority: 'high' | 'medium' | 'low' = 'medium'
  ) => {
    memoryManager.registerCleanupCallback(componentId, cleanup, priority);
  };

  const unregisterCleanup = () => {
    memoryManager.unregisterCleanupCallback(componentId);
  };

  return {
    registerCleanup,
    unregisterCleanup,
    performCleanup: () => memoryManager.performCleanup(),
    getMemoryStats: () => memoryManager.getMemoryStats(),
  };
};

/**
 * Utility for debouncing expensive operations
 */
export const createDebouncedFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  }) as T;
};

/**
 * Utility for throttling expensive operations
 */
export const createThrottledFunction = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  let lastCall = 0;
  
  return ((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return func(...args);
    }
  }) as T;
};

/**
 * Utility for creating memoized selectors
 */
export const createMemoizedSelector = <TInput, TOutput>(
  selector: (input: TInput) => TOutput,
  equalityFn?: (a: TOutput, b: TOutput) => boolean
) => {
  let lastInput: TInput;
  let lastOutput: TOutput;
  let hasResult = false;

  const defaultEqualityFn = (a: TOutput, b: TOutput) => a === b;
  const isEqual = equalityFn || defaultEqualityFn;

  return (input: TInput): TOutput => {
    if (!hasResult || input !== lastInput) {
      const newOutput = selector(input);
      
      if (!hasResult || !isEqual(lastOutput, newOutput)) {
        lastOutput = newOutput;
      }
      
      lastInput = input;
      hasResult = true;
    }
    
    return lastOutput;
  };
};

/**
 * Utility for batch processing large datasets
 */
export const processBatch = async <T, R>(
  items: T[],
  processor: (item: T) => R | Promise<R>,
  batchSize: number = 10,
  delay: number = 0
): Promise<R[]> => {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    
    // Add delay between batches to prevent blocking the main thread
    if (delay > 0 && i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  return results;
};