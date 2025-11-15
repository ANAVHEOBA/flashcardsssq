import { LanguageModel } from './language.model';
import { ILanguage, ILanguageInput } from './language.interface';

// Create a new language
export const createLanguage = async (languageData: ILanguageInput): Promise<ILanguage> => {
  const existingLanguage = await LanguageModel.findOne({ slug: languageData.slug });
  if (existingLanguage) {
    throw new Error('Language already exists');
  }

  const newLanguage = new LanguageModel(languageData);
  return await newLanguage.save();
};

// Get all languages
export const getAllLanguages = async (): Promise<ILanguage[]> => {
  return await LanguageModel.find().sort({ name: 1 });
};

// Get language by slug
export const getLanguageBySlug = async (slug: string): Promise<ILanguage | null> => {
  return await LanguageModel.findOne({ slug });
};

// Get language by ID
export const getLanguageById = async (id: string): Promise<ILanguage | null> => {
  return await LanguageModel.findById(id);
};

// Mark language as generated
export const markLanguageAsGenerated = async (slug: string): Promise<ILanguage | null> => {
  return await LanguageModel.findOneAndUpdate(
    { slug },
    { isGenerated: true },
    { new: true }
  );
};
