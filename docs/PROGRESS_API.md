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

### 2. Get Quiz Questions (Multiple Choice with Timer)

**Endpoint:** `GET /api/progress/quiz/:slug?limit=10`

**Description:** Get quiz questions in multiple-choice format with 5 options and a 10-minute timer

**Authentication:** Required (JWT Token)

**URL Parameters:**
- `slug` - Language identifier (python, javascript, java, etc.)

**Query Parameters:**
- `limit` (optional) - Number of questions to return (default: 10)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "language": "python",
  "count": 3,
  "questions": [
    {
      "flashcardId": "691847ce22fb596aaece17c4",
      "keyword": "False",
      "options": [
        {
          "id": "691847ce22fb596aaece17cf",
          "text": "Def defines a function or method, creating a callable object with a given name and parameters."
        },
        {
          "id": "691847ce22fb596aaece17e5",
          "text": "With manages resources through context managers, ensuring proper setup and cleanup."
        },
        {
          "id": "691847ce22fb596aaece17cb",
          "text": "Await pauses execution of an async function until the awaited coroutine completes."
        },
        {
          "id": "691847ce22fb596aaece17c6",
          "text": "True is a boolean value representing logical truth."
        },
        {
          "id": "691847ce22fb596aaece17c4",
          "text": "False is a boolean value representing the concept of 'not true'."
        }
      ],
      "correctOptionId": "691847ce22fb596aaece17c4"
    }
  ],
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "startedAt": "2025-01-15T10:30:00.000Z",
  "expiresAt": "2025-01-15T10:40:00.000Z",
  "timeLimitMinutes": 10,
  "timeRemainingSeconds": 600
}
```

**Field Descriptions:**
- `language` - Language identifier (slug)
- `count` - Number of questions returned (use for "Question 1 of X" display)
- `questions` - Array of quiz question objects
  - `flashcardId` - ID of the flashcard (use for submitting results)
  - `keyword` - The programming keyword being tested
  - `options` - Array of 5 answer choices (shuffled)
    - `id` - Option identifier
    - `text` - Answer text
  - `correctOptionId` - ID of the correct option (matches one option's `id`)
- `sessionId` - **Unique session ID (required for submission)**
- `startedAt` - When the quiz session started
- `expiresAt` - When the quiz session expires (10 minutes after start)
- `timeLimitMinutes` - Time limit in minutes (always 10)
- `timeRemainingSeconds` - Seconds remaining (600 at start)

**Timer Behavior:**
- Each quiz has a **fixed 10-minute time limit**
- Timer starts when quiz is fetched
- Submissions after `expiresAt` will be rejected
- Sessions auto-delete after 24 hours

**Error Response (401):**
```json
{
  "message": "Unauthorized"
}
```

**Error Response (500):**
```json
{
  "message": "Failed to get quiz questions",
  "error": "Language not found"
}
```

---

### 3. Submit Quiz Results (with Timer Validation)

**Endpoint:** `POST /api/progress/quiz/:slug`

**Description:** Submit quiz results with session validation (checks timer)

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
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "results": [
    {
      "flashcardId": "691847ce22fb596aaece17c4",
      "isCorrect": true
    },
    {
      "flashcardId": "691847ce22fb596aaece17c5",
      "isCorrect": false
    }
  ]
}
```

**Success Response (200):**
```json
{
  "message": "Quiz results recorded successfully"
}
```

**Error Response (400) - Missing Session:**
```json
{
  "message": "Session ID is required"
}
```

**Error Response (400) - Already Completed:**
```json
{
  "message": "Quiz session already completed",
  "expired": false
}
```

**Error Response (408) - Time Expired:**
```json
{
  "message": "Quiz session has expired. Time limit exceeded.",
  "expired": true
}
```

**Important Notes:**
- `sessionId` is **required** - obtained from GET /api/progress/quiz/:slug
- Must submit within 10 minutes of starting the quiz
- Each session can only be submitted once
- Use HTTP status 408 to detect timeout on frontend
- Include `selectedOptionId` in results for review feature

**Updated Request Body (for quiz results review):**
```json
{
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "results": [
    {
      "flashcardId": "691847ce22fb596aaece17c4",
      "selectedOptionId": "691847ce22fb596aaece17c4",
      "isCorrect": true
    },
    {
      "flashcardId": "691847ce22fb596aaece17c5",
      "selectedOptionId": "691847ce22fb596aaece17cf",
      "isCorrect": false
    }
  ]
}
```

---

### 4. Get Quiz Results (Review)

**Endpoint:** `GET /api/progress/quiz/:sessionId/results`

**Description:** Get detailed quiz results after completion - shows all questions with your answer vs correct answer

**Authentication:** Required (JWT Token)

**URL Parameters:**
- `sessionId` - The quiz session ID (obtained when starting the quiz)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "language": "python",
  "score": 7,
  "totalQuestions": 10,
  "percentage": 70,
  "passed": true,
  "completedAt": "2025-01-15T10:38:45.000Z",
  "timeTaken": 525,
  "questions": [
    {
      "flashcardId": "691847ce22fb596aaece17c4",
      "keyword": "False",
      "yourAnswer": "False is a boolean value representing the concept of 'not true'.",
      "correctAnswer": "False is a boolean value representing the concept of 'not true'.",
      "isCorrect": true
    },
    {
      "flashcardId": "691847ce22fb596aaece17c5",
      "keyword": "None",
      "yourAnswer": "Def defines a function or method...",
      "correctAnswer": "None represents the absence of a value or a null value.",
      "isCorrect": false
    }
  ]
}
```

**Field Descriptions:**
- `sessionId` - The quiz session ID
- `language` - Language slug
- `score` - Number of correct answers
- `totalQuestions` - Total number of questions
- `percentage` - Score as percentage (0-100)
- `passed` - Whether user passed (≥70%)
- `completedAt` - When the quiz was submitted
- `timeTaken` - Time taken in seconds
- `questions` - Array of all questions with results
  - `keyword` - The programming keyword
  - `yourAnswer` - The answer text you selected
  - `correctAnswer` - The correct answer text
  - `isCorrect` - Whether your answer was correct

**Error Response (404):**
```json
{
  "message": "Quiz results not found or quiz not completed"
}
```

---

### 5. Submit Practice Results (No Timer)

**Endpoint:** `POST /api/progress/practice/:slug`

**Description:** Submit practice session results to track progress (no timer validation)

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

### 6. Get Language Progress

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

### 7. Get Overall Progress Summary

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

### Get Quiz Questions (with Timer)
```bash
curl -X GET "http://localhost:5000/api/progress/quiz/python?limit=5" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Submit Quiz Results (with Session ID)
```bash
curl -X POST "http://localhost:5000/api/progress/quiz/python" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "results": [
      {"flashcardId": "691847ce22fb596aaece17c4", "selectedOptionId": "691847ce22fb596aaece17c4", "isCorrect": true},
      {"flashcardId": "691847ce22fb596aaece17c5", "selectedOptionId": "691847ce22fb596aaece17cf", "isCorrect": false}
    ]
  }'
```

### Get Quiz Results (Review)
```bash
curl -X GET "http://localhost:5000/api/progress/quiz/a1b2c3d4-e5f6-7890-abcd-ef1234567890/results" \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Submit Practice Results (No Timer)
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

## Quiz Session Workflow (Multiple Choice with Timer)

### Recommended Flow

1. **Get Quiz Questions (Timer Starts)**
   ```
   GET /api/progress/quiz/python?limit=10
   ```
   Response includes `sessionId`, `expiresAt`, and `timeRemainingSeconds`

2. **Start Countdown Timer**
   - Display timer using `timeRemainingSeconds` (600 seconds = 10 min)
   - Show: "Time Remaining: 9:59"

3. **Display Questions**
   - Show the keyword: "What does `False` mean?"
   - Display 5 shuffled options (A, B, C, D, E)
   - Show: "Question 1 of 10"

4. **User Selects Answers**
   - Compare selected option's `id` with `correctOptionId`
   - Mark as correct if they match

5. **Submit Results (Before Timer Expires)**
   ```
   POST /api/progress/quiz/python
   Body: { sessionId, results: [{ flashcardId, isCorrect }, ...] }
   ```

### Example Quiz Flow
```javascript
// Frontend example
const quiz = await fetch('/api/progress/quiz/python?limit=5', {
  headers: { 'Authorization': 'Bearer ' + token }
});
const { questions, count, sessionId, expiresAt, timeRemainingSeconds } = await quiz.json();

// Start countdown timer
let secondsLeft = timeRemainingSeconds; // 600
const timer = setInterval(() => {
  secondsLeft--;
  displayTimer(secondsLeft); // "9:59", "9:58", ...

  if (secondsLeft <= 0) {
    clearInterval(timer);
    autoSubmit(); // Force submit when time runs out
  }
}, 1000);

// User answers questions...
const results = questions.map(q => ({
  flashcardId: q.flashcardId,
  isCorrect: userAnswers[q.flashcardId] === q.correctOptionId
}));

// Submit before timer expires
const response = await fetch('/api/progress/quiz/python', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ sessionId, results })
});

if (response.status === 408) {
  // Timer expired!
  showMessage("Time's up! Your quiz was not submitted.");
}
```

### Timer Error Handling
```javascript
// Check for timeout error
if (response.status === 408) {
  const data = await response.json();
  // data.expired === true
  // data.message === "Quiz session has expired. Time limit exceeded."
}
```

---

## Practice Session Workflow (Free Response)

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
