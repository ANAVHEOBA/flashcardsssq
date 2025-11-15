# Authentication API Documentation

Base URL: `http://localhost:5000/api/auth`

## Overview
The Authentication module handles user registration and login with JWT token-based authentication.

---

## Endpoints

### 1. Register User

**Endpoint:** `POST /api/auth/register`

**Description:** Create a new user account

**Authentication:** None (Public)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "69184e8aac9859363da992e4",
      "email": "john@example.com",
      "name": "John Doe"
    }
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

**Validation Errors:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "Name is required",
    "Valid email is required",
    "Password must be at least 6 characters"
  ]
}
```

---

### 2. Login User

**Endpoint:** `POST /api/auth/login`

**Description:** Authenticate user and receive JWT token

**Authentication:** None (Public)

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "69184e8aac9859363da992e4",
      "email": "john@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MTg0ZThhYWM5ODU5MzYzZGE5OTJlNCIsImlhdCI6MTc2MzIwMDY3NCwiZXhwIjoxNzYzODA1NDc0fQ.4gHi9Z3FDyl11UzKn5I9w_kSOnQpGfJVA0XlwXwApGU"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Token Usage

After login, use the token in the `Authorization` header for protected endpoints:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Token Expiration:** 7 days

---

## cURL Examples

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

---

## Password Requirements
- Minimum 6 characters
- Hashed using bcrypt with salt rounds: 10

## Email Validation
- Must be valid email format
- Unique across the system
- Case-insensitive

## Security Notes
- Passwords are never returned in responses
- All passwords stored as bcrypt hashes
- JWT tokens signed with HS256 algorithm
- Tokens include user ID in payload
