# 🔐 Authentication Implementation Guide

## Overview
This document describes the secure authentication implementation for the Bedtime Stories mobile app, following SOLID principles and best practices.

## Architecture

### 🏗️ Service Layer Structure

```
src/services/
├── auth/
│   └── AuthService.ts          # Authentication operations
├── api/
│   └── ApiClient.ts            # HTTP client with interceptors
├── storage/
│   └── TokenManager.ts         # Secure token management
├── types/
│   └── auth.types.ts           # TypeScript interfaces
└── index.ts                    # Central exports
```

## 🔑 Key Features

### 1. **Secure Token Management**
- Access tokens stored securely in AsyncStorage
- Refresh tokens for long-lived sessions
- Automatic token refresh on expiration
- Token validation and expiry checking

### 2. **Automatic Token Refresh**
- Intercepts 401 responses
- Automatically refreshes expired tokens
- Retries failed requests with new token
- Queues concurrent requests during refresh

### 3. **Guest Mode Support**
- Users can explore without registration
- Seamless upgrade from guest to full account
- Preserves user data and preferences

### 4. **SOLID Principles**
- **Single Responsibility**: Each class has one job
- **Open/Closed**: Extensible without modification
- **Liskov Substitution**: Services are interchangeable
- **Interface Segregation**: Clean, focused interfaces
- **Dependency Inversion**: Depends on abstractions

## 📱 Usage Examples

### Register as Guest

```typescript
import { AuthService } from '../services';

const handleGuestLogin = async () => {
  try {
    const response = await AuthService.registerAsGuest();
    console.log('Guest user:', response.user);
    // Navigate to app
  } catch (error) {
    console.error('Guest registration failed:', error);
  }
};
```

### Register New User

```typescript
import { AuthService } from '../services';

const handleRegister = async () => {
  try {
    const response = await AuthService.register({
      email: 'user@example.com',
      password: 'SecurePassword123!',
      name: 'John Doe',
      mobileNumber: '+1234567890', // Optional
    });
    console.log('Registered user:', response.user);
    // Navigate to app
  } catch (error) {
    console.error('Registration failed:', error.message);
  }
};
```

### Login

```typescript
import { AuthService } from '../services';

const handleLogin = async () => {
  try {
    const response = await AuthService.login({
      email: 'user@example.com',
      password: 'SecurePassword123!',
    });
    console.log('Logged in user:', response.user);
    // Navigate to app
  } catch (error) {
    console.error('Login failed:', error.message);
  }
};
```

### Upgrade Guest Account

```typescript
import { AuthService } from '../services';

const handleUpgrade = async () => {
  try {
    const response = await AuthService.upgradeGuestAccount({
      email: 'user@example.com',
      password: 'SecurePassword123!',
      name: 'John Doe',
    });
    console.log('Upgraded user:', response.user);
    // Update UI to show full account features
  } catch (error) {
    console.error('Upgrade failed:', error.message);
  }
};
```

### Logout

```typescript
import { AuthService } from '../services';

const handleLogout = async () => {
  try {
    await AuthService.logout();
    // Navigate to login screen
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
```

### Check Authentication Status

```typescript
import { AuthService } from '../services';

const checkAuth = async () => {
  const isAuthenticated = await AuthService.isAuthenticated();
  const isGuest = await AuthService.isGuest();
  
  if (isAuthenticated) {
    if (isGuest) {
      console.log('User is a guest');
    } else {
      console.log('User is fully registered');
    }
  } else {
    console.log('User is not authenticated');
  }
};
```

### Get Current User

```typescript
import { AuthService } from '../services';

const loadUser = async () => {
  try {
    const user = await AuthService.getCurrentUser();
    if (user) {
      console.log('Current user:', user);
    } else {
      console.log('No user logged in');
    }
  } catch (error) {
    console.error('Failed to load user:', error);
  }
};
```

## 🔒 Security Features

### 1. **Token Security**
- Tokens stored in AsyncStorage (encrypted on iOS, keystore on Android)
- Access tokens expire after 15 minutes
- Refresh tokens expire after 30 days
- Automatic token rotation on refresh

### 2. **Request Security**
- All requests include platform identifier
- Device ID for tracking and security
- Automatic retry with exponential backoff
- Request queuing during token refresh

### 3. **Error Handling**
- Graceful degradation on network errors
- Clear error messages for users
- Automatic session cleanup on auth failures
- Logging for debugging

## 🔄 Token Refresh Flow

```
1. User makes API request
2. Access token is expired (401)
3. ApiClient intercepts the error
4. Calls refresh endpoint with refresh token
5. Receives new access + refresh tokens
6. Saves new tokens
7. Retries original request with new token
8. Returns response to user
```

## 🎯 Best Practices

### 1. **Always Check Authentication**
```typescript
useEffect(() => {
  const checkAuth = async () => {
    const isValid = await AuthService.validateSession();
    if (!isValid) {
      navigation.navigate('Login');
    }
  };
  checkAuth();
}, []);
```

### 2. **Handle Errors Gracefully**
```typescript
try {
  await AuthService.login(credentials);
} catch (error) {
  if (error.statusCode === 401) {
    Alert.alert('Error', 'Invalid credentials');
  } else if (error.statusCode === 429) {
    Alert.alert('Error', 'Too many attempts. Please try again later.');
  } else {
    Alert.alert('Error', error.message || 'Something went wrong');
  }
}
```

### 3. **Provide Guest Option**
```typescript
<TouchableOpacity onPress={handleGuestLogin}>
  <Text>Continue as Guest</Text>
</TouchableOpacity>
```

### 4. **Encourage Account Creation**
```typescript
if (await AuthService.isGuest()) {
  // Show upgrade prompt
  Alert.alert(
    'Create Account',
    'Create an account to save your progress and access all features!',
    [
      { text: 'Later', style: 'cancel' },
      { text: 'Create Account', onPress: () => navigation.navigate('Register') }
    ]
  );
}
```

## 🧪 Testing

### Unit Tests
```typescript
describe('AuthService', () => {
  it('should register guest user', async () => {
    const response = await AuthService.registerAsGuest();
    expect(response.user.isGuest).toBe(true);
  });

  it('should login with valid credentials', async () => {
    const response = await AuthService.login({
      email: 'test@example.com',
      password: 'password123'
    });
    expect(response.user.email).toBe('test@example.com');
  });
});
```

## 🔧 Configuration

### Update Backend URL
```typescript
// In ApiClient.ts
this.baseURL = __DEV__
  ? 'http://localhost:8000/api'  // Development
  : 'https://api.yourdomain.com/api';  // Production
```

### Adjust Token Expiry
Backend configuration in `.env`:
```
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
REFRESH_TOKEN_EXPIRY_DAYS=30
```

## 📊 Monitoring

### Log Authentication Events
```typescript
// Add to AuthService methods
console.log('[Auth] User logged in:', user.id);
console.log('[Auth] Token refreshed');
console.log('[Auth] User logged out');
```

### Track Errors
```typescript
// Integrate with error tracking service
import * as Sentry from '@sentry/react-native';

catch (error) {
  Sentry.captureException(error);
  throw error;
}
```

## 🚀 Next Steps

1. **Implement in Login/Register Screens**
2. **Add Loading States**
3. **Implement Error Handling UI**
4. **Add Biometric Authentication** (optional)
5. **Implement Social Login** (optional)
6. **Add Analytics Tracking**

## 📝 Notes

- All tokens are automatically managed
- No need to manually handle token refresh
- Guest users can seamlessly upgrade
- Session validation happens automatically
- Secure by default with best practices

## 🆘 Troubleshooting

### Token Refresh Fails
- Check network connection
- Verify backend is running
- Check refresh token expiry
- Clear app data and re-login

### Authentication Loops
- Clear AsyncStorage
- Check token expiry times
- Verify backend JWT configuration

### Guest Upgrade Issues
- Ensure guest is logged in first
- Check email uniqueness
- Verify all required fields

## 📚 Additional Resources

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [React Native Security](https://reactnative.dev/docs/security)
- [AsyncStorage Documentation](https://react-native-async-storage.github.io/async-storage/)
