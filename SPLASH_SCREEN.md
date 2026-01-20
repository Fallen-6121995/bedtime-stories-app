# Splash Screen & Auto-Login Implementation

## Overview
The app now includes a splash screen that displays while checking for saved authentication tokens and automatically logs in users if a valid token exists.

## Flow

### 1. App Launch
- **SplashScreen** is displayed immediately when the app starts
- Minimum display time: 2 seconds (for better UX)

### 2. Token Validation Process

```
App Launch
    ↓
Show Splash Screen
    ↓
Check Onboarding Status
    ↓
Check for Saved Token
    ↓
┌─────────────────────┐
│  Token Exists?      │
└─────────────────────┘
    ↓           ↓
   YES         NO
    ↓           ↓
Validate    Go to Login
Session         Screen
    ↓
┌─────────────────────┐
│  Session Valid?     │
└─────────────────────┘
    ↓           ↓
   YES         NO
    ↓           ↓
Fetch User  Go to Login
Details         Screen
    ↓
┌─────────────────────┐
│  User Fetched?      │
└─────────────────────┘
    ↓           ↓
   YES         NO
    ↓           ↓
Go to Main  Go to Login
Tabs Screen     Screen
```

### 3. User Details Fetching
When a valid token is found:
- Calls `AuthService.fetchUserDetails()` 
- Makes GET request to `/users/me` endpoint
- Saves user data to local storage
- User data is immediately available in HomeScreen and ProfileScreen

## Files Modified

### New Files
- `src/screens/SplashScreen.tsx` - Beautiful animated splash screen

### Modified Files
- `App.tsx` - Added splash screen and token validation logic
- `src/services/auth/AuthService.ts` - Added `fetchUserDetails()` method
- `src/screens/HomeScreen.tsx` - Updated to use `useFocusEffect` for user data
- `src/screens/ProfileScreen.tsx` - Already uses `useFocusEffect` for user data

## API Endpoint

### GET /user/me
**Base URL:** `https://bedtime-stories-5eb2.onrender.com/api`

**Full URL:** `https://bedtime-stories-5eb2.onrender.com/api/user/me`

**Headers Required:**
- `Authorization: Bearer <access_token>`
- `x-api-key: <api_key>`
- `x-platform: mobile`
- `x-client-id: <client_id>`
- `x-client-secret: <client_secret>`

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "name": "User Name",
    "mobileNumber": "+1234567890",
    "isGuest": false,
    "deviceId": "device_id",
    "preferences": {},
    "upgradedFromGuest": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "lastActiveAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## User Experience

1. **First Time Users**: See onboarding → Login/Register
2. **Returning Users with Valid Token**: See splash screen → Automatically logged in → Home screen
3. **Returning Users with Expired Token**: See splash screen → Login screen
4. **Users Without Token**: See splash screen → Login screen

## Benefits

- ✅ Seamless user experience - no need to login every time
- ✅ Automatic token refresh if expired but refresh token is valid
- ✅ User data is always up-to-date from server
- ✅ Beautiful splash screen with animations
- ✅ Minimum 2-second splash display prevents flickering
- ✅ Proper error handling and fallback to login screen

## Testing

To test the auto-login feature:
1. Login to the app
2. Close the app completely
3. Reopen the app
4. You should see the splash screen briefly, then be automatically logged in to the home screen
5. Your name should appear in the home screen greeting
6. Your profile should show your details

## Notes

- Token validation happens on every app launch
- If the access token is expired but refresh token is valid, it will automatically refresh
- If both tokens are invalid, user is redirected to login screen
- User data is fetched fresh from the server on each app launch to ensure it's up-to-date
