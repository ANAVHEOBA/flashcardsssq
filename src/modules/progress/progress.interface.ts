import { Document, Types } from 'mongoose';

export interface IProgress {
  userId: Types.ObjectId;
  flashcardId: Types.ObjectId;
  languageId: Types.ObjectId;
  correct: number;
  incorrect: number;
  lastPracticed: Date;
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'mastered';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProgressDocument extends IProgress, Document {}

export interface IPracticeResult {
  flashcardId: string;
  isCorrect: boolean;
}

export interface IPracticeSession {
  languageSlug: string;
  results: IPracticeResult[];
}

export interface ILanguageStats {
  language: string;
  slug: string;
  totalFlashcards: number;
  practiced: number;
  correct: number;
  incorrect: number;
  mastered: number;
  averageAccuracy: number;
}

export interface IUserProgressSummary {
  totalLanguages: number;
  languagesInProgress: number;
  totalFlashcardsPracticed: number;
  overallAccuracy: number;
  languageStats: ILanguageStats[];
}

// Quiz interfaces
export interface IQuizOption {
  id: string;
  text: string;
}

export interface IQuizQuestion {
  flashcardId: string;
  keyword: string;
  options: IQuizOption[];
  correctOptionId: string;
}

export interface IQuizResponse {
  language: string;
  count: number;
  questions: IQuizQuestion[];
}

// Quiz Session interfaces (for timer tracking)
export interface IQuizSession {
  sessionId: string;
  userId: Types.ObjectId;
  languageSlug: string;
  flashcardIds: string[];
  startedAt: Date;
  expiresAt: Date;
  timeLimitMinutes: number;
  isCompleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IQuizSessionDocument extends IQuizSession, Document {}

export interface IQuizResponseWithTimer extends IQuizResponse {
  sessionId: string;
  startedAt: Date;
  expiresAt: Date;
  timeLimitMinutes: number;
  timeRemainingSeconds: number;
}
