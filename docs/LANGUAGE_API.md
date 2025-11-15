# Language API Documentation

Base URL: `http://localhost:5000/api/languages`

## Overview
The Language module provides information about supported programming languages and their flashcard generation status.

---

## Endpoints

### 1. Get Supported Languages

**Endpoint:** `GET /api/languages/supported`

**Description:** Get list of all supported programming languages from the system

**Authentication:** Required (JWT Token)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "languages": [
      {
        "name": "Python",
        "slug": "python",
        "keywords": [
          "False", "None", "True", "and", "as", "assert", "async", "await",
          "break", "class", "continue", "def", "del", "elif", "else", "except",
          "finally", "for", "from", "global", "if", "import", "in", "is",
          "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try",
          "while", "with", "yield"
        ]
      },
      {
        "name": "JavaScript",
        "slug": "javascript",
        "keywords": [
          "break", "case", "catch", "class", "const", "continue", "debugger", "default",
          "delete", "do", "else", "export", "extends", "false", "finally", "for",
          "function", "if", "import", "in", "instanceof", "new", "null", "return",
          "super", "switch", "this", "throw", "true", "try", "typeof", "var",
          "void", "while", "with", "let", "static", "yield", "await", "enum",
          "implements", "interface", "package", "private", "protected", "public",
          "as", "async", "from", "get", "of", "set"
        ]
      }
      // ... 7 more languages
    ]
  }
}
```

---

### 2. Get All Languages

**Endpoint:** `GET /api/languages`

**Description:** Get all programming languages with generation status from database

**Authentication:** Required (JWT Token)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "total": 9,
    "languages": [
      {
        "_id": "691846557aab46246b7d87cc",
        "name": "Python",
        "slug": "python",
        "totalKeywords": 35,
        "isGenerated": true,
        "createdAt": "2025-11-15T09:22:29.123Z",
        "updatedAt": "2025-11-15T09:28:46.691Z"
      },
      {
        "_id": "691846557aab46246b7d87cd",
        "name": "Javascript",
        "slug": "javascript",
        "totalKeywords": 52,
        "isGenerated": true,
        "createdAt": "2025-11-15T09:22:29.124Z",
        "updatedAt": "2025-11-15T09:29:26.842Z"
      },
      {
        "_id": "691846557aab46246b7d87ce",
        "name": "Java",
        "slug": "java",
        "totalKeywords": 50,
        "isGenerated": true,
        "createdAt": "2025-11-15T09:22:29.124Z",
        "updatedAt": "2025-11-15T09:30:09.156Z"
      },
      {
        "_id": "691846557aab46246b7d87cf",
        "name": "Typescript",
        "slug": "typescript",
        "totalKeywords": 72,
        "isGenerated": true,
        "createdAt": "2025-11-15T09:22:29.124Z",
        "updatedAt": "2025-11-15T09:31:16.431Z"
      },
      {
        "_id": "691846557aab46246b7d87d0",
        "name": "Rust",
        "slug": "rust",
        "totalKeywords": 54,
        "isGenerated": true,
        "createdAt": "2025-11-15T09:22:29.124Z",
        "updatedAt": "2025-11-15T09:32:10.892Z"
      },
      {
        "_id": "691846557aab46246b7d87d1",
        "name": "Go",
        "slug": "go",
        "totalKeywords": 25,
        "isGenerated": true,
        "createdAt": "2025-11-15T09:22:29.124Z",
        "updatedAt": "2025-11-15T09:32:34.567Z"
      },
      {
        "_id": "691846557aab46246b7d87d2",
        "name": "Cpp",
        "slug": "cpp",
        "totalKeywords": 92,
        "isGenerated": true,
        "createdAt": "2025-11-15T09:22:29.124Z",
        "updatedAt": "2025-11-15T09:33:36.789Z"
      },
      {
        "_id": "691846557aab46246b7d87d3",
        "name": "C",
        "slug": "c",
        "totalKeywords": 57,
        "isGenerated": true,
        "createdAt": "2025-11-15T09:38:45.234Z",
        "updatedAt": "2025-11-15T09:41:23.567Z"
      },
      {
        "_id": "691846557aab46246b7d87d4",
        "name": "Kotlin",
        "slug": "kotlin",
        "totalKeywords": 75,
        "isGenerated": true,
        "createdAt": "2025-11-15T09:38:45.234Z",
        "updatedAt": "2025-11-15T09:42:45.891Z"
      }
    ]
  }
}
```

---

### 3. Get Single Language

**Endpoint:** `GET /api/languages/:slug`

**Description:** Get detailed information about a specific language

**Authentication:** Required (JWT Token)

**Request Headers:**
```
Authorization: Bearer <your-jwt-token>
```

**URL Parameters:**
- `slug` - Language identifier (python, javascript, java, typescript, cpp, go, rust, c, kotlin)

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "language": {
      "_id": "691846557aab46246b7d87cc",
      "name": "Python",
      "slug": "python",
      "totalKeywords": 35,
      "isGenerated": true,
      "createdAt": "2025-11-15T09:22:29.123Z",
      "updatedAt": "2025-11-15T09:28:46.691Z"
    }
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

---

## Supported Languages List

| Language   | Slug       | Keywords Count |
|------------|------------|----------------|
| Python     | python     | 35             |
| JavaScript | javascript | 52             |
| Java       | java       | 50             |
| TypeScript | typescript | 72             |
| C++        | cpp        | 92             |
| Go         | go         | 25             |
| Rust       | rust       | 54             |
| C          | c          | 57             |
| Kotlin     | kotlin     | 75             |

**Total:** 9 languages, 517 keywords

---

## cURL Examples

### Get Supported Languages
```bash
curl -X GET http://localhost:5000/api/languages/supported \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get All Languages
```bash
curl -X GET http://localhost:5000/api/languages \
  -H "Authorization: Bearer <your-jwt-token>"
```

### Get Specific Language
```bash
curl -X GET http://localhost:5000/api/languages/python \
  -H "Authorization: Bearer <your-jwt-token>"
```

---

## Notes
- All endpoints require authentication
- Language slugs are case-sensitive (use lowercase)
- `isGenerated: true` indicates flashcards have been created for this language
- Keywords are sourced from official language documentation
