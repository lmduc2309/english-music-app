# 🎵 English Music App

> Learn English by singing along to songs! A React Native mobile app with real-time pronunciation, pitch, and rhythm scoring.

## 📱 Screenshots Flow

```
Login → Home → Discover Songs → Song Detail → Lesson → Practice → Score Result
  │                                                        ↑           │
  └── Register                                             └───────────┘
                                                          (retry if < 80%)
```

## 🏗 Architecture

```
src/
├── App.tsx                  # Root with Navigation (Stack + Bottom Tabs)
├── types/index.ts           # TypeScript types & navigation params
├── theme/index.ts           # Dark theme, colors, CEFR level colors
├── services/
│   └── api.ts               # Axios client with JWT interceptors
├── store/
│   ├── authStore.ts         # Zustand auth state (login/register/logout)
│   └── songStore.ts         # Zustand song & lesson state
├── screens/
│   ├── auth/
│   │   ├── LoginScreen.tsx
│   │   └── RegisterScreen.tsx
│   ├── HomeScreen.tsx        # Dashboard with stats, levels, recommendations
│   ├── DiscoverScreen.tsx    # Search & filter songs by level/genre
│   ├── SongDetailScreen.tsx  # Song info, vocabulary, sentence list
│   ├── LessonScreen.tsx      # Sentence-by-sentence navigation with tips
│   ├── PracticeScreen.tsx    # 🎤 Core: Record voice, animated mic
│   ├── ScoreResultScreen.tsx # Score breakdown, word-by-word analysis
│   ├── ProgressScreen.tsx    # Stats & song completion history
│   ├── LeaderboardScreen.tsx # Global & weekly rankings
│   └── ProfileScreen.tsx     # User profile, achievements, settings
└── SplashScreen.tsx
```

## 🎯 Core Learning Flow

1. **Browse** → Pick a song matching your CEFR level (A1-C2)
2. **Learn** → See the sentence, phonetics, teaching tips, key vocabulary
3. **Listen** → Hear the original line from the song video
4. **Sing** → Record yourself singing the line
5. **Score** → Get instant feedback on:
   - 🗣️ **Pronunciation** (50%) — word-by-word accuracy
   - 🎵 **Pitch** (30%) — melody matching
   - 🥁 **Rhythm** (20%) — timing/tempo
6. **Pass/Retry** → Need 80%+ to unlock the next sentence
7. **Level Up** → Earn XP, maintain streaks, unlock achievements

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- React Native CLI
- Xcode (iOS) / Android Studio (Android)
- Running instance of [english-music-api](https://github.com/lmduc2309/english-music-api)

### Installation

```bash
# Clone
git clone https://github.com/lmduc2309/english-music-app.git
cd english-music-app

# Install dependencies
npm install

# iOS pods
cd ios && pod install && cd ..

# Update API URL in src/services/api.ts
# Change API_BASE_URL to your backend address

# Run
npx react-native run-ios     # iOS
npx react-native run-android  # Android
```

## 🎨 Design System

**Dark theme** with musical vibes:

| Element | Color |
|---------|-------|
| Primary | `#6C5CE7` (Purple) |
| Secondary | `#00CEC9` (Teal) |
| Accent | `#FD79A8` (Pink) |
| Background | `#0F0F23` (Deep Navy) |
| Success | `#00B894` (Green) |
| Error | `#E17055` (Coral) |

**CEFR Level Colors**: A1 🟢 → A2 🔵 → B1 🟣 → B2 💜 → C1 💗 → C2 🔴

## 🛠 Tech Stack

- **React Native CLI** (0.73) — No Expo
- **React Navigation** — Stack + Bottom Tabs
- **Zustand** — State management
- **Axios** — API client with JWT refresh
- **react-native-audio-recorder-player** — Voice recording
- **react-native-video** — Song video playback
- **pitchy** — Real-time pitch detection
- **Lottie** — Animations
- **AsyncStorage** — Token persistence

## 📡 API Integration

The app connects to the NestJS backend at `english-music-api`:

| Feature | Endpoint |
|---------|----------|
| Auth | `POST /auth/login`, `/register`, `/refresh` |
| Songs | `GET /songs`, `/songs/:id/sentences` |
| Lessons | `GET /lessons/:songId` |
| Scoring | `POST /scoring/evaluate` |
| Progress | `GET /progress`, `/progress/stats` |
| Leaderboard | `GET /leaderboard/global`, `/weekly` |
| Achievements | `GET /achievements/mine` |

## 🔜 TODO / Integration Points

- [ ] Integrate `react-native-audio-recorder-player` for actual recording
- [ ] Integrate `pitchy` for real-time pitch detection during recording
- [ ] Add Speech-to-Text (Google Cloud / Whisper) for pronunciation
- [ ] Add `react-native-video` for song playback with seek-to-sentence
- [ ] Add Lottie animations for score reveals
- [ ] Push notifications for streak reminders
- [ ] Social sharing of scores

## 📝 License

MIT
