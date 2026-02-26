import { create } from 'zustand';
import { songsAPI } from '../api/songs';
import { practiceAPI, AttemptPayload } from '../api/practice';

interface Word {
  text: string;
  phonetic: string;
  startTime: number;
  endTime: number;
  isKeyWord: boolean;
  definition?: string;
}

export interface Sentence {
  _id: string;
  index: number;
  text: string;
  phonetic: string;
  startTime: number;
  endTime: number;
  duration: number;
  words: Word[];
}

export interface AttemptResult {
  scores: { pitch: number; duration: number; pronunciation: number; overall: number };
  passed: boolean;
  feedback: string[];
  xpEarned: number;
  wordScores: { word: string; correct: boolean; spokenAs?: string; score: number }[];
  needsPractice: string[];
  canContinue: boolean;
  nextSentenceIndex: number;
  isSongComplete: boolean;
}

interface PracticeState {
  sentences: Sentence[];
  currentIndex: number;
  lastResult: AttemptResult | null;
  loading: boolean;
  isRecording: boolean;
  mode: 'listen' | 'sing' | 'result' | 'complete';
  attemptCount: number;
  loadSentences: (songId: string) => Promise<void>;
  submitAttempt: (payload: AttemptPayload) => Promise<AttemptResult>;
  setMode: (mode: 'listen' | 'sing' | 'result' | 'complete') => void;
  goToNext: () => void;
  resetPractice: () => void;
  setRecording: (recording: boolean) => void;
}

export const usePracticeStore = create<PracticeState>((set, get) => ({
  sentences: [],
  currentIndex: 0,
  lastResult: null,
  loading: false,
  isRecording: false,
  mode: 'listen',
  attemptCount: 0,

  loadSentences: async (songId) => {
    set({ loading: true });
    try {
      const { data } = await songsAPI.getSentences(songId);
      set({ sentences: data.sentences, currentIndex: 0, loading: false, mode: 'listen' });
    } catch {
      set({ loading: false });
    }
  },

  submitAttempt: async (payload) => {
    set({ loading: true });
    const { data } = await practiceAPI.submitAttempt(payload);
    set({ lastResult: data, loading: false, mode: 'result', attemptCount: get().attemptCount + 1 });
    return data;
  },

  setMode: (mode) => set({ mode }),

  goToNext: () => {
    const { currentIndex, sentences } = get();
    if (currentIndex + 1 >= sentences.length) {
      set({ mode: 'complete' });
    } else {
      set({ currentIndex: currentIndex + 1, mode: 'listen', lastResult: null, attemptCount: 0 });
    }
  },

  resetPractice: () => set({ sentences: [], currentIndex: 0, lastResult: null, mode: 'listen', attemptCount: 0 }),
  setRecording: (recording) => set({ isRecording: recording }),
}));
