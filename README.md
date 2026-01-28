# Tänään — Digital Almanac

A calm, editorial single-page web app that presents the essentials of today: light, time, and cultural context.

## Overview

Tänään (Finnish for "Today") is not a dashboard, not a productivity app, and not a weather app. It is a digital almanac that presents information with the quiet dignity of a well-designed print publication.

### Core Principles

- **Everything fits on one calm, scrollable page**
- **Editorial, print-like feeling** — no cards, no borders, no shadows
- **Whitespace over density** — generous vertical rhythm
- **No spinners, no skeletons** — content appears complete
- **Calm over efficiency** — if it feels "app-like", it's removed

## Features

### 1. Mood Line
A poetic Finnish sentence describing the day, rendered over a subtle gradient. Deterministic based on date and day length — same date in same location always produces the same mood line.

### 2. Date
Full Finnish date string in editorial typography
Example: "Tiistai 27. tammikuuta 2026"

### 3. Sun & Daylight
- Sunrise and sunset times
- Day length in hours and minutes
- 24-hour daylight timeline visualization with smooth gradients

### 4. Weather (Today)
- Minimal line-based weather icon
- Temperature range for the day
- Finnish weather description
- Wind speed
- Clearly indicates "today" not real-time

### 5. Name Days
Three calendars:
- Finnish (Lutheran)
- Orthodox
- Swedish

### 6. Today in History
One historical event in calm, educational tone
Format: "Tänä päivänä vuonna YYYY …"

### 7. Location Selector
- Searchable dropdown with all Finnish municipalities
- Stored in localStorage
- Updates sun and weather data when changed

## Tech Stack


- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules
- **Fonts**: Lora (serif), Work Sans (sans-serif)
- **Hosting**: Vercel
- **Data Sources**:
  - Open-Meteo API (sun, weather)
  - Wikipedia "On This Day" API (historical events)
  - Local JSON files (name days, municipalities)

## Project Structure

```
tanaan-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout with fonts
│   │   ├── page.tsx                # Server component (data fetching)
│   │   ├── TanaanClient.tsx        # Client component (state, interactivity)
│   │   ├── TanaanClient.module.css # Main styles
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── DaylightTimeline.tsx    # 24h day/night visualization
│   │   ├── DaylightTimeline.module.css
│   │   ├── LocationSelector.tsx    # Municipality selector
│   │   ├── LocationSelector.module.css
│   │   └── WeatherIcons.tsx        # Inline SVG weather icons
│   ├── data/
│   │   ├── namedays-finnish.json   # All 366 days
│   │   ├── namedays-orthodox.json  # All 366 days
│   │   ├── namedays-swedish.json   # All 366 days
│   │   └── municipalities.json     # Finnish municipalities with coords
│   └── utils/
│       ├── dateTime.ts             # Finnish date formatting, timezone
│       ├── moodLines.ts            # Deterministic mood line generator
│       ├── openMeteo.ts            # Weather & sun API integration
│       ├── weather.ts              # Weather code → Finnish description
│       └── wikipedia.ts            # Historical events API
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## How It Works

### Data Flow

1. **Server Component** (`page.tsx`):
   - Fetches initial data on the server
   - Gets current date in Helsinki timezone
   - Fetches sun/weather data for default location (Helsinki)
   - Fetches historical event
   - Passes data to client component

2. **Client Component** (`TanaanClient.tsx`):
   - Manages location state (localStorage)
   - Handles location changes → refetches data
   - Sets up midnight refresh timer
   - Renders all sections with proper styling

### Mood Line Logic

The mood line is **fully deterministic** and **offline**:

1. Determine season category based on month + day length
   - winter_darkest (Dec 15 - Jan 15)
   - winter_dark (Jan - Feb)
   - winter_light (March)
   - spring (Apr - May)
   - early_summer (early June)
   - midsummer (mid-June to mid-July)
   - late_summer (late July - Aug)
   - autumn (Sep - Oct)
   - early_winter (Nov)

2. Select from pre-written phrases using day of month modulo array length
3. Return both text and gradient colors

Same date + same day length = same mood line every time.

### Midnight Refresh

The app automatically refreshes at the next local midnight (Europe/Helsinki):

```typescript
const msUntilMidnight = getMillisecondsUntilMidnight();
setTimeout(() => window.location.reload(), msUntilMidnight);
```

No polling, no cron jobs — just one timer set on page load.

### Typography & Aesthetics

**Fonts:**
- Lora (serif) — headlines, dates, emphasis
- Work Sans (sans-serif) — body text, labels

**Color Palette:**
- Soft off-white background (#fafaf8)
- Dark grey text (#2a2a2a)
- Muted blues for night (#3d5875)
- Warm beiges for daylight (#f5e6d3)
- No pure black anywhere

**Spacing:**
- Generous vertical rhythm (4rem between sections)
- Maximum width: 680px
- Mobile-first responsive design

## Setup & Development

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Vercel

### Method 1: Vercel CLI

```bash
npm install -g vercel
vercel
```

### Method 2: GitHub Integration

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Vercel auto-detects Next.js
5. Deploy

### Environment

No environment variables needed. Everything works out of the box.

### Zero Configuration

The app is designed to work immediately after deployment:
- No databases to set up
- No API keys required
- No authentication
- No analytics

## API Usage

### Open-Meteo

Free, no API key required:
- Endpoint: `https://api.open-meteo.com/v1/forecast`
- Used for: sunrise, sunset, daylight duration, temperature, weather code, wind speed

### Wikipedia "On This Day"

Free, no API key required:
- Endpoint: `https://[lang].wikipedia.org/api/rest_v1/feed/onthisday/events/[month]/[day]`
- First tries Finnish (`fi`), falls back to English
- Filters out births/deaths, prefers historical events

## Data Files

All data files are included in the repository:

- **Name days**: Complete 366-day calendars for all three traditions
- **Municipalities**: 100+ Finnish municipalities with latitude/longitude
- **Mood lines**: Seasonal phrases with gradients (hardcoded in utility)

No external data dependencies beyond the two free APIs.

## Design Philosophy

This app was designed with the care and attention usually reserved for print publications:

- **Clarity over cleverness**
- **Readability over abstraction**  
- **Calm over efficiency**
- **Silence over noise**

If something can be simpler, make it simpler.
If it feels "app-like", remove it.
If you're unsure, add whitespace.

## License

MIT

## Credits

Weather data: [Open-Meteo](https://open-meteo.com/)
Historical events: [Wikipedia](https://www.wikipedia.org/)
Typography: Lora by Cyreal, Work Sans by Wei Huang
