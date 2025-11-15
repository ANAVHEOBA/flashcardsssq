import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.route';
import languageRoutes from './modules/language/language.route';
import flashcardRoutes from './modules/flashcard/flashcard.route';
import progressRoutes from './modules/progress/progress.route';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { config } from './config/app.config';

const app: Application = express();

// Middleware
// Support multiple CORS origins (comma-separated in .env)
const allowedOrigins = config.corsOrigin.split(',').map(origin => origin.trim());
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Flashcards API - Programming Language Learning',
    version: '1.0.0',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
      },
      languages: {
        supported: 'GET /api/languages/supported',
        all: 'GET /api/languages',
        bySlug: 'GET /api/languages/:slug',
      },
      flashcards: {
        generate: 'POST /api/flashcards/generate/:slug',
        get: 'GET /api/flashcards/:slug',
      },
      progress: {
        practice: 'GET /api/progress/practice/:slug',
        submit: 'POST /api/progress/practice/:slug',
        languageProgress: 'GET /api/progress/language/:slug',
        summary: 'GET /api/progress/summary',
      },
    },
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/languages', languageRoutes);
app.use('/api/flashcards', flashcardRoutes);
app.use('/api/progress', progressRoutes);

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
