/** Shared TypeScript types for english-music-app */

export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  currentLevel: CEFRLevel;
  totalXP: number;
  currentStreak: number;
  longestStreak: number;
  songsCompleted: number;
  sentencesPracticed: number;
  averageScore: number;
  preferredGenres: string[];
  dailyGoal: number;
  lastPracticeDate?: string;
}

export interface Sentence {
  _id: string;
  text: string;
  startTime: number;
  endTime: number;
  pitchData: number[];
  difficulty: CEFRLevel;
  order: number;
}

export interface Song {
  _id: string;
  title: string;
  artist: string;
  youtubeId: string;
  thumbnailUrl?: string;
  level: CEFRLevel;
  genre: string;
  bpm: number;
  duration: number;
  totalSentences: number;
  playCount: number;
  averageScore: number;
  sentences?: Sentence[];
}

export interface SongProgress {
  songId: string;
  completedSentences: number;
  totalSentences: number;
  bestScore: number;
  lastPracticed?: string;
  completed: boolean;
  percentComplete: number;
}

export interface ScoreBreakdown {
  pitch: number;
  duration: number;
  pronunciation: number;
  overall: number;
}

export interface WordScore {
  word: string;
  correct: boolean;
  spokenAs?: string;
  score: number;
}

export interface PracticeResult {
  scores: ScoreBreakdown;
  passed: boolean;
  wordScores: WordScore[];
  feedback: string[];
  xpEarned: number;
}

export interface Achievement {
  _id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: 'practice' | 'streak' | 'level' | 'score' | 'social';
  xpReward: number;
  requirement: { type: string; value: number };
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  earnedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  displayName: string;
  avatar?: string;
  totalXP: number;
  currentStreak: number;
  currentLevel: CEFRLevel;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Songs: undefined;
  Practice: { songId: string; sentenceIndex?: number };
  Progress: undefined;
  Profile: undefined;
};

export type MainStackParamList = {
  SongList: undefined;
  SongDetail: { songId: string };
  Practice: { songId: string; sentenceIndex?: number };
  Leaderboard: undefined;
};
