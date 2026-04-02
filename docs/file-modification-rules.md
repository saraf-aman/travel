# File Modification Rules for Claude

## Golden Rule
> **ONLY fetch files that need to change for the current task.**

## Current Architecture Understanding

**Homepage:**
- `index.html` loads `base.css` + `homepage.css`
- Warm cream/brown theme

**Trip Pages:**
- Each trip has its own folder: `trips/{trip-name}/index.html`
- Each trip loads `base.css` + `css/trips/{trip-name}.css`
- Unique color scheme per trip (Banff = blue, Barcelona = terracotta)

**CSS Files:**
- `css/base.css` - Shared foundation (documented, never fetch)
- `css/homepage.css` - Homepage styling (documented, never fetch)
- `css/trips/*.css` - Trip-specific styling (documented, never fetch)

## Common Tasks → Files to Fetch

### Trip Content Edits

| User Request | Fetch This | Ignore Everything Else |
|--------------|------------|------------------------|
| "Add Day 8 to Banff trip" | `trips/banff-jasper-2025/index.html` | All CSS, images, other trips |
| "Update Banff itinerary" | `trips/banff-jasper-2025/index.html` | All CSS, images, other trips |
| "Fix typo in Banff trip" | `trips/banff-jasper-2025/index.html` | Everything else |

**Token Cost:** ~5KB per trip HTML (down from 65KB!)

### Creating New Trips

| User Request | Fetch This | Create These Files |
|--------------|------------|--------------------|
| "Create Barcelona trip" | NOTHING | `trips/barcelona-2025/index.html` + `css/trips/barcelona-2025.css` |

**Token Cost:** ~0KB fetch, just create new files

### Homepage Updates

| User Request | Fetch This | Ignore Everything Else |
|--------------|------------|------------------------|
| "Add new trip card to homepage" | `index.html` | All CSS, trip pages |
| "Update homepage copy" | `index.html` | All CSS, trip pages |

**Token Cost:** ~5KB

### NEVER Fetch (Info in Docs)

- `css/base.css` → Documented in `ui-design-system.md`
- `css/homepage.css` → Documented in `ui-design-system.md`
- `css/trips/*.css` → Documented in `ui-design-system.md`
- Any trip HTML not being edited
- Image files

## CSS Information Source

**All CSS is documented in `ui-design-system.md`:**
- Color palettes for homepage and each trip
- Typography rules
- Component styles
- Layout patterns

**Never fetch CSS files!** Use the documentation instead.

## Multi-File Updates

When updating multiple trips, use `push_files`:

```javascript
github:push_files({
  files: [
    { path: "trips/banff-jasper-2025/index.html", content: "..." },
    { path: "trips/barcelona-2025/index.html", content: "..." }
  ],
  message: "Update Banff and Barcelona itineraries"
})
```

## Red Flags (Ask User First)

- Task requires fetching 3+ files → Something's wrong
- Unsure which file handles the feature → Ask user
- Change might affect multiple components → Confirm scope

## Workflow: Trip Planning

1. **User:** "Plan 5 days in Barcelona"
2. **Claude:** Respond with markdown itinerary (NO repo fetch)
3. **User:** Approves plan
4. **Claude:** Create new files:
   - `trips/barcelona-2025/index.html` (trip content)
   - `css/trips/barcelona-2025.css` (terracotta theme)
5. **Token Cost:** ~0KB (no fetching, just creation)

## Workflow: Trip Update

1. **User:** "Add Day 8 to Banff trip"
2. **Claude:** Fetch `trips/banff-jasper-2025/index.html` ONLY (~5KB)
3. **Claude:** Add Day 8 content, push
4. **Token Cost:** ~10KB total

## Workflow: CSS Questions

1. **User:** "What colors are used in Banff trip?"
2. **Claude:** Check `ui-design-system.md` (0 tokens)
3. **Claude:** Answer from documentation
4. **Token Cost:** ~0KB (no repo access needed)