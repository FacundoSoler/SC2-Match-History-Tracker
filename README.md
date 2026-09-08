# SC2 Match History Tracker

A modern, responsive web application for searching, tracking, and analyzing StarCraft II player profiles, MMR statistics, ladder performance, and detailed match histories across all regions. Built as a monorepo to support web, server, shared libraries, and local API integration.

This project is based on the SC2Pulse website which you can check here : 
(https://sc2pulse.nephest.com/sc2)

![SC2 Match History Tracker](https://raw.githubusercontent.com/placeholder/sc2-tracker/main/preview.png)

---

## 🏗️ Monorepo Architecture

This repository uses **npm Workspaces** to manage all sub-projects in a single repository:

```text
sc2-tracker/
├── packages/
│   ├── web/          # Vue 3 + Vite + Vuetify frontend application
│   ├── server/       # Node.js backend service
│   ├── extension/    # Chrome Extension companion (bypasses CORS for localhost SC2 API)
│   └── shared/       # Shared TypeScript models, date utilities, and MMR calculators
├── package.json      # Root workspace orchestrator
└── tsconfig.json     # Shared base TypeScript configuration
```

---

## 🌟 Key Features

- **Multi-Region Profile Search**: Search Battle.net profiles or player handles across **US**, **EU**, and **KR** server regions.
- **Ladder & MMR Overview**:
  - View current and peak 1v1 MMR.
  - Track total 1v1 games played vs. recent season games.
  - See highest achieved league tier alongside main player race.
- **Detailed Character Stats**:
  - Breakdown of performance over the **last 20 matches**.
  - Matchup distribution and win/loss breakdown against **Protoss**, **Zerg**, **Terran**, and **Random**.
- **Match History Breakdown**:
  - Inspect game outcomes (**WIN** / **LOSS**), duration, and map names.
  - Real-time **MMR adjustments** (+/- ratings).
  - Detailed player name, BattleTag, and main race identifiers.
- **Chrome Extension Companion**: Integrates directly with StarCraft II's local API (`localhost:6119`) to surface live match state without CORS limitations.
- **Dark Theme UI**: Clean, high-contrast dark mode styled with **Vuetify**.

---

## 🛠️ Tech Stack

- **Frontend**: Vue 3, Vite, TypeScript
- **UI Framework**: Vuetify (Material Design)
- **Backend**: Node.js
- **Testing**: Vitest
- **Data Sources**: StarCraft II Community APIs / Battle.net Data API / Local SC2 Client API (`localhost:6119`)

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (`v20.x` recommended)
- [npm](https://www.npmjs.com/) (`v7+` for workspace support)

### 1. Setup

Clone the repository and install all dependencies across all workspaces with a single command from the root:

```bash
git clone https://github.com/your-username/sc2-match-history-tracker.git
cd sc2-match-history-tracker
npm install
```

### 2. Available Scripts (Run from Root)

You can run commands for all sub-packages directly from the root folder without needing to `cd` into individual package directories:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the Vue web application (`packages/web`) |
| `npm run dev:server` | Starts the Node.js backend server (`packages/server`) |
| `npm run test` | Runs the Vitest test suite (`packages/web`) |
| `npm run test:watch` | Runs Vitest in watch mode |
| `npm run build` | Builds all sub-packages (`packages/*`) for production |

---

## 🧩 Chrome Extension Setup (Optional)

To enable live local SC2 client tracking:

1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (top right toggle).
3. Click **Load unpacked** and select the `packages/extension` folder.

---

## 📸 Screenshots

| Player Search & Region Overview | Character Stats & Match History |
| :---: | :---: |
| Overview of matching profiles, peak MMR, and current league ranks. | Breakdown of recent matches, race matchups, win rate, and game details. |

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
