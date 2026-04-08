# Steps to run

> cd folderName
> npm run dev

# Wall Calendar — Interactive React Component

A polished, interactive wall calendar built with **React 18** and **Tailwind CSS**, inspired by the aesthetics of a physical spiral-bound wall calendar. Features a dynamic hero image per month, day range selection, integrated notes with localStorage persistence, holiday markers, and smooth page-flip animations.

---

## Preview

> The calendar renders as a physical wall calendar card — spiral binding at the top, a full-bleed hero landscape photo for each month, a clean date grid below, and a lined notes section at the bottom. Every month has its own unique color theme and scenery.

---

## Features

### Core
- **Wall Calendar Aesthetic** — spiral binding, hero photo with diagonal SVG cutout, paper-textured bottom strip
- **12 Unique Month Themes** — each month ships with its own accent color, label, emoji, and Unsplash landscape photo
- **Day Range Selector** — click a start date, click an end date; clear visual states for start, end, in-range, and today
- **Integrated Notes Panel** — tabbed notes: one for the whole month, one scoped to the selected date range
- **localStorage Persistence** — notes survive page refreshes; save, delete, and browse all past notes from within the UI
- **Holiday Markers** — dot indicators on public holidays (Republic Day, Independence Day, Christmas, etc.)
- **Note Indicators** — amber dot on any date that has an attached note
- **Page-Flip Animation** — subtle 3D tilt transition when navigating between months
- **Fully Responsive** — max-width card layout, touch-friendly, works on mobile and desktop

### Notes UI Details
- **Save button** with three states: idle → saving (spinner) → saved (green) / error (red)
- **saved badge** in the header when the active tab already has a persisted entry
- **🗑 Delete button** appears only when a saved note exists for the current tab
- **Saved notes drawer** — collapsible list of all saved notes across every month and range, with preview snippets and per-entry delete



## localStorage Schema

Notes are stored in the browser under the key `wall-calendar-notes` as a JSON object:

```json
{
  "2026-4": "April thoughts go here...",
  "2026-1": "New year resolutions...",
  "range-2026-04-01-2026-04-07": "Notes for the first week of April"
}
```