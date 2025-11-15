import { Document } from 'mongoose';

export interface ILanguage extends Document {
  name: string;
  slug: string;
  totalKeywords: number;
  isGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILanguageInput {
  name: string;
  slug: string;
  totalKeywords: number;
}
