import { Schema } from 'mongoose';
import { IFlashcard } from './flashcard.interface';

export const FlashcardSchema = new Schema<IFlashcard>(
  {
    languageId: {
      type: Schema.Types.ObjectId,
      ref: 'Language',
      required: [true, 'Language ID is required'],
    },
    keyword: {
      type: String,
      required: [true, 'Keyword is required'],
      trim: true,
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    answer: {
      type: String,
      required: [true, 'Answer is required'],
      trim: true,
    },
    codeExample: {
      type: String,
      required: [true, 'Code example is required'],
      trim: true,
    },
    distractors: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
FlashcardSchema.index({ languageId: 1 });
FlashcardSchema.index({ keyword: 1 });
FlashcardSchema.index({ languageId: 1, keyword: 1 }, { unique: true });
