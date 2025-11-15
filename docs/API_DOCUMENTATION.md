# Flashcards API - Complete Documentation

## Overview

A comprehensive REST API for learning programming language keywords through AI-generated flashcards with progress tracking and mastery levels.

**Base URL:** `http://localhost:5000`

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [API Modules](#api-modules)
4. [Response Format](#response-format)
5. [Error Handling](#error-handling)
6. [Rate Limits](#rate-limits)

---

## Quick Start

### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

### 3. Get Languages
```bash
curl -X GET http://localhost:5000/api/languages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Get Flashcards
```bash
curl -X GET http://localhost:5000/api/flashcards/python \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Practice Session
```bash
# Get practice flashcards
curl -X GET "http://localhost:5000/api/progress/practice/python?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Submit results
curl -X POST "http://localhost:5000/api/progress/practice/python" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "results": [
      {"flashcardId": "abc123", "isCorrect": true},
      {"flashcardId": "def456", "isCorrect": false}
    ]
  }'
```

---

## Authentication

### Token-Based Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Lifecycle
- **Expiration:** 7 days
- **Algorithm:** HS256
- **Payload:** `{ id: "userId", iat: timestamp, exp: timestamp }`

### Public Endpoints (No Auth Required)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/flashcards/generate/:slug`

### Protected Endpoints (Auth Required)
- All `/api/languages/*` routes
- `GET /api/flashcards/:slug`
- All `/api/progress/*` routes

---

## API Modules

### 1. Authentication Module
Handles user registration and login with JWT tokens.

**Documentation:** [AUTH_API.md](./AUTH_API.md)

**Endpoints:**
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Authenticate and get token

---

### 2. Language Module
Provides information about supported programming languages.

**Documentation:** [LANGUAGE_API.md](./LANGUAGE_API.md)

**Endpoints:**
- `GET /api/languages/supported` - Get supported languages list
- `GET /api/languages` - Get all languages with generation status
- `GET /api/languages/:slug` - Get specific language details

**Supported Languages:**
| Language   | Slug       | Keywords |
|------------|------------|----------|
| Python     | python     | 35       |
| JavaScript | javascript | 52       |
| Java       | java       | 50       |
| TypeScript | typescript | 72       |
| C++        | cpp        | 92       |
| Go         | go         | 25       |
| Rust       | rust       | 54       |
| C          | c          | 57       |
| Kotlin     | kotlin     | 75       |

**Total:** 9 languages, 517 keywords

---

### 3. Flashcard Module
Manages AI-powered flashcard generation and retrieval.

**Documentation:** [FLASHCARD_API.md](./FLASHCARD_API.md)

**Endpoints:**
- `POST /api/flashcards/generate/:slug` (Public) - Generate flashcards using AI
- `GET /api/flashcards/:slug` (Protected) - Get all flashcards for a language

**Flashcard Structure:**
```json
{
  "_id": "unique-id",
  "keyword": "False",
  "question": "What does the False keyword represent in Python?",
  "answer": "False is a boolean value...",
  "codeExample": "is_valid = False\nif not is_valid:\n    print('Invalid')"
}
```

**AI Provider:** OpenRouter (KAT-Coder-Pro free model)

---

### 4. Progress & Practice Module
Tracks learning progress with mastery levels and smart practice sessions.

**Documentation:** [PROGRESS_API.md](./PROGRESS_API.md)

**Endpoints:**
- `GET /api/progress/practice/:slug?limit=10` - Get flashcards for practice
- `POST /api/progress/practice/:slug` - Submit practice results
- `GET /api/progress/language/:slug` - Get language-specific progress
- `GET /api/progress/summary` - Get overall progress summary

**Mastery Levels:**
- **Beginner:** < 3 attempts
- **Intermediate:** ≥50% accuracy with ≥3 attempts
- **Advanced:** ≥75% accuracy with ≥5 attempts
- **Mastered:** ≥90% accuracy with ≥10 attempts

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development mode)"
}
```

### HTTP Status Codes

| Code | Meaning               | Usage                                    |
|------|-----------------------|------------------------------------------|
| 200  | OK                    | Successful GET, PUT, DELETE              |
| 201  | Created               | Successful POST creating new resource    |
| 400  | Bad Request           | Invalid request data                     |
| 401  | Unauthorized          | Missing or invalid token                 |
| 404  | Not Found             | Resource doesn't exist                   |
| 500  | Internal Server Error | Server-side error                        |

---

## Error Handling

### Authentication Errors

**Missing Token:**
```json
{
  "message": "No token provided"
}
```

**Invalid Token:**
```json
{
  "message": "Invalid token"
}
```

**Expired Token:**
```json
{
  "message": "Token expired"
}
```

### Validation Errors

**Email Already Exists:**
```json
{
  "success": false,
  "message": "User already exists"
}
```

**Invalid Credentials:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

**Resource Not Found:**
```json
{
  "success": false,
  "message": "Language not found"
}
```

---

## Rate Limits

Currently **no rate limiting** is implemented. In production, consider:

- Authentication endpoints: 5 requests per minute
- Flashcard generation: 1 request per 5 minutes per language
- Other endpoints: 100 requests per minute

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, lowercase),
  password: String (bcrypt hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Languages Collection
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String (unique),
  totalKeywords: Number,
  isGenerated: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Flashcards Collection
```javascript
{
  _id: ObjectId,
  languageId: ObjectId (ref: Language),
  keyword: String,
  question: String,
  answer: String,
  codeExample: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Progress Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  flashcardId: ObjectId (ref: Flashcard),
  languageId: ObjectId (ref: Language),
  correct: Number,
  incorrect: Number,
  lastPracticed: Date,
  masteryLevel: Enum ['beginner', 'intermediate', 'advanced', 'mastered'],
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `progress.userId + progress.flashcardId` (unique compound)
- `progress.userId + progress.languageId`
- `languages.slug` (unique)
- `users.email` (unique)

---

## Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# AI Service
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=kwaipilot/kat-coder-pro:free
```

---

## Development Setup

### Prerequisites
- Node.js 16+
- MongoDB Atlas account or local MongoDB
- OpenRouter API key

### Installation
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Build TypeScript
npm run build

# Start development server
npm run dev
```

### Project Structure
```
flashcardsssq/
├── src/
│   ├── config/
│   │   └── app.config.ts
│   ├── middleware/
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── modules/
│   │   ├── auth/
│   │   ├── language/
│   │   ├── flashcard/
│   │   └── progress/
│   ├── services/
│   │   ├── jwt.service.ts
│   │   └── ai.service.ts
│   ├── data/
│   │   └── keywords.ts
│   ├── app.ts
│   └── index.ts
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── AUTH_API.md
│   ├── LANGUAGE_API.md
│   ├── FLASHCARD_API.md
│   └── PROGRESS_API.md
└── package.json
```

---

## Testing with cURL

See individual module documentation for detailed examples:
- [Authentication Examples](./AUTH_API.md#curl-examples)
- [Language Examples](./LANGUAGE_API.md#curl-examples)
- [Flashcard Examples](./FLASHCARD_API.md#curl-examples)
- [Progress Examples](./PROGRESS_API.md#curl-examples)

---

## Common Use Cases

### Use Case 1: New User Learning Python
```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register -H "Content-Type: application/json" -d '{"name":"Alice","email":"alice@test.com","password":"pass123"}'

# 2. Login (get token)
curl -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"alice@test.com","password":"pass123"}'

# 3. Check if Python flashcards exist
curl -X GET http://localhost:5000/api/languages/python -H "Authorization: Bearer TOKEN"

# 4. Get practice flashcards
curl -X GET "http://localhost:5000/api/progress/practice/python?limit=10" -H "Authorization: Bearer TOKEN"

# 5. Submit practice results
curl -X POST http://localhost:5000/api/progress/practice/python -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d '{"results":[...]}'

# 6. Check progress
curl -X GET http://localhost:5000/api/progress/language/python -H "Authorization: Bearer TOKEN"
```

### Use Case 2: Generate Flashcards for New Language
```bash
# Anyone can trigger generation (no auth needed)
curl -X POST http://localhost:5000/api/flashcards/generate/rust

# Wait for completion (~90 seconds for large languages)
# Check generation status
curl -X GET http://localhost:5000/api/languages/rust -H "Authorization: Bearer TOKEN"
```

### Use Case 3: Track Overall Progress
```bash
# Get summary across all languages
curl -X GET http://localhost:5000/api/progress/summary -H "Authorization: Bearer TOKEN"

# Returns stats for all 9 languages with mastery counts
```

---

## Support

For issues or questions:
- Check individual module documentation
- Review error messages carefully
- Ensure JWT token is valid and not expired
- Verify language slug is lowercase and correct

---

## Version History

**v1.0.0** - Initial Release
- User authentication with JWT
- 9 programming languages supported
- 517 AI-generated flashcards
- Progress tracking with mastery levels
- Smart practice session prioritization
