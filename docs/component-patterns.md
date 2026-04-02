# Component Patterns & JavaScript APIs

> **How the website actually works**
> Reference this doc to understand data flow and component behavior.

## Architecture Overview

### Data Flow
```
data/trips/*.json → tripLoader.js → tripRenderer.js → DOM
```

1. **Trip JSONs** live in `data/trips/{trip-id}.json`
2. **tripLoader.js** fetches them via fetch API
3. **tripRenderer.js** creates HTML strings
4. **app.js** orchestrates everything

---

## File Responsibilities

### `js/app.js` (Orchestrator)
**Purpose:** Detects page type and initializes appropriate rendering

```javascript
// Homepage: Load all trips
loadAllTrips().then(trips => {
  renderTripCards(trips);
  updateStats(trips);
});

// Trip detail page: Load specific trip
loadTripById(tripId).then(trip => {
  renderTripDetail(trip);
});
```

**What it does:**
- Checks if we're on homepage or trip detail page
- Calls appropriate loader functions
- Handles errors gracefully

---

### `js/tripLoader.js` (Data Layer)
**Purpose:** Fetch trip data from JSON files

#### Functions:

**`loadAllTrips()`**
```javascript
// Returns: Promise<Array<Trip>>
// Fetches all trip JSONs and returns array
// Filters out failed loads (null)
```

**`loadTripById(id)`**
```javascript
// Returns: Promise<Trip>
// Fetches single trip JSON by ID
// Throws error if not found
```

**`getTripUrl(tripId)`**
```javascript
// Returns: string
// Generates URL for trip detail page
// Example: "/travel/trip.html?id=banff-jasper-2026"
```

**Path Resolution:**
```javascript
const BASE_PATH = window.location.hostname === 'saraf-aman.github.io' 
  ? '/travel'  // GitHub Pages
  : '';        // Local development
```

---

### `js/tripRenderer.js` (Presentation Layer)
**Purpose:** Convert trip data into HTML strings

#### Functions:

**`renderTripCards(trips)`**
```javascript
// Input: Array<Trip>
// Output: void (modifies DOM)
// Updates #trip-grid with trip cards
```

**`renderTripDetail(trip)`**
```javascript
// Input: Trip object
// Output: void (modifies DOM)
// Renders full trip detail page
```

**`updateStats(trips)`**
```javascript
// Input: Array<Trip>
// Output: void (modifies DOM)
// Calculates and updates hero stats
```

**Internal Helpers:**
- `createTripCard(trip)` - Returns HTML string for single card

---

### `js/utils.js` (Helpers)
**Purpose:** Shared utility functions

```javascript
formatDate(dateString)        // "2026-06-16" → "Jun 16, 2026"
formatDateRange(start, end)   // Smart range formatting
daysBetween(start, end)       // Calculate trip duration
```

---

## HTML Structure

### Homepage (`index.html`)

**Key elements:**
```html
<div id="trip-grid"></div>      <!-- Trip cards render here -->
<div id="hero-stats"></div>     <!-- Stats update here -->
```

**Data flow:**
1. Page loads
2. `app.js` calls `loadAllTrips()`
3. Trip JSONs fetched
4. `renderTripCards()` populates grid
5. `updateStats()` updates hero numbers

---

### Trip Detail (`trip.html`)

**Key elements:**
```html
<div id="trip-root"></div>      <!-- Full trip detail renders here -->
```

**Data flow:**
1. Page loads with `?id=banff-jasper-2026`
2. `app.js` extracts trip ID from URL
3. `loadTripById()` fetches specific JSON
4. `renderTripDetail()` populates root element
5. Page title updated dynamically

---

## Trip Card Anatomy

```html
<a href="trip.html?id={id}" class="trip-card">
  <img class="card-img" src="{coverImage}">
  <div class="card-body">
    <div class="card-location">{destination}</div>
    <div class="card-title">{title}</div>
    <p class="card-desc">{summary}</p>
    <div class="card-tags">
      <span class="card-tag">{dates.display}</span>
      <!-- More tags... -->
    </div>
    <ul class="card-highlights">
      <li>{highlight}</li>
      <!-- Up to 5 highlights -->
    </ul>
    <span class="card-cta">View full itinerary →</span>
  </div>
</a>
```

**Coming Soon State:**
```html
<div class="trip-card coming-soon">
  <!-- Same structure, but not clickable -->
  <span class="coming-badge">Planning · {dates}</span>
</div>
```

---

## Adding a New Trip

### Step 1: Create JSON
```bash
data/trips/new-trip-2026.json
```

### Step 2: Add to trip list
```javascript
// In tripLoader.js
const tripIds = [
  'banff-jasper-2026',
  'new-trip-2026'  // Add here
];
```

### Step 3: Push to GitHub
```bash
git add data/trips/new-trip-2026.json
git commit -m "Add new trip"
git push
```

That's it! Website auto-updates.

---

## Modifying Components

### Changing Trip Card Design
**File to edit:** `css/components.css`
**Class:** `.trip-card`

### Changing Card Rendering Logic
**File to edit:** `js/tripRenderer.js`
**Function:** `createTripCard(trip)`

### Adding New Data Fields
1. Update JSON in `data/trips/`
2. Update `createTripCard()` or `renderTripDetail()` to use new field
3. No CSS changes needed if using existing components

---

## Error Handling

**Failed trip load:**
```javascript
// tripLoader.js handles this
loadTripById(id).catch(err => {
  console.warn(`Failed to load trip ${id}:`, err);
  return null; // Filters out in loadAllTrips()
});
```

**No trips found:**
```javascript
// tripRenderer.js shows fallback
if (!trips || trips.length === 0) {
  grid.innerHTML = '<p class="loading-text">No trips yet!</p>';
}
```

**Invalid trip ID:**
```javascript
// app.js shows error page
if (!tripId) {
  root.innerHTML = '<p class="error-text">No trip ID specified.</p>';
}
```

---

## Performance Notes

- **Lazy loading images:** `loading="lazy"` on all card images
- **Minimal DOM manipulation:** Build HTML strings, insert once
- **No framework overhead:** Pure vanilla JS
- **Small JSON files:** 2-5KB per trip
- **Cached CSS/JS:** Browsers cache static assets

---

## Future Enhancements

### Planned Features
1. **Weather API integration** - Live weather data for trip locations
2. **Search/filter** - Filter trips by destination, date, type
3. **Trip index JSON** - Auto-discover trips without hardcoding IDs
4. **Day-by-day itinerary** - Full detailed daily breakdown
5. **Photo galleries** - Image carousels for each trip

### Where they'll go
- Weather: `js/weatherAPI.js` (already stubbed)
- Search: New `js/search.js` module
- Trip index: `data/trips-index.json`
- Itinerary: Enhanced `renderTripDetail()` function
- Photos: New component in `components.css`