# Repository Structure

## Current Architecture (Production)

```
travel/
├── index.html                      # Homepage (lightweight, loads base + homepage CSS)
│
├── css/
│   ├── base.css                    # Shared foundation: reset, fonts, animations, CSS vars (~2KB)
│   ├── homepage.css                # Homepage-specific styles (~10KB)
│   └── trips/
│       ├── banff-2026.css          # Banff trip styles (blue mountain theme) (~10KB)
│       └── barcelona-2025.css      # Future: Barcelona trip styles (terracotta theme)
│
├── trips/
│   ├── banff-jasper-2025/
│   │   └── index.html              # Banff trip page (lightweight ~5KB, loads base + banff CSS)
│   └── barcelona-2025/
│       └── index.html              # Future: Barcelona trip page
│
├── images/
│   ├── trips/
│   │   ├── banff/                  # Trip-specific images
│   │   └── barcelona/
│   └── icons/                      # UI icons
│
├── docs/                           # Project knowledge (LOCAL ONLY, never deployed)
│   ├── project-context.md
│   ├── repo-structure.md           # This file
│   ├── workflow-state.md
│   ├── ui-design-system.md
│   └── file-modification-rules.md
│
└── planning/                       # Draft content (not deployed)
    └── barcelona-planning.md
```

## File Size Guidelines
- `base.css`: ~2KB (rarely changes)
- `homepage.css`: ~10KB (documented in ui-design-system.md)
- Trip CSS (`css/trips/*.css`): ~10KB each (documented in ui-design-system.md)
- Trip HTML: ~5KB each (content only, no embedded CSS)

## CSS Architecture

### Base CSS (Shared)
- CSS reset and box-sizing
- Font family declarations
- CSS variables (colors)
- Animations
- Basic body styles

### Homepage CSS
- Warm cream/brown theme
- Homepage-specific components (nav, hero, trip cards, about section, footer)

### Trip-Specific CSS
- Each trip has its own CSS file in `css/trips/`
- Unique color schemes per destination:
  - **Banff**: Blue mountain theme (sky, glacial lakes)
  - **Barcelona**: Terracotta Mediterranean theme (planned)
  - **Future trips**: Custom themes matching destinations
- Trip page components (tabs, timeline, collapsible blocks, day navigation)

## Files Claude Should NEVER Fetch
- `css/base.css` (documented in ui-design-system.md)
- `css/homepage.css` (documented in ui-design-system.md)
- `css/trips/*.css` (documented in ui-design-system.md)
- Image files

## Files Claude Fetches Only When Needed
- Specific trip HTML being updated: `trips/{trip-name}/index.html` (~5KB)
- **NEVER fetch CSS files** - they're documented in ui-design-system.md

## Trip Page Structure

Each trip follows this pattern:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/travel/css/base.css">
  <link rel="stylesheet" href="/travel/css/trips/banff-2026.css">
</head>
<body>
  <!-- All trip content here (HTML only, no embedded CSS) -->
</body>
</html>
```

## Token Efficiency

**Before optimization:**
- Trip page: 65KB (HTML + embedded CSS)
- Edit one day: 65KB fetch + 65KB write = 130K tokens

**After optimization:**
- Trip page: 5KB (HTML only)
- Trip CSS: 10KB (documented, never fetched)
- Edit one day: 5KB fetch + 5KB write = 10K tokens
- **92% token reduction!**

## Why This Architecture

1. **Token Efficiency**: Only fetch the small HTML file when editing trip content
2. **Unique Designs**: Each trip can have its own color scheme and theme
3. **No CSS Conflicts**: Homepage and trips use separate CSS files
4. **Scalable**: Easy to add new trips with custom themes
5. **Maintainable**: CSS changes don't affect HTML, and vice versa