export enum CefrLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  currentLevel: CefrLevel;
  totalXp: number;
  currentStreak: number;
  longestStreak: number;
  songsCompleted: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  nativeLanguage?: string;
  dailyGoalMinutes?: number;
  preferredGenres?: string[];
  notificationsEnabled?: boolean;
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string;
  cefrLevel: CefrLevel;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  bpm: number;
  description?: string;
  tags?: string[];
  totalPlays: number;
  averageScore: number;
  totalSentences: number;
  vocabulary?: VocabularyItem[];
}

export interface VocabularyItem {
  word: string;
  definition: string;
  phonetic: string;
  partOfSpeech: string;
}

export interface SongSentence {
  id: string;
  songId: string;
  orderIndex: number;
  text: string;
  phonetic?: string;
  startTime: number;
  endTime: number;
  expectedDuration: number;
  pitchContour?: PitchPoint[];
  keyWords?: string[];
  teachingNote?: string;
  difficulty: number;
  // Lesson-specific fields
  isUnlocked?: boolean;
  isCompleted?: boolean;
  bestScore?: number;
  attempts?: number;
}

export interface PitchPoint {
  time: number;
  frequency: number;
}

export interface ScoreResult {
  scores: {
    pitch: number;
    duration: number;
    pronunciation: number;
    total: number;
  };
  passed: boolean;
  feedback: string;
  wordAnalysis: WordAnalysis[];
  shouldRepeat: boolean;
  nextSentenceIndex: number;
  encouragement: string;
}

export interface WordAnalysis {
  word: string;
  expected: string;
  isCorrect: boolean;
  confidence: number;
  phonemeAccuracy?: number;
}

export interface LessonData {
  song: Song;
  progress: {
    completedSentences: number;
    totalSentences: number;
    percentComplete: number;
    bestOverallScore: number;
    isCompleted: boolean;
  };
  sentences: SongSentence[];
}

export interface UserProgress {
  id: string;
  songId: string;
  song: Song;
  lastCompletedSentenceIndex: number;
  totalAttempts: number;
  bestOverallScore: number;
  isCompleted: boolean;
}

export interface UserStats {
  songsCompleted: number;
  songsInProgress: number;
  totalAttempts: number;
  averageScore: number;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatarUrl?: string;
  totalXp?: number;
  weeklyScore?: number;
  bestScore?: number;
}

export interface Achievement {
  id: string;
  type: string;
  name: string;
  description: string;
  iconUrl?: string;
  xpReward: number;
  unlockedAt?: string;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  SongDetail: {songId: string};
  Lesson: {songId: string};
  Practice: {songId: string; sentenceIndex: number};
  ScoreResult: {result: ScoreResult; sentence: SongSentence};
  LevelSongs: {level: CefrLevel};
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Progress: undefined;
  Leaderboard: undefined;
  Profile: undefined;
};
