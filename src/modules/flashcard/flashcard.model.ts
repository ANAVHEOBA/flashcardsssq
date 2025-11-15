import { model } from 'mongoose';
import { IFlashcard } from './flashcard.interface';
import { FlashcardSchema } from './flashcard.schema';

export const FlashcardModel = model<IFlashcard>('Flashcard', FlashcardSchema);
