# UI Design System

> **Status:** ✅ Fully documented — Claude NEVER needs to fetch CSS files.

---

## Two Themes in This Repo

| File | Theme | Palette |
|------|-------|---------|
| `index.html` (homepage) | Warm cream | `--cream`, `--accent` (amber/gold) |
| `trips/*/index.html` (trip pages) | Mountain sky | `--glacier`, `--sky`, `--ink` (blue/slate) |

---

## Homepage Design Tokens (`index.html`)

Declared as `:root` inline in `index.html`.

```css
--cream:    #faf8f5;   /* page background */
--warm:     #f2efe9;   /* card hover, tag background */
--border:   #e4e0d8;   /* all borders */
--stone:    #9a9189;   /* muted text, labels */
--stone-dk: #6b6059;   /* body text, descriptions */
--ink:      #1a1714;   /* headings, strong text */
--ink-mid:  #3d3530;   /* secondary headings */
--accent:   #c17f4a;   /* amber gold — CTAs, italic highlights */
--accent-lt:#e8c9a0;   /* light accent for borders */
--accent-bg:#fdf5eb;   /* accent background tint */
--snow:     #ffffff;   /* nav background, card backgrounds */
```

### Homepage Typography
- **Headings:** `Playfair Display` serif — 400, 600, 700; italic for accent words
- **Body:** `DM Sans` — 300 (light), 400, 500
- **Mono:** `DM Mono` — 400 (eyebrows, labels, stat values)
- **Hero h1:** `clamp(42px, 6vw, 72px)`, weight 700
- **Card title:** `Playfair Display` 22px weight 700
- **Section title:** `Playfair Display` 22px weight 600
- **Body text:** DM Sans 13–16px weight 300

### Homepage Key Measurements
- **Nav height:** 56px, sticky, `box-shadow: 0 1px 8px rgba(0,0,0,0.05)`
- **Hero padding:** 80px 32px 72px; max-width 760px centered
- **Section padding:** 0 32px 80px; max-width 1100px
- **Trip grid:** `repeat(auto-fill, minmax(320px, 1fr))`, gap 24px
- **Card border-radius:** 16px
- **Card hover:** `translateY(-3px)` + `box-shadow: 0 12px 40px rgba(0,0,0,0.1)`
- **Mobile breakpoint:** 720px → padding collapses, about-grid goes 1-col

### Homepage Component Inventory
- **Nav:** brand (Playfair serif, accent italic) + nav-links (pill hover on --warm)
- **Hero:** eyebrow (DM Mono uppercase) + h1 + hero-desc + hero-stats (3 stat blocks)
- **Trip grid:** `.trip-card` → card-img (200px) + card-body (location, title, desc, tags, highlights, CTA)
- **About section:** 2-col grid with narrative + 4 principle cards
- **GitHub bar:** dark (--ink) background with white CTA button
- **Footer:** centered, semi-transparent text

---

## Trip Page Design Tokens (`trips/*/index.html`)

Declared in `css/theme.css`.

```css
/* Blues / glaciers */
--sky:          #daeaf5;   /* lightest blue — backgrounds, tags */
--sky-mid:      #b8d6ed;   /* borders in sky-toned elements */
--sky-deep:     #7fb3d3;   /* timeline line, sleep dot */
--glacier:      #4a90b8;   /* primary accent — card-time, tab underline, badge */
--glacier-dark: #2c6a90;   /* nav title, active tab, back-btn, links */

/* Neutrals */
--snow:         #ffffff;
--mist:         #f4f8fc;   /* page bg, drive-card bg */
--mist-dark:    #e6f0f7;
--stone:        #8fa3b1;   /* muted labels */
--stone-dark:   #5c7a8a;   /* secondary text */
--slate:        #3d5a6a;
--ink:          #1e3040;   /* primary headings */

/* Amber / food accent */
--amber:        #d4872a;   /* food card time, amber badge */
--amber-light:  #e9a84a;
--amber-pale:   #fdf3e3;   /* food/tip tag bg, birthday banner */

/* Semantic */
--text-dark:  #1a2a35;
--text-mid:   #3d5a6a;
--text-light: #7a9aaa;
--border:     #ccdde8;
```

### Trip Page Typography
- **Same font stack** as homepage: Playfair Display + DM Sans + DM Mono
- **Day h2:** Playfair Display 30px weight 700; `em` = italic glacier-dark
- **Card title:** Playfair Display 16px weight 600
- **Card time:** DM Mono 11px, letter-spacing .07em
- **Tab label:** DM Sans 11px uppercase; day number Playfair 18px
- **Body text:** DM Sans 13–13.5px weight 300, line-height 1.72–1.78

### Trip Page Key Measurements
- **Top nav height:** 48px sticky (z-index 200)
- **Tab nav:** sticky at `top: 48px` (z-index 100); horizontal scroll, hidden scrollbar
- **Main content:** max-width 960px, padding 36px 20px 80px
- **Card border-radius:** 14px
- **Card body indent:** `padding-left: 64px` (aligns under icon)
- **Timeline:** `padding-left: 28px`; vertical line left edge; dots at `left: -34px`
- **Day overview strip:** horizontal scroll, border-radius 14px; each stop min-width 80px
- **Mobile breakpoint:** 600px → card-body-inner collapses padding, day-header goes column

### Dot Color Meanings (Timeline)
| Class | Color | Meaning |
|-------|----|---|
| (default) | `--glacier` border, white fill | Sightseeing/activity |
| `.drive` | `--stone` border | Drive segment |
| `.food` | `--amber` border | Meal |
| `.sleep` | `--sky-deep` border | Accommodation |
| `.special` | `--glacier-dark` border + fill | Highlight/iconic stop |

### Card Variant Colors
| Class | Background | Border | Time color |
|-------|------------|--------|------------|
| (default) | `--snow` | `--border` | `--glacier` |
| `.drive-card` | `--mist` | `--sky-mid` | `--stone` |
| `.food-card` | `--snow` | amber 25% | `--amber` |
| `.special-card` | `--snow` | `--sky-deep` + ring | `--glacier` |

### Tag Types
| Class | Color | Usage |
|-------|-------|-------|
| `.tag-knee` | Blue | Accessibility / mobility note |
| `.tag-tip` | Amber | Practical tip |
| `.tag-book` | Red | Must-book reminder |
| `.tag-bday` | Orange | Birthday / special occasion |
| `.tag-note` | Grey | General note |

---

## Animations
```css
fadeUp: opacity 0→1, translateY(14px→0), duration .6s ease
fadeIn: opacity 0→1, translateY(6px→0), duration .3s ease
/* Hero uses staggered delays: .1s, .25s, .4s, .55s */
```
