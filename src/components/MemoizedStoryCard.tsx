import React, { memo } from 'react';
import StoryCard from './StoryCard';
import { Story } from '../types';

interface MemoizedStoryCardProps {
  story: Story;
  onPress: (story: Story) => void;
  onFavoritePress?: (story: Story) => void;
  variant?: 'horizontal' | 'grid' | 'featured';
  showFavorite?: boolean;
  testID?: string;
}

// Custom comparison function for memo
const arePropsEqual = (
  prevProps: MemoizedStoryCardProps,
  nextProps: MemoizedStoryCardProps
): boolean => {
  // Check if story object has changed
  if (prevProps.story.id !== nextProps.story.id) return false;
  if (prevProps.story.title !== nextProps.story.title) return false;
  if (prevProps.story.description !== nextProps.story.description) return false;
  if (prevProps.story.image !== nextProps.story.image) return false;
  if (prevProps.story.isFavorite !== nextProps.story.isFavorite) return false;
  if (prevProps.story.readCount !== nextProps.story.readCount) return false;
  if (prevProps.story.readingTime !== nextProps.story.readingTime) return false;
  if (prevProps.story.ageGroup !== nextProps.story.ageGroup) return false;

  // Check other props
  if (prevProps.variant !== nextProps.variant) return false;
  if (prevProps.showFavorite !== nextProps.showFavorite) return false;
  if (prevProps.testID !== nextProps.testID) return false;

  // Function references are expected to be stable, so we don't compare them
  // If they change frequently, consider using useCallback in parent component

  return true;
};

export const MemoizedStoryCard = memo<MemoizedStoryCardProps>(
  ({ story, onPress, onFavoritePress, variant = 'horizontal', showFavorite = false, testID }) => (
    <StoryCard
      story={story}
      onPress={onPress}
      onFavoritePress={onFavoritePress}
      variant={variant}
      showFavorite={showFavorite}
      testID={testID}
    />
  ),
  arePropsEqual
);

MemoizedStoryCard.displayName = 'MemoizedStoryCard';