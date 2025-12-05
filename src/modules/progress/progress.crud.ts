import Progress, { QuizSession } from './progress.model';
import { IPracticeResult, ILanguageStats, IUserProgressSummary, IQuizQuestion, IQuizResponseWithTimer, IQuizResultsResponse, IQuizAnswerRecord } from './progress.interface';
import crypto from 'crypto';

// Default quiz time limit in minutes
const QUIZ_TIME_LIMIT_MINUTES = 10;
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

// Shuffle array helper
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get quiz questions with multiple choice options and create timed session
export const getQuizQuestions = async (
  userId: string,
  languageSlug: string,
  limit: number = 10
): Promise<IQuizResponseWithTimer> => {
  // Get prioritized flashcards for practice
  const practiceFlashcards = await getFlashcardsForPractice(userId, languageSlug, limit);

  if (practiceFlashcards.length === 0) {
    throw new Error('No flashcards available for this language');
  }

  // Get language to fetch all flashcards for wrong options
  const language = await LanguageModel.findOne({ slug: languageSlug });
  if (!language) {
    throw new Error('Language not found');
  }

  // Get all flashcards for this language (fallback for flashcards without distractors)
  const allFlashcards = await FlashcardModel.find({ languageId: language._id });

  // Build quiz questions
  const quizQuestions: IQuizQuestion[] = practiceFlashcards.map((flashcard) => {
    // Create correct option
    const correctOption = {
      id: String(flashcard._id),
      text: flashcard.answer,
    };

    let wrongOptionsList: { id: string; text: string }[];

    // Use stored distractors if available (AI-generated plausible wrong answers)
    if (flashcard.distractors && flashcard.distractors.length >= 4) {
      wrongOptionsList = flashcard.distractors.slice(0, 4).map((distractor, index) => ({
        id: `distractor_${index}_${flashcard._id}`,
        text: distractor,
      }));
    } else {
      // Fallback: use random answers from other flashcards (old behavior)
      const wrongOptions = allFlashcards
        .filter((f) => String(f._id) !== String(flashcard._id))
        .sort(() => Math.random() - 0.5)
        .slice(0, 4);

      wrongOptionsList = wrongOptions.map((f) => ({
        id: String(f._id),
        text: f.answer,
      }));
    }

    // Combine and shuffle all 5 options
    const allOptions = shuffleArray([correctOption, ...wrongOptionsList]);

    return {
      flashcardId: String(flashcard._id),
      keyword: flashcard.keyword,
      options: allOptions,
      correctOptionId: String(flashcard._id),
    };
  });

  // Create quiz session with timer
  const sessionId = crypto.randomUUID();
  const startedAt = new Date();
  const expiresAt = new Date(startedAt.getTime() + QUIZ_TIME_LIMIT_MINUTES * 60 * 1000);

  await QuizSession.create({
    sessionId,
    userId: new Types.ObjectId(userId),
    languageSlug,
    flashcardIds: quizQuestions.map((q) => q.flashcardId),
    questionsData: quizQuestions,
    startedAt,
    expiresAt,
    timeLimitMinutes: QUIZ_TIME_LIMIT_MINUTES,
    isCompleted: false,
    totalQuestions: quizQuestions.length,
  });

  return {
    language: languageSlug,
    count: quizQuestions.length,
    questions: quizQuestions,
    sessionId,
    startedAt,
    expiresAt,
    timeLimitMinutes: QUIZ_TIME_LIMIT_MINUTES,
    timeRemainingSeconds: QUIZ_TIME_LIMIT_MINUTES * 60,
  };
};

// Validate quiz session and check if expired
export const validateQuizSession = async (
  sessionId: string,
  userId: string
): Promise<{ valid: boolean; message: string; expired?: boolean }> => {
  const session = await QuizSession.findOne({
    sessionId,
    userId: new Types.ObjectId(userId),
  });

  if (!session) {
    return { valid: false, message: 'Quiz session not found' };
  }

  if (session.isCompleted) {
    return { valid: false, message: 'Quiz session already completed' };
  }

  const now = new Date();
  if (now > session.expiresAt) {
    return { valid: false, message: 'Quiz session has expired. Time limit exceeded.', expired: true };
  }

  return { valid: true, message: 'Session valid' };
};

// Extended practice result with selected option
export interface IQuizSubmitResult {
  flashcardId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

// Mark quiz session as completed and store answers
export const completeQuizSession = async (
  sessionId: string,
  userId: string,
  results: IQuizSubmitResult[]
): Promise<void> => {
  const session = await QuizSession.findOne({
    sessionId,
    userId: new Types.ObjectId(userId),
  });

  if (!session) return;

  // Build answer records with correct option IDs from stored questions
  const answers: IQuizAnswerRecord[] = results.map((result) => {
    const question = session.questionsData.find(
      (q) => q.flashcardId === result.flashcardId
    );
    return {
      flashcardId: result.flashcardId,
      selectedOptionId: result.selectedOptionId,
      correctOptionId: question?.correctOptionId || '',
      isCorrect: result.isCorrect,
    };
  });

  const score = results.filter((r) => r.isCorrect).length;

  await QuizSession.findOneAndUpdate(
    { sessionId, userId: new Types.ObjectId(userId) },
    {
      isCompleted: true,
      completedAt: new Date(),
      answers,
      score,
    }
  );
};

// Get quiz results after completion
export const getQuizResults = async (
  sessionId: string,
  userId: string
): Promise<IQuizResultsResponse | null> => {
  const session = await QuizSession.findOne({
    sessionId,
    userId: new Types.ObjectId(userId),
  });

  if (!session) return null;
  if (!session.isCompleted) return null;

  // Build results with question details
  const questions = session.questionsData.map((question) => {
    const answer = session.answers?.find(
      (a) => a.flashcardId === question.flashcardId
    );

    // Find the text for selected and correct options
    const selectedOption = question.options.find(
      (o) => o.id === answer?.selectedOptionId
    );
    const correctOption = question.options.find(
      (o) => o.id === question.correctOptionId
    );

    return {
      flashcardId: question.flashcardId,
      keyword: question.keyword,
      yourAnswer: selectedOption?.text || 'Not answered',
      correctAnswer: correctOption?.text || '',
      isCorrect: answer?.isCorrect || false,
    };
  });

  const score = session.score || 0;
  const totalQuestions = session.totalQuestions || session.questionsData.length;
  const percentage = Math.round((score / totalQuestions) * 100);

  // Calculate time taken in seconds
  const timeTaken = session.completedAt
    ? Math.round((session.completedAt.getTime() - session.startedAt.getTime()) / 1000)
    : 0;

  return {
    sessionId: session.sessionId,
    language: session.languageSlug,
    score,
    totalQuestions,
    percentage,
    passed: percentage >= 70,
    completedAt: session.completedAt || new Date(),
    timeTaken,
    questions,
  };
};
