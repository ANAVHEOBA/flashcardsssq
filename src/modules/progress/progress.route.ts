import { Router } from 'express';
import {
  submitPracticeResults,
  getLanguageProgress,
  getProgressSummary,
  getPracticeFlashcards,
  getQuizForPractice,
  submitQuizResults,
} from './progress.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// All progress routes are protected - require authentication
router.post('/practice/:slug', protect, submitPracticeResults);
router.get('/language/:slug', protect, getLanguageProgress);
router.get('/summary', protect, getProgressSummary);
router.get('/practice/:slug', protect, getPracticeFlashcards);
router.get('/quiz/:slug', protect, getQuizForPractice);
router.post('/quiz/:slug', protect, submitQuizResults);

export default router;
