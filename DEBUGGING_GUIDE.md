# Debugging Guide - Splash Screen & API Issues

## Enhanced Logging Added

The app now has comprehensive logging to help debug issues. Here's what to look for:

## Console Log Flow

### Normal Successful Flow:
```
🚀 App initialization started...
📋 Step 1: Checking onboarding status...
📋 Onboarding completed: true
🔐 Step 2: Checking authentication status...
🔐 Is authenticated: true
🔑 Step 3: Token found, validating session...
🔍 Validating session...
✅ Access token found
⏰ Token expired: false
✅ Token is still valid
🔑 Session valid: true
👤 Step 4: Fetching user details from /user/me...
🌐 API Request: GET https://bedtime-stories-5eb2.onrender.com/api/user/me
🔑 Access token exists: true
🔑 Token preview: eyJhbGciOiJIUzI1NiIs...
📋 Request headers: { ... }
📤 Sending request...
📥 Response status: 200 OK
📡 Calling API: /user/me
✅ API Response received: { user: { ... } }
💾 User data saved to storage
👤 User fetch result: Success
✅ User details fetched successfully: John Doe
🏁 App initialization complete, hiding splash screen
```

### Flow with Expired Token (Auto-Refresh):
```
🚀 App initialization started...
📋 Step 1: Checking onboarding status...
📋 Onboarding completed: true
🔐 Step 2: Checking authentication status...
🔐 Is authenticated: true
🔑 Step 3: Token found, validating session...
🔍 Validating session...
✅ Access token found
⏰ Token expired: true
🔄 Token expired, attempting refresh...
✅ Token refresh successful
🔑 Session valid: true
👤 Step 4: Fetching user details from /user/me...
[continues as normal...]
```

### Flow with 401 Error (Token Refresh During API Call):
```
🚀 App initialization started...
[... initial checks ...]
👤 Step 4: Fetching user details from /user/me...
🌐 API Request: GET https://bedtime-stories-5eb2.onrender.com/api/user/me
📤 Sending request...
📥 Response status: 401 Unauthorized
🔄 Got 401, attempting token refresh...
🔄 Starting token refresh...
✅ Token refreshed successfully
🔄 Retrying original request with new token...
📥 Retry response status: 200 OK
✅ API Response received: { user: { ... } }
```

### Flow with Failed Authentication:
```
🚀 App initialization started...
[... initial checks ...]
🔑 Step 3: Token found, validating session...
🔍 Validating session...
✅ Access token found
⏰ Token expired: true
🔄 Token expired, attempting refresh...
❌ Token refresh failed: [error details]
🔑 Session valid: false
❌ Session validation failed, navigating to Login
🏁 App initialization complete, hiding splash screen
```

## Common Issues & Solutions

### Issue 1: Stuck on Splash Screen
**Symptoms:** App shows splash screen indefinitely

**Debug Steps:**
1. Check console logs - look for where the flow stops
2. Look for the last log message before it gets stuck
3. Check if `🏁 App initialization complete` appears

**Possible Causes:**
- Network timeout (no response from server)
- Unhandled promise rejection
- Missing error handling

**Solution:** The updated code now has:
- Comprehensive try-catch blocks
- Guaranteed `finally` block that sets `isLoading(false)`
- Minimum 2-second splash time that always completes

### Issue 2: 401 Error on /user/me
**Symptoms:** Getting 401 Unauthorized error

**Debug Steps:**
1. Look for these logs:
   ```
   📥 Response status: 401 Unauthorized
   🔄 Got 401, attempting token refresh...
   ```

2. Check if token refresh succeeds:
   ```
   ✅ Token refreshed successfully
   ```
   OR
   ```
   ❌ Token refresh failed: [error]
   ```

**Possible Causes:**
- Access token expired (should auto-refresh)
- Refresh token also expired (need to login again)
- Invalid token format
- Backend auth middleware issue

**Solution:**
- If refresh succeeds: Request should retry automatically
- If refresh fails: User redirected to login screen
- Check backend logs for auth middleware errors

### Issue 3: Token Exists but User Not Fetched
**Symptoms:** Token validation passes but user fetch fails

**Debug Steps:**
1. Look for:
   ```
   👤 Step 4: Fetching user details from /user/me...
   ❌ Fetch user details error: [error]
   ```

2. Check the error details in logs

**Possible Causes:**
- Wrong endpoint URL
- Missing headers
- Backend route not found
- User not found in database

**Solution:** Check these logs:
```
🌐 API Request: GET [URL]
📋 Request headers: [headers]
📥 Response status: [status]
```

## Manual Debugging Commands

### Clear All Tokens (Force Login)
Add this to a test button or run in console:
```typescript
import { TokenManager, UserManager } from './src/services';

await TokenManager.clearTokens();
await UserManager.clearUser();
// Restart app
```

### Check Current Token Status
```typescript
import { TokenManager } from './src/services';

const token = await TokenManager.getAccessToken();
console.log('Token:', token);
console.log('Is expired:', TokenManager.isTokenExpired(token));
```

### Test API Call Directly
```typescript
import { UserService } from './src/services';

try {
  const user = await UserService.getMe();
  console.log('User:', user);
} catch (error) {
  console.error('Error:', error);
}
```

## Backend Verification

### Check if /user/me endpoint works:
```bash
curl -X GET https://bedtime-stories-5eb2.onrender.com/api/user/me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "x-api-key: pk_Zt1cFQjpIqJA6gDOZsyWcWwZsxKxV9D6" \
  -H "x-platform: mobile" \
  -H "x-client-id: myapp" \
  -H "x-client-secret: somesecretvalue"
```

### Expected Response:
```json
{
  "user": {
    "id": "...",
    "email": "...",
    "name": "...",
    "isGuest": false
  }
}
```

## What to Check in Backend

1. **Auth Middleware** - Is it properly validating the token?
2. **Route Mounting** - Is `/api/user/me` properly mounted?
3. **User Controller** - Is `getCurrentUser` function working?
4. **Database** - Does the user exist in the database?

## Quick Fixes

### If stuck on splash screen:
1. Kill app completely
2. Clear app data/cache
3. Restart app
4. Check console logs immediately

### If 401 persists:
1. Login again to get fresh tokens
2. Check if backend is running
3. Verify API key and client credentials
4. Check backend auth middleware logs

### If user fetch fails:
1. Verify endpoint URL is correct
2. Check backend route is mounted
3. Verify user exists in database
4. Check backend controller logs

## Log Levels

The app now logs at different levels:
- 🚀 **Initialization** - App startup
- 📋 **Info** - General information
- 🔐 **Auth** - Authentication checks
- 🔑 **Token** - Token operations
- 👤 **User** - User operations
- 🌐 **Network** - API requests
- ✅ **Success** - Operations succeeded
- ❌ **Error** - Operations failed
- 🔄 **Retry** - Retry operations
- 🏁 **Complete** - Process finished

## Next Steps

1. **Run the app** and watch the console logs
2. **Identify where it stops** in the flow
3. **Check the error messages** for clues
4. **Verify backend** is responding correctly
5. **Test API endpoint** directly with curl/Postman

The enhanced logging will show you exactly where the issue is occurring!
