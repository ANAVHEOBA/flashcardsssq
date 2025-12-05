import { Request, Response } from 'express';
import {
  getLanguageBySlug,
  createLanguage,
  markLanguageAsGenerated,
} from '../language/language.crud';
import {
  createMultipleFlashcards,
  getFlashcardsByLanguage,
  countFlashcardsByLanguage,
  updateFlashcardDistractors,
  getFlashcardsWithoutDistractors,
} from './flashcard.crud';
import { getKeywordsBySlug } from '../../data/keywords';
import { generateFlashcardsForKeywords, generateDistractorsForFlashcard } from '../../services/ai.service';

// Generate flashcards for a language
export const generateFlashcards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    // Get keywords for this language
    const keywords = getKeywordsBySlug(slug);
    if (keywords.length === 0) {
      res.status(404).json({
        success: false,
        message: `Language '${slug}' is not supported`,
      });
      return;
    }

    // Check if language exists in database
    let language = await getLanguageBySlug(slug);

    // If language doesn't exist, create it
    if (!language) {
      language = await createLanguage({
        name: slug.charAt(0).toUpperCase() + slug.slice(1),
        slug,
        totalKeywords: keywords.length,
      });
    }

    // Check if flashcards already generated
    if (language.isGenerated) {
      const existingCount = await countFlashcardsByLanguage(String(language._id));
      res.status(200).json({
        success: true,
        message: `Flashcards for ${language.name} already exist`,
        data: {
          language: language.name,
          totalFlashcards: existingCount,
          alreadyGenerated: true,
        },
      });
      return;
    }

    // Generate flashcards using AI
    console.log(`Generating ${keywords.length} flashcards for ${language.name}...`);
    const generatedFlashcards = await generateFlashcardsForKeywords(language.name, keywords);

    // Save flashcards to database (now includes distractors)
    const flashcardsToSave = generatedFlashcards.map((fc) => ({
      languageId: String(language!._id),
      keyword: fc.keyword,
      question: fc.question,
      answer: fc.answer,
      codeExample: fc.codeExample,
      distractors: fc.distractors || [],
    }));

    const savedFlashcards = await createMultipleFlashcards(flashcardsToSave);

    // Mark language as generated
    await markLanguageAsGenerated(slug);

    res.status(201).json({
      success: true,
      message: `Successfully generated ${savedFlashcards.length} flashcards for ${language.name}`,
      data: {
        language: language.name,
        totalFlashcards: savedFlashcards.length,
        flashcards: savedFlashcards,
      },
    });
  } catch (error) {
    console.error('Error in generateFlashcards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate flashcards',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get all flashcards for a language
export const getFlashcards = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    // Get language
    const language = await getLanguageBySlug(slug);
    if (!language) {
      res.status(404).json({
        success: false,
        message: 'Language not found',
      });
      return;
    }

    // Get flashcards
    const flashcards = await getFlashcardsByLanguage(String(language._id));

    res.status(200).json({
      success: true,
      data: {
        language: language.name,
        totalFlashcards: flashcards.length,
        flashcards,
      },
    });
  } catch (error) {
    console.error('Error in getFlashcards:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch flashcards',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Generate distractors for existing flashcards (migration endpoint)
export const generateDistractors = async (req: Request, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    // Get language
    const language = await getLanguageBySlug(slug);
    if (!language) {
      res.status(404).json({
        success: false,
        message: 'Language not found',
      });
      return;
    }

    // Get flashcards without distractors
    const flashcardsToUpdate = await getFlashcardsWithoutDistractors(String(language._id), limit);

    if (flashcardsToUpdate.length === 0) {
      res.status(200).json({
        success: true,
        message: 'All flashcards already have distractors',
        data: { updated: 0 },
      });
      return;
    }

    console.log(`Generating distractors for ${flashcardsToUpdate.length} flashcards...`);

    let updatedCount = 0;
    const errors: string[] = [];

    // Generate distractors for each flashcard
    for (const flashcard of flashcardsToUpdate) {
      try {
        const distractors = await generateDistractorsForFlashcard(
          language.name,
          flashcard.keyword,
          flashcard.answer
        );

        await updateFlashcardDistractors(String(flashcard._id), distractors);
        updatedCount++;
        console.log(`✓ Generated distractors for: ${flashcard.keyword}`);
      } catch (err) {
        const errorMsg = `Failed for ${flashcard.keyword}: ${err instanceof Error ? err.message : 'Unknown'}`;
        errors.push(errorMsg);
        console.error(`✗ ${errorMsg}`);
      }
    }

    res.status(200).json({
      success: true,
      message: `Generated distractors for ${updatedCount}/${flashcardsToUpdate.length} flashcards`,
      data: {
        updated: updatedCount,
        total: flashcardsToUpdate.length,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error('Error in generateDistractors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate distractors',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
