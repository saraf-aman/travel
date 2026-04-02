# Current Workflow State

## CRITICAL: Current Repo Status (AS OF 2025-04-02)

### ✅ What's Working
- `data/trips/banff-jasper-2026.json` exists and has proper structure
- CSS files exist (theme.css, layout.css, components.css, utilities.css)
- JS files exist (app.js, tripLoader.js, tripRenderer.js, utils.js, weatherAPI.js)
- `trip.html` template exists but is not yet functional
- `index.html` homepage exists

### ⚠️ What's Incomplete
- **OLD monolithic HTML still exists:** `trips/banff-jasper-2025/index.html` (65KB)
- **JavaScript not connected:** trip.html doesn't load JSON data yet
- **No dynamic rendering:** Site doesn't use data/trips/ JSONs yet
- **Homepage not updated:** Still shows old structure

### 🎯 Next Priority Tasks
1. **DO NOT create new folder structures** - Use existing `data/trips/`
2. **DO NOT break CSS** - Existing CSS files are working
3. **Complete the data-driven migration:**
   - Make tripLoader.js actually load from `data/trips/*.json`
   - Make tripRenderer.js render trip details
   - Update index.html to render trip cards from JSON
   - Connect trip.html to load specific trip via ?id= parameter

## STRICT RULES for Future Claude Instances

### ❌ NEVER DO THIS
- Create new `trips/{name}/` folders with individual index.html files
- Modify CSS files without explicit user request
- Change file paths from what's documented in repo-structure.md
- Create duplicate structures

### ✅ ALWAYS DO THIS
- Put trip data ONLY in `data/trips/{trip-id}.json`
- Follow repo-structure.md exactly
- Keep CSS files unchanged unless user explicitly asks
- Make JavaScript load from `data/trips/` folder
- Ask for clarification if structure seems wrong

## Active Work
- **Current Trip:** Banff & Jasper 2026 (JSON created, needs JS connection)
- **Next Task:** Complete data-driven architecture migration
- **User Status:** Frustrated with other Claude breaking structure

## Recent Changes
- 2025-04-02: Created project documentation files
- 2025-04-02: User reported other Claude broke CSS and ignored structure
- 2025-04-02: Confirmed data/trips/ structure exists and is correct

## Trips Status
1. **Banff & Jasper 2026** - JSON exists in `data/trips/banff-jasper-2026.json`
2. **Old Banff folder** - `trips/banff-jasper-2025/` exists (legacy, should be removed)
3. **Barcelona** - Planning phase only

## User Preferences
- Detailed day-by-day itineraries with timing
- Focus on outdoor activities and local food experiences
- Budget-conscious with occasional splurges
- Prefers morning activities to beat crowds
- Values insider tips and practical logistics
- **VERY frustrated when structure is not followed**

## Future Enhancements
- Weather API integration
- Interactive maps
- Budget calculator
- Photo galleries
- Trip comparison tools