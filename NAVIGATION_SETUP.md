# Navigation Setup

## Overview
The app now uses a hybrid navigation system combining React Navigation with a custom bottom tab bar.

## Structure

### Main Navigation Flow
```
App.tsx (NavigationContainer + Stack Navigator)
  └── MainTabs (Custom Tab Component)
      ├── HomeScreen (Tab 1)
      ├── StoriesScreen (Tab 2)
      ├── SearchScreen (Tab 3 - Center Button)
      ├── FavoritesScreen (Tab 4)
      └── ProfileScreen (Tab 5)
  └── Stack Screens (Modal/Push)
      ├── StoryDetail
      ├── Category
      ├── AgeGroup
      ├── Blog
      ├── BlogDetail
      └── Settings
```

### Custom Bottom Tab Bar
Located in: `src/components/BottomTabBar.tsx`

**Features:**
- Floating design with rounded corners
- Purple gradient for active tabs
- Large center search button (64x64px)
- Smooth shadows and animations
- Responsive to safe area insets

**Tabs:**
1. Home (🏠)
2. Stories (📚)
3. Search (🔍) - Center floating button
4. Favorites (❤️)
5. Profile (👤)

## How to Navigate

### From Any Screen

```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();

// Navigate to detail screen
navigation.navigate('StoryDetail', { id: 'story-123' });

// Navigate to category
navigation.navigate('Category', { id: 'animals' });

// Go back
navigation.goBack();
```

### Current Implementation

The HomeScreen already has navigation integrated:
- Tapping story cards → StoryDetail screen
- Tapping categories → Category screen
- Tapping "See all" → AllStories screen

## Screens Status

### ✅ Redesigned & Ready
- HomeScreen - Modern, premium design with gradients

### 🔄 Need Redesign (Next Steps)
- StoriesScreen
- SearchScreen
- FavoritesScreen
- ProfileScreen
- StoryDetailScreen
- CategoryScreen
- BlogScreen
- BlogDetailScreen
- SettingsScreen
- AgeGroupScreen

## Adding New Screens

1. Create screen component in `src/screens/`
2. Add to Stack Navigator in `App.tsx`:
```typescript
<Stack.Screen 
  name="NewScreen" 
  component={NewScreenComponent}
/>
```

3. Navigate from any screen:
```typescript
navigation.navigate('NewScreen', { param: 'value' });
```

## Bottom Padding

All main tab screens should have `paddingBottom: 120` in their ScrollView to account for the floating bottom tab bar.

## Next Steps

1. Redesign remaining screens to match HomeScreen aesthetic
2. Add smooth transitions between screens
3. Implement proper loading states
4. Add error boundaries
5. Test navigation flow on different devices
