# 🚀 API 101 - Interactive Learning Playground

Learn how APIs work through hands-on experimentation! This project provides a local API server with a beautiful interactive playground to explore HTTP methods, status codes, authentication, and more.

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [What You'll Learn](#-what-youll-learn)
- [Features](#-features)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Learning Exercises](#-learning-exercises)
- [Key Concepts](#-key-concepts)

---

## 🏃 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

### 3. Open the Interactive Playground

Visit **http://localhost:3000** in your browser!

### 4. (Optional) Run Client Examples

In a new terminal:

```bash
npm run client
```

---

## 📚 What You'll Learn

| Concept              | Description                                 |
| -------------------- | ------------------------------------------- |
| **HTTP Methods**     | GET, POST, PUT, PATCH, DELETE               |
| **Path Parameters**  | `/api/books/:id` - dynamic URL segments     |
| **Query Parameters** | `/api/books?genre=Tech&limit=5`             |
| **Request Headers**  | Authorization, Content-Type, custom headers |
| **Request Body**     | Sending JSON data                           |
| **Status Codes**     | 200, 201, 400, 401, 403, 404, 500+          |
| **Authentication**   | Bearer tokens, API keys                     |
| **Error Handling**   | Understanding error responses               |

---

## ✨ Features

### 🌐 Interactive Web Playground

- Beautiful dark-themed UI
- Pre-built examples for every HTTP method
- Real-time request/response viewer
- Edit requests and see results instantly

### 💻 Node.js Client Examples

- 15+ working examples with detailed explanations
- Learn how to use `fetch()` for API calls
- Error handling patterns
- Header management

### 🛠️ Full-Featured API Server

- Books CRUD API (Create, Read, Update, Delete)
- Users API with authentication
- Search functionality
- Calculator API
- Echo endpoint for debugging
- Status code testing
- Random data generator

---

## 📖 API Endpoints Reference

### Books API

| Method   | Endpoint               | Description           |
| -------- | ---------------------- | --------------------- |
| `GET`    | `/api/books`           | Get all books         |
| `GET`    | `/api/books/:id`       | Get specific book     |
| `GET`    | `/api/books?genre=X`   | Filter books by genre |
| `GET`    | `/api/books?sort=year` | Sort books            |
| `GET`    | `/api/books?limit=N`   | Limit results         |
| `POST`   | `/api/books`           | Create new book       |
| `PUT`    | `/api/books/:id`       | Replace entire book   |
| `PATCH`  | `/api/books/:id`       | Update book fields    |
| `DELETE` | `/api/books/:id`       | Delete a book         |

### Users API (Authenticated)

| Method | Endpoint     | Headers Required                         |
| ------ | ------------ | ---------------------------------------- |
| `GET`  | `/api/users` | `Authorization: Bearer secret-token-123` |
| `POST` | `/api/users` | `X-API-Key: my-secret-api-key`           |

### Utility Endpoints

| Method | Endpoint               | Description              |
| ------ | ---------------------- | ------------------------ |
| `GET`  | `/api/search?q=X`      | Search books             |
| `POST` | `/api/echo`            | Echo back your request   |
| `POST` | `/api/calculate`       | Math operations          |
| `GET`  | `/api/random`          | Random data              |
| `GET`  | `/api/status/:code`    | Test status codes        |
| `GET`  | `/api/slow?delay=3000` | Slow response simulation |

---

## 🎯 Learning Exercises

### Exercise 1: Basic GET Requests

1. Open http://localhost:3000/api/books in your browser
2. Try adding query parameters: `/api/books?genre=Technology`
3. Get a specific book: `/api/books/1`

### Exercise 2: Creating Data with POST

Using the playground or curl:

```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "My Book", "author": "Me", "year": 2024, "genre": "Tech"}'
```

### Exercise 3: PUT vs PATCH

Try updating book #1:

**PUT (replace everything):**

```json
PUT /api/books/1
{
  "title": "New Title",
  "author": "New Author",
  "year": 2025,
  "genre": "Fiction"
}
```

**PATCH (update specific fields):**

```json
PATCH /api/books/1
{
  "year": 2030
}
```

### Exercise 4: Authentication

1. Try `GET /api/users` without headers - observe 401 error
2. Add `Authorization: Bearer secret-token-123` header - success!

### Exercise 5: Error Handling

1. Request a non-existent book: `GET /api/books/99999`
2. Try `GET /api/status/404` to see different status codes
3. Create a book without required fields to see validation errors

### Exercise 6: The Echo Endpoint

POST to `/api/echo` with any data to see exactly what the server receives - great for debugging!

---

## 🔑 Key Concepts

### HTTP Methods

```
GET     → Retrieve data (safe, no side effects)
POST    → Create new resource
PUT     → Replace entire resource (idempotent)
PATCH   → Partial update (only changed fields)
DELETE  → Remove resource (idempotent)
```

### Status Codes

```
2xx Success
├── 200 OK                 - Request successful
├── 201 Created            - Resource created
└── 204 No Content         - Success, no body

4xx Client Error
├── 400 Bad Request        - Invalid request data
├── 401 Unauthorized       - Missing authentication
├── 403 Forbidden          - No permission
├── 404 Not Found          - Resource doesn't exist
└── 429 Too Many Requests  - Rate limited

5xx Server Error
├── 500 Internal Error     - Server crashed
├── 502 Bad Gateway        - Upstream failure
└── 503 Service Unavailable - Temporarily down
```

### URL Anatomy

```
https://api.example.com/v1/books/123?format=json&page=2
└─────────┬──────────┘└┬─┘└───┬──┘└┬┘└───────┬────────┘
       Base URL      Path  Path   Query Parameters
                    Prefix Param
```

### Request Structure

```http
POST /api/books HTTP/1.1          ← Method + Path
Host: localhost:3000              ← Headers
Content-Type: application/json
Authorization: Bearer token123

{                                 ← Body (JSON)
  "title": "My Book",
  "author": "John Doe"
}
```

---

## 🛠️ Tools for Testing APIs

### Browser

- Just type GET URLs in the address bar
- Use browser DevTools (F12) → Network tab

### cURL (Command Line)

```bash
# GET request
curl http://localhost:3000/api/books

# POST request with JSON
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "author": "Me"}'
```

### VS Code Extensions

- **Thunder Client** - GUI for API testing
- **REST Client** - Send requests from .http files

### Dedicated Tools

- **Postman** - Full-featured API testing
- **Insomnia** - Clean, modern API client

---

## 📁 Project Structure

```
API-101/
├── package.json          # Project config & scripts
├── server.js             # API server with all endpoints
├── client-examples.js    # Node.js example code
├── public/
│   └── index.html        # Interactive web playground
└── README.md             # This file!
```

---

## 🎉 Happy Learning!

Start experimenting, break things, and learn how APIs work! The best way to learn is by doing.

**Tips:**

- Watch the server console for request logs
- Use the echo endpoint to debug your requests
- Try sending invalid data to see error handling
- Create, update, and delete books to see changes

If you have questions, the API responses include helpful tips and suggestions!
