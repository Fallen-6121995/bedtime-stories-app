# 🔐 Session Management & Persistence

## Overview
The app now maintains user sessions across app restarts using secure token storage and automatic token refresh.

## 🎯 Features Implemented

### 1. **Session Persistence**
- User stays logged in after closing the app
- Tokens stored securely in AsyncStorage
- User data cached locally
- Automatic session validation on app launch

### 2. **Automatic Token Refresh**
- Access tokens automatically refresh when expired
- Refresh token used to get new access token
- Seamless user experience (no re-login needed)
- Handled automatically by ApiClient

### 3. **User Data Display**
- Real user name shown in Profile screen
- First name displayed in Home screen greeting
- Dynamic greeting based on time of day
- Guest users identified and labeled

## 🔄 Session Flow

### App Launch Flow

```
App Starts
    ↓
Check Onboarding Status
    ↓
┌─────────────────────────────────────┐
│ Onboarding Not Completed            │
│ → Show Onboarding                   │
└─────────────────────────────────────┘
    ↓
Check Authentication Status
    ↓
┌─────────────────────────────────────┐
│ No Tokens Found                     │
│ → Show Login Screen                 │
└─────────────────────────────────────┘
    ↓
Validate Session
    ↓
┌─────────────────────────────────────┐
│ Access Token Valid                  │
│ → Go to MainTabs                    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Access Token Expired                │
│ → Try Refresh Token                 │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Refresh Successful                  │
│ → Go to MainTabs                    │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Refresh Failed                      │
│ → Show Login Screen                 │
└─────────────────────────────────────┘
```

### Token Refresh Flow

```
API Request Made
    ↓
Access Token Expired (401)
    ↓
ApiClient Intercepts
    ↓
Call /auth/refresh with Refresh Token
    ↓
┌─────────────────────────────────────┐
│ Refresh Successful                  │
│ → Save New Tokens                   │
│ → Retry Original Request            │
│ → Return Response                   │
└─────────────────────────────────────┘
    ↓
┌─────────────────────────────────────┐
│ Refresh Failed                      │
│ → Clear Tokens                      │
│ → Navigate to Login                 │
└─────────────────────────────────────┘
```

## 📦 Data Storage

### Stored Data

1. **Access Token**
   - Key: `@bedtime_stories_access_token`
   - Expires: 15 minutes
   - Used for API authentication

2. **Refresh Token**
   - Key: `@bedtime_stories_refresh_token`
   - Expires: 30 days
   - Used to get new access token

3. **User Data**
   - Key: `@bedtime_stories_user_data`
   - Contains: id, name, email, isGuest, etc.
   - Updated on login/register

4. **Device ID**
   - Key: `@bedtime_stories_device_id`
   - Unique device identifier
   - Used for guest accounts

5. **Onboarding Status**
   - Key: `@bedtime_stories_onboarding_completed`
   - Boolean flag
   - Prevents showing onboarding again

## 🔧 Implementation Details

### App.tsx - Session Check

```typescript
const initializeApp = async () => {
  // 1. Check onboarding
  const onboardingCompleted = await hasCompletedOnboarding();
  if (!onboardingCompleted) {
    return setInitialRoute('Onboarding');
  }

  // 2. Check authentication
  const isAuthenticated = await AuthService.isAuthenticated();
  if (!isAuthenticated) {
    return setInitialRoute('Login');
  }

  // 3. Validate session (auto-refresh if needed)
  const isValid = await AuthService.validateSession();
  if (isValid) {
    setInitialRoute('MainTabs'); // User stays logged in!
  } else {
    setInitialRoute('Login');
  }
};
```

### AuthService - Session Validation

```typescript
async validateSession(): Promise<boolean> {
  const accessToken = await TokenManager.getAccessToken();
  
  if (!accessToken) return false;

  // Check if token is expired
  if (TokenManager.isTokenExpired(accessToken)) {
    // Try to refresh
    try {
      await this.refreshToken();
      return true; // Refresh successful
    } catch (error) {
      return false; // Refresh failed
    }
  }

  return true; // Token still valid
}
```

### ApiClient - Automatic Refresh

```typescript
async request(endpoint, options) {
  const response = await fetch(url, { headers });

  // Handle 401 Unauthorized
  if (response.status === 401) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      
      // Refresh token
      const newAccessToken = await this.refreshAccessToken();
      
      // Retry original request with new token
      const retryResponse = await fetch(url, {
        headers: { ...headers, Authorization: `Bearer ${newAccessToken}` }
      });
      
      return retryResponse;
    }
  }

  return response;
}
```

## 🎨 User Experience

### Home Screen
- Shows personalized greeting: "Good Morning, John"
- Greeting changes based on time:
  - Morning: 12 AM - 11:59 AM
  - Afternoon: 12 PM - 4:59 PM
  - Evening: 5 PM - 11:59 PM
- Shows first name only (not full name)

### Profile Screen
- Shows full name
- Shows email address
- Guest badge for guest users
- "Upgrade to Full Account" button for guests

### Session Behavior
- ✅ User stays logged in after app restart
- ✅ Tokens refresh automatically
- ✅ No interruption to user experience
- ✅ Seamless background refresh
- ✅ Only logs out when refresh token expires (30 days)

## 🔒 Security

### Token Security
- Tokens stored in AsyncStorage (encrypted on iOS, keystore on Android)
- Access token expires after 15 minutes
- Refresh token expires after 30 days
- Tokens cleared on logout

### Session Security
- Token validation on app launch
- Automatic cleanup on auth failures
- Secure token refresh mechanism
- Device ID for guest tracking

## 🧪 Testing Session Management

### Test Scenarios

1. **Fresh Install**
   ```
   - Install app
   - Should show Onboarding
   - Complete onboarding
   - Should show Login
   ```

2. **First Login**
   ```
   - Login with credentials
   - Should navigate to MainTabs
   - Close app
   - Reopen app
   - Should go directly to MainTabs (no login needed)
   ```

3. **Token Expiry**
   ```
   - Login and use app
   - Wait 15+ minutes (access token expires)
   - Make an API request
   - Should auto-refresh and continue
   - No user interruption
   ```

4. **Refresh Token Expiry**
   ```
   - Login and use app
   - Wait 30+ days (refresh token expires)
   - Reopen app
   - Should show Login screen
   ```

5. **Logout**
   ```
   - Logout from Profile
   - Should clear all tokens
   - Reopen app
   - Should show Login screen
   ```

6. **Guest Mode**
   ```
   - Continue as Guest
   - Close app
   - Reopen app
   - Should stay logged in as guest
   ```

## 📊 Session Lifecycle

### Login/Register
1. User enters credentials
2. Backend returns tokens + user data
3. Save tokens to TokenManager
4. Save user data to UserManager
5. Navigate to MainTabs

### App Launch
1. Check for tokens
2. Validate access token
3. If expired, use refresh token
4. If valid, go to MainTabs
5. If invalid, go to Login

### API Request
1. Add access token to headers
2. Make request
3. If 401, refresh token
4. Retry request
5. Return response

### Logout
1. Call logout endpoint
2. Clear tokens from TokenManager
3. Clear user data from UserManager
4. Navigate to Login

## 🛠️ Troubleshooting

### User Not Staying Logged In
- Check if tokens are being saved
- Verify AsyncStorage permissions
- Check token expiry times
- Ensure refresh token is valid

### Infinite Login Loop
- Clear AsyncStorage
- Check token validation logic
- Verify refresh endpoint
- Check backend token expiry settings

### User Data Not Showing
- Verify user data is saved after login
- Check UserManager.getUser()
- Ensure user object has name/email
- Check for null/undefined values

## 📝 Best Practices

1. **Always validate sessions on app launch**
2. **Handle token refresh transparently**
3. **Clear data on logout**
4. **Show loading states during validation**
5. **Handle errors gracefully**
6. **Log session events for debugging**
7. **Test with expired tokens**
8. **Implement proper error handling**

## 🚀 Future Enhancements

- [ ] Biometric authentication (Face ID / Touch ID)
- [ ] Remember me option
- [ ] Multiple device management
- [ ] Session activity tracking
- [ ] Push notification for session expiry
- [ ] Offline mode support
- [ ] Session analytics

## ✅ Checklist

Session management is complete when:
- [x] User stays logged in after app restart
- [x] Tokens refresh automatically
- [x] User data persists
- [x] Guest mode works
- [x] Logout clears all data
- [x] Loading states shown
- [x] Error handling implemented
- [x] User name displayed correctly
- [x] Session validation on launch
- [x] Automatic token refresh on API calls

## 📚 Related Documentation

- [Authentication Implementation](./AUTH_IMPLEMENTATION.md)
- [API Configuration](./API_CONFIGURATION.md)
- [Integration Examples](./INTEGRATION_EXAMPLE.md)
