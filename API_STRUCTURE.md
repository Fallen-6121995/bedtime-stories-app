# API Structure & Service Pattern

## Overview
All API calls follow a consistent structure using centralized services. This ensures maintainability, type safety, and consistent error handling across the app.

## Base Configuration

### API Base URL
```
https://bedtime-stories-5eb2.onrender.com/api
```

### Required Headers (All Requests)
```typescript
{
  'Content-Type': 'application/json',
  'x-api-key': 'pk_Zt1cFQjpIqJA6gDOZsyWcWwZsxKxV9D6',
  'x-platform': 'mobile',
  'x-client-id': 'myapp',
  'x-client-secret': 'somesecretvalue',
  'Authorization': 'Bearer <access_token>' // For authenticated requests
}
```

## Service Architecture

### 1. ApiClient (Base Layer)
**Location:** `src/services/api/ApiClient.ts`

**Purpose:** Low-level HTTP client with automatic token refresh

**Features:**
- Singleton pattern
- Automatic token refresh on 401
- Request/response interceptors
- Consistent error handling
- Type-safe responses

**Methods:**
```typescript
ApiClient.get<T>(endpoint: string, options?: RequestInit): Promise<T>
ApiClient.post<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T>
ApiClient.put<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T>
ApiClient.patch<T>(endpoint: string, body?: any, options?: RequestInit): Promise<T>
ApiClient.delete<T>(endpoint: string, options?: RequestInit): Promise<T>
```

### 2. Service Layer (Business Logic)
**Pattern:** Each domain has its own service following the same structure

#### AuthService
**Location:** `src/services/auth/AuthService.ts`

**Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh access token

**Methods:**
```typescript
AuthService.register(credentials: RegisterCredentials): Promise<AuthResponse>
AuthService.login(credentials: LoginCredentials): Promise<AuthResponse>
AuthService.logout(): Promise<void>
AuthService.refreshToken(): Promise<string>
AuthService.validateSession(): Promise<boolean>
AuthService.isAuthenticated(): Promise<boolean>
AuthService.isGuest(): Promise<boolean>
AuthService.getCurrentUser(): Promise<User | null>
AuthService.fetchUserDetails(): Promise<User | null>
```

#### UserService
**Location:** `src/services/user/UserService.ts`

**Endpoints:**
- `GET /user/me` - Get current user details
- `PUT /user/profile` - Update user profile
- `PUT /user/preferences` - Update user preferences
- `GET /user/favorites` - Get user favorites
- `GET /user/history` - Get user history

**Methods:**
```typescript
UserService.getMe(): Promise<User | null>
UserService.updateProfile(data: { name?: string; mobileNumber?: string }): Promise<User | null>
UserService.updatePreferences(preferences: Record<string, any>): Promise<Record<string, any> | null>
UserService.getFavorites(): Promise<any[]>
UserService.getHistory(): Promise<any[]>
```

### 3. Storage Layer
**Purpose:** Local data persistence

**TokenManager:** Manages access/refresh tokens
**UserManager:** Manages user data

## API Endpoints Configuration

**Location:** `src/config/api.config.ts`

All endpoints are centralized in `API_ENDPOINTS` constant:

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USER: {
    ME: '/user/me',
    PROFILE: '/user/profile',
    PREFERENCES: '/user/preferences',
    FAVORITES: '/user/favorites',
    HISTORY: '/user/history',
  },
  STORIES: {
    LIST: '/stories',
    DETAIL: (id: string) => `/stories/${id}`,
    FEATURED: '/stories/featured',
    SEARCH: '/stories/search',
    // ... more endpoints
  },
  // ... more domains
};
```

## Usage Examples

### Example 1: Login User
```typescript
import { AuthService } from '../services';

try {
  const response = await AuthService.login({
    email: 'user@example.com',
    password: 'password123'
  });
  
  console.log('Logged in:', response.user.name);
  // Tokens are automatically saved
} catch (error) {
  console.error('Login failed:', error);
}
```

### Example 2: Get User Details
```typescript
import { UserService } from '../services';

try {
  const user = await UserService.getMe();
  
  if (user) {
    console.log('User:', user.name);
  }
} catch (error) {
  console.error('Failed to get user:', error);
}
```

### Example 3: Update Profile
```typescript
import { UserService } from '../services';

try {
  const updatedUser = await UserService.updateProfile({
    name: 'New Name',
    mobileNumber: '+1234567890'
  });
  
  console.log('Profile updated:', updatedUser);
} catch (error) {
  console.error('Update failed:', error);
}
```

### Example 4: Direct API Call (Advanced)
```typescript
import { ApiClient, API_ENDPOINTS } from '../services';

try {
  const response = await ApiClient.get<{ data: any }>(
    API_ENDPOINTS.STORIES.LIST
  );
  
  console.log('Stories:', response.data);
} catch (error) {
  console.error('Failed to fetch stories:', error);
}
```

## Adding New Services

To add a new service (e.g., StoriesService):

### Step 1: Create Service File
**Location:** `src/services/stories/StoriesService.ts`

```typescript
import ApiClient from '../api/ApiClient';
import { API_ENDPOINTS } from '../../config/api.config';

class StoriesService {
  private static instance: StoriesService;

  private constructor() {}

  public static getInstance(): StoriesService {
    if (!StoriesService.instance) {
      StoriesService.instance = new StoriesService();
    }
    return StoriesService.instance;
  }

  async getStories(): Promise<any[]> {
    try {
      const response = await ApiClient.get<{ stories: any[] }>(
        API_ENDPOINTS.STORIES.LIST
      );
      return response.stories;
    } catch (error) {
      console.error('Get stories error:', error);
      throw error;
    }
  }

  async getStoryById(id: string): Promise<any> {
    try {
      const response = await ApiClient.get<{ story: any }>(
        API_ENDPOINTS.STORIES.DETAIL(id)
      );
      return response.story;
    } catch (error) {
      console.error('Get story error:', error);
      throw error;
    }
  }
}

export default StoriesService.getInstance();
```

### Step 2: Add Endpoints to Config
**Location:** `src/config/api.config.ts`

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints
  STORIES: {
    LIST: '/stories',
    DETAIL: (id: string) => `/stories/${id}`,
    FEATURED: '/stories/featured',
  },
};
```

### Step 3: Export from Index
**Location:** `src/services/index.ts`

```typescript
export { default as StoriesService } from './stories/StoriesService';
```

### Step 4: Use in Components
```typescript
import { StoriesService } from '../services';

const stories = await StoriesService.getStories();
```

## Benefits of This Structure

✅ **Consistent** - All API calls follow the same pattern
✅ **Type-Safe** - Full TypeScript support
✅ **Maintainable** - Easy to update and extend
✅ **Testable** - Services can be mocked easily
✅ **Centralized** - All endpoints in one config file
✅ **Automatic Token Refresh** - Handled by ApiClient
✅ **Error Handling** - Consistent across all services
✅ **Singleton Pattern** - Single instance per service

## Important Rules

1. ✅ **Always use services** - Never call ApiClient directly from components
2. ✅ **Use API_ENDPOINTS** - Never hardcode endpoint strings
3. ✅ **Follow the pattern** - All services should follow the same structure
4. ✅ **Handle errors** - Always wrap API calls in try-catch
5. ✅ **Type responses** - Always specify response types
6. ✅ **Log appropriately** - Use console.log for success, console.error for errors
7. ✅ **Update storage** - Save data to local storage when appropriate

## Testing API Calls

```typescript
// Test in a component or screen
import { UserService } from '../services';

useEffect(() => {
  const testAPI = async () => {
    try {
      const user = await UserService.getMe();
      console.log('✅ API Test Success:', user);
    } catch (error) {
      console.error('❌ API Test Failed:', error);
    }
  };
  
  testAPI();
}, []);
```
