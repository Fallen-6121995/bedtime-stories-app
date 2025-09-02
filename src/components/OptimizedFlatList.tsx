import React, { useMemo, useCallback, memo } from 'react';
import {
  FlatList,
  FlatListProps,
  ListRenderItem,
  ViewToken,
  Dimensions,
} from 'react-native';

interface OptimizedFlatListProps<T> extends Omit<FlatListProps<T>, 'renderItem' | 'keyExtractor'> {
  data: T[];
  renderItem: ListRenderItem<T>;
  keyExtractor: (item: T, index: number) => string;
  itemHeight?: number;
  estimatedItemSize?: number;
  windowSize?: number;
  maxToRenderPerBatch?: number;
  updateCellsBatchingPeriod?: number;
  removeClippedSubviews?: boolean;
  onViewableItemsChanged?: (info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => void;
}

const { height: screenHeight } = Dimensions.get('window');

function OptimizedFlatListComponent<T>({
  data,
  renderItem,
  keyExtractor,
  itemHeight,
  estimatedItemSize = 200,
  windowSize = 10,
  maxToRenderPerBatch = 5,
  updateCellsBatchingPeriod = 50,
  removeClippedSubviews = true,
  onViewableItemsChanged,
  ...props
}: OptimizedFlatListProps<T>) {
  
  // Memoize the key extractor to prevent unnecessary re-renders
  const memoizedKeyExtractor = useCallback(
    (item: T, index: number) => keyExtractor(item, index),
    [keyExtractor]
  );

  // Memoize the render item function
  const memoizedRenderItem = useCallback(
    (info: { item: T; index: number }) => renderItem(info),
    [renderItem]
  );

  // Calculate getItemLayout if itemHeight is provided
  const getItemLayout = useMemo(() => {
    if (!itemHeight) return undefined;
    
    return (data: T[] | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    });
  }, [itemHeight]);

  // Optimize viewability config
  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 300,
  }), []);

  // Memoize viewable items changed handler
  const memoizedOnViewableItemsChanged = useMemo(() => {
    if (!onViewableItemsChanged) return undefined;
    
    return { onViewableItemsChanged, viewabilityConfig };
  }, [onViewableItemsChanged, viewabilityConfig]);

  // Calculate initial number of items to render
  const initialNumToRender = useMemo(() => {
    if (itemHeight) {
      return Math.ceil(screenHeight / itemHeight) + 2;
    }
    return Math.ceil(screenHeight / estimatedItemSize) + 2;
  }, [itemHeight, estimatedItemSize]);

  return (
    <FlatList
      data={data}
      renderItem={memoizedRenderItem}
      keyExtractor={memoizedKeyExtractor}
      getItemLayout={getItemLayout}
      initialNumToRender={initialNumToRender}
      maxToRenderPerBatch={maxToRenderPerBatch}
      updateCellsBatchingPeriod={updateCellsBatchingPeriod}
      windowSize={windowSize}
      removeClippedSubviews={removeClippedSubviews}
      onViewableItemsChanged={memoizedOnViewableItemsChanged?.onViewableItemsChanged}
      viewabilityConfig={memoizedOnViewableItemsChanged?.viewabilityConfig}
      // Performance optimizations
      legacyImplementation={false}
      disableVirtualization={false}
      {...props}
    />
  );
}

// Export memoized component to prevent unnecessary re-renders
export const OptimizedFlatList = memo(OptimizedFlatListComponent);