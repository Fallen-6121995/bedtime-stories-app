# 🔧 API Configuration Guide

## Overview
This document explains the API configuration and required headers for the Bedtime Stories mobile app.

## 📋 Required Headers

All API requests to the backend **MUST** include these headers:

### 1. **x-api-key** (Required)
- **Purpose**: Authenticates the client application
- **Value**: `pk_Zt1cFQjpIqJA6gDOZsyWcWwZsxKxV9D6`
- **Type**: Public API Key
- **Security**: This is a public key meant for client identification, not secret data

```typescript
headers: {
  'x-api-key': 'pk_Zt1cFQjpIqJA6gDOZsyWcWwZsxKxV9D6'
}
```

### 2. **x-platform** (Required)
- **Purpose**: Identifies the client platform
- **Value**: `mobile` (for mobile app) or `web` (for web app)
- **Validation**: Backend validates this header

```typescript
headers: {
  'x-platform': 'mobile'
}
```

### 3. **x-client-id** (Required for mobile)
- **Purpose**: Identifies the mobile client application
- **Value**: `myapp`
- **When**: Required when x-platform is 'mobile'
- **Validation**: Backend validates against MOBILE_CLIENT_ID

```typescript
headers: {
  'x-client-id': 'myapp'
}
```

### 4. **x-client-secret** (Required for mobile)
- **Purpose**: Authenticates the mobile client application
- **Value**: `somesecretvalue`
- **When**: Required when x-platform is 'mobile'
- **Validation**: Backend validates against MOBILE_CLIENT_SECRET
- **Security**: Should be kept secure, but can be extracted from app

```typescript
headers: {
  'x-client-secret': 'somesecretvalue'
}
```

### 5. **Authorization** (Optional - for authenticated requests)
- **Purpose**: Contains the JWT access token
- **Format**: `Bearer <access_token>`
- **When**: Included automatically by ApiClient for authenticated requests

```typescript
headers: {
  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
}
```

### 6. **Content-Type** (Standard)
- **Purpose**: Specifies request body format
- **Value**: `application/json`

```typescript
headers: {
  'Content-Type': 'application/json'
}
```

## 🏗️ Configuration Structure

### API Config File
Location: `src/config/api.config.ts`

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://bedtime-stories-5eb2.onrender.com/api',
  API_KEY: 'pk_Zt1cFQjpIqJA6gDOZsyWcWwZsxKxV9D6',
  MOBILE_CLIENT_ID: 'myapp',
  MOBILE_CLIENT_SECRET: 'somesecretvalue',
  PLATFORM: 'mobile',
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
};
```

### Centralized Endpoints
All API endpoints are defined in `api.config.ts`:

```typescript
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  STORIES: {
    LIST: '/stories',
    DETAIL: (id) => `/stories/${id}`,
    FEATURED: '/stories/featured',
  },
  // ... more endpoints
};
```

## 🔐 Backend Validation

The backend validates:

1. **API Key** (`middleware/auth.js`): Must match `PUBLIC_API_KEY` in backend `.env`
2. **Platform** (`middleware/auth.js`): Must be either 'web' or 'mobile'
3. **Client Credentials** (`utils/utils.js`): For mobile, validates `x-client-id` and `x-client-secret`
4. **Origin** (web only): Validates allowed origins for web platform

### Backend Validation Flow

**Step 1: API Key Validation** (`middleware/auth.js`)
```javascript
exports.validateApiKey = (req, res, next) => {
  const apiKey = req.header('x-api-key') || '';
  const platform = (req.header('x-platform') || '').toLowerCase();

  // Validate platform
  if (!platform || !['web', 'mobile'].includes(platform)) {
    return res.status(400).json({ 
      error: 'Missing or invalid x-platform header' 
    });
  }

  // Validate API key
  if (!secureCompare(apiKey, PUBLIC_API_KEY)) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
};
```

**Step 2: Platform-Specific Validation** (`utils/utils.js`)
```javascript
function getPlatform(req) {
  const platform = req.headers['x-platform'];
  
  if (platform === 'mobile') {
    const clientId = req.headers['x-client-id'];
    const clientSecret = req.headers['x-client-secret'];
    
    if (
      clientId !== process.env.MOBILE_CLIENT_ID ||
      clientSecret !== process.env.MOBILE_CLIENT_SECRET
    ) {
      throw new Error('Invalid mobile client credentials');
    }
    
    return 'mobile';
  }
  
  return platform;
}
```

## 🚀 Usage in App

### Automatic Header Injection

The `ApiClient` automatically includes required headers:

```typescript
// src/services/api/ApiClient.ts
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
  'x-api-key': API_CONFIG.API_KEY,
  'x-platform': API_CONFIG.PLATFORM,
  'x-client-id': API_CONFIG.MOBILE_CLIENT_ID,
  'x-client-secret': API_CONFIG.MOBILE_CLIENT_SECRET,
  ...(options.headers as Record<string, string>),
};

// Add Authorization if token exists
if (accessToken) {
  headers['Authorization'] = `Bearer ${accessToken}`;
}
```

### Making API Calls

You don't need to manually add headers:

```typescript
import { ApiClient } from '../services';

// Headers are added automatically
const stories = await ApiClient.get('/stories');
const user = await ApiClient.post('/auth/login', { email, password });
```

## 🔄 Token Refresh

Token refresh also includes required headers:

```typescript
const response = await fetch(`${baseURL}/auth/refresh`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_CONFIG.API_KEY,
    'x-platform': API_CONFIG.PLATFORM,
  },
  body: JSON.stringify({ refreshToken }),
});
```

## ⚙️ Environment Configuration

### Development vs Production

```typescript
export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:8000/api'  // Development
    : 'https://bedtime-stories-5eb2.onrender.com/api',  // Production
};
```

### Backend Environment Variables

```env
# backend/.env
PUBLIC_API_KEY=pk_Zt1cFQjpIqJA6gDOZsyWcWwZsxKxV9D6
MOBILE_CLIENT_ID=myapp
MOBILE_CLIENT_SECRET=somesecretvalue
REQUIRE_ORIGIN=false  # Set to true for web origin validation
ALLOWED_ORIGINS=https://app.yourdomain.com,http://localhost:3001
```

## 🛡️ Security Considerations

### Public API Key
- **Not a Secret**: The API key is public and meant for client identification
- **Purpose**: Prevents unauthorized clients from accessing the API
- **Rotation**: Can be rotated by updating both backend and mobile app

### Why It's Safe
1. **Client Identification**: Only identifies the client, doesn't grant access
2. **Token-Based Auth**: Actual authentication uses JWT tokens
3. **Rate Limiting**: Backend can rate-limit by API key
4. **Platform Validation**: Ensures requests come from expected platforms

### What It Protects Against
- ✅ Random API scraping
- ✅ Unauthorized client applications
- ✅ Bot traffic
- ✅ Abuse from unknown sources

### What It Doesn't Protect
- ❌ Determined attackers (they can extract the key from the app)
- ❌ User authentication (handled by JWT tokens)
- ❌ Data encryption (handled by HTTPS)

## 🔧 Updating Configuration

### To Change API URL

1. Update `src/config/api.config.ts`:
```typescript
BASE_URL: 'https://your-new-api.com/api'
```

### To Change API Key

1. Update backend `.env`:
```env
PUBLIC_API_KEY=your_new_key_here
```

2. Update `src/config/api.config.ts`:
```typescript
API_KEY: 'your_new_key_here'
```

3. Rebuild and redeploy the app

### To Change Mobile Client Credentials

1. Update backend `.env`:
```env
MOBILE_CLIENT_ID=your_new_client_id
MOBILE_CLIENT_SECRET=your_new_client_secret
```

2. Update `src/config/api.config.ts`:
```typescript
MOBILE_CLIENT_ID: 'your_new_client_id',
MOBILE_CLIENT_SECRET: 'your_new_client_secret',
```

3. Rebuild and redeploy the app

## 🧪 Testing

### Test API Connection

```typescript
import { ApiClient } from '../services';

const testConnection = async () => {
  try {
    const response = await ApiClient.get('/health');
    console.log('API Connected:', response);
  } catch (error) {
    console.error('API Connection Failed:', error);
  }
};
```

### Verify Headers

```typescript
// Check if headers are being sent
const response = await fetch(API_CONFIG.BASE_URL + '/test', {
  headers: getDefaultHeaders(),
});
console.log('Request headers:', response.headers);
```

## 📊 Error Responses

### Missing API Key
```json
{
  "error": "Invalid API key"
}
```
**Status**: 403 Forbidden

### Invalid Platform
```json
{
  "error": "Missing or invalid x-platform header"
}
```
**Status**: 400 Bad Request

### Invalid Mobile Client Credentials
```json
{
  "error": "Invalid mobile client credentials"
}
```
**Status**: 500 Internal Server Error (thrown as Error)

### Invalid Token
```json
{
  "error": "Invalid or expired token"
}
```
**Status**: 401 Unauthorized

## 📝 Best Practices

1. **Never Hardcode**: Use config file for all API settings
2. **Environment Variables**: Use different configs for dev/prod
3. **Error Handling**: Always handle API errors gracefully
4. **Logging**: Log API errors for debugging
5. **Timeout**: Set reasonable timeout values
6. **Retry Logic**: Implement retry for transient failures

## 🆘 Troubleshooting

### "Invalid API key" Error
- Check if API_KEY in config matches backend PUBLIC_API_KEY
- Verify headers are being sent correctly
- Check backend logs for the received key

### "Missing x-platform header" Error
- Ensure ApiClient is being used (not raw fetch)
- Verify API_CONFIG.PLATFORM is set correctly
- Check if headers are being overridden

### Connection Refused
- Verify BASE_URL is correct
- Check if backend is running
- Ensure network connectivity
- Check firewall/proxy settings

## 📚 Related Documentation

- [Authentication Implementation](./AUTH_IMPLEMENTATION.md)
- [Integration Examples](./INTEGRATION_EXAMPLE.md)
- [Backend Integration](./BACKEND_INTEGRATION.md)

## ✅ Checklist

Before deploying:
- [ ] API_KEY matches backend PUBLIC_API_KEY
- [ ] BASE_URL points to correct backend
- [ ] PLATFORM is set to 'mobile'
- [ ] All endpoints are defined in API_ENDPOINTS
- [ ] Error handling is implemented
- [ ] Timeout values are reasonable
- [ ] Tested in both dev and prod environments
