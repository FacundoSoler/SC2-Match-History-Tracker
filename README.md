# SC2 Match History Tracker

A modern, responsive web application for searching, tracking, and analyzing StarCraft II player profiles, MMR statistics, ladder performance, and detailed match histories across all regions.

![SC2 Match History Tracker](https://raw.githubusercontent.com/placeholder/sc2-tracker/main/preview.png)

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
- **Dark Theme UI**: Clean, high-contrast dark mode styled with **Vuetify**.

---

## 🛠️ Tech Stack

- **Frontend**: [Vue.js](https://vuejs.org/) (Vue 3 / Options or Composition API)
- **UI Framework**: [Vuetify](https://vuetifyjs.com/) (Material Design Components)
- **Styling**: Custom CSS / SASS overrides with Vuetify dark theme
- **Icons**: Material Design Icons & Custom SC2 Race / Flag assets
- **Data Source**: StarCraft II Community APIs / Battle.net Data API

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (`v16.x` or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation - Part 1 (Web app)

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/sc2-match-history-tracker.git
   cd sc2-match-history-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173` (or the port indicated in your console).

4. **Build for production:**
   ```bash
   npm run build
   ```

---

### Installation - Part 2 (NodeJS Server)

1. **Open a new terminal window and navigate to the server folder from the project root:**
      ```bash
   cd src/server
   ```
      
2. **Install server dependencies**
     ```bash
   npm install
   ```
     
3. **Start the local NodeJS Server**
     ```bash
   node server.js
   ```

## 📸 Screenshots

| Player Search & Region Overview | Character Stats & Match History |
| :---: | :---: |
| Overview of matching profiles, peak MMR, and current league ranks. | Breakdown of recent matches, race matchups, win rate, and game details. |

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
