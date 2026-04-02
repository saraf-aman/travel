# Travel Website Project Context

## GitHub Repository
- **Owner:** saraf-aman
- **Repo:** travel
- **Branch:** main
- **Hosting:** GitHub Pages
- **URL:** https://saraf-aman.github.io/travel/

## Tech Stack
- **Frontend:** Vanilla HTML/CSS/JavaScript (ES6+)
- **Styling:** Custom CSS (no framework)
- **Data:** JSON files for trip data
- **Build:** None required (static site)
- **Future:** Will integrate external APIs (weather, maps, etc.)

## Current State
- **Homepage:** index.html with trip cards
- **Trip Pages:** Individual trip detail pages in trip/ folder
- **Structure:** Currently monolithic (all data embedded in HTML)
- **Status:** Working but needs optimization for token efficiency

## Existing Trips
1. **Banff & Jasper National Park** - Complete with details
2. **Barcelona & Catalonia** - Placeholder only (no code yet)

## Project Goals
- Migrate to data-driven architecture (JSON-based)
- Optimize for minimal token consumption
- Enable easy trip additions without touching UI code
- Prepare for future API integrations (weather, live data)
- Maintain clean, industry-standard structure

## Development Workflow
- Plan trips in markdown (planning/ folder)
- Convert to JSON when approved
- Website renders dynamically from JSON
- Claude only modifies JSON files, not UI components