# Progress & Practice API Documentation

Base URL: `http://localhost:5000/api/progress`

## Overview
The Progress module tracks user learning progress, manages practice sessions, and calculates mastery levels for programming language keywords.

---

## Endpoints

### 1. Get Practice Flashcards

**Endpoint:** `GET /api/progress/practice/:slug?limit=10`

**Description:** Get flashcards for practice session (prioritizes unpracticed and non-mastered cards)

**Authentication:** Required (JWT Token)

**URL Parameters:**
- `slug` - Language identifier (python, javascript, java, etc.)

**Query Parameters:**
- `limit` (optional) - Number of flashcards to return (default: 10, max: 100)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "language": "python",
  "count": 5,
  "flashcards": [
    {
      "_id": "691847ce22fb596aaece17c4",
      "languageId": "691846557aab46246b7d87cc",
      "keyword": "False",
      "question": "What does the False keyword represent in Python?",
      "answer": "False is a boolean value representing the concept of 'not true'. It is one of the two possible values of the bool type, used in logical operations and conditionals.",
      "codeExample": "is_valid = False\nif not is_valid:\n    print('Invalid input')",
      "createdAt": "2025-11-15T09:28:46.667Z",
      "updatedAt": "2025-11-15T09:28:46.667Z"
    },
    {
      "_id": "691847ce22fb596aaece17c5",
      "languageId": "691846557aab46246b7d87cc",
      "keyword": "None",
      "question": "What does the None keyword represent in Python?",
      "answer": "None represents the absence of a value or a null value. It is the only value of the NoneType and is often used as a default return value for functions.",
      "codeExample": "def get_user(id):\n    if id not in database:\n        return None\n    return database[id]",
      "createdAt": "2025-11-15T09:28:46.668Z",
      "updatedAt": "2025-11-15T09:28:46.668Z"
    }
    // ... more flashcards
  ]
}
```

**Error Response (404):**
```json
{
  "message": "Language not found"
}
```

---

### 2. Submit Practice Results

**Endpoint:** `POST /api/progress/practice/:slug`

**Description:** Submit practice session results to track progress

**Authentication:** Required (JWT Token)

**URL Parameters:**
- `slug` - Language identifier (python, javascript, java, etc.)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "results": [
    {
      "flashcardId": "691847ce22fb596aaece17c4",
      "isCorrect": true
    },
    {
      "flashcardId": "691847ce22fb596aaece17c5",
      "isCorrect": true
    },
    {
      "flashcardId": "691847ce22fb596aaece17c6",
      "isCorrect": false
    },
    {
      "flashcardId": "691847ce22fb596aaece17c7",
      "isCorrect": true
    },
    {
      "flashcardId": "691847ce22fb596aaece17c8",
      "isCorrect": true
    }
  ]
}
```

**Success Response (200):**
```json
{
  "message": "Practice results recorded successfully"
}
```

**Error Response (400):**
```json
{
  "message": "Results array is required"
}
```

**Error Response (401):**
```json
{
  "message": "Unauthorized"
}
```

---

### 3. Get Language Progress

**Endpoint:** `GET /api/progress/language/:slug`

**Description:** Get detailed progress statistics for a specific language

**Authentication:** Required (JWT Token)

**URL Parameters:**
- `slug` - Language identifier (python, javascript, java, etc.)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "language": "Python",
  "slug": "python",
  "totalFlashcards": 35,
  "practiced": 5,
  "correct": 9,
  "incorrect": 1,
  "mastered": 2,
  "averageAccuracy": 90
}
```

**Field Descriptions:**
- `language` - Language display name
- `slug` - Language identifier
- `totalFlashcards` - Total number of flashcards available
- `practiced` - Number of unique flashcards practiced at least once
- `correct` - Total correct answers across all practice sessions
- `incorrect` - Total incorrect answers across all practice sessions
- `mastered` - Number of flashcards that reached mastery level
- `averageAccuracy` - Overall accuracy percentage (0-100)

**Error Response (404):**
```json
{
  "message": "Language not found"
}
```

---

### 4. Get Overall Progress Summary

**Endpoint:** `GET /api/progress/summary`

**Description:** Get comprehensive progress summary across all languages

**Authentication:** Required (JWT Token)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "totalLanguages": 9,
  "languagesInProgress": 3,
  "totalFlashcardsPracticed": 87,
  "overallAccuracy": 85.5,
  "languageStats": [
    {
      "language": "Python",
      "slug": "python",
      "totalFlashcards": 35,
      "practiced": 25,
      "correct": 45,
      "incorrect": 5,
      "mastered": 12,
      "averageAccuracy": 90
    },
    {
      "language": "Javascript",
      "slug": "javascript",
      "totalFlashcards": 52,
      "practiced": 42,
      "correct": 78,
      "incorrect": 18,
      "mastered": 15,
      "averageAccuracy": 81.25
    },
    {
      "language": "Java",
      "slug": "java",
      "totalFlashcards": 50,
      "practiced": 20,
      "correct": 35,
      "incorrect": 5,
      "mastered": 8,
      "averageAccuracy": 87.5
    },
    {
      "language": "Typescript",
      "slug": "typescript",
      "totalFlashcards": 72,
      "practiced": 0,
      "correct": 0,
      "incorrect": 0,
      "mastered": 0,
      "averageAccuracy": 0
    },
    {
      "language": "Rust",
      "slug": "rust",
      "totalFlashcards": 54,
      "practiced": 0,
      "correct": 0,
      "incorrect": 0,
      "mastered": 0,
      "averageAccuracy": 0
    },
    {
      "language": "Go",
      "slug": "go",
      "totalFlashcards": 25,
      "practiced": 0,
      "correct": 0,
      "incorrect": 0,
      "mastered": 0,
      "averageAccuracy": 0
    },
    {
      "language": "Cpp",
      "slug": "cpp",
      "totalFlashcards": 92,
      "practiced": 0,
      "correct": 0,
      "incorrect": 0,
      "mastered": 0,
      "averageAccuracy": 0
    },
    {
      "language": "C",
      "slug": "c",
      "totalFlashcards": 57,
      "practiced": 0,
      "correct": 0,
      "incorrect": 0,
      "mastered": 0,
      "averageAccuracy": 0
    },
    {
      "language": "Kotlin",
      "slug": "kotlin",
      "totalFlashcards": 75,
      "practiced": 0,
      "correct": 0,
      "incorrect": 0,
      "mastered": 0,
      "averageAccuracy": 0
    }
  ]
}
```

**Field Descriptions:**
- `totalLanguages` - Total supported languages
- `languagesInProgress` - Languages with at least 1 practiced flashcard
- `totalFlashcardsPracticed` - Sum of unique flashcards practiced across all languages
- `overallAccuracy` - Global accuracy percentage across all languages
- `languageStats` - Array of progress stats for each language

---

## Mastery Level System

Progress records track mastery levels based on performance:

| Level        | Requirements                                    | Description                    |
|--------------|------------------------------------------------|--------------------------------|
| Beginner     | < 3 total attempts                             | Just started learning          |
| Intermediate | ≥50% accuracy with ≥3 attempts                  | Getting familiar               |
| Advanced     | ≥75% accuracy with ≥5 attempts                  | Strong understanding           |
| Mastered     | ≥90% accuracy with ≥10 attempts                 | Complete mastery achieved      |

### Mastery Calculation
- Automatically calculated after each practice session
- Based on cumulative correct/incorrect ratio
- Requires minimum practice attempts for higher levels
- Individual per flashcard

---

## Practice Prioritization

The practice endpoint intelligently selects flashcards:

**Priority Order:**
1. **Never practiced** (Priority 0) - Flashcards user hasn't seen
2. **Not mastered** (Priority 1) - Flashcards below mastery level, sorted by oldest practice date
3. **Mastered** (Priority 3) - Already mastered flashcards (lowest priority)

This ensures users focus on learning new keywords and reinforcing weak areas.

---

## cURL Examples

### Get Practice Flashcards
```bash
curl -X GET "http://localhost:5000/api/progress/practice/python?limit=10" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Submit Practice Results
```bash
curl -X POST "http://localhost:5000/api/progress/practice/python" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "results": [
      {"flashcardId": "691847ce22fb596aaece17c4", "isCorrect": true},
      {"flashcardId": "691847ce22fb596aaece17c5", "isCorrect": false},
      {"flashcardId": "691847ce22fb596aaece17c6", "isCorrect": true}
    ]
  }'
```

### Get Language Progress
```bash
curl -X GET "http://localhost:5000/api/progress/language/python" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Overall Summary
```bash
curl -X GET "http://localhost:5000/api/progress/summary" \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## Practice Session Workflow

### Recommended Flow

1. **Get Practice Flashcards**
   ```
   GET /api/progress/practice/python?limit=10
   ```

2. **User Practices**
   - Show question to user
   - User types answer
   - Compare with correct answer
   - Mark as correct/incorrect

3. **Submit Results**
   ```
   POST /api/progress/practice/python
   Body: { results: [...] }
   ```

4. **View Progress**
   ```
   GET /api/progress/language/python
   GET /api/progress/summary
   ```

### Example Practice Session
```json
// Step 1: Get flashcards
// Response includes 10 flashcards

// Step 2: User practices (frontend logic)
// User sees: "What does the False keyword represent in Python?"
// User types: "Boolean value for false"
// Show correct answer and code example

// Step 3: Submit all results after session
{
  "results": [
    {"flashcardId": "abc123", "isCorrect": true},
    {"flashcardId": "def456", "isCorrect": false},
    // ... 8 more
  ]
}

// Step 4: Updated progress automatically calculated
// Mastery levels updated based on new attempts
```

---

## Progress Tracking Features

### Per-User Tracking
- Each user has separate progress records
- Progress isolated by userId
- Multiple users can practice simultaneously

### Per-Flashcard Tracking
- Individual progress for each flashcard
- Tracks correct/incorrect counts
- Last practiced timestamp
- Dynamic mastery level

### Cumulative Statistics
- Running totals of correct/incorrect
- Accuracy percentage auto-calculated
- Never decreases mastered count (once mastered, stays mastered unless accuracy drops)

---

## Notes
- All endpoints require authentication
- Progress is tracked per user per flashcard
- Results can be submitted in batches (entire practice session)
- Mastery levels update automatically after each submission
- Practice flashcards intelligently prioritize learning needs
- Progress persists across sessions
- Statistics are calculated in real-time
