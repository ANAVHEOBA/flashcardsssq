import Progress from './progress.model';
import { IPracticeResult, ILanguageStats, IUserProgressSummary } from './progress.interface';
import { LanguageModel } from '../language/language.model';
import { FlashcardModel } from '../flashcard/flashcard.model';
import { Types } from 'mongoose';
import { IFlashcard } from '../flashcard/flashcard.interface';

// Calculate mastery level based on accuracy and practice count
const calculateMasteryLevel = (
  correct: number,
  incorrect: number
): 'beginner' | 'intermediate' | 'advanced' | 'mastered' => {
  const total = correct + incorrect;
  if (total < 3) return 'beginner';

  const accuracy = (correct / total) * 100;

  if (accuracy >= 90 && total >= 10) return 'mastered';
  if (accuracy >= 75 && total >= 5) return 'advanced';
  if (accuracy >= 50 && total >= 3) return 'intermediate';
  return 'beginner';
};

// Record practice results for multiple flashcards
export const recordPracticeSession = async (
  userId: string,
  languageSlug: string,
  results: IPracticeResult[]
): Promise<void> => {
  // Get language ID
  const language = await LanguageModel.findOne({ slug: languageSlug });
  if (!language) {
    throw new Error('Language not found');
  }

  // Process each result
  for (const result of results) {
    const flashcard = await FlashcardModel.findById(result.flashcardId);
    if (!flashcard) continue;

    // Find or create progress record
    const existingProgress = await Progress.findOne({
      userId: new Types.ObjectId(userId),
      flashcardId: new Types.ObjectId(result.flashcardId),
    });

    if (existingProgress) {
      // Update existing progress
      if (result.isCorrect) {
        existingProgress.correct += 1;
      } else {
        existingProgress.incorrect += 1;
      }
      existingProgress.lastPracticed = new Date();
      existingProgress.masteryLevel = calculateMasteryLevel(
        existingProgress.correct,
        existingProgress.incorrect
      );
      await existingProgress.save();
    } else {
      // Create new progress record
      await Progress.create({
        userId: new Types.ObjectId(userId),
        flashcardId: new Types.ObjectId(result.flashcardId),
        languageId: language._id,
        correct: result.isCorrect ? 1 : 0,
        incorrect: result.isCorrect ? 0 : 1,
        lastPracticed: new Date(),
        masteryLevel: 'beginner',
      });
    }
  }
};

// Get user progress for a specific language
export const getUserProgressByLanguage = async (
  userId: string,
  languageSlug: string
): Promise<ILanguageStats | null> => {
  const language = await LanguageModel.findOne({ slug: languageSlug });
  if (!language) {
    throw new Error('Language not found');
  }

  const totalFlashcards = await FlashcardModel.countDocuments({
    languageId: language._id,
  });

  const progressRecords = await Progress.find({
    userId: new Types.ObjectId(userId),
    languageId: language._id,
  });

  const practiced = progressRecords.length;
  const correct = progressRecords.reduce((sum, p) => sum + p.correct, 0);
  const incorrect = progressRecords.reduce((sum, p) => sum + p.incorrect, 0);
  const mastered = progressRecords.filter((p) => p.masteryLevel === 'mastered').length;

  const total = correct + incorrect;
  const averageAccuracy = total > 0 ? (correct / total) * 100 : 0;

  return {
    language: language.name,
    slug: language.slug,
    totalFlashcards,
    practiced,
    correct,
    incorrect,
    mastered,
    averageAccuracy: Math.round(averageAccuracy * 100) / 100,
  };
};

// Get overall user progress summary across all languages
export const getUserProgressSummary = async (
  userId: string
): Promise<IUserProgressSummary> => {
  const languages = await LanguageModel.find({ isGenerated: true });

  const languageStats: ILanguageStats[] = [];

  for (const language of languages) {
    const stats = await getUserProgressByLanguage(userId, language.slug);
    if (stats) {
      languageStats.push(stats);
    }
  }

  const totalLanguages = languages.length;
  const languagesInProgress = languageStats.filter((s) => s.practiced > 0).length;
  const totalFlashcardsPracticed = languageStats.reduce((sum, s) => sum + s.practiced, 0);

  const totalCorrect = languageStats.reduce((sum, s) => sum + s.correct, 0);
  const totalIncorrect = languageStats.reduce((sum, s) => sum + s.incorrect, 0);
  const totalAttempts = totalCorrect + totalIncorrect;
  const overallAccuracy = totalAttempts > 0 ? (totalCorrect / totalAttempts) * 100 : 0;

  return {
    totalLanguages,
    languagesInProgress,
    totalFlashcardsPracticed,
    overallAccuracy: Math.round(overallAccuracy * 100) / 100,
    languageStats,
  };
};

// Get flashcards for practice (those not mastered or least recently practiced)
export const getFlashcardsForPractice = async (
  userId: string,
  languageSlug: string,
  limit: number = 10
) => {
  const language = await LanguageModel.findOne({ slug: languageSlug });
  if (!language) {
    throw new Error('Language not found');
  }

  // Get all flashcards for this language
  const allFlashcards = await FlashcardModel.find({ languageId: language._id });

  // Get user's progress for this language
  const progressRecords = await Progress.find({
    userId: new Types.ObjectId(userId),
    languageId: language._id,
  });

  // Create a map of flashcard progress
  const progressMap = new Map(
    progressRecords.map((p) => [p.flashcardId.toString(), p])
  );

  // Prioritize flashcards:
  // 1. Never practiced
  // 2. Not mastered, sorted by last practiced (oldest first)
  interface FlashcardWithPriority {
    flashcard: IFlashcard;
    priority: number;
    lastPracticed: Date;
  }

  const flashcardsWithPriority: FlashcardWithPriority[] = allFlashcards.map((flashcard) => {
    const progress = progressMap.get(String(flashcard._id));
    if (!progress) {
      return { flashcard, priority: 0, lastPracticed: new Date(0) };
    }
    if (progress.masteryLevel === 'mastered') {
      return { flashcard, priority: 3, lastPracticed: progress.lastPracticed };
    }
    return { flashcard, priority: 1, lastPracticed: progress.lastPracticed };
  });

  // Sort and limit
  const sortedFlashcards = flashcardsWithPriority
    .sort((a: FlashcardWithPriority, b: FlashcardWithPriority) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return a.lastPracticed.getTime() - b.lastPracticed.getTime();
    })
    .slice(0, limit)
    .map((item: FlashcardWithPriority) => item.flashcard);

  return sortedFlashcards;
};
