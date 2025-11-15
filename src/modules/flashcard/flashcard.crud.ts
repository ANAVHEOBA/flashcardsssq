import { FlashcardModel } from './flashcard.model';
import { IFlashcard, IFlashcardInput } from './flashcard.interface';

// Create flashcard
export const createFlashcard = async (flashcardData: IFlashcardInput): Promise<IFlashcard> => {
  const newFlashcard = new FlashcardModel(flashcardData);
  return await newFlashcard.save();
};

// Create multiple flashcards
export const createMultipleFlashcards = async (
  flashcardsData: IFlashcardInput[]
): Promise<any[]> => {
  return await FlashcardModel.insertMany(flashcardsData);
};

// Get all flashcards for a language
export const getFlashcardsByLanguage = async (languageId: string): Promise<IFlashcard[]> => {
  return await FlashcardModel.find({ languageId }).sort({ keyword: 1 });
};

// Get flashcard by ID
export const getFlashcardById = async (id: string): Promise<IFlashcard | null> => {
  return await FlashcardModel.findById(id);
};

// Count flashcards for a language
export const countFlashcardsByLanguage = async (languageId: string): Promise<number> => {
  return await FlashcardModel.countDocuments({ languageId });
};

// Delete all flashcards for a language
export const deleteFlashcardsByLanguage = async (languageId: string): Promise<void> => {
  await FlashcardModel.deleteMany({ languageId });
};
