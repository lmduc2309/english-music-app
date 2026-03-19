# 🎵 SingLish — english-music-app

React Native (Expo) mobile app for learning English through singing with AI-powered pronunciation scoring.

## Tech Stack

- **Expo SDK 55** + React Native 0.83
- **expo-router** — File-based navigation (Stack + Bottom Tabs)
- **expo-av** — Microphone recording for singing
- **expo-secure-store** — Secure JWT token storage
- **expo-haptics** — Tactile feedback on pass/fail
- **Zustand** — Lightweight state management
- **Axios** — API client with JWT interceptor
- **react-native-svg** — Animated score circles
- **Ionicons** — Tab bar icons

## Project Structure

```
app/                          # expo-router file-based routes
├── _layout.tsx               # Root Stack layout + auth init
├── index.tsx                 # Auth gate → redirect to tabs or login
├── login.tsx                 # Register / login screen
├── (tabs)/                   # Bottom tab navigation
│   ├── _layout.tsx           # Tab bar config (Home, Vocab, Ranks, Profile)
│   ├── index.tsx             # Home — stats, level picker, popular songs
│   ├── vocabulary.tsx        # SM-2 flashcard review + word list
│   ├── leaderboard.tsx       # Global + weekly rankings
│   └── profile.tsx           # Stats, achievements, XP level, logout
├── song/
│   ├── list.tsx              # Browse songs by CEFR level
│   └── [id].tsx              # Song detail — lyrics preview + start practice
└── practice/
    ├── [sessionId].tsx       # Core game loop — record + score + 80% gate
    └── complete.tsx          # Celebration screen — stars + XP

src/                          # Shared logic
├── components/               # ScoreCircle, LevelBadge, SongCard
├── services/api.ts           # Axios client for all API endpoints
├── store/index.ts            # Zustand global state
├── types/index.ts            # TypeScript interfaces
└── utils/theme.ts            # Colors, fonts, spacing constants
```

## Core Game Loop

```
1. LISTEN   → Read the lyric line, tap "I'm Ready"
2. RECORD   → expo-av records your singing via microphone
3. SCORE    → API scores: pitch + pronunciation + timing + words
4. RESULT   → 4-metric breakdown + AI coach feedback + word chips
5. GATE     → Score >= 80%? Next line. Below? Retry.
6. COMPLETE → All lines done → Stars + XP celebration
```

## Quick Start

```bash
git clone https://github.com/lmduc2309/english-music-app.git
cd english-music-app
npm install
npx expo start
```

Scan the QR code with **Expo Go** on your phone, or press `a` for Android / `i` for iOS simulator.

Make sure the backend API (`english-music-api`) is running first.
Demo login: `demo@singlish.app` / `demo1234`

## API Connection

Edit `src/services/api.ts` to match your backend:

```typescript
// Android emulator
'http://10.0.2.2:3000/api/v1'
// iOS simulator
'http://localhost:3000/api/v1'
// Physical device (your LAN IP)
'http://192.168.x.x:3000/api/v1'
```

## Key Expo Packages

| Package | Purpose |
|---------|---------|
| `expo-router` | File-based navigation |
| `expo-av` | Audio recording (microphone) |
| `expo-secure-store` | Encrypted JWT storage |
| `expo-haptics` | Vibration on pass/fail |
| `expo-status-bar` | Dark status bar |
| `expo-linear-gradient` | UI gradients |
| `@expo/vector-icons` | Ionicons for tabs |

## Related

Backend API: [english-music-api](https://github.com/lmduc2309/english-music-api)
