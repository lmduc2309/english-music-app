# 🎵 SingLish — english-music-app

React Native mobile app for learning English through singing with AI-powered pronunciation scoring.

## Screenshots Flow

```
Login → Home (stats, levels, songs) → Song List (by level) → Song Detail (lyrics)
  → Practice (listen → sing → score → pass/retry) → Song Complete (stars, XP)
  → Vocabulary (SRS review) → Leaderboard → Profile (achievements)
```

## Project Structure

```
src/
├── screens/
│   ├── LoginScreen.tsx           # Auth (register + login)
│   ├── HomeScreen.tsx            # Dashboard: stats, level picker, songs
│   ├── SongListScreen.tsx        # Browse songs by CEFR level
│   ├── SongDetailScreen.tsx      # Song info, lyrics, start practice
│   ├── PracticeScreen.tsx        # Core game: listen → sing → score
│   ├── SessionCompleteScreen.tsx # Celebration with stars + XP
│   ├── VocabularyScreen.tsx      # SM-2 spaced repetition review
│   ├── LeaderboardScreen.tsx     # Global + weekly rankings
│   └── ProfileScreen.tsx         # Stats, achievements, settings
├── components/
│   ├── ScoreCircle.tsx           # Animated circular SVG score
│   ├── LevelBadge.tsx            # CEFR level pill (A1-C2)
│   └── SongCard.tsx              # Song list item with thumbnail
├── services/
│   └── api.ts                    # Axios client with JWT interceptor
├── store/
│   └── index.ts                  # Zustand global state
├── navigation/
│   └── AppNavigator.tsx          # Stack + Bottom Tab navigation
├── types/
│   └── index.ts                  # TypeScript interfaces
└── utils/
    └── theme.ts                  # Dark theme colors, fonts, spacing
```

## Core Game Loop (PracticeScreen)

```
1. LISTEN   — Read the lyric sentence, tap "I'm Ready"
2. RECORD   — Hold button and sing the sentence
3. SCORE    — API analyzes: pitch + pronunciation + timing + words
4. RESULT   — See 4-metric breakdown + AI coach feedback
5. GATE     — Score >= 80%? → Next line. Below? → Retry.
6. COMPLETE — All lines done → Stars + XP celebration
```

## Setup

```bash
# 1. Clone and install
git clone https://github.com/lmduc2309/english-music-app.git
cd english-music-app
npm install

# 2. iOS (macOS only)
cd ios && pod install && cd ..
npx react-native run-ios

# 3. Android
npx react-native run-android

# 4. Start Metro bundler (if not auto-started)
npx react-native start
```

## API Connection

Update the base URL in `src/services/api.ts`:

```typescript
// Android emulator → localhost maps to 10.0.2.2
const API_BASE_URL = 'http://10.0.2.2:3000/api/v1';

// iOS simulator
const API_BASE_URL = 'http://localhost:3000/api/v1';

// Physical device (use your machine's LAN IP)
const API_BASE_URL = 'http://192.168.x.x:3000/api/v1';
```

Make sure `english-music-api` is running first. Demo login: `demo@singlish.app` / `demo1234`

## Features

- **Song Browser** — Filter by CEFR level (A1–C2), search by title/artist
- **Karaoke Practice** — Sentence-by-sentence singing with recording
- **AI Scoring** — 4 metrics: pitch, pronunciation, timing, word accuracy
- **80% Gate** — Must pass each line before advancing
- **AI Coach** — Natural language feedback from Qwen2.5-7B
- **Vocabulary** — Auto-extracted words with SM-2 spaced repetition
- **Gamification** — XP, 11 levels (Beginner Listener → Master Singer), 14 achievements, streaks
- **Leaderboard** — Global (all-time XP) and weekly rankings
- **Dark Theme** — Purple/teal/coral accent design system

## Tech Stack

React Native CLI · React Navigation (Stack + Tabs) · Zustand · Axios · react-native-svg · react-native-video · react-native-audio-recorder-player · react-native-pitch-detector · AsyncStorage

## Related

- Backend API: [english-music-api](https://github.com/lmduc2309/english-music-api)
