import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { ViewToken } from 'react-native';
import { useMemoryManagement, createDebouncedFunction } from '../utils/memoryManagement';

interface UseOptimizedListOptions<T> {
  data: T[];
  keyExtractor: (item: T) => string;
  initialBatchSize?: number;
  batchSize?: number;
  preloadThreshold?: number;
  enableVirtualization?: boolean;
  onItemVisible?: (item: T) => void;
  onItemHidden?: (item: T) => void;
}

interface OptimizedListState<T> {
  visibleData: T[];
  isLoading: boolean;
  hasMore: boolean;
  visibleItems: Set<string>;
}

export const useOptimizedList = <T>({
  data,
  keyExtractor,
  initialBatchSize = 20,
  batchSize = 10,
  preloadThreshold = 5,
  enableVirtualization = true,
  onItemVisible,
  onItemHidden,
}: UseOptimizedListOptions<T>) => {
  const [state, setState] = useState<OptimizedListState<T>>({
    visibleData: data.slice(0, initialBatchSize),
    isLoading: false,
    hasMore: data.length > initialBatchSize,
    visibleItems: new Set(),
  });

  const loadingRef = useRef(false);
  const { registerCleanup, unregisterCleanup } = useMemoryManagement('optimized-list');

  // Update visible data when source data changes
  useEffect(() => {
    setState(prevState => ({
      ...prevState,
      visibleData: data.slice(0, Math.max(initialBatchSize, prevState.visibleData.length)),
      hasMore: data.length > prevState.visibleData.length,
    }));
  }, [data, initialBatchSize]);

  // Register memory cleanup
  useEffect(() => {
    registerCleanup(() => {
      setState(prevState => ({
        ...prevState,
        visibleData: data.slice(0, initialBatchSize),
        hasMore: data.length > initialBatchSize,
      }));
    }, 'medium');

    return () => {
      unregisterCleanup();
    };
  }, [registerCleanup, unregisterCleanup, data, initialBatchSize]);

  // Debounced load more function to prevent excessive calls
  const debouncedLoadMore = useMemo(
    () => createDebouncedFunction(() => {
      if (loadingRef.current || !state.hasMore) return;

      loadingRef.current = true;
      setState(prevState => ({ ...prevState, isLoading: true }));

      // Simulate async loading (in real app, this might be an API call)
      setTimeout(() => {
        setState(prevState => {
          const currentLength = prevState.visibleData.length;
          const newData = data.slice(0, currentLength + batchSize);
          const hasMore = newData.length < data.length;

          loadingRef.current = false;

          return {
            ...prevState,
            visibleData: newData,
            hasMore,
            isLoading: false,
          };
        });
      }, 100);
    }, 300),
    [data, batchSize, state.hasMore]
  );

  // Handle end reached
  const handleEndReached = useCallback(() => {
    if (enableVirtualization && state.hasMore && !state.isLoading) {
      debouncedLoadMore();
    }
  }, [enableVirtualization, state.hasMore, state.isLoading, debouncedLoadMore]);

  // Handle viewable items changed
  const handleViewableItemsChanged = useCallback(
    ({ viewableItems, changed }: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
      const newVisibleItems = new Set(viewableItems.map(item => keyExtractor(item.item)));

      setState(prevState => ({ ...prevState, visibleItems: newVisibleItems }));

      // Trigger callbacks for visibility changes
      changed.forEach(({ item, isViewable }) => {
        if (isViewable && onItemVisible) {
          onItemVisible(item);
        } else if (!isViewable && onItemHidden) {
          onItemHidden(item);
        }
      });

      // Load more items if we're near the end
      const lastVisibleIndex = Math.max(...viewableItems.map(item => item.index || 0));
      if (lastVisibleIndex >= state.visibleData.length - preloadThreshold) {
        handleEndReached();
      }
    },
    [keyExtractor, onItemVisible, onItemHidden, state.visibleData.length, preloadThreshold, handleEndReached]
  );

  // Memoized viewability config
  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  }), []);

  // Check if item is visible
  const isItemVisible = useCallback(
    (item: T) => state.visibleItems.has(keyExtractor(item)),
    [state.visibleItems, keyExtractor]
  );

  // Get visible item count
  const getVisibleItemCount = useCallback(() => state.visibleItems.size, [state.visibleItems]);

  // Reset list to initial state
  const resetList = useCallback(() => {
    setState({
      visibleData: data.slice(0, initialBatchSize),
      isLoading: false,
      hasMore: data.length > initialBatchSize,
      visibleItems: new Set(),
    });
  }, [data, initialBatchSize]);

  // Preload specific items
  const preloadItems = useCallback((itemKeys: string[]) => {
    const itemsToPreload = data.filter(item => itemKeys.includes(keyExtractor(item)));
    // In a real app, this would trigger image preloading or data prefetching
    console.log('Preloading items:', itemsToPreload.length);
  }, [data, keyExtractor]);

  return {
    // Data
    data: state.visibleData,
    isLoading: state.isLoading,
    hasMore: state.hasMore,
    
    // Event handlers
    onEndReached: handleEndReached,
    onViewableItemsChanged: handleViewableItemsChanged,
    viewabilityConfig,
    
    // Utility functions
    isItemVisible,
    getVisibleItemCount,
    resetList,
    preloadItems,
    
    // Manual controls
    loadMore: debouncedLoadMore,
  };
};