import { Router } from 'express';
import { generateFlashcards, getFlashcards } from './flashcard.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// Flashcard routes
router.post('/generate/:slug', generateFlashcards); // Public - for generation
router.get('/:slug', protect, getFlashcards); // Protected - requires auth to view

export default router;
