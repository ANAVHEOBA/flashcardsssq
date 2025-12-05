import { Router } from 'express';
import { generateFlashcards, getFlashcards, generateDistractors } from './flashcard.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// Flashcard routes
router.post('/generate/:slug', generateFlashcards); // Public - for generation
router.post('/generate-distractors/:slug', generateDistractors); // Generate distractors for existing flashcards
router.get('/:slug', protect, getFlashcards); // Protected - requires auth to view

export default router;
