# Design Document

## Overview

This design document outlines the architecture and implementation approach for rewriting the React Native Bedtime Stories app. The design focuses on creating a modern, child-friendly application with enhanced user experience, proper authentication, and responsive layouts while preserving all existing story content. The architecture emphasizes modularity, reusability, and maintainability following React Native best practices.

## Architecture

### High-Level Architecture

The application follows a layered architecture pattern with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│              Presentation Layer          │
│  (Screens, Components, Navigation)       │
├─────────────────────────────────────────┤
│              Business Logic Layer        │
│  (Hooks, Context, State Management)      │
├─────────────────────────────────────────┤
│              Data Layer                  │
│  (Services, Storage, API Integration)    │
├─────────────────────────────────────────┤
│              Foundation Layer            │
│  (Types, Constants, Utilities)           │
└─────────────────────────────────────────┘
```

### Technology Stack

- **Framework**: React Native 0.80.1
- **Navigation**: React Navigation v7 (Stack + Bottom Tabs)
- **State Management**: React Context + useReducer for complex state, useState for local state
- **Styling**: StyleSheet with responsive design utilities
- **Animations**: React Native Animated API + Lottie for complex animations
- **Authentication**: AsyncStorage for session management (Firebase-ready structure)
- **Type Safety**: TypeScript throughout the application
- **Icons**: React Native Vector Icons
- **Gradients**: React Native Linear Gradient

## Components and Interfaces

### Core Component Structure

```typescript
// Base component interfaces
interface BaseComponentProps {
  testID?: string;
  style?: ViewStyle | ViewStyle[];
}

interface ScreenProps extends BaseComponentProps {
  navigation: NavigationProp<any>;
  route: RouteProp<any>;
}

// Story-related interfaces
interface Story {
  id: string;
  title: string;
  description: string;
  image: string;
  content?: string;
  category?: string;
}

interface Category {
  id: string;
  name: string;
  stories: Story[];
}

// User interfaces
interface User {
  id: string;
  email: string;
  name: string;
  preferences?: UserPreferences;
}

interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
  favoriteCategories: string[];
}
```

### Component Hierarchy

```
App
├── AuthProvider (Context)
├── ThemeProvider (Context)
└── NavigationContainer
    └── RootNavigator
        ├── AuthStack (when not authenticated)
        │   ├── SplashScreen
        │   ├── LoginScreen
        │   └── SignupScreen
        └── MainStack (when authenticated also when not authenticated)
            ├── BottomTabNavigator
            │   ├── HomeScreen
            │   ├── CategoriesScreen
            │   ├── FavoritesScreen (only when authenticated)
            │   └── ProfileScreen  (only when authenticated)
            │   └── CreateStoryScreen  (only when authenticated)
            └── ModalStack (when authenticated also when not authenticated)
                ├── StoryDetailScreen
                └── SettingsScreen
```

### Reusable Components

#### 1. UI Components
- **Button**: Primary, secondary, and icon button variants
- **Input**: Text input with validation states
- **Card**: Story cards with different layouts (horizontal, grid)
- **Avatar**: User profile images with fallbacks
- **LoadingSpinner**: Consistent loading indicators
- **SafeAreaWrapper**: Screen wrapper with safe area handling

#### 2. Story Components
- **StoryCard**: Enhanced version with animations and interactions
- **StoryList**: Horizontal and vertical list layouts
- **CategoryHeader**: Section headers with "View All" functionality
- **StoryReader**: Full-screen story reading component

#### 3. Layout Components
- **ScreenContainer**: Base screen wrapper with consistent padding
- **Section**: Content sections with proper spacing
- **Grid**: Responsive grid layout for story cards
- **Header**: Customizable screen headers

## Data Models

### Enhanced Story Data Structure

```typescript
interface EnhancedStory extends Story {
  content: string; // Full story content for reading
  readingTime: number; // Estimated reading time in minutes
  ageGroup: string; // Target age group
  tags: string[]; // Story tags for filtering
  isFavorite: boolean; // User favorite status
  lastRead?: Date; // Last read timestamp
  readCount: number; // Number of times read
}

interface StoryCategory {
  id: string;
  name: string;
  description: string;
  color: string; // Category theme color
  icon: string; // Category icon name
  stories: EnhancedStory[];
}
```

### Authentication State

```typescript
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}
```

## Error Handling

### Error Boundary Implementation

```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
  // Catches JavaScript errors anywhere in the child component tree
  // Displays fallback UI with option to restart app
  // Logs errors for debugging
}
```

### Error Types and Handling

1. **Network Errors**: Graceful handling with retry mechanisms
2. **Authentication Errors**: Clear user feedback and recovery options
3. **Data Loading Errors**: Fallback content and retry buttons
4. **Navigation Errors**: Safe navigation with error boundaries
5. **Image Loading Errors**: Placeholder images and retry logic

## Testing Strategy

### Testing Pyramid

```
┌─────────────────────────────────────────┐
│              E2E Tests                   │
│  (Critical user journeys)                │
├─────────────────────────────────────────┤
│              Integration Tests           │
│  (Component interactions)                │
├─────────────────────────────────────────┤
│              Unit Tests                  │
│  (Individual components & utilities)     │
└─────────────────────────────────────────┘
```

### Testing Approach

#### Unit Tests
- **Components**: Test rendering, props handling, and user interactions
- **Hooks**: Test custom hooks with various scenarios
- **Utilities**: Test helper functions and data transformations
- **Services**: Test API calls and data processing

#### Integration Tests
- **Navigation**: Test screen transitions and navigation flows
- **Authentication**: Test login/logout flows
- **Data Flow**: Test data fetching and state updates
- **User Interactions**: Test complex user workflows

#### E2E Tests
- **Critical Paths**: Login → Browse Stories → Read Story → Logout
- **Cross-Platform**: Test on both iOS and Android
- **Performance**: Test app performance under various conditions

### Testing Tools
- **Jest**: Unit and integration testing
- **React Native Testing Library**: Component testing
- **Detox**: E2E testing
- **Flipper**: Debugging and performance monitoring

## Design System

### Color Palette

```typescript
const colors = {
  // Primary colors - warm and inviting
  primary: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316', // Main primary
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
  },
  
  // Secondary colors - soft and playful
  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // Main secondary
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  
  // Neutral colors
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};
```

### Typography Scale

```typescript
const typography = {
  // Font families
  fontFamily: {
    regular: 'System', // Platform default
    medium: 'System-Medium',
    bold: 'System-Bold',
    playful: 'ComicNeue-Regular', // For headings and fun elements
  },
  
  // Font sizes (responsive)
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Line heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};
```

### Spacing System

```typescript
const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
};
```

### Component Variants

#### Button Variants
- **Primary**: Main call-to-action buttons
- **Secondary**: Secondary actions
- **Outline**: Subtle actions
- **Ghost**: Minimal actions
- **Icon**: Icon-only buttons

#### Card Variants
- **Horizontal**: For story lists
- **Grid**: For category views
- **Featured**: For highlighted content
- **Compact**: For dense layouts

## Responsive Design Strategy

### Breakpoint System

```typescript
const breakpoints = {
  sm: 480,  // Small phones
  md: 768,  // Large phones / small tablets
  lg: 1024, // Tablets
  xl: 1280, // Large tablets
};
```

### Responsive Utilities

```typescript
// Hook for responsive values
const useResponsiveValue = (values: ResponsiveValue) => {
  const { width } = useWindowDimensions();
  // Returns appropriate value based on screen width
};

// Responsive style helper
const createResponsiveStyle = (baseStyle: any, responsiveProps: any) => {
  // Creates styles that adapt to screen size
};
```

### Layout Adaptations

#### Phone Layout (< 768px)
- Single column layouts
- Bottom tab navigation
- Stacked story cards
- Larger touch targets

#### Tablet Layout (≥ 768px)
- Multi-column layouts where appropriate
- Side navigation options
- Grid-based story displays
- Optimized for landscape orientation

## Animation and Interactions

### Animation Strategy

#### Micro-interactions
- Button press feedback (scale + opacity)
- Card hover/press states
- Loading state animations
- Success/error feedback

#### Screen Transitions
- Smooth slide transitions between screens
- Modal presentations with backdrop
- Tab switching animations
- Story card to detail transitions

#### Splash Screen Animation
```typescript
// Splash screen animation sequence
const splashAnimation = {
  logo: {
    scale: [0.5, 1.2, 1],
    opacity: [0, 1, 1],
    duration: 1500,
  },
  title: {
    translateY: [50, 0],
    opacity: [0, 1],
    delay: 800,
    duration: 800,
  },
  background: {
    colors: ['#FFE4E1', '#E6F3FF', '#F0FFF0'],
    duration: 2000,
  },
};
```

## Performance Optimizations

### Image Optimization
- Lazy loading for story images
- Progressive image loading
- Image caching strategy
- Placeholder images during loading

### List Performance
- FlatList optimization with getItemLayout
- Virtualization for large story lists
- Memoization of story cards
- Efficient key extraction

### Memory Management
- Proper cleanup of event listeners
- Image cache management
- Navigation state optimization
- Component unmounting cleanup

### Bundle Optimization
- Code splitting where possible
- Tree shaking for unused code
- Image asset optimization
- Font subsetting for custom fonts

## Accessibility

### Accessibility Features
- Screen reader support with proper labels
- High contrast mode support
- Large text support
- Voice control compatibility
- Keyboard navigation support

### Implementation Strategy
- Semantic HTML-like structure
- Proper accessibility labels
- Focus management
- Color contrast compliance
- Touch target size compliance (44pt minimum)

## Security Considerations

### Data Protection
- Secure storage for authentication tokens
- Input validation and sanitization
- Protection against common vulnerabilities
- Safe handling of user data

### Authentication Security
- Secure password requirements
- Session management
- Logout on app backgrounding (optional)
- Biometric authentication support (future)

This design provides a comprehensive foundation for building a modern, scalable, and maintainable React Native application that meets all the specified requirements while providing an excellent user experience for children and parents.