# DreamTales AI â€“ Vector Asset Pack

This markdown file contains clean, editable SVG code for all core UI assets used in the **DreamTales AI** prototype. Copy each code block into a separate â€œ.svgâ€ file (named as indicated) and import them into Figma, Sketch, Illustrator, or your preferred tool. All shapes are pure vectors; change the `fill` hex value to adapt the palette to your theme.

---

## 1. Brand & Navigation Icons

### 1.1 App Logo (dreamtales-logo.svg)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="60" viewBox="0 0 200 60" fill="none">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="200" y2="60" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#6B46C1"/>
      <stop offset="100%" stop-color="#8B5CF6"/>
    </linearGradient>
  </defs>
  <rect x="0" y="0" width="200" height="60" rx="12" fill="url(#g)"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="'Fredoka One', sans-serif" font-size="28" fill="#FFFFFF">DreamTales</text>
</svg>
```

### 1.2 Home (icon-home.svg)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B46C1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 9L12 3l9 6v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-5H9v5a2 2 0 0 1-2 2H3z"/>
</svg>
```

### 1.3 Create / Plus (icon-create.svg)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B46C1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <line x1="12" y1="8" x2="12" y2="16"/>
  <line x1="8" y1="12" x2="16" y2="12"/>
</svg>
```

### 1.4 Library / Books (icon-library.svg)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B46C1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="2" y="3" width="6" height="18" rx="1"/>
  <rect x="10" y="3" width="6" height="18" rx="1"/>
  <rect x="18" y="3" width="4" height="18" rx="1"/>
</svg>
```

### 1.5 Profile (icon-profile.svg)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6B46C1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="8" r="4"/>
  <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
</svg>
```

---

## 2. Story Category Icons
Each icon uses its dedicated category hue. Replace the provided `stroke` color to match your own palette or apply `currentColor` for flexible theming.

### 2.1 Fantasy â€“ Wizard Hat (icon-fantasy.svg)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EC4899" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 20h16l-5-13-3 4-3-4z"/>
  <circle cx="12" cy="11" r="1"/>
  <circle cx="9" cy="14" r="1"/>
  <circle cx="15" cy="14" r="1"/>
</svg>
```

### 2.2 Adventure â€“ Compass (icon-adventure.svg)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="10"/>
  <polygon points="12 8 16 12 12 16 8 12 12 8"/>
</svg>
```

### 2.3 Horror â€“ Ghost (icon-horror.svg)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 3c-3.866 0-7 3.134-7 7v11l3-2 4 3 4-3 3 2V10c0-3.866-3.134-7-7-7z"/>
  <circle cx="10" cy="11" r="1"/>
  <circle cx="14" cy="11" r="1"/>
</svg>
```

### 2.4 Comedy â€“ Smiling Star (icon-comedy.svg)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polygon points="12 2 15 9 22 9 16.5 14 18 22 12 18 6 22 7.5 14 2 9 9 9 12 2"/>
  <path d="M9 14s1 2 3 2 3-2 3-2"/>
</svg>
```

### 2.5 Educational â€“ Lightbulb (icon-educational.svg)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M9 18h6"/>
  <path d="M10 22h4"/>
  <path d="M12 2a6 6 0 0 0-4 10 5 5 0 0 1 2 4v2h4v-2a5 5 0 0 1 2-4 6 6 0 0 0-4-10z"/>
</svg>
```

### 2.6 Classic â€“ Open Book (icon-classic.svg)
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M2 4h9a4 4 0 0 1 4 4v12H6a4 4 0 0 1-4-4V4z"/>
  <path d="M22 4h-9a4 4 0 0 0-4 4v12h9a4 4 0 0 0 4-4V4z"/>
</svg>
```

---

## 3. Usage Tips
1. **Color Themability**: Swap the `stroke` (for line icons) or `fill` (for solid shapes) with CSS `currentColor` or your brand hue.
2. **Line Weight**: Adjust `stroke-width` uniformly to scale visual weight.
3. **Size Scaling**: Vector shapes remain crisp at any resolutionâ€”simply adjust the `width`/`height` attributes or scale inside your design tool.
4. **Animation Ready**: These simple path-based vectors are ideal for lightweight Lottie or CSS animations.

Enjoy customizing DreamTales AI to perfectly fit your brand!