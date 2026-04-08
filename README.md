# Interactive Calendar Component 🗓️

A highly optimized, fully responsive, and interactive calendar component built with React, Vite, and Tailwind CSS.

## 🌟 Key Features

- **Custom Date Range Selection:** Click a start date, hover to preview the range, and click to finalize. Click again to reset.
- **Dynamic Theming:** Each month features a unique hero image and CSS accent color that drives the entire UI, creating a cohesive seasonal feel.
- **Light & Dark Modes:** Fully styled with Tailwind CSS to support system preferences and manual toggling, including custom elevation shadows and dynamic surface colors.
- **3D Hardware-Accelerated Animations:** Uses `framer-motion` for a spatial, physical feel. The calendar grid flips in 3D space (`rotateX`) while the header slides horizontally during month transitions.
- **Persistent Notes Engine:** Attach notes to specific date ranges. Notes are saved to `localStorage` and displayed in a collapsible panel that dynamically resizes the hero image layout.
- **Zero-Lag Media Loading:** Utilizes aggressive DOM-level image pre-caching of local assets to guarantee 100% instant, stutter-free month transitions.

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/) (Fast HMR & optimized production builds)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Arbitrary values & native dark mode)
- **Animation:** [Framer Motion](https://www.framer.com/motion/) (Spring physics, layout transitions, `AnimatePresence`)

## 📂 Project Architecture

The application is structured for maintainability and separation of concerns:

```text
src/
├── assets/
│   └── images/              # Locally hosted monthly theme images
├── components/
│   ├── Wall.jsx             # Main application shell with lazy-loaded panels
│   ├── CalendarGrid.jsx     # Month navigation and 7x6 grid rendering
│   ├── DayCell.jsx          # Individual day logic (hover, range states, memoized)
│   ├── Hero.jsx             # Dynamic image banner with diagonal overlay
│   └── NotesPanel.jsx       # Expandable text editor with localStorage persistence
├── hooks/
│   ├── useCalendar.js       # Manages month/year state and transition logic
│   ├── useDateRange.js      # Handles start, end, and hover preview interactions
│   └── useNotes.js          # CRUD operations for the localStorage notes engine
├── utils/
│   ├── dateUtils.js         # Pure JS functions for building the day array and checking ranges
│   └── holidays.js          # Dictionary of fixed and calculated holiday dates
├── data/
│   └── monthThemes.js       # Configuration for monthly images, labels, and accent colors
├── index.css                # Tailwind directives and 3D perspective utilities
├── App.jsx
└── main.jsx
```

## 🧠 Optimization Details

This calendar handles a massive amount of state changes (hovering individual days while selecting a range). To maintain a buttery-smooth 60fps framerate, the following enterprise-level optimizations were applied:

- **Component Memoization (`React.memo`):** `DayCell` utilizes a custom comparator function comparing `getTime()` values so that only the specific cells affected by a new selection or hover range are re-rendered, completely skipping the unchanged days.
- **Function & Value Caching (`useMemo` & `useCallback`):** The complex day array (`buildCalendarDays`) is cached and only recalculates when the month or year actually changes. All hook functions and click handlers are wrapped in `useCallback` to prevent cascading child re-renders.
- **State Consolidation:** The `month` and `year` states were combined into a single object inside `useCalendar` to prevent React from triggering double render cycles.
- **Aggressive Image Pre-caching:** Images are in local assets, injecting them invisibly into the DOM on initial load with `decoding="sync"` and `fetchpriority="high"`. This forces the browser to decode the images instantly, eliminating the micro-stutter typical in image carousels.
- **Code Splitting:** Heavy UI panels (`Hero` and `NotesPanel`) are dynamically imported using `React.lazy` and `<Suspense>` to keep the initial JavaScript bundle tiny.