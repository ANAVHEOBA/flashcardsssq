import { Router } from 'express';
import {
  getLanguages,
  getLanguage,
  getSupportedLanguagesController,
} from './language.controller';
import { protect } from '../../middleware/auth.middleware';

const router = Router();

// Language routes (protected)
router.get('/supported', protect, getSupportedLanguagesController);
router.get('/', protect, getLanguages);
router.get('/:slug', protect, getLanguage);

export default router;
