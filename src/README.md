# Bedtime Stories App - Source Code Structure

This document outlines the structure and organization of the Bedtime Stories app source code.

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   └── ErrorBoundary.tsx
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── services/           # Business logic and API services
│   ├── AuthService.ts
│   ├── StorageService.ts
│   ├── StoryService.ts
│   ├── UserPreferencesService.ts
│   └── index.ts
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useTheme.ts
│   ├── useStories.ts
│   ├── useResponsive.ts
│   ├── useForm.ts
│   ├── useAsyncStorage.ts
│   └── index.ts
├── context/            # React context providers
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   ├── AppProvider.tsx
│   └── index.ts
├── utils/              # Utility functions
│   ├── helpers.ts
│   ├── responsive.ts
│   ├── validation.ts
│   └── index.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── constants/          # App constants and configuration
│   ├── theme.ts
│   ├── app.ts
│   ├── api.ts
│   └── index.ts
├── config/             # Environment configuration
│   ├── development.ts
│   ├── production.ts
│   └── index.ts
├── common/             # Shared data and utilities
│   └── StoriesData.ts
└── assets/             # Static assets (images, fonts, etc.)
```

## Architecture Overview

The app follows a layered architecture with clear separation of concerns:

### 1. Presentation Layer
- **Components**: Reusable UI components
- **Screens**: Full-screen components
- **Navigation**: Navigation configuration and routing

### 2. Business Logic Layer
- **Hooks**: Custom React hooks for state management
- **Context**: React context providers for global state
- **Services**: Business logic and data management

### 3. Data Layer
- **Services**: API integration and data persistence
- **Utils**: Data transformation and validation utilities

### 4. Foundation Layer
- **Types**: TypeScript type definitions
- **Constants**: App-wide constants and configuration
- **Config**: Environment-specific configuration

## Key Features

### Type Safety
- Comprehensive TypeScript types for all components and services
- Strict TypeScript configuration with enhanced error checking
- Type-safe navigation and routing

### State Management
- React Context for global state (Auth, Theme)
- Custom hooks for component-level state management
- Persistent storage with AsyncStorage

### Responsive Design
- Responsive utilities and hooks
- Breakpoint-based design system
- Device-specific adaptations

### Error Handling
- Error boundary component for JavaScript errors
- Comprehensive error handling in services
- User-friendly error messages

### Development Tools
- ESLint configuration with TypeScript support
- Prettier for code formatting
- Comprehensive npm scripts for development workflow

## Getting Started

### Prerequisites
- Node.js >= 18
- React Native development environment
- iOS/Android development tools

### Installation
```bash
npm install
cd ios && pod install && cd ..  # iOS only
```

### Development
```bash
npm run start          # Start Metro bundler
npm run android        # Run on Android
npm run ios           # Run on iOS
npm run lint          # Run ESLint
npm run format        # Format code with Prettier
npm run type-check    # Run TypeScript type checking
```

### Testing
```bash
npm run test          # Run tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

## Code Style Guidelines

### File Naming
- Components: PascalCase (e.g., `StoryCard.tsx`)
- Hooks: camelCase starting with 'use' (e.g., `useAuth.ts`)
- Services: PascalCase with 'Service' suffix (e.g., `AuthService.ts`)
- Utils: camelCase (e.g., `helpers.ts`)
- Constants: camelCase (e.g., `theme.ts`)

### Import Organization
1. React and React Native imports
2. Third-party library imports
3. Internal imports (services, utils, types)
4. Relative imports

### Component Structure
```typescript
// Imports
import React from 'react';
import { View, Text } from 'react-native';

// Types
interface ComponentProps {
  // props definition
}

// Component
export const Component: React.FC<ComponentProps> = ({ ...props }) => {
  // hooks
  // state
  // effects
  // handlers
  // render
};

// Styles
const styles = StyleSheet.create({
  // styles
});
```

## Best Practices

### Performance
- Use React.memo for expensive components
- Implement proper key props for lists
- Optimize image loading and caching
- Use FlatList for large datasets

### Accessibility
- Provide accessibility labels
- Ensure proper touch target sizes
- Support screen readers
- Maintain color contrast ratios

### Security
- Validate all user inputs
- Secure storage for sensitive data
- Proper error handling without exposing internals
- Regular dependency updates

### Testing
- Unit tests for utilities and services
- Component tests for UI components
- Integration tests for user flows
- E2E tests for critical paths

## Contributing

1. Follow the established code style and structure
2. Add TypeScript types for all new code
3. Include tests for new functionality
4. Update documentation as needed
5. Run linting and type checking before committing