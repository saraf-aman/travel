# Travel Website - Complete Project Reference

## Repository Information
- **Owner:** saraf-aman
- **Repo:** travel
- **Branch:** main
- **Hosting:** GitHub Pages
- **URL:** https://saraf-aman.github.io/travel/
- **Tech Stack:** Vanilla HTML/CSS/JavaScript (no frameworks)

---

## Current File Structure

```
travel/
├── index.html                          # Homepage with trip cards
│
├── css/
│   ├── base.css                        # Shared foundation (fonts, animations, CSS vars)
│   ├── homepage.css                    # Homepage-specific styles
│   ├── components.css                  # Reusable UI components
│   ├── layout.css                      # Grid & page structure
│   ├── theme.css                       # Design tokens (colors, spacing)
│   ├── utilities.css                   # Helper classes
│   └── trips/
│       └── banff-jasper-2026.css      # Trip-specific CSS (13KB)
│
├── trips/
│   └── banff-jasper-2026/
│       └── banff-jasper-2026.html     # Complete trip page (76KB)
│
└── planning/                           # Draft trip plans (markdown)
    └── [future trip drafts]
```

---

## Architecture Philosophy

### Current Approach: Embedded HTML
- **All trip data lives in HTML files** (not JSON)
- **CSS is external and cached** (shared across site)
- **JavaScript is inline in HTML** (minimal, just tab switching)
- **Each trip = 1 HTML file + 1 CSS file**

### Why This Structure?
✅ **Fast page loads** - No JavaScript fetch delay
✅ **SEO friendly** - All content visible to crawlers
✅ **Simple deployment** - Just HTML files
✅ **Works without JS** - Degrades gracefully

### Token Optimization
- CSS files are **DOCUMENTED** (never fetch)
- Trip HTML is **IN PROJECT KNOWLEDGE** via GitHub connector (0 tokens)
- Homepage is small (~7KB) - cheap to fetch when needed

---

## Design System (NEVER FETCH CSS FILES)

### Color Palette
```css
--sky: #daeaf5          /* Light blue backgrounds */
--sky-mid: #b8d6ed      /* Borders, accents */
--sky-deep: #7fb3d3     /* Hover states */
--glacier: #4a90b8      /* Primary blue */
--glacier-dark: #2c6a90 /* Dark blue text/links */

--snow: #ffffff         /* White backgrounds */
--mist: #f4f8fc        /* Off-white backgrounds */
--stone: #8fa3b1       /* Secondary text */
--ink: #1e3040         /* Primary text */

--amber: #d4872a       /* Warning/special accents */
--amber-pale: #fdf3e3  /* Amber backgrounds */
```

### Typography
- **Headings:** 'Playfair Display', serif (elegant, classic)
- **Body:** 'DM Sans', sans-serif (clean, readable)
- **Code/Times:** 'DM Mono', monospace

### Component Classes
- `.card` - Activity cards with collapsible content
- `.day-overview` - Horizontal scrollable timeline
- `.tag` - Pills for tips, warnings, notes
- `.booking-box` - Pre-trip reminders section
- `.hero` - Trip page header with mountain SVG

### Layout Rules
- **Max width:** 960px (centered)
- **Mobile breakpoint:** 600px
- **Padding:** Desktop 20px, Mobile 16px

---

## File Modification Rules

### ✅ FETCH ONLY WHEN NEEDED

| User Request | Fetch This | Never Fetch |
|--------------|-----------|-------------|
| "Add Day 8 to Banff" | NOTHING (use GitHub connector) | CSS files, other trips |
| "Update homepage trip card" | `index.html` | CSS, trip files |
| "Fix mobile scrolling" | NOTHING (CSS is documented) | Everything |
| "Create Barcelona trip" | NOTHING (create new file) | Existing files |

### ❌ NEVER FETCH THESE (Info in Docs)
- **Any CSS file** - Design system is documented above
- **Trip HTML if in Project Knowledge** - Use GitHub connector (0 tokens)
- **Multiple files "to check structure"** - Architecture is documented

### ✅ ONLY FETCH WHEN
- Homepage needs editing: `index.html` (7KB)
- Creating new trip: Nothing (just create new HTML)

---

## Common Workflows

### Add Content to Existing Trip
**OLD WAY (wasteful):**
1. Fetch `trips/banff-jasper-2026/banff-jasper-2026.html` (76K tokens)
2. Edit
3. Push

**NEW WAY (optimized):**
1. Read from Project Knowledge via GitHub connector (0 tokens)
2. Generate updated HTML
3. User pushes manually or Claude pushes

### Create New Trip
1. User provides trip details
2. Claude creates new HTML file (based on Banff template structure)
3. Claude creates new CSS file (using design tokens above)
4. User pushes to `trips/{trip-name}/` folder

### Update Homepage
1. Fetch `index.html` (7KB - small, acceptable)
2. Update trip card
3. Push

### Fix CSS/Styling
1. **NO FETCH** - Use design system documented above
2. Generate CSS changes
3. User updates appropriate CSS file

---

## Trip HTML Structure Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>[Trip Name] 2026 — Aman's Travel</title>
  <link rel="stylesheet" href="/travel/css/base.css">
  <link rel="stylesheet" href="/travel/css/trips/[trip-slug].css">
</head>
<body>

<!-- Top navigation -->
<div class="top-nav">
  <a href="../../index.html">← All Trips</a>
  <div class="top-nav-title">[Trip Name]</div>
</div>

<!-- Hero section with gradient background -->
<div class="hero">
  <h1>[Trip Name] &amp; <em>[Highlight]</em></h1>
  <p class="hero-sub">[Route description]</p>
  <div class="hero-pills">
    <!-- Pills: dates, travelers, type, etc -->
  </div>
</div>

<!-- Tabs: Day 1, Day 2, ..., Info -->
<div class="tab-nav-wrap">
  <div class="tab-nav">
    <!-- Day tabs -->
  </div>
</div>

<div class="main">
  <!-- Day panels with timelines -->
</div>

<footer>
  <em>[Trip Name] · Family Trip · [Dates]</em>
</footer>

<script>
  // Tab switching and card toggle functions
</script>

</body>
</html>
```

---

## Critical Reminders

### Token Efficiency Rules
1. **CSS files:** NEVER fetch (use design system docs)
2. **Trip HTML:** Use GitHub connector (0 tokens)
3. **Homepage:** Only fetch when editing homepage itself
4. **Creating new trips:** No fetches needed (template + data)

### File Naming Conventions
- **Trip folders:** `trips/{destination-slug}-{year}/`
- **Trip HTML:** `trips/{destination-slug}-{year}/{destination-slug}-{year}.html`
- **Trip CSS:** `css/trips/{destination-slug}-{year}.css`
- **Examples:** 
  - `trips/banff-jasper-2026/banff-jasper-2026.html`
  - `css/trips/banff-jasper-2026.css`

### Homepage Trip Card Template
```html
<a href="trips/[trip-slug]/[trip-slug].html" class="trip-card">
  <img class="card-img" src="[unsplash-image]" alt="[location]">
  <div class="card-body">
    <div class="card-location">[Country] · [Region]</div>
    <div class="card-title">[Name] &amp; <em>[Highlight]</em></div>
    <p class="card-desc">[Description]</p>
    <div class="card-tags">
      <span class="card-tag">📅 [Dates]</span>
      <span class="card-tag">👨‍👩‍👦‍👦 [Group]</span>
    </div>
  </div>
</a>
```

---

## Future Enhancements (No Migration Needed)

The current HTML structure supports adding:
- ✅ **Weather APIs** - Inject widgets into existing HTML
- ✅ **Interactive maps** - Add as new sections
- ✅ **Live pricing** - Overlay on current content
- ✅ **Photo galleries** - Append to day sections

**No JSON migration needed!** Just add JavaScript features as you need them.

---

## Project Knowledge Setup

### What Should Be in Project Knowledge (via GitHub Connector):
1. ✅ `trips/banff-jasper-2026/banff-jasper-2026.html` - Full trip page
2. ✅ This master reference document
3. ❌ NOT CSS files (documented above, never fetch)
4. ❌ NOT homepage (small enough to fetch when needed)

### How to Use:
- **Editing trips:** Read from GitHub connector (0 tokens)
- **Reference design system:** Use this document (0 tokens)
- **Creating new trips:** Use template above (0 tokens)

---

## Success Metrics

**Before optimization:** ~130K tokens per trip edit
**After optimization:** ~0-7K tokens per edit (95%+ reduction)

- Trip edits: 0 tokens (GitHub connector)
- Homepage edits: 7K tokens (acceptable, rare)
- CSS edits: 0 tokens (documented)
- New trips: 0 tokens (template-based)

🎯 **Mission accomplished!**
