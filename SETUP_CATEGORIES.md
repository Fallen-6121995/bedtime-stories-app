# Setup Categories - Quick Guide

## Prerequisites

1. ✅ Backend server running
2. ✅ Database connected
3. ✅ Prompts updated (animals, adventure, magic, nature, space, ocean)

## Step 1: Create Categories in Database

Run the setup script to populate categories:

```bash
node backend/scripts/setupCategories.js
```

**Expected Output**:
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

📋 Setting up categories...

✨ Created category: "Animals"
   ID: 507f1f77bcf86cd799439011
   Prompt Key: animals
   Icon: 🐾

✨ Created category: "Adventure"
   ...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Category setup complete!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Current Categories:

🐾 Animals
   ID: 507f1f77bcf86cd799439011
   Prompt: animals
   Active: ✅

🚀 Adventure
   ...
```

## Step 2: Verify API Endpoint

Test the categories endpoint:

```bash
# Get your access token first (login or use existing token)
export TOKEN="your_access_token_here"

# Test categories endpoint
curl http://localhost:5000/api/categories \
  -H "Authorization: Bearer $TOKEN" \
  -H "x-api-key: pk_Zt1cFQjpIqJA6gDOZsyWcWwZsxKxV9D6" \
  -H "x-platform: mobile" \
  -H "x-client-id: myapp" \
  -H "x-client-secret: somesecretvalue"
```

**Expected Response**:
```json
{
  "categories": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Animals",
      "slug": "animals",
      "description": "Fun stories about animals...",
      "icon": "🐾",
      "color": "#FFB5E8",
      "promptKey": "animals",
      "storyCount": 0,
      "isActive": true,
      "order": 1
    },
    // ... 5 more categories
  ]
}
```

## Step 3: Update API Configuration

Make sure your mobile app points to the correct backend URL:

**File**: `mobile app/BedtimeStoriesApp/src/config/api.config.ts`

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',  // Update this!
  // or for physical device:
  // BASE_URL: 'http://192.168.1.x:5000/api',
  
  API_KEY: 'pk_Zt1cFQjpIqJA6gDOZsyWcWwZsxKxV9D6',
  PLATFORM: 'mobile',
  CLIENT_ID: 'myapp',
  CLIENT_SECRET: 'somesecretvalue',
};
```

## Step 4: Test in Mobile App

### Option A: Using Debug Screen

1. Open the app
2. Navigate to Debug screen (if available)
3. Test "Fetch Categories" button
4. Check console logs

### Option B: Using HomeScreen

1. Open the app
2. HomeScreen should automatically fetch categories
3. Check if categories display correctly
4. Look for console logs:
   ```
   ✅ Categories loaded: 6
     - Animals (0 stories)
     - Adventure (0 stories)
     - Magic (0 stories)
     - Nature (0 stories)
     - Space (0 stories)
     - Ocean (0 stories)
   ```

### Option C: Manual Test

Add this to any screen:

```typescript
import { CategoryService } from '../services';

const testCategories = async () => {
  try {
    const categories = await CategoryService.getCategories();
    console.log('✅ Success:', categories);
  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Call it
useEffect(() => {
  testCategories();
}, []);
```

## Troubleshooting

### Issue: "Network request failed"

**Cause**: Can't reach backend server

**Solutions**:
1. Check backend is running: `http://localhost:5000`
2. For physical device, use computer's IP: `http://192.168.1.x:5000`
3. Check firewall settings
4. Verify API_CONFIG.BASE_URL is correct

### Issue: "401 Unauthorized"

**Cause**: Authentication failed

**Solutions**:
1. Check if user is logged in
2. Verify access token is valid
3. Check API key headers are correct
4. Try logging in again

### Issue: "Categories not displaying"

**Cause**: Data transformation issue

**Solutions**:
1. Check console logs for errors
2. Verify API response format
3. Check if `promptKey` exists in categories
4. Verify theme keys match in `storyThemes.ts`

### Issue: "Empty categories array"

**Cause**: No categories in database

**Solutions**:
1. Run setup script: `node backend/scripts/setupCategories.js`
2. Check database connection
3. Verify categories were created

## Verification Checklist

- [ ] Backend server running
- [ ] Database has 6 categories
- [ ] API endpoint returns categories
- [ ] Mobile app API config is correct
- [ ] User is authenticated
- [ ] Categories display in HomeScreen
- [ ] Category icons and colors show correctly
- [ ] Story counts display (may be 0 initially)

## Next Steps

Once categories are working:

1. **Generate Stories**: Use the categories to generate stories
2. **Update Story Counts**: Stories will automatically update category counts
3. **Test Category Navigation**: Click categories to see stories
4. **Add More Categories**: Create new categories via admin API

## Quick Test Script

Create a test file to verify everything:

```typescript
// test-categories.ts
import { CategoryService } from './src/services';

async function testCategories() {
  console.log('🧪 Testing Categories API...\n');

  try {
    // Test 1: Fetch categories
    console.log('1️⃣ Fetching categories...');
    const categories = await CategoryService.getCategories();
    console.log(`✅ Found ${categories.length} categories\n`);

    // Test 2: Display each category
    console.log('2️⃣ Category Details:');
    categories.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.icon} ${cat.name}`);
      console.log(`      ID: ${cat.id}`);
      console.log(`      Prompt: ${cat.promptKey}`);
      console.log(`      Stories: ${cat.storyCount}`);
      console.log('');
    });

    // Test 3: Get category by ID
    if (categories.length > 0) {
      console.log('3️⃣ Testing getCategoryById...');
      const firstCat = await CategoryService.getCategoryById(categories[0].id);
      console.log(`✅ Found: ${firstCat?.name}\n`);
    }

    // Test 4: Get category by slug
    if (categories.length > 0) {
      console.log('4️⃣ Testing getCategoryBySlug...');
      const cat = await CategoryService.getCategoryBySlug(categories[0].slug);
      console.log(`✅ Found: ${cat?.name}\n`);
    }

    console.log('🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCategories();
```

Run it:
```bash
npx ts-node test-categories.ts
```

## Success Indicators

You'll know it's working when:

1. ✅ Setup script creates 6 categories
2. ✅ API returns categories with correct structure
3. ✅ Mobile app displays 6 category cards
4. ✅ Each category has correct icon and color
5. ✅ No console errors
6. ✅ Categories are clickable (even if no stories yet)

## Summary

The category integration is complete! Your app now:
- Fetches real categories from backend
- Displays them with proper icons and colors
- Handles errors gracefully
- Falls back to mock data if needed
- Ready for story generation with categories
