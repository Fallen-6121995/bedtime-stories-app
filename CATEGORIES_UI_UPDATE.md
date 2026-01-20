# Categories UI Update

## Overview
Updated the mobile app UI to display categories matching the backend prompt templates.

## Updated Categories

The app now displays these 4 main categories that match your backend prompts:

### 1. Panchatantra Tales 🦊
- **Prompt Key**: `panchatantra`
- **Color**: Orange/Amber (#FED7AA, #FDBA74)
- **Icon**: paw
- **Description**: Classic animal fables with life lessons and morals

### 2. Fairy Tales ✨
- **Prompt Key**: `fairyTale`
- **Color**: Pink (#FBCFE8, #F9A8D4)
- **Icon**: sparkles
- **Description**: Magical stories with enchanting adventures

### 3. Adventure Fantasy 🗺️
- **Prompt Key**: `adventureFantasy`
- **Color**: Purple (#DDD6FE, #C4B5FD)
- **Icon**: compass
- **Description**: Thrilling adventures in magical worlds

### 4. Mystery Explorer 🔍
- **Prompt Key**: `mysteryExplorer`
- **Color**: Green (#BBF7D0, #86EFAC)
- **Icon**: search
- **Description**: Exciting mysteries to solve

## Files Modified

### 1. HomeScreen.tsx
- Updated mock categories to use new prompt keys
- Changed category names to match backend

### 2. storyThemes.ts
- Added new category themes for prompt keys
- Updated `getCategoryTheme()` function
- Added themes to `STORY_THEMES` for story cards
- Kept legacy categories for backward compatibility

## Visual Changes

### Before
```
Animals | Adventure | Magic | Nature | Space | Ocean
```

### After
```
Panchatantra Tales | Fairy Tales | Adventure Fantasy | Mystery Explorer
```

## Color Scheme

Each category now has a distinct color that matches its theme:

- **Panchatantra**: Warm orange/amber (animal fables)
- **Fairy Tales**: Soft pink (magical, whimsical)
- **Adventure Fantasy**: Rich purple (epic, mystical)
- **Mystery Explorer**: Fresh green (curious, investigative)

## Next Steps

When you're ready to connect to the API:

1. The categories are already set up in the database (via setupCategories.js)
2. The UI is styled and ready
3. Just need to replace mock data with API calls:

```typescript
// In HomeScreen.tsx, replace:
const mockCategories = [...]

// With:
const response = await api.get('/categories');
setCategories(response.categories);
```

## Testing the UI

Run the app to see:
- Updated category names on Home screen
- New icons and colors for each category
- Consistent theming throughout the app

The UI now perfectly matches your backend prompt structure!
