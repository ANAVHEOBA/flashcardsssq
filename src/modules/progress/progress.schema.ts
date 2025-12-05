import { Schema } from 'mongoose';
import { IProgressDocument, IQuizSessionDocument } from './progress.interface';

const ProgressSchema = new Schema<IProgressDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    flashcardId: {
      type: Schema.Types.ObjectId,
      ref: 'Flashcard',
      required: true,
    },
    languageId: {
      type: Schema.Types.ObjectId,
      ref: 'Language',
      required: true,
    },
    correct: {
      type: Number,
      default: 0,
      min: 0,
    },
    incorrect: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastPracticed: {
      type: Date,
      default: Date.now,
    },
    masteryLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'mastered'],
      default: 'beginner',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure one progress record per user per flashcard
ProgressSchema.index({ userId: 1, flashcardId: 1 }, { unique: true });

// Index for querying user progress by language
ProgressSchema.index({ userId: 1, languageId: 1 });

// Quiz Session Schema (for timer tracking)
export const QuizSessionSchema = new Schema<IQuizSessionDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    languageSlug: {
      type: String,
      required: true,
    },
    flashcardIds: {
      type: [String],
      required: true,
    },
    startedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    timeLimitMinutes: {
      type: Number,
      required: true,
      default: 10,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for finding active sessions by user
QuizSessionSchema.index({ userId: 1, isCompleted: 1 });
// TTL index to auto-delete expired sessions after 24 hours
QuizSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

export default ProgressSchema;
