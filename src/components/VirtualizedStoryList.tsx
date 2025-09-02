import React, { memo, useCallback, useMemo } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { OptimizedFlatList } from './OptimizedFlatList';
import { MemoizedStoryCard } from './MemoizedStoryCard';
import { Story } from '../types';

interface VirtualizedStoryListProps {
  stories: Story[];
  onStoryPress: (story: Story) => void;
  onFavoritePress?: (story: Story) => void;
  variant?: 'horizontal' | 'grid' | 'featured';
  showFavorites?: boolean;
  numColumns?: number;
  horizontal?: boolean;
  contentContainerStyle?: any;
  testID?: string;
}

const { width: screenWidth } = Dimensions.get('window');



export const VirtualizedStoryList: React.FC<VirtualizedStoryListProps> = memo(({
  stories,
  onStoryPress,
  onFavoritePress,
  variant = 'horizontal',
  showFavorites = false,
  numColumns = 1,
  horizontal = false,
  contentContainerStyle,
  testID,
}) => {
  // Calculate item dimensions for getItemLayout optimization
  const itemDimensions = useMemo(() => {
    switch (variant) {
      case 'horizontal':
        return { width: 240, height: 280 };
      case 'grid':
        return { width: (screenWidth - 48) / 2, height: 220 };
      case 'featured':
        return { width: screenWidth - 32, height: 320 };
      default:
        return { width: 240, height: 280 };
    }
  }, [variant]);

  // Memoized render item function
  const renderStoryItem = useCallback(({ item }: { item: Story }) => (
    <MemoizedStoryCard
      story={item}
      onPress={onStoryPress}
      onFavoritePress={onFavoritePress}
      variant={variant}
      showFavorite={showFavorites}
    />
  ), [onStoryPress, onFavoritePress, variant, showFavorites]);

  // Memoized key extractor
  const keyExtractor = useCallback((item: Story) => item.id, []);

  // Calculate spacing for grid layout
  const getItemLayout = useCallback((data: Story[] | null | undefined, index: number) => {
    if (horizontal) {
      return {
        length: itemDimensions.width + 16, // Include margin
        offset: (itemDimensions.width + 16) * index,
        index,
      };
    }

    if (numColumns > 1) {
      const row = Math.floor(index / numColumns);
      return {
        length: itemDimensions.height + 16,
        offset: (itemDimensions.height + 16) * row,
        index,
      };
    }

    return {
      length: itemDimensions.height + 16,
      offset: (itemDimensions.height + 16) * index,
      index,
    };
  }, [horizontal, numColumns, itemDimensions]);

  // Memoized list props
  const listProps = useMemo(() => ({
    horizontal,
    numColumns: horizontal ? 1 : numColumns,
    showsHorizontalScrollIndicator: false,
    showsVerticalScrollIndicator: false,
    contentContainerStyle: [
      horizontal ? styles.horizontalContainer : styles.verticalContainer,
      contentContainerStyle,
    ],
  }), [horizontal, numColumns, contentContainerStyle]);

  return (
    <OptimizedFlatList
      data={stories}
      renderItem={renderStoryItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      itemHeight={horizontal ? undefined : itemDimensions.height + 16}
      estimatedItemSize={itemDimensions.height + 16}
      windowSize={horizontal ? 5 : 10}
      maxToRenderPerBatch={horizontal ? 3 : 5}
      updateCellsBatchingPeriod={50}
      removeClippedSubviews={true}
      testID={testID}
      {...listProps}
    />
  );
});

VirtualizedStoryList.displayName = 'VirtualizedStoryList';

const styles = StyleSheet.create({
  horizontalContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  verticalContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});