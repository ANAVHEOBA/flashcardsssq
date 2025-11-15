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
