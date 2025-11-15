# Flashcard API Documentation

Base URL: `http://localhost:5000/api/flashcards`

## Overview
The Flashcard module handles AI-powered flashcard generation and retrieval for programming language keywords.

---

## Endpoints

### 1. Generate Flashcards

**Endpoint:** `POST /api/flashcards/generate/:slug`

**Description:** Generate flashcards for all keywords in a programming language using AI

**Authentication:** None (Public)

**URL Parameters:**
- `slug` - Language identifier (python, javascript, java, typescript, cpp, go, rust, c, kotlin)

**Request Headers:**
```
Content-Type: application/json
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Flashcards generated successfully",
  "data": {
    "language": "Python",
    "totalGenerated": 35,
    "flashcards": [
      {
        "keyword": "False",
        "question": "What does the False keyword represent in Python?",
        "answer": "False is a boolean value representing the concept of 'not true'. It is one of the two possible values of the bool type, used in logical operations and conditionals.",
        "codeExample": "is_valid = False\nif not is_valid:\n    print('Invalid input')"
      },
      {
        "keyword": "None",
        "question": "What does the None keyword represent in Python?",
        "answer": "None represents the absence of a value or a null value. It is the only value of the NoneType and is often used as a default return value for functions.",
        "codeExample": "def get_user(id):\n    if id not in database:\n        return None\n    return database[id]"
      }
      // ... 33 more flashcards
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Language not found"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Flashcards already generated for this language"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Failed to generate flashcards",
  "error": "AI service error details"
}
```

---

### 2. Get Flashcards

**Endpoint:** `GET /api/flashcards/:slug`

**Description:** Retrieve all flashcards for a specific programming language

**Authentication:** Required (JWT Token)

**URL Parameters:**
- `slug` - Language identifier (python, javascript, java, typescript, cpp, go, rust, c, kotlin)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "language": "Python",
    "totalFlashcards": 35,
    "flashcards": [
      {
        "_id": "691847ce22fb596aaece17c4",
        "languageId": "691846557aab46246b7d87cc",
        "keyword": "False",
        "question": "What does the False keyword represent in Python?",
        "answer": "False is a boolean value representing the concept of 'not true'. It is one of the two possible values of the bool type, used in logical operations and conditionals.",
        "codeExample": "is_valid = False\nif not is_valid:\n    print('Invalid input')",
        "createdAt": "2025-11-15T09:28:46.667Z",
        "updatedAt": "2025-11-15T09:28:46.667Z",
        "__v": 0
      },
      {
        "_id": "691847ce22fb596aaece17c5",
        "languageId": "691846557aab46246b7d87cc",
        "keyword": "None",
        "question": "What does the None keyword represent in Python?",
        "answer": "None represents the absence of a value or a null value. It is the only value of the NoneType and is often used as a default return value for functions.",
        "codeExample": "def get_user(id):\n    if id not in database:\n        return None\n    return database[id]",
        "createdAt": "2025-11-15T09:28:46.668Z",
        "updatedAt": "2025-11-15T09:28:46.668Z",
        "__v": 0
      },
      {
        "_id": "691847ce22fb596aaece17c6",
        "languageId": "691846557aab46246b7d87cc",
        "keyword": "True",
        "question": "What does the True keyword represent in Python?",
        "answer": "True is a boolean value representing logical truth. It is one of the two possible values of the bool type and evaluates to 1 in numeric contexts.",
        "codeExample": "is_admin = True\nif is_admin:\n    print('Access granted')",
        "createdAt": "2025-11-15T09:28:46.668Z",
        "updatedAt": "2025-11-15T09:28:46.668Z",
        "__v": 0
      }
      // ... 32 more flashcards
    ]
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Language not found"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "No flashcards found for this language"
}
```

---

## Flashcard Structure

Each flashcard contains:

| Field       | Type   | Description                                    |
|-------------|--------|------------------------------------------------|
| _id         | string | Unique identifier                              |
| languageId  | string | Reference to language document                 |
| keyword     | string | The programming keyword                        |
| question    | string | Question about the keyword                     |
| answer      | string | Detailed explanation                           |
| codeExample | string | Working code demonstrating the keyword         |
| createdAt   | date   | Creation timestamp                             |
| updatedAt   | date   | Last update timestamp                          |

---

## Generation Details

### AI Model
- **Provider:** OpenRouter
- **Model:** KAT-Coder-Pro (free tier)
- **Temperature:** 0.7
- **Max Tokens:** 16,000

### Generation Process
1. Fetches all keywords for the specified language
2. Sends batch request to AI with structured prompt
3. AI generates question, answer, and code example for each keyword
4. Validates and stores flashcards in MongoDB
5. Updates language generation status

### Generation Time
- Small languages (Go: 25 keywords): ~30-45 seconds
- Medium languages (Python: 35 keywords): ~45-60 seconds
- Large languages (C++: 92 keywords): ~90-120 seconds

---

## cURL Examples

### Generate Flashcards (Public)
```bash
curl -X POST http://localhost:5000/api/flashcards/generate/python \
  -H "Content-Type: application/json"
```

### Get Flashcards (Protected)
```bash
curl -X GET http://localhost:5000/api/flashcards/python \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## Example Flashcards by Language

### Python Example
```json
{
  "keyword": "lambda",
  "question": "What is the purpose of the 'lambda' keyword in Python?",
  "answer": "The 'lambda' keyword creates anonymous (unnamed) functions. These are small, one-line functions often used with map(), filter(), and sorted().",
  "codeExample": "square = lambda x: x ** 2\nprint(square(5))  # Output: 25"
}
```

### JavaScript Example
```json
{
  "keyword": "const",
  "question": "What does the const keyword do in JavaScript?",
  "answer": "The const keyword declares a block-scoped variable that cannot be reassigned. The value it holds can be mutable (objects/arrays), but the binding is immutable.",
  "codeExample": "const PI = 3.14159;\nconst user = { name: 'John' };\nuser.name = 'Jane';  // OK\n// PI = 3.14;  // Error"
}
```

### Rust Example
```json
{
  "keyword": "mut",
  "question": "What does the 'mut' keyword do in Rust?",
  "answer": "The 'mut' keyword makes a variable mutable, allowing its value to be changed after initialization. By default, all variables in Rust are immutable.",
  "codeExample": "let mut count = 0;\ncount += 1;  // OK\nlet x = 5;\n// x += 1;  // Error: cannot mutate immutable variable"
}
```

---

## Notes
- **Generation is public** - Anyone can trigger flashcard generation
- **Retrieval is protected** - Requires authentication to view flashcards
- Flashcards are generated once per language
- Re-generation will fail if flashcards already exist
- All keywords are sourced from official language documentation
- Code examples are tested and working
