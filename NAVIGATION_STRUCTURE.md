# Navigation Structure

## Overview
The app uses a simple, clean navigation structure with React Navigation. All navigation logic is contained in `App.tsx` - no separate navigation files needed.

## Navigation Flow

```
App Launch
    ↓
SplashScreen (while checking auth)
    ↓
┌─────────────────────────────────┐
│  Onboarding Complete?           │
└─────────────────────────────────┘
    ↓           ↓
   NO          YES
    ↓           ↓
Onboarding   Check Token
Screen          ↓
            ┌───────────────┐
            │ Token Valid?  │
            └───────────────┘
                ↓       ↓
               YES     NO
                ↓       ↓
            MainTabs  Login
            Screen    Screen
```

## Screen Hierarchy

### Stack Navigator (Root)
- **Onboarding** - First-time user onboarding
- **Login** - User login
- **Register** - User registration
- **MainTabs** - Main app with bottom tabs
- **AllCategories** - All story categories
- **StoryDetail** - Individual story details (modal)
- **Category** - Stories by category
- **AgeGroup** - Stories by age group
- **Blog** - Parenting blog
- **BlogDetail** - Individual blog post
- **Settings** - App settings

### MainTabs Component (Custom Bottom Tabs)
Uses custom `BottomTabBar` component with 5 tabs:
- **Home** - HomeScreen
- **Stories** - StoriesScreen
- **Search** - SearchScreen
- **Favorites** - FavoritesScreen
- **Profile** - ProfileScreen

## Implementation Details

### Custom Bottom Tab Bar
Instead of using React Navigation's bottom tabs, we use a custom implementation:
- `BottomTabBar` component handles tab switching
- `MainTabs` component renders the active screen
- Cleaner UI control and customization

### Navigation Props
Screens can navigate using React Navigation hooks:
```typescript
import { useNavigation } from '@react-navigation/native';

const navigation = useNavigation();
navigation.navigate('ScreenName', { params });
```

## Active Screens

### Auth Screens
- `SplashScreen.tsx` - App launch splash
- `OnboardingScreen.tsx` - First-time onboarding
- `LoginScreen.tsx` - User login
- `RegisterScreen.tsx` - User registration

### Main Screens (Bottom Tabs)
- `HomeScreen.tsx` - Home dashboard
- `StoriesScreen.tsx` - Story library
- `SearchScreen.tsx` - Search functionality
- `FavoritesScreen.tsx` - Saved favorites
- `ProfileScreen.tsx` - User profile

### Detail Screens
- `StoryDetailScreen.tsx` - Story details and player
- `CategoryScreen.tsx` - Category-filtered stories
- `AgeGroupScreen.tsx` - Age-filtered stories
- `BlogScreen.tsx` - Blog posts list
- `BlogDetailScreen.tsx` - Individual blog post
- `SettingsScreen.tsx` - App settings

## Removed Files

The following unused navigation and test files have been removed:
- ❌ `src/navigation/AppNavigator.tsx`
- ❌ `src/navigation/SimpleNavigator.tsx`
- ❌ `src/navigation/` (entire folder)
- ❌ `src/screens/TestScreen.tsx`
- ❌ `src/screens/MinimalScreen.tsx`
- ❌ `src/screens/SimpleHomeScreen.tsx`
- ❌ `TestApp.tsx`

## Benefits of Current Structure

✅ **Simple** - All navigation in one file (App.tsx)
✅ **Clean** - No unused navigation files
✅ **Maintainable** - Easy to understand and modify
✅ **Custom** - Full control over bottom tab bar UI
✅ **Type-safe** - TypeScript support throughout
✅ **Performant** - Minimal navigation overhead

## Adding New Screens

To add a new screen:

1. Create the screen component in `src/screens/`
2. Import it in `App.tsx`
3. Add it to the Stack Navigator:
```typescript
<Stack.Screen 
  name="NewScreen" 
  component={NewScreenComponent}
  options={{ /* options */ }}
/>
```

4. Navigate to it from any screen:
```typescript
navigation.navigate('NewScreen', { params });
```
