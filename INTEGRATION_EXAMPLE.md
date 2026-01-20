# 🔌 Authentication Integration Examples

## Quick Start Integration

### 1. Update LoginScreen.tsx

```typescript
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { AuthService } from '../services';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.login({
        email: email.trim(),
        password,
      });

      // Success! Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error.message || 'Invalid email or password'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await AuthService.registerAsGuest();
      
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to continue as guest');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your existing UI with:
    // - Email input bound to {email, setEmail}
    // - Password input bound to {password, setPassword}
    // - Login button calling handleLogin
    // - Guest button calling handleGuestLogin
    // - Loading indicator when {loading}
  );
};
```

### 2. Update RegisterScreen.tsx

```typescript
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { AuthService } from '../services';

const RegisterScreen: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;

    setLoading(true);
    try {
      // Check if upgrading from guest
      const isGuest = await AuthService.isGuest();

      if (isGuest) {
        // Upgrade guest account
        await AuthService.upgradeGuestAccount({
          email: email.trim(),
          password,
          name: name.trim(),
        });
      } else {
        // New registration
        await AuthService.register({
          email: email.trim(),
          password,
          name: name.trim(),
        });
      }

      // Success!
      navigation.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      });
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'Failed to create account'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    // Your existing UI with:
    // - Name input bound to {name, setName}
    // - Email input bound to {email, setEmail}
    // - Password input bound to {password, setPassword}
    // - Confirm password input bound to {confirmPassword, setConfirmPassword}
    // - Register button calling handleRegister
    // - Loading indicator when {loading}
  );
};
```

### 3. Update App.tsx (Check Auth on Launch)

```typescript
import React, { useState, useEffect } from 'react';
import { AuthService } from './src/services';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Onboarding' | 'Login' | 'MainTabs'>('Onboarding');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check onboarding
      const onboardingCompleted = await hasCompletedOnboarding();
      
      if (!onboardingCompleted) {
        setInitialRoute('Onboarding');
        setIsLoading(false);
        return;
      }

      // Check authentication
      const isAuthenticated = await AuthService.isAuthenticated();
      
      if (isAuthenticated) {
        // Validate session
        const isValid = await AuthService.validateSession();
        
        if (isValid) {
          setInitialRoute('MainTabs');
        } else {
          setInitialRoute('Login');
        }
      } else {
        setInitialRoute('Login');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setInitialRoute('Login');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    // Your navigation with initialRoute
  );
};
```

### 4. Add Logout to ProfileScreen

```typescript
import { AuthService } from '../services';
import { CommonActions } from '@react-navigation/native';

const handleLogout = () => {
  Alert.alert(
    'Logout',
    'Are you sure you want to logout?',
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive', 
        onPress: async () => {
          try {
            await AuthService.logout();
            
            // Navigate to login
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );
          } catch (error) {
            console.error('Logout error:', error);
            // Still navigate even if server request fails
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              })
            );
          }
        } 
      },
    ]
  );
};
```

### 5. Protected API Calls Example

```typescript
import { ApiClient } from '../services';

// Fetch user's favorite stories
const fetchFavorites = async () => {
  try {
    const favorites = await ApiClient.get('/stories/favorites');
    setFavorites(favorites);
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
  }
};

// Add story to favorites
const addToFavorites = async (storyId: string) => {
  try {
    await ApiClient.post('/stories/favorites', { storyId });
    Alert.alert('Success', 'Added to favorites!');
  } catch (error) {
    Alert.alert('Error', 'Failed to add to favorites');
  }
};
```

### 6. Show Upgrade Prompt for Guests

```typescript
import { AuthService } from '../services';

const showUpgradePrompt = async () => {
  const isGuest = await AuthService.isGuest();
  
  if (isGuest) {
    Alert.alert(
      '✨ Create Your Account',
      'Create an account to save your favorites, track progress, and access all features!',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { 
          text: 'Create Account', 
          onPress: () => navigation.navigate('Register')
        }
      ]
    );
  }
};

// Call this when user tries to use premium features
useEffect(() => {
  showUpgradePrompt();
}, []);
```

### 7. Handle Session Expiry

```typescript
import { useEffect } from 'react';
import { AuthService } from '../services';
import { AppState } from 'react-native';

const useSessionValidation = () => {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (nextAppState === 'active') {
        // App came to foreground, validate session
        const isValid = await AuthService.validateSession();
        
        if (!isValid) {
          Alert.alert(
            'Session Expired',
            'Your session has expired. Please login again.',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  });
                }
              }
            ]
          );
        }
      }
    });

    return () => subscription.remove();
  }, []);
};

// Use in your main app component
const App = () => {
  useSessionValidation();
  // ... rest of your app
};
```

## 🎨 UI Enhancements

### Loading States

```typescript
{loading ? (
  <ActivityIndicator size="large" color="#8B5CF6" />
) : (
  <TouchableOpacity onPress={handleLogin}>
    <Text>Login</Text>
  </TouchableOpacity>
)}
```

### Error Display

```typescript
{error && (
  <View style={styles.errorContainer}>
    <Icon name="alert-circle" size={20} color="#EF4444" />
    <Text style={styles.errorText}>{error}</Text>
  </View>
)}
```

### Success Feedback

```typescript
import Toast from 'react-native-toast-message';

Toast.show({
  type: 'success',
  text1: 'Welcome back!',
  text2: 'You have successfully logged in',
});
```

## 🔐 Security Best Practices

1. **Never log sensitive data**
```typescript
// ❌ Bad
console.log('Password:', password);

// ✅ Good
console.log('Login attempt for user:', email);
```

2. **Validate inputs**
```typescript
const validateEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};
```

3. **Use secure text entry**
```typescript
<TextInput
  secureTextEntry
  autoCapitalize="none"
  autoCorrect={false}
/>
```

4. **Clear sensitive data on unmount**
```typescript
useEffect(() => {
  return () => {
    setPassword('');
    setConfirmPassword('');
  };
}, []);
```

## 📱 Testing

```typescript
// Mock AuthService for testing
jest.mock('../services', () => ({
  AuthService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
  },
}));

describe('LoginScreen', () => {
  it('should login successfully', async () => {
    AuthService.login.mockResolvedValue({
      user: { id: '1', email: 'test@example.com' },
      accessToken: 'token',
    });

    // Test your component
  });
});
```

## 🚀 Ready to Use!

Your authentication system is now fully implemented and ready to use. Simply:

1. Update your Login/Register screens with the examples above
2. Add session validation to your App.tsx
3. Use ApiClient for all authenticated API calls
4. Test the flow thoroughly

All token management, refresh logic, and security is handled automatically! 🎉
