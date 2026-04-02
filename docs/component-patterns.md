# Component Patterns & JavaScript APIs

> **Status:** ✅ Fully documented — Claude NEVER needs to fetch JS or HTML files to understand structure.

---

## Current Architecture

Both pages are **self-contained monoliths** with inline CSS + JS. The target architecture moves to shared CSS files and a JSON data loader — but the HTML structure and JS API documented here remain stable.

---

## JavaScript Functions (trip pages)

### `switchTab(id, btn)`
Switches the visible day panel.
```javascript
function switchTab(id, btn) {
  // Hides all .tab-panel, removes .active from all .tab-btn
  // Shows panel with matching id, marks btn active
  // Scrolls to top
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
```
**Called by:** `onclick="switchTab('d1', this)"` on each `.tab-btn`
**Tab IDs:** `d1`, `d2`, `d3`, `d4`, `d5`, `d6`, `d7`, `info`

### `toggleCard(card)`
Expands/collapses a timeline card.
```javascript
function toggleCard(card) {
  card.classList.toggle('open');
}
```
**Called by:** `onclick="toggleCard(this)"` on each `.card`
**Effect:** `.open` class → shows `.card-body`, rotates `.card-chevron` 180°

### Auto-open first card (init)
```javascript
document.querySelectorAll('.tab-panel').forEach(panel => {
  const first = panel.querySelector('.card');
  if (first) first.classList.add('open');
});
```
Runs on DOMContentLoaded. First card in every day panel starts open.

---

## HTML Structure — Trip Page

```
body
├── .top-nav
│   ├── a.back-btn  (← All Trips → ../../index.html)
│   └── .top-nav-title  (trip name, em = italic accent)
├── .hero
│   ├── svg.hero-mountains  (decorative mountain silhouette)
│   ├── .hero-eyebrow  ("Family Trip · June 2025")
│   ├── h1  ("Banff & Jasper")
│   ├── p.hero-sub  (route summary)
│   └── .hero-pills  (metadata chips: travellers, dates, drive type, accessibility, birthday)
├── .notice-bar  ("Book before you go: ..." — red-alert items)
├── .tab-nav-wrap  (sticky below top-nav)
│   └── .tab-nav
│       └── button.tab-btn × 8  (Day 1–7 + Info)
│           ├── span.day-num  ("Day 1" — Playfair 18px)
│           └── span.day-date  ("Jun 16 🎂" — DM Sans 10px)
└── .main
    ├── #d1.tab-panel.active  (Day 1)
    ├── #d2.tab-panel         (Day 2)
    │   ... (d3–d7 same structure)
    └── #info.tab-panel       (Essentials / Info)
```

### Day Panel Internal Structure
```
#dN.tab-panel
├── .day-header
│   ├── .day-header-left
│   │   ├── h2  ("Calgary → Kootenay → Banff")
│   │   └── p   (date · notes · depart time)
│   └── .day-stats
│       └── .day-stat × N  (val + label)
├── .day-overview  (horizontal scroll strip)
│   └── .overview-stop × N  (time + icon + name)
├── [optional] .birthday-banner
├── .timeline
│   └── .tblock × N
│       ├── .tblock-dot[.drive|.food|.sleep|.special]
│       └── .card[.drive-card|.food-card|.special-card]
│           ├── .card-head  (onclick=toggleCard)
│           │   ├── .card-icon
│           │   ├── .card-head-info
│           │   │   ├── .card-time
│           │   │   └── .card-title  [+ .badge]
│           │   ├── .card-dur
│           │   └── .card-chevron
│           └── .card-body
│               └── .card-body-inner
│                   ├── [.place-spotlight]  h4 + p
│                   ├── [.restaurant-highlight]  h4 + .rest-meta + p + .rest-dishes
│                   ├── [.info-grid]  .info-box × N  (label + val)
│                   ├── [p.card-desc]
│                   └── .tags  .tag[.tag-knee|.tag-tip|.tag-book|.tag-bday|.tag-note] × N
├── [optional] .section-label  (Plan B / alternate route)
└── .booking-box  (day reminders)
    └── .booking-item × N  (icon + strong title + body text)
```

---

## HTML Structure — Homepage (`index.html`)

```
body
├── nav
│   ├── a.nav-brand  ("Travels with Aman")
│   └── .nav-links
│       └── a.nav-link × 3  (Trips, About, GitHub)
├── .hero
│   ├── .hero-eyebrow
│   ├── h1
│   ├── p.hero-desc
│   └── .hero-stats
│       └── div × 3  (.stat-val + .stat-label)
└── .section
    ├── #trips
    │   ├── .section-header  (.section-title + .section-line)
    │   └── .trip-grid
    │       └── a.trip-card × N  (or div.trip-card.coming-soon)
    │           ├── img.card-img  (200px, object-fit cover)
    │           └── .card-body
    │               ├── .card-location  (DM Mono uppercase)
    │               ├── .card-title  (Playfair)
    │               ├── p.card-desc
    │               ├── .card-tags  (emoji + text chips)
    │               ├── ul.card-highlights  (li × N)
    │               └── span.card-cta  OR span.coming-badge
    ├── #about
    │   ├── .section-header
    │   └── .about-grid  (2-col: narrative + .principles)
    │       └── .principle × 4  (.principle-title + .principle-desc)
    ├── .github-bar  (dark bg, white CTA button)
    └── footer
```

---

## Adding a New Trip Card (Homepage)

To add a new trip to `index.html`, copy this template into `.trip-grid`:

```html
<!-- NEW TRIP -->
<a href="trips/{slug}/index.html" class="trip-card">
  <img class="card-img" src="https://images.unsplash.com/..." alt="{description}" loading="lazy">
  <div class="card-body">
    <div class="card-location">{Country} &middot; {Region}</div>
    <div class="card-title">{City} &amp; <em>{Region}</em></div>
    <p class="card-desc">{2-3 sentence description}</p>
    <div class="card-tags">
      <span class="card-tag">📅 {Month Year}</span>
      <span class="card-tag">{emoji} {attribute}</span>
    </div>
    <ul class="card-highlights">
      <li>{highlight 1}</li>
      <li>{highlight 2}</li>
    </ul>
    <span class="card-cta">View full itinerary →</span>
  </div>
</a>
```

For a **coming soon** card (no link, grayed out):
```html
<div class="trip-card coming-soon">
  <!-- same internals but no <a> wrapper -->
  <!-- omit card-highlights and card-cta -->
  <!-- add: <span class="coming-badge">Planning · {Month Year}</span> -->
</div>
```

---

## Adding a New Day Tab (Trip Page)

1. Add button to `.tab-nav`:
```html
<button class="tab-btn" onclick="switchTab('d8', this)">
  <span class="day-num">Day 8</span>
  <span class="day-date">Jun 23</span>
</button>
```

2. Add panel to `.main`:
```html
<div id="d8" class="tab-panel">
  <div class="day-header">...</div>
  <div class="day-overview">...</div>
  <div class="timeline">
    <!-- .tblock entries -->
  </div>
  <div class="booking-box">...</div>
</div>
```

---

## File Modification Rules Summary

| Change needed | Touch this file |
|---------------|------------------|
| Trip content (activity, time, description) | `data/trips/{id}.json` (future) / current: `trips/{id}/index.html` |
| Trip card on homepage | `index.html` — add to `.trip-grid` |
| Card colors / tag styles | `css/components.css` |
| Color palette / tokens | `css/theme.css` |
| Page layout / grid | `css/layout.css` |
| Tab/card JS behavior | `js/tripRenderer.js` (future) / current: inline `<script>` in trip HTML |

---

## What NEVER Changes (Don't Touch)
- The `switchTab` / `toggleCard` JS API — stable
- The `.tblock` → `.card` → `.card-body` nesting — stable
- Font imports (Google Fonts CDN link) — stable
- The `:root` CSS variable names — stable (changing breaks all inline references)
