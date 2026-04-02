# File Modification Rules for Claude

## Golden Rule
> **ONLY fetch files that need to change for the current task.**

## Common Tasks → Files to Fetch

### Trip Data Tasks

| User Request | Fetch This | Ignore Everything Else |
|--------------|------------|------------------------|
| "Add Day 5 to Banff trip" | `data/trips/banff-jasper-2024.json` | All CSS, JS, HTML, other trips |
| "Create Barcelona trip plan" | None (create `data/trips/barcelona-2025.json`) | Everything |
| "Update Banff budget" | `data/trips/banff-jasper-2024.json` | All CSS, JS, HTML, other trips |
| "Fix typo in trip description" | `data/trips/{trip-id}.json` | Everything else |

**Token Cost:** ~2-5KB per trip JSON

### UI/Code Tasks

| User Request | Fetch This | Ignore Everything Else |
|--------------|------------|------------------------|
| "Change trip card styling" | `css/components.css` | Data, JS, HTML, other CSS |
| "Update homepage layout" | `index.html`, `css/layout.css` | Data, trip pages, other CSS |
| "Modify trip detail page structure" | `trip.html` | Data, homepage, CSS (unless changing) |
| "Add weather API integration" | `js/weatherAPI.js` (create new) | Everything else |

**Token Cost:** ~1-3KB per file

### NEVER Fetch (Info in Docs)

- `css/theme.css` → See `ui-design-system.md`
- `css/layout.css` → See `ui-design-system.md`  
- `css/utilities.css` → Static helpers, no changes needed
- Any trip JSON not being edited
- Image files

## Multi-File Updates

When updating multiple trips:
```javascript
// Use push_files for atomic commit
github:push_files({
  files: [
    { path: "data/trips/banff-jasper-2024.json", content: "..." },
    { path: "data/trips/barcelona-2025.json", content: "..." }
  ],
  message: "Update Banff and Barcelona itineraries"
})
```

## Red Flags (Ask User First)

- Task requires fetching 5+ files → Something's wrong
- Unsure which file handles the feature → Ask user
- Change might affect multiple components → Confirm scope

## Workflow: Trip Planning

1. **User:** "Plan 5 days in Barcelona"
2. **Claude:** Respond with markdown planning (NO repo fetch)
3. **User:** Approves plan
4. **Claude:** Convert to JSON, create `data/trips/barcelona-2025.json`, push (NO fetch needed)

**Token Cost:** ~5KB total (no fetching, just creation)

## Workflow: Trip Update

1. **User:** "Add Day 6 to Banff trip"
2. **Claude:** Fetch `data/trips/banff-jasper-2024.json` ONLY
3. **Claude:** Update JSON, push
4. **User:** Sees changes live on website

**Token Cost:** ~3KB (one small file fetch)