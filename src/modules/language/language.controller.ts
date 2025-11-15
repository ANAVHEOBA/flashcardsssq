import { Request, Response } from 'express';
import { getAllLanguages, getLanguageBySlug } from './language.crud';
import { getSupportedLanguages } from '../../data/keywords';

// Get all languages
export const getLanguages = async (_req: Request, res: Response): Promise<void> => {
  try {
    const languages = await getAllLanguages();

    res.status(200).json({
      success: true,
      count: languages.length,
      data: languages,
    });
  } catch (error) {
    console.error('Error in getLanguages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch languages',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get supported languages (from keywords file)
export const getSupportedLanguagesController = (_req: Request, res: Response): void => {
  try {
    const languages = getSupportedLanguages();

    res.status(200).json({
      success: true,
      count: languages.length,
      data: languages.map((lang) => ({
        name: lang.name,
        slug: lang.slug,
        totalKeywords: lang.keywords.length,
      })),
    });
  } catch (error) {
    console.error('Error in getSupportedLanguages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch supported languages',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get language by slug
export const getLanguage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    const language = await getLanguageBySlug(slug);

    if (!language) {
      res.status(404).json({
        success: false,
        message: 'Language not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: language,
    });
  } catch (error) {
    console.error('Error in getLanguage:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch language',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
