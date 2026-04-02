# UI Design System

> **Extracted from existing website CSS**
> All design tokens documented here. CSS files should NEVER be fetched - reference this doc instead.

## Color Palette

```css
--cream:    #faf8f5;  /* Page background */
--warm:     #f2efe9;  /* Card hover, subtle backgrounds */
--border:   #e4e0d8;  /* Borders, dividers */
--stone:    #9a9189;  /* Secondary text, muted elements */
--stone-dk: #6b6059;  /* Body text, darker secondary */
--ink:      #1a1714;  /* Primary text, headings */
--ink-mid:  #3d3530;  /* Mid-tone text */
--accent:   #c17f4a;  /* Links, highlights, italic text */
--accent-lt:#e8c9a0;  /* Lighter accent tones */
--accent-bg:#fdf5eb;  /* Accent backgrounds */
--snow:     #ffffff;  /* Cards, nav, pure white */
```

## Typography

### Font Families
```css
/* Headings, titles, branding */
font-family: 'Playfair Display', serif;

/* Body text, UI elements */
font-family: 'DM Sans', sans-serif;

/* Eyebrows, tags, code-like elements */
font-family: 'DM Mono', monospace;
```

### Font Sizes
```css
/* Hero Title */
font-size: clamp(42px, 6vw, 72px);

/* Section Titles */
font-size: 22px;

/* Card Titles */
font-size: 22px;

/* Body Text */
font-size: 16px; /* Hero description */
font-size: 14px; /* About section */
font-size: 13px; /* Card descriptions, nav links */
font-size: 12px; /* Small text, stats labels, highlights */
font-size: 11px; /* Tags, eyebrows */
font-size: 10px; /* Tiny labels, uppercase text */
```

### Font Weights
```css
font-weight: 300; /* Light - body text */
font-weight: 400; /* Regular - UI elements */
font-weight: 500; /* Medium - buttons, emphasis */
font-weight: 600; /* Semibold - nav brand, section titles */
font-weight: 700; /* Bold - hero, card titles, stats */
```

## Spacing System

```css
/* Micro spacing */
4px, 6px, 8px

/* Small spacing */
12px, 14px, 16px, 18px, 20px

/* Medium spacing */
22px, 24px, 28px, 32px, 36px

/* Large spacing */
44px, 48px, 56px, 72px, 80px

/* Container max-widths */
max-width: 760px;  /* Hero, narrow content */
max-width: 1100px; /* Main sections, grid container */
```

## Component Styles

### Navigation
```css
height: 56px;
background: var(--snow);
border-bottom: 1px solid var(--border);
box-shadow: 0 1px 8px rgba(0,0,0,0.05);
position: sticky;
top: 0;
z-index: 100;
```

### Trip Cards
```css
background: var(--snow);
border: 1px solid var(--border);
border-radius: 16px;
transition: box-shadow 0.2s, transform 0.2s;

/* Hover state */
box-shadow: 0 12px 40px rgba(0,0,0,0.1);
transform: translateY(-3px);

/* Image */
height: 200px;
object-fit: cover;
```

### Buttons
```css
/* Primary CTA */
background: var(--ink);
color: var(--snow);
padding: 9px 18px;
border-radius: 8px;
font-size: 12px;
font-weight: 500;

/* Hover */
background: var(--accent);
```

### Tags/Badges
```css
font-size: 11px;
padding: 3px 10px;
border-radius: 100px;
background: var(--warm);
border: 1px solid var(--border);
color: var(--stone-dk);
```

## Animations

```css
/* Transitions */
transition: all 0.15s;        /* Quick UI feedback */
transition: 0.2s;             /* Card hovers */

/* Fade up animation */
@keyframes fadeUp {
  from { 
    opacity: 0; 
    transform: translateY(12px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* Usage */
animation: fadeUp 0.5s ease 0.05s forwards;
```

## Layout Rules

### Grid System
```css
/* Trip Grid */
grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
gap: 24px;

/* About Grid */
grid-template-columns: 1fr 1fr;
gap: 48px;
```

### Breakpoints
```css
@media (max-width: 720px) {
  /* Mobile adjustments */
  padding: 56px 20px 56px; /* Reduced padding */
  grid-template-columns: 1fr; /* Single column */
}
```

## Design Principles

1. **Minimal & Elegant** - Use whitespace generously, avoid clutter
2. **Serif for Impact** - Playfair Display for headings, hierarchy
3. **Warm Neutrals** - Cream backgrounds, stone grays, accent browns
4. **Subtle Interactions** - Gentle hovers, smooth transitions
5. **Typography-Driven** - Let type hierarchy do the heavy lifting
6. **Grid-Based Layout** - Consistent spacing, aligned elements

## When Adding New Components

- Use existing color variables (NEVER hardcode colors)
- Follow spacing system (4px increments)
- Match animation patterns (0.15s-0.2s transitions)
- Maintain established hierarchy (Playfair headings, DM Sans body)
- Keep border-radius consistent (8px buttons, 16px cards, 100px pills)