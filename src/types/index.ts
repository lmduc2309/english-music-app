export enum CefrLevel { A1='A1',A2='A2',B1='B1',B2='B2',C1='C1',C2='C2' }

export interface User { id:string; email:string; displayName:string; avatarUrl?:string; currentLevel:CefrLevel; totalXp:number; currentStreak:number; longestStreak:number; nativeLanguage:string; }
export interface Song { id:string; title:string; artist:string; youtubeVideoId:string; thumbnailUrl:string; level:CefrLevel; genre?:string; bpm?:number; durationSeconds:number; totalLines:number; averageRating:number; timesPlayed:number; tags?:string[]; lyrics?:LyricLine[]; }
export interface LyricLine { id:string; songId:string; lineNumber:number; text:string; phonetic?:string; startTime:number; endTime:number; keywords?:string[]; wordTimestamps?:{word:string;start:number;end:number}[]; }
export interface PracticeSession { id:string; songId:string; status:'in_progress'|'completed'|'abandoned'; currentLineIndex:number; totalLinesCompleted:number; overallScore:number; pitchScore:number; pronunciationScore:number; timingScore:number; wordAccuracyScore:number; xpEarned:number; song?:Song; }
export interface AttemptResult { attempt:{id:string;attemptNumber:number;pitchScore:number;pronunciationScore:number;timingScore:number;wordAccuracyScore:number;totalScore:number;passed:boolean;wordDetails:WordDetail[];aiFeedback:string}; session:{currentLineIndex:number;totalLinesCompleted:number;status:string;overallScore:number;xpEarned:number}; nextAction:'next_line'|'retry'|'song_complete'; }
export interface WordDetail { word:string; expected:string; correct:boolean; pronunciationNote:string; }
export interface VocabularyItem { id:string; word:string; definition?:string; phonetic?:string; exampleSentence?:string; songContext?:string; mastered:boolean; nextReviewDate?:string; }
export interface Achievement { id:string; code:string; name:string; description:string; category:string; threshold:number; xpReward:number; unlocked:boolean; unlockedAt?:string; }
export interface UserStats { totalXp:number; currentStreak:number; longestStreak:number; currentLevel:string; achievementsUnlocked:number; totalAchievements:number; level:{level:number;title:string;nextLevelXp:number;progress:number}; }
export interface LeaderboardEntry { rank:number; userId:string; displayName:string; avatarUrl?:string; totalXp:number; currentStreak?:number; }
