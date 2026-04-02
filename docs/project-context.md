# Travel Website Project Context

## GitHub Repository
- **Owner:** saraf-aman
- **Repo:** travel
- **Branch:** main
- **Hosting:** GitHub Pages
- **URL:** https://saraf-aman.github.io/travel/

## Tech Stack
- **Frontend:** Vanilla HTML/CSS/JavaScript (ES6+)
- **Styling:** Modular CSS (no framework)
- **Architecture:** Static site with trip-specific themes
- **Build:** None required (pure static files)
- **Future:** Will integrate external APIs (weather, maps, etc.)

## Current State
- **Homepage:** ✅ Working perfectly with warm cream/brown theme
- **Banff Trip:** ⏳ In progress - extracting CSS to external file
- **Structure:** Modular CSS architecture implemented
- **Status:** Optimized for minimal token consumption

## CSS Architecture

### Shared Foundation
- `css/base.css` (~2KB)
  - CSS reset, fonts, animations
  - CSS variables for colors
  - Shared across all pages

### Homepage
- `css/homepage.css` (~10KB)
  - Warm cream background (#faf8f5)
  - Brown/orange accents (#c17f4a)
  - Homepage components: nav, hero, cards, about, footer

### Trip Pages
- Each trip has its own CSS file in `css/trips/`
- **Banff (2026):** `css/trips/banff-2026.css` - Blue mountain theme
- **Barcelona (2025):** `css/trips/barcelona-2025.css` - Terracotta theme (planned)
- Each trip can have unique colors matching the destination

## Existing Trips

### 1. Banff & Jasper National Parks (June 2026)
- **File:** `trips/banff-jasper-2025/index.html`
- **Theme:** Blue mountain (sky, glacial lakes)
- **Status:** Content complete, CSS extraction in progress
- **Days:** 7 days, family road trip
- **Special:** Mom's birthday, accessibility-focused

### 2. Barcelona & Catalonia (August 2025)
- **File:** `trips/barcelona-2025/index.html` (not created yet)
- **Theme:** Terracotta Mediterranean
- **Status:** Planning phase
- **Planned:** Gaudí, Costa Brava, Montserrat

## Project Goals

### Token Efficiency (PRIMARY GOAL)
- **Before:** 65KB trip files = 130K tokens per edit
- **After:** 5KB trip files = 10K tokens per edit
- **Savings:** 92% token reduction
- **Method:** External CSS + documentation

### Design Goals
- Homepage: Professional directory feel
- Trip pages: Immersive, destination-specific themes
- Each trip: Unique color scheme matching location
- Maintain beautiful UI structure and components

### Architecture Goals
- Modular CSS (separate files per page type)
- Lightweight HTML files
- No CSS conflicts between pages
- Easy to add new trips
- Scalable for infinite destinations

## Development Workflow

### Planning Trips
1. User describes trip → Claude responds with markdown itinerary
2. User approves → Claude creates trip files
3. Create `trips/{trip-name}/index.html` (lightweight HTML)
4. Create `css/trips/{trip-name}.css` (unique theme)
5. Add trip card to homepage

### Editing Trips
1. User requests change → Claude fetches ONLY the trip HTML (~5KB)
2. Claude edits content, pushes back
3. **CSS is never fetched** (documented in ui-design-system.md)
4. Changes appear live on GitHub Pages

### CSS Management
1. All CSS is documented in `ui-design-system.md`
2. Claude never fetches CSS files
3. CSS changes are rare (design is stable)
4. When CSS needs updating, it's documented immediately

## Key Files

### Production Files (Deployed)
- `index.html` - Homepage
- `css/base.css` - Shared foundation
- `css/homepage.css` - Homepage styling
- `css/trips/*.css` - Trip-specific styling
- `trips/*/index.html` - Individual trip pages

### Documentation Files (Local Only)
- `docs/project-context.md` - This file
- `docs/repo-structure.md` - File organization
- `docs/workflow-state.md` - Current progress
- `docs/ui-design-system.md` - CSS documentation
- `docs/file-modification-rules.md` - Task → File mapping

### Planning Files (Not Deployed)
- `planning/barcelona-planning.md` - Draft content

## Token Optimization Strategy

### What Claude Fetches
✅ **Only trip HTML when editing:** `trips/{trip-name}/index.html` (~5KB)

### What Claude NEVER Fetches
❌ CSS files (documented in ui-design-system.md)
❌ Other trip pages
❌ Images
❌ Homepage (unless editing homepage)

### Information Sources (0 Token Cost)
- Color palettes → `ui-design-system.md`
- Component styles → `ui-design-system.md`
- Architecture → `repo-structure.md`
- Current state → `workflow-state.md`
- Task mapping → `file-modification-rules.md`

## Design Philosophy

### Homepage = Travel Directory
- Warm, professional, inviting
- Like a coffee table book or travel agency
- Showcases all trips at a glance

### Trip Pages = Immersive Experience
- Cool mountain blues for Banff (sky, glacial lakes)
- Warm terracotta for Barcelona (Mediterranean)
- Each trip tells its own visual story
- User feels "in the destination"

### Why Different Themes?
- Homepage is the portfolio/index
- Trip pages are the adventures
- Each destination deserves its own personality
- More memorable and engaging than uniform design