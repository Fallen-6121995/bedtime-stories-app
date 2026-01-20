# Backend Integration Guide

## How the Design System Works with Backend Data

The app uses a smart theme system that automatically determines colors and icons based on data from your backend.

### 1. Story Theme System

The app maps backend data (categories, tags, titles) to visual themes automatically.

#### Backend Data Structure Expected:

```typescript
{
  "id": "story-123",
  "title": "The Moonlight Adventure",
  "subtitle": "A magical journey through the stars",
  "duration": 8,  // in minutes
  "category": "space",  // Main category
  "tags": ["moon", "adventure", "night"],  // Additional tags
  "coverImage": "https://...",  // Optional
  "audioUrl": "https://..."  // Optional
}
```

#### How Themes are Determined:

1. **By Category** - If story has `category: "space"`, it gets space theme (dark blue gradient + planet icon)
2. **By Tags** - If no category match, checks tags array for keywords
3. **By Title** - If no category/tags, scans title for keywords like "moon", "ocean", "forest"
4. **Fallback** - Uses default gray theme if no matches

### 2. Available Themes

The system includes pre-configured themes for:

- **Nature & Animals**: forest, animals, nature (green gradients, leaf/paw icons)
- **Ocean & Water**: ocean, sea, water (blue gradients, water icon)
- **Space & Sky**: space, moon, stars, night (dark blue/purple, planet/moon icons)
- **Magic & Fantasy**: magic, fairy, wizard (purple gradients, sparkles icon)
- **Adventure**: adventure, journey, treasure (orange/brown, rocket/compass icons)
- **Bedtime**: bedtime, sleep, calm, dream (blue/purple, moon/cloud icons)
- **Friendship**: friendship, love, family (pink gradients, heart icon)

### 3. Backend API Endpoints

Update `src/services/api.ts` with your actual API URLs:

```typescript
const API_BASE_URL = 'https://your-api.com/api';

// Required endpoints:
GET /stories/featured          // Featured stories for home screen
GET /categories                // All categories
GET /stories?category={id}     // Stories by category
GET /stories/{id}              // Single story details
GET /stories/search?q={query}  // Search stories
```

### 4. Adding New Themes

To add a new theme, edit `src/utils/storyThemes.ts`:

```typescript
const STORY_THEMES: Record<string, StoryTheme> = {
  // Add your new theme
  dinosaur: {
    colors: ['#065F46', '#047857', '#059669'],  // Gradient colors
    icon: 'paw',  // Ionicons icon name
  },
  // ... existing themes
};
```

### 5. Category Configuration

Categories also use the theme system. Update in `getCategoryTheme()`:

```typescript
const categoryThemes: Record<string, StoryTheme> = {
  dinosaurs: {
    colors: ['#BBF7D0', '#86EFAC'],  // Light green gradient
    icon: 'paw',
  },
};
```

### 6. Using in Components

```typescript
import { getStoryTheme } from '../utils/storyThemes';

// In your component:
const story = {
  category: 'ocean',
  tags: ['sea', 'adventure']
};

const theme = getStoryTheme(story.category, story.tags);
// Returns: { colors: ['#0C4A6E', '#075985', '#0369A1'], icon: 'water' }

// Use in UI:
<LinearGradient colors={theme.colors}>
  <Icon name={theme.icon} />
</LinearGradient>
```

### 7. Mock Data vs Real API

Currently using mock data in `HomeScreen.tsx`:

```typescript
// Replace this:
const mockStories: Story[] = [...];

// With actual API call:
const stories = await fetchFeaturedStories();
```

### 8. Icon Names

All icons use Ionicons. Available icon names:
- `paw`, `leaf`, `water`, `planet`, `moon`, `star`
- `sparkles`, `rocket`, `compass`, `diamond`
- `heart`, `people`, `cloud`, `book`
- Full list: https://ionic.io/ionicons

### 9. Customization

You can customize themes per story by adding a `theme` field in backend:

```typescript
{
  "id": "story-123",
  "title": "Custom Story",
  "theme": {
    "colors": ["#FF0000", "#00FF00"],
    "icon": "custom-icon"
  }
}
```

Then in your component:
```typescript
const theme = story.theme || getStoryTheme(story.category, story.tags);
```

### 10. Testing

Test with different backend data:

```bash
# Test with space category
{ "category": "space" } → Dark blue gradient + planet icon

# Test with tags
{ "tags": ["ocean", "adventure"] } → Blue gradient + water icon

# Test with title
{ "title": "The Magic Forest" } → Purple gradient + sparkles icon
```

## Summary

The system is **fully automatic** - just send proper category/tags from backend, and the app handles all visual styling. No need to send colors or icons from backend unless you want custom themes for specific stories.
