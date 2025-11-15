import { Schema } from 'mongoose';
import { ILanguage } from './language.interface';

export const LanguageSchema = new Schema<ILanguage>(
  {
    name: {
      type: String,
      required: [true, 'Language name is required'],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Language slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    totalKeywords: {
      type: Number,
      required: [true, 'Total keywords is required'],
      min: [1, 'Total keywords must be at least 1'],
    },
    isGenerated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes (slug already indexed via unique: true)
LanguageSchema.index({ isGenerated: 1 });
