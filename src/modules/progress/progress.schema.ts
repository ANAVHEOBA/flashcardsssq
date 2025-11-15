import { Schema } from 'mongoose';
import { IProgressDocument } from './progress.interface';

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

export default ProgressSchema;
