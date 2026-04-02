# Repository Structure

## Target Architecture (After Optimization)

```
travel/
├── index.html                      # Homepage (lightweight, loads trip data)
├── trip.html                       # Trip detail page template (loads specific trip)
│
├── css/
│   ├── theme.css                   # Design tokens (colors, fonts, spacing)
│   ├── layout.css                  # Grid, containers, page structure
│   ├── components.css              # Reusable component styles
│   └── utilities.css               # Helper classes
│
├── js/
│   ├── app.js                      # Main app logic
│   ├── tripLoader.js               # Loads trip JSON data
│   ├── tripRenderer.js             # Renders trip cards & details
│   ├── weatherAPI.js               # Future: Weather integration
│   └── utils.js                    # Date formatters, etc.
│
├── data/
│   └── trips/
│       ├── banff-jasper-2024.json  # Banff trip data
│       ├── barcelona-2025.json     # Barcelona trip data (future)
│       └── ...                     # More trips
│
├── images/
│   ├── trips/
│   │   ├── banff/                  # Trip-specific images
│   │   └── barcelona/
│   └── icons/                      # UI icons
│
├── docs/                           # Project knowledge (LOCAL ONLY)
│   ├── project-context.md
│   ├── repo-structure.md
│   ├── trip-data-template.md
│   ├── workflow-state.md
│   ├── ui-design-system.md
│   ├── component-patterns.md
│   └── file-modification-rules.md
│
└── planning/                       # Draft content (not deployed)
    ├── barcelona-planning.md
    └── workflow.md
```

## Current Structure (Before Optimization)
```
travel/
├── index.html                      # Homepage with embedded trip data
└── trip/
    └── index.html                  # Trip detail with embedded data
```

## File Size Guidelines
- Trip JSON: ~2-5KB each
- CSS files: ~2-3KB each
- JS modules: ~1-3KB each
- HTML templates: ~1-2KB each

## Files Claude Should NEVER Fetch
- theme.css (documented in ui-design-system.md)
- layout.css (documented in ui-design-system.md)
- utilities.css (static helper classes)
- Image files
- Any CSS/JS not being actively modified

## Files Claude Fetches Only When Needed
- Specific trip JSON being updated: `data/trips/{trip-id}.json`
- Specific JS module being modified: `js/{module}.js`
- HTML template if structure changes: `index.html` or `trip.html`