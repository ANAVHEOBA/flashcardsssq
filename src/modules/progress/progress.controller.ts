import { Response } from 'express';
import { AuthRequest } from '../../services/jwt.service';
import {
  recordPracticeSession,
  getUserProgressByLanguage,
  getUserProgressSummary,
  getFlashcardsForPractice,
  getQuizQuestions,
  validateQuizSession,
  completeQuizSession,
  getQuizResults,
} from './progress.crud';

// Submit practice results
export const submitPracticeResults = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { results } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!results || !Array.isArray(results)) {
      res.status(400).json({ message: 'Results array is required' });
      return;
    }

    await recordPracticeSession(req.user.id, slug, results);

    res.status(200).json({
      message: 'Practice results recorded successfully',
    });
  } catch (error) {
    console.error('Error submitting practice results:', error);
    res.status(500).json({
      message: 'Failed to submit practice results',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get progress for a specific language
export const getLanguageProgress = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const progress = await getUserProgressByLanguage(req.user.id, slug);

    res.status(200).json(progress);
  } catch (error) {
    console.error('Error getting language progress:', error);
    res.status(500).json({
      message: 'Failed to get language progress',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get overall progress summary
export const getProgressSummary = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const summary = await getUserProgressSummary(req.user.id);

    res.status(200).json(summary);
  } catch (error) {
    console.error('Error getting progress summary:', error);
    res.status(500).json({
      message: 'Failed to get progress summary',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get flashcards for practice session
export const getPracticeFlashcards = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const flashcards = await getFlashcardsForPractice(req.user.id, slug, limit);

    res.status(200).json({
      language: slug,
      count: flashcards.length,
      flashcards,
    });
  } catch (error) {
    console.error('Error getting practice flashcards:', error);
    res.status(500).json({
      message: 'Failed to get practice flashcards',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get quiz questions for practice (multiple choice format with timer)
export const getQuizForPractice = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const quizResponse = await getQuizQuestions(req.user.id, slug, limit);

    res.status(200).json(quizResponse);
  } catch (error) {
    console.error('Error getting quiz questions:', error);
    res.status(500).json({
      message: 'Failed to get quiz questions',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Submit quiz results with session validation
export const submitQuizResults = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { slug } = req.params;
    const { sessionId, results } = req.body;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!sessionId) {
      res.status(400).json({ message: 'Session ID is required' });
      return;
    }

    if (!results || !Array.isArray(results)) {
      res.status(400).json({ message: 'Results array is required' });
      return;
    }

    // Validate session and check timer
    const validation = await validateQuizSession(sessionId, req.user.id);
    if (!validation.valid) {
      res.status(validation.expired ? 408 : 400).json({
        message: validation.message,
        expired: validation.expired || false,
      });
      return;
    }

    // Convert results to include isCorrect for practice session recording
    const practiceResults = results.map((r: { flashcardId: string; selectedOptionId: string; isCorrect: boolean }) => ({
      flashcardId: r.flashcardId,
      isCorrect: r.isCorrect,
    }));

    // Record the results for progress tracking
    await recordPracticeSession(req.user.id, slug, practiceResults);

    // Mark session as completed and store detailed answers
    await completeQuizSession(sessionId, req.user.id, results);

    res.status(200).json({
      message: 'Quiz results recorded successfully',
      sessionId,
    });
  } catch (error) {
    console.error('Error submitting quiz results:', error);
    res.status(500).json({
      message: 'Failed to submit quiz results',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Get quiz results after completion
export const getQuizResultsController = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { sessionId } = req.params;

    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const results = await getQuizResults(sessionId, req.user.id);

    if (!results) {
      res.status(404).json({ message: 'Quiz results not found or quiz not completed' });
      return;
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error getting quiz results:', error);
    res.status(500).json({
      message: 'Failed to get quiz results',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
