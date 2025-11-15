import { Document, Types } from 'mongoose';

export interface IFlashcard extends Document {
  languageId: Types.ObjectId;
  keyword: string;
  question: string;
  answer: string;
  codeExample: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFlashcardInput {
  languageId: string;
  keyword: string;
  question: string;
  answer: string;
  codeExample: string;
}

export interface IFlashcardGenerated {
  keyword: string;
  question: string;
  answer: string;
  codeExample: string;
}
