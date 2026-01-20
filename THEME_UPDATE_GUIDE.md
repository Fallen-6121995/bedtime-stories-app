# Theme Update Guide

## Overview
This guide documents the unified theme applied across the BedtimeStoriesApp to ensure consistency and responsiveness.

## Theme Configuration
Location: `src/theme/appTheme.ts`

### Color Palette
- **Background**: `#F0F9FF` (Soft light blue)
- **Text Dark**: `#1E293B`
- **Text Light**: `#64748B`
- **Primary**: `#8B5CF6` (Purple)
- **Secondary**: `#38BDF8` (Sky blue)
- **Accent**: `#F59E0B` (Orange/Gold)
- **Card Shadow**: `#6366F1`

### Design Principles
1. **Chunky & Fun**: Large, rounded buttons with playful shadows
2. **Responsive**: Dynamic layouts that adapt to screen sizes (mobile, tablet, desktop)
3. **Kid-Friendly**: Bright colors, large touch targets, clear typography
4. **Consistent**: Same spacing, shadows, and border radius across all screens

## Responsive Grid System
- **Mobile** (<600px): 2 columns
- **Tablet** (600-1024px): 3 columns
- **Desktop** (>1024px): 4 columns

## Component Patterns

### Back Button
```tsx
<TouchableOpacity
  style={styles.backButton}
  onPress={() => navigation.goBack()}
  activeOpacity={0.7}
>
  <Icon name="chevron-back" size={28} color="#FFF" />
</TouchableOpacity>

// Style
backButton: {
  width: 48,
  height: 48,
  borderRadius: 24,
  backgroundColor: THEME.secondary,
  alignItems: 'center',
  justifyContent: 'center',
  ...THEME.shadows.colored(THEME.secondary),
  borderWidth: 2,
  borderColor: '#FFF',
}
```

### Search Bar (Capsule Style)
```tsx
<View style={styles.searchBar}>
  <Icon name="search" size={24} color={THEME.primary} />
  <TextInput
    style={styles.searchInput}
    placeholder="Find a story..."
    placeholderTextColor="#94A3B8"
  />
</View>

// Style
searchBar: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFFFFF',
  borderRadius: 100, // Fully rounded capsule
  paddingHorizontal: 20,
  paddingVertical: 14,
  ...THEME.shadows.medium,
}
```

### Card with Gradient
```tsx
<TouchableOpacity style={[styles.card, { width: cardWidth }]}>
  <LinearGradient
    colors={colors}
    style={styles.cardGradient}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    {/* Bubble decoration */}
    <View style={styles.bubbleDecoration} />
    {/* Content */}
  </LinearGradient>
</TouchableOpacity>

// Styles
card: {
  borderRadius: THEME.borderRadius.xxxl,
  overflow: 'hidden',
  ...THEME.shadows.large,
},
bubbleDecoration: {
  position: 'absolute',
  top: -20,
  right: -20,
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: 'rgba(255,255,255,0.1)',
}
```

### Badge (Popular/New/Hot)
```tsx
<View style={styles.badge}>
  <Icon name="star" size={12} color="#FFF" />
  <Text style={styles.badgeText}>HOT</Text>
</View>

// Style
badge: {
  position: 'absolute',
  top: 12,
  left: 12,
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: THEME.accent,
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: THEME.borderRadius.full,
  borderWidth: 1.5,
  borderColor: 'rgba(255,255,255,0.4)',
  gap: 4,
}
```

## Screens Updated

### ✅ CategoriesListScreen
- Fully responsive grid
- Capsule search bar
- Chunky back button
- Themed colors

### ✅ CategoryStoriesListScreen
- Responsive story grid
- Sort chips with active states
- Empty state with illustration
- Themed colors

### 🔄 Screens To Update

#### HomeScreen
- Update header with chunky buttons
- Make category grid responsive
- Update featured stories section
- Apply theme colors

#### SearchScreen
- Capsule search bar
- Responsive results grid
- Filter chips
- Theme colors

#### ProfileScreen
- Themed buttons
- Consistent spacing
- Profile card styling

#### FavoritesScreen
- Responsive grid
- Empty state
- Theme colors

#### SettingsScreen
- Themed switches/toggles
- Consistent list items
- Theme colors

#### StoryDetailScreen
- Themed play button
- Consistent spacing
- Theme colors

#### BlogScreen & BlogDetailScreen
- Responsive cards
- Theme colors
- Consistent typography

## Implementation Checklist

For each screen:
1. [ ] Import `THEME`, `getNumColumns`, `getCardWidth` from `../theme/appTheme`
2. [ ] Add `useWindowDimensions` hook
3. [ ] Calculate responsive grid values
4. [ ] Replace hardcoded colors with THEME constants
5. [ ] Update button styles to chunky design
6. [ ] Add bubble decorations to cards
7. [ ] Update shadows using THEME.shadows
8. [ ] Test on multiple screen sizes
9. [ ] Ensure touch targets are at least 44x44

## Testing
- Test on iPhone SE (small screen)
- Test on iPhone 14 Pro (medium screen)
- Test on iPad (tablet)
- Test landscape orientation
- Verify all touch targets are accessible
- Check color contrast for accessibility
