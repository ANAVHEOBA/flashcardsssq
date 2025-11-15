import { model } from 'mongoose';
import { ILanguage } from './language.interface';
import { LanguageSchema } from './language.schema';

export const LanguageModel = model<ILanguage>('Language', LanguageSchema);
