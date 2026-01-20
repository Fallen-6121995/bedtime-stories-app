# Refresh Token Fix - Authorization Header Issue

## Problem Identified ✅

You were correct! The `AuthService.refreshToken()` method was calling `ApiClient.post()`, which automatically adds the Authorization header to ALL requests. This was causing the refresh token request to include an Authorization header, which is incorrect.

### What Was Happening (WRONG):

```typescript
// AuthService.refreshToken() was calling:
await ApiClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken });

// ApiClient.post() adds Authorization header automatically:
Headers: {
  "Authorization": "Bearer eyJhbGci...",  // ❌ WRONG!
  "x-api-key": "...",
  // ... other headers
}
```

## Solution Applied ✅

Changed `AuthService.refreshToken()` to use direct `fetch()` call instead of going through `ApiClient`, which bypasses the automatic Authorization header addition.

### What Happens Now (CORRECT):

```typescript
// AuthService.refreshToken() now uses direct fetch:
await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_CONFIG.API_KEY,
    'x-platform': API_CONFIG.PLATFORM,
    'x-client-id': API_CONFIG.MOBILE_CLIENT_ID,
    'x-client-secret': API_CONFIG.MOBILE_CLIENT_SECRET,
    // ❌ NO Authorization header
  },
  body: JSON.stringify({ refreshToken }),
});
```

## Two Refresh Methods

Now there are TWO methods that handle token refresh:

### 1. `ApiClient.refreshAccessToken()` (Private)
- Used internally by ApiClient when it gets a 401 response
- Already correct - no Authorization header
- Handles automatic retry of failed requests

### 2. `AuthService.refreshToken()` (Public)
- Used by app code to manually refresh tokens
- **NOW FIXED** - no Authorization header
- Can be called directly from components/screens

## When Each is Used

### ApiClient.refreshAccessToken() (Automatic):
```
User makes API request → GET /user/me
  ↓
Response: 401 Unauthorized
  ↓
ApiClient.refreshAccessToken() ← Automatic refresh
  ↓
Retry original request with new token
```

### AuthService.refreshToken() (Manual):
```
App checks token expiry → Token expired
  ↓
AuthService.refreshToken() ← Manual refresh
  ↓
Continue with new token
```

## Testing the Fix

### Test 1: Manual Refresh
```typescript
import { AuthService } from './src/services';

try {
  const newToken = await AuthService.refreshToken();
  console.log('✅ Refresh successful:', newToken);
} catch (error) {
  console.error('❌ Refresh failed:', error);
}
```

### Test 2: Check Logs
You should now see:
```
🔄 AuthService.refreshToken: Getting refresh token...
🔄 Calling refresh endpoint WITHOUT Authorization header...
🌐 Refresh URL: https://bedtime-stories-5eb2.onrender.com/api/auth/refresh
📥 Refresh response status: 200
✅ Refresh successful
💾 New tokens saved
```

### Test 3: Verify Headers
The request should NOT include Authorization header:
```json
{
  "Content-Type": "application/json",
  "x-api-key": "pk_Zt1cFQjpIqJA6gDOZsyWcWwZsxKxV9D6",
  "x-platform": "mobile",
  "x-client-id": "myapp",
  "x-client-secret": "somesecretvalue"
}
```

## Expected Backend Response

### Success (200):
```json
{
  "accessToken": "new_access_token_here",
  "refreshToken": "new_refresh_token_here"
}
```

### Error (401):
```json
{
  "error": "Invalid or expired refresh token"
}
```

## Summary of Changes

### Before (WRONG):
```typescript
async refreshToken(): Promise<string> {
  const refreshToken = await TokenManager.getRefreshToken();
  
  // ❌ This adds Authorization header automatically
  const response = await ApiClient.post(
    API_ENDPOINTS.AUTH.REFRESH,
    { refreshToken }
  );
  
  // ...
}
```

### After (CORRECT):
```typescript
async refreshToken(): Promise<string> {
  const refreshToken = await TokenManager.getRefreshToken();
  
  // ✅ Direct fetch - no Authorization header
  const response = await fetch(
    `${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_CONFIG.API_KEY,
        'x-platform': API_CONFIG.PLATFORM,
        'x-client-id': API_CONFIG.MOBILE_CLIENT_ID,
        'x-client-secret': API_CONFIG.MOBILE_CLIENT_SECRET,
        // ❌ NO Authorization header
      },
      body: JSON.stringify({ refreshToken }),
    }
  );
  
  // ...
}
```

## Benefits

✅ **Correct Implementation** - Matches backend requirements exactly
✅ **No Authorization Header** - Refresh token sent in body only
✅ **Better Logging** - See exactly what's happening
✅ **Consistent** - Both refresh methods now work correctly

## Next Steps

1. ✅ Kill and restart your mobile app
2. ✅ Test token refresh
3. ✅ Verify no Authorization header in logs
4. ✅ Confirm refresh works successfully

The refresh token implementation is now correct! 🎉
