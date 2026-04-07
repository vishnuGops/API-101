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

### Basic Concepts

| Concept              | Description                                 |
| -------------------- | ------------------------------------------- |
| **HTTP Methods**     | GET, POST, PUT, PATCH, DELETE, HEAD         |
| **Path Parameters**  | `/api/books/:id` - dynamic URL segments     |
| **Query Parameters** | `/api/books?genre=Tech&limit=5`             |
| **Request Headers**  | Authorization, Content-Type, custom headers |
| **Request Body**     | Sending JSON data                           |
| **Status Codes**     | 200, 201, 400, 401, 403, 404, 429, 500+     |
| **Authentication**   | Bearer tokens, API keys                     |
| **Error Handling**   | Understanding error responses               |

### Advanced Concepts

| Concept                 | Description                                       |
| ----------------------- | ------------------------------------------------- |
| **Pagination**          | `?page=1&limit=10` - navigate large datasets      |
| **Rate Limiting**       | X-RateLimit-\* headers, 429 Too Many Requests     |
| **Bulk Operations**     | Create/update multiple items in one request       |
| **Nested Resources**    | `/books/1/reviews` - parent/child relationships   |
| **Field Selection**     | `?fields=id,title` - request only needed fields   |
| **Content Negotiation** | Accept header for JSON/XML/CSV formats            |
| **Idempotency Keys**    | X-Idempotency-Key header prevents duplicates      |
| **API Versioning**      | `/api/v1/` vs `/api/v2/` - backward compatibility |
| **ETags & Caching**     | If-None-Match header, 304 Not Modified            |
| **Webhooks**            | Server pushes events to your endpoint             |
| **Health Checks**       | `/api/health` for monitoring and load balancers   |

---

## ✨ Features

### 🌐 Interactive Web Playground

- Beautiful dark-themed UI with categorized sidebar
- 40+ pre-built examples covering basic and advanced concepts
- Educational explanation panel for each API concept
- Real-time request/response viewer
- Support for all HTTP methods including HEAD
- Quick reference cards for 16 key concepts

### 💻 Node.js Client Examples

- 27 working examples with detailed JSDoc explanations
- Basic examples (1-15): CRUD, headers, query params, error handling
- Advanced examples (16-27): pagination, rate limiting, ETags, webhooks
- Learn how to use `fetch()` for API calls
- Error handling patterns
- Header management

### 🛠️ Full-Featured API Server (30+ Endpoints)

**Core APIs:**

- Books CRUD API (Create, Read, Update, Delete)
- Users API with authentication
- Search functionality with filters
- Calculator API
- Echo endpoint for debugging
- Status code testing
- Random data generator

**Advanced APIs:**

- Pagination with metadata
- Rate limiting (5 requests/minute)
- Bulk create/update operations
- Nested resources (book reviews)
- Field selection (sparse fieldsets)
- Content negotiation (JSON/XML/CSV)
- Idempotency key support
- API versioning (v1/v2)
- ETags and conditional requests
- Webhook event simulation
- Health check and API info endpoints

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

### Advanced API Endpoints

#### Pagination

| Method | Endpoint                          | Description            |
| ------ | --------------------------------- | ---------------------- |
| `GET`  | `/api/products?page=1&limit=10`   | Paginated product list |
| `GET`  | `/api/products?category=X&page=1` | Filter + paginate      |

#### Rate Limiting

| Method | Endpoint       | Description                       |
| ------ | -------------- | --------------------------------- |
| `GET`  | `/api/limited` | Rate limited endpoint (5 req/min) |

#### Bulk Operations

| Method  | Endpoint           | Description                     |
| ------- | ------------------ | ------------------------------- |
| `POST`  | `/api/bulk/create` | Create multiple inventory items |
| `PATCH` | `/api/bulk/update` | Update multiple items by SKU    |
| `GET`   | `/api/inventory`   | View all inventory              |

#### Nested Resources

| Method | Endpoint                 | Description            |
| ------ | ------------------------ | ---------------------- |
| `GET`  | `/api/books/:id/reviews` | Get reviews for a book |
| `POST` | `/api/books/:id/reviews` | Add a review to a book |

#### Field Selection

| Method | Endpoint                            | Description           |
| ------ | ----------------------------------- | --------------------- |
| `GET`  | `/api/books-select`                 | All fields            |
| `GET`  | `/api/books-select?fields=id,title` | Only specified fields |

#### Content Negotiation

| Method | Endpoint    | Accept Header      | Description   |
| ------ | ----------- | ------------------ | ------------- |
| `GET`  | `/api/data` | `application/json` | JSON response |
| `GET`  | `/api/data` | `application/xml`  | XML response  |
| `GET`  | `/api/data` | `text/csv`         | CSV response  |

#### Idempotency

| Method | Endpoint       | Headers Required           | Description               |
| ------ | -------------- | -------------------------- | ------------------------- |
| `POST` | `/api/payment` | `X-Idempotency-Key: <key>` | Idempotent payment create |

#### API Versioning

| Method | Endpoint                   | Description                 |
| ------ | -------------------------- | --------------------------- |
| `GET`  | `/api/v1/greeting?name=X`  | Simple greeting (v1)        |
| `GET`  | `/api/v2/greeting?name=X`  | Enhanced greeting (v2)      |
| `GET`  | `/api/v2/greeting?lang=es` | Multi-language support (v2) |

#### ETags & Caching

| Method | Endpoint       | Headers                | Description               |
| ------ | -------------- | ---------------------- | ------------------------- |
| `GET`  | `/api/article` | -                      | Get article + ETag        |
| `GET`  | `/api/article` | `If-None-Match: <tag>` | Conditional request       |
| `PUT`  | `/api/article` | -                      | Update article (new ETag) |

#### Webhooks

| Method | Endpoint                 | Description               |
| ------ | ------------------------ | ------------------------- |
| `POST` | `/api/webhooks/simulate` | Simulate a webhook event  |
| `GET`  | `/api/webhooks/events`   | View all simulated events |

#### Health & Info

| Method | Endpoint      | Description                    |
| ------ | ------------- | ------------------------------ |
| `GET`  | `/api/health` | Health check (uptime, version) |
| `GET`  | `/api/info`   | API discovery/metadata         |

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

## 🎓 Advanced Learning Exercises

### Exercise 7: Pagination

1. Get the first page: `GET /api/products?page=1&limit=5`
2. Check `pagination.totalPages` in the response
3. Navigate to page 2 and compare results
4. Try filtering + pagination: `?category=Electronics&page=1&limit=3`

### Exercise 8: Rate Limiting

```bash
# Run this 6 times quickly to trigger 429 error:
for i in {1..6}; do curl -s http://localhost:3000/api/limited | head -1; done
```

Watch the `X-RateLimit-Remaining` header decrease!

### Exercise 9: Bulk Operations

```bash
# Create multiple items at once:
curl -X POST http://localhost:3000/api/bulk/create \
  -H "Content-Type: application/json" \
  -d '{"items": [{"name": "Item A", "quantity": 10}, {"name": "Item B", "quantity": 20}]}'
```

### Exercise 10: Content Negotiation

Request the same endpoint in different formats:

```bash
curl -H "Accept: application/json" http://localhost:3000/api/data
curl -H "Accept: application/xml" http://localhost:3000/api/data
curl -H "Accept: text/csv" http://localhost:3000/api/data
```

### Exercise 11: Idempotency Keys

```bash
# First payment:
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: order-123" \
  -d '{"amount": 99.99}'

# Retry with SAME key - no duplicate charge!
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -H "X-Idempotency-Key: order-123" \
  -d '{"amount": 99.99}'
```

### Exercise 12: ETags for Caching

```bash
# Get article and note the ETag:
curl -i http://localhost:3000/api/article

# Use ETag for conditional request (returns 304 if unchanged):
curl -H "If-None-Match: \"abc123\"" http://localhost:3000/api/article
```

### Exercise 13: API Versioning

Compare v1 vs v2 responses:

```bash
curl "http://localhost:3000/api/v1/greeting?name=Dev"
curl "http://localhost:3000/api/v2/greeting?name=Dev"
curl "http://localhost:3000/api/v2/greeting?name=Amigo&lang=es"
```

---

## 🔑 Key Concepts

### HTTP Methods

```
GET     → Retrieve data (safe, no side effects)
POST    → Create new resource
PUT     → Replace entire resource (idempotent)
PATCH   → Partial update (only changed fields)
DELETE  → Remove resource (idempotent)
HEAD    → Get headers only, no body (metadata check)
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

## 🔧 Response Headers to Know

| Header                  | Purpose                                        |
| ----------------------- | ---------------------------------------------- |
| `Content-Type`          | Format of response body (application/json)     |
| `X-RateLimit-Limit`     | Maximum requests allowed in window             |
| `X-RateLimit-Remaining` | Requests remaining in current window           |
| `X-RateLimit-Reset`     | When the rate limit resets (Unix timestamp)    |
| `ETag`                  | Version identifier for caching                 |
| `Retry-After`           | Seconds to wait before retrying (429 response) |

---

## 📊 Learning Path

**Beginner (Examples 1-15):**

1. Start with basic GET requests
2. Learn path vs query parameters
3. Practice POST/PUT/PATCH/DELETE
4. Understand authentication headers
5. Handle errors gracefully

**Intermediate (Examples 16-21):**

1. Implement pagination in your apps
2. Respect rate limits with proper retry logic
3. Use bulk operations for efficiency
4. Navigate nested resource relationships
5. Select only fields you need
6. Handle multiple content types

**Advanced (Examples 22-27):**

1. Implement idempotency for critical operations
2. Version your APIs for backward compatibility
3. Use ETags to avoid unnecessary data transfer
4. Set up webhooks for event-driven architecture
5. Monitor API health in production

---

## 🎉 Happy Learning!

Start experimenting, break things, and learn how APIs work! The best way to learn is by doing.

**Tips:**

- Watch the server console for request logs
- Use the echo endpoint to debug your requests
- Try sending invalid data to see error handling
- Create, update, and delete books to see changes

If you have questions, the API responses include helpful tips and suggestions!
