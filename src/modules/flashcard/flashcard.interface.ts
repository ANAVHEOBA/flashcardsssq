import { Document, Types } from 'mongoose';

export interface IFlashcard extends Document {
  languageId: Types.ObjectId;
  keyword: string;
  question: string;
  answer: string;
  codeExample: string;
  distractors: string[]; // 4 AI-generated plausible but wrong answers
  createdAt: Date;
  updatedAt: Date;
}

export interface IFlashcardInput {
  languageId: string;
  keyword: string;
  question: string;
  answer: string;
  codeExample: string;
  distractors: string[];
}

export interface IFlashcardGenerated {
  keyword: string;
  question: string;
  answer: string;
  codeExample: string;
  distractors: string[];
}
