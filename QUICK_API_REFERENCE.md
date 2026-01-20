# Quick API Reference

## Base URL
```
https://bedtime-stories-5eb2.onrender.com/api
```

## Import Services
```typescript
import { AuthService, UserService } from '../services';
```

## Authentication

### Login
```typescript
const response = await AuthService.login({
  email: 'user@example.com',
  password: 'password123'
});
```

### Register
```typescript
const response = await AuthService.register({
  name: 'John Doe',
  email: 'user@example.com',
  password: 'password123',
  mobileNumber: '+1234567890' // optional
});
```

### Logout
```typescript
await AuthService.logout();
```

### Check if Authenticated
```typescript
const isAuth = await AuthService.isAuthenticated();
```

## User Operations

### Get Current User
```typescript
const user = await UserService.getMe();
// Returns user from /user/me endpoint
```

### Update Profile
```typescript
const updated = await UserService.updateProfile({
  name: 'New Name',
  mobileNumber: '+1234567890'
});
```

### Update Preferences
```typescript
const prefs = await UserService.updatePreferences({
  theme: 'dark',
  notifications: true
});
```

### Get Favorites
```typescript
const favorites = await UserService.getFavorites();
```

### Get History
```typescript
const history = await UserService.getHistory();
```

## Available Endpoints

### Auth Routes (`/auth/*`)
- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh token

### User Routes (`/user/*`)
- `GET /user/me` - Get current user
- `PUT /user/profile` - Update profile
- `PUT /user/preferences` - Update preferences
- `GET /user/favorites` - Get favorites
- `GET /user/history` - Get history

## Error Handling

```typescript
try {
  const user = await UserService.getMe();
  console.log('Success:', user);
} catch (error) {
  console.error('Error:', error);
  // Handle error (show message, redirect, etc.)
}
```

## Automatic Features

✅ **Token Refresh** - Automatically refreshes expired tokens
✅ **Headers** - All required headers added automatically
✅ **Storage** - User data saved to local storage automatically
✅ **Type Safety** - Full TypeScript support

## Pattern for All API Calls

```typescript
// 1. Import service
import { ServiceName } from '../services';

// 2. Call method
const result = await ServiceName.methodName(params);

// 3. Handle result
console.log(result);
```

## Adding New Endpoints

1. Add to `src/config/api.config.ts`:
```typescript
MY_DOMAIN: {
  ENDPOINT: '/my-domain/endpoint',
}
```

2. Create service in `src/services/my-domain/MyService.ts`
3. Export from `src/services/index.ts`
4. Use in components

See `API_STRUCTURE.md` for detailed guide.
