/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                         API 101 - Learning Playground                         ║
 * ║                    Your Interactive API Learning Server                       ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * This server demonstrates various API concepts:
 * - HTTP Methods (GET, POST, PUT, PATCH, DELETE)
 * - Path Parameters vs Query Parameters
 * - Request Headers and Body
 * - Status Codes
 * - Authentication patterns
 * - Error Handling
 */

const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Parse JSON request bodies
app.use(express.static("public")); // Serve static files

// Request Logger Middleware - Shows all incoming requests
app.use((req, res, next) => {
  console.log("\n" + "═".repeat(60));
  console.log(`📨 ${new Date().toISOString()}`);
  console.log(`   Method: ${req.method}`);
  console.log(`   URL: ${req.url}`);
  console.log(
    `   Headers: ${JSON.stringify(req.headers, null, 2).substring(0, 200)}...`,
  );
  if (Object.keys(req.body).length > 0) {
    console.log(`   Body: ${JSON.stringify(req.body)}`);
  }
  console.log("═".repeat(60));
  next();
});

// ============================================================================
// 📚 IN-MEMORY DATABASE (simulates a real database)
// ============================================================================
let books = [
  {
    id: 1,
    title: "The API Design Book",
    author: "RESTful Roy",
    year: 2020,
    genre: "Technology",
  },
  {
    id: 2,
    title: "HTTP: The Definitive Guide",
    author: "Web Walker",
    year: 2019,
    genre: "Technology",
  },
  {
    id: 3,
    title: "JavaScript Mastery",
    author: "Code Carter",
    year: 2021,
    genre: "Programming",
  },
  {
    id: 4,
    title: "The Art of REST",
    author: "API Andy",
    year: 2022,
    genre: "Technology",
  },
];

let users = [
  { id: 1, username: "learner", email: "learner@api101.com", role: "student" },
  { id: 2, username: "teacher", email: "teacher@api101.com", role: "admin" },
];

let nextBookId = 5;
let nextUserId = 3;

// ============================================================================
// 🏠 ROOT ENDPOINT
// ============================================================================

/**
 * GET / - Welcome endpoint
 * This is the simplest type of API endpoint!
 */
app.get("/", (req, res) => {
  res.json({
    message: "🎉 Welcome to API 101 Learning Playground!",
    version: "1.0.0",
    tip: "Try visiting /api/books to see a list of books",
    availableEndpoints: {
      basics: [
        "GET    /api/books          - Get all books",
        "GET    /api/books/:id      - Get a specific book",
        "POST   /api/books          - Create a new book",
        "PUT    /api/books/:id      - Replace a book completely",
        "PATCH  /api/books/:id      - Update specific book fields",
        "DELETE /api/books/:id      - Delete a book",
        "GET    /api/search         - Search with query parameters",
        "GET    /api/users          - Get users (requires auth header)",
        "POST   /api/echo           - Echo back your request",
        "GET    /api/status/:code   - Get different status codes",
        "GET    /api/slow           - Simulates a slow API response",
        "GET    /api/random         - Get random data",
      ],
      advanced: [
        "GET    /api/products       - Paginated products list",
        "GET    /api/limited        - Rate limiting demo (5 req/min)",
        "POST   /api/bulk/create    - Bulk create items",
        "PATCH  /api/bulk/update    - Bulk update items",
        "GET    /api/inventory      - View inventory",
        "GET    /api/books/:id/reviews - Nested resource (reviews)",
        "POST   /api/books/:id/reviews - Add a review",
        "GET    /api/books-select   - Field selection (?fields=id,title)",
        "HEAD   /api/books          - Get metadata only",
        "GET    /api/data           - Content negotiation (Accept header)",
        "POST   /api/payment        - Idempotency key demo",
        "GET    /api/v1/greeting    - API versioning (v1)",
        "GET    /api/v2/greeting    - API versioning (v2 with languages)",
        "GET    /api/article        - ETag caching demo",
        "PUT    /api/article        - Update article (changes ETag)",
        "POST   /api/webhooks/simulate - Webhook simulation",
        "GET    /api/webhooks/events   - View webhook events",
        "GET    /api/health         - Health check endpoint",
        "GET    /api/info           - API metadata",
      ],
    },
  });
});

// ============================================================================
// 📖 BOOKS API - Full CRUD Operations
// ============================================================================

/**
 * GET /api/books - Retrieve all books
 *
 * 🎯 CONCEPT: GET requests retrieve data without modifying anything
 *
 * Query Parameters (optional):
 * - genre: Filter by genre
 * - limit: Limit number of results
 * - sort: Sort by field (title, year, author)
 *
 * Example: /api/books?genre=Technology&limit=2
 */
app.get("/api/books", (req, res) => {
  let result = [...books];

  // Filter by genre (query parameter)
  if (req.query.genre) {
    result = result.filter(
      (book) => book.genre.toLowerCase() === req.query.genre.toLowerCase(),
    );
  }

  // Sort by field
  if (req.query.sort) {
    const sortField = req.query.sort;
    result.sort((a, b) => {
      if (a[sortField] < b[sortField]) return -1;
      if (a[sortField] > b[sortField]) return 1;
      return 0;
    });
  }

  // Limit results
  if (req.query.limit) {
    result = result.slice(0, parseInt(req.query.limit));
  }

  res.json({
    success: true,
    count: result.length,
    queryParams: req.query,
    data: result,
  });
});

/**
 * GET /api/books/:id - Retrieve a specific book by ID
 *
 * 🎯 CONCEPT: Path parameters (like :id) identify specific resources
 *
 * The :id in the URL becomes req.params.id
 */
app.get("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    // 404 Not Found - Resource doesn't exist
    return res.status(404).json({
      success: false,
      error: "Book not found",
      requestedId: bookId,
      tip: "Try an ID between 1 and " + (nextBookId - 1),
    });
  }

  res.json({
    success: true,
    pathParam: req.params.id,
    data: book,
  });
});

/**
 * POST /api/books - Create a new book
 *
 * 🎯 CONCEPT: POST creates new resources. Data is sent in the request body.
 *
 * Required body: { title, author, year, genre }
 */
app.post("/api/books", (req, res) => {
  const { title, author, year, genre } = req.body;

  // Validate required fields
  if (!title || !author) {
    // 400 Bad Request - Client sent invalid data
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
      required: ["title", "author"],
      received: req.body,
      tip: "Send a JSON body with at least 'title' and 'author'",
    });
  }

  const newBook = {
    id: nextBookId++,
    title,
    author,
    year: year || new Date().getFullYear(),
    genre: genre || "General",
  };

  books.push(newBook);

  // 201 Created - Resource was successfully created
  res.status(201).json({
    success: true,
    message: "Book created successfully!",
    data: newBook,
  });
});

/**
 * PUT /api/books/:id - Replace a book completely
 *
 * 🎯 CONCEPT: PUT replaces the ENTIRE resource. All fields must be provided.
 */
app.put("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Book not found",
    });
  }

  const { title, author, year, genre } = req.body;

  if (!title || !author || !year || !genre) {
    return res.status(400).json({
      success: false,
      error: "PUT requires ALL fields (title, author, year, genre)",
      tip: "Use PATCH if you only want to update some fields",
    });
  }

  books[bookIndex] = { id: bookId, title, author, year, genre };

  res.json({
    success: true,
    message: "Book replaced completely!",
    method: "PUT - Full replacement",
    data: books[bookIndex],
  });
});

/**
 * PATCH /api/books/:id - Update specific fields of a book
 *
 * 🎯 CONCEPT: PATCH updates only the fields you provide. Other fields stay unchanged.
 */
app.patch("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Book not found",
    });
  }

  // Only update provided fields
  const previousBook = { ...books[bookIndex] };
  books[bookIndex] = { ...books[bookIndex], ...req.body, id: bookId };

  res.json({
    success: true,
    message: "Book updated!",
    method: "PATCH - Partial update",
    previous: previousBook,
    updated: books[bookIndex],
    fieldsChanged: Object.keys(req.body),
  });
});

/**
 * DELETE /api/books/:id - Delete a book
 *
 * 🎯 CONCEPT: DELETE removes resources
 */
app.delete("/api/books/:id", (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({
      success: false,
      error: "Book not found",
    });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];

  // 200 OK with response body, or 204 No Content without body
  res.json({
    success: true,
    message: "Book deleted successfully!",
    deletedBook,
  });
});

// ============================================================================
// 🔍 SEARCH API - Query Parameters Demo
// ============================================================================

/**
 * GET /api/search - Advanced search with multiple query parameters
 *
 * 🎯 CONCEPT: Query parameters are key-value pairs after ? in the URL
 *
 * Example: /api/search?q=javascript&minYear=2020&maxYear=2025
 */
app.get("/api/search", (req, res) => {
  const { q, minYear, maxYear, author } = req.query;

  let results = [...books];

  if (q) {
    const query = q.toLowerCase();
    results = results.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query),
    );
  }

  if (minYear) {
    results = results.filter((book) => book.year >= parseInt(minYear));
  }

  if (maxYear) {
    results = results.filter((book) => book.year <= parseInt(maxYear));
  }

  if (author) {
    results = results.filter((book) =>
      book.author.toLowerCase().includes(author.toLowerCase()),
    );
  }

  res.json({
    success: true,
    searchCriteria: req.query,
    resultsFound: results.length,
    data: results,
  });
});

// ============================================================================
// 👤 USERS API - Authentication Demo
// ============================================================================

/**
 * GET /api/users - Get users (requires authentication header)
 *
 * 🎯 CONCEPT: Headers carry metadata about the request, including auth tokens
 *
 * Required Header: Authorization: Bearer secret-token-123
 */
app.get("/api/users", (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    // 401 Unauthorized - No credentials provided
    return res.status(401).json({
      success: false,
      error: "No authorization header provided",
      tip: "Add header: Authorization: Bearer secret-token-123",
    });
  }

  if (authHeader !== "Bearer secret-token-123") {
    // 403 Forbidden - Invalid credentials
    return res.status(403).json({
      success: false,
      error: "Invalid token",
      received: authHeader,
      expected: "Bearer secret-token-123",
    });
  }

  res.json({
    success: true,
    message: "Authentication successful!",
    data: users,
  });
});

/**
 * POST /api/users - Create a user (checks custom headers)
 */
app.post("/api/users", (req, res) => {
  const apiKey = req.headers["x-api-key"];

  if (apiKey !== "my-secret-api-key") {
    return res.status(401).json({
      success: false,
      error: "Invalid or missing X-API-Key header",
      tip: "Add header: X-API-Key: my-secret-api-key",
    });
  }

  const { username, email, role } = req.body;

  if (!username || !email) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields: username, email",
    });
  }

  const newUser = {
    id: nextUserId++,
    username,
    email,
    role: role || "student",
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "User created!",
    data: newUser,
  });
});

// ============================================================================
// 🔄 ECHO API - See exactly what you sent
// ============================================================================

/**
 * POST /api/echo - Echoes back everything you sent
 *
 * 🎯 CONCEPT: Great for debugging and understanding request structure
 */
app.post("/api/echo", (req, res) => {
  res.json({
    success: true,
    message: "Here's what I received from you!",
    yourRequest: {
      method: req.method,
      url: req.url,
      headers: {
        "content-type": req.headers["content-type"],
        "user-agent": req.headers["user-agent"],
        authorization: req.headers["authorization"] || "not provided",
        "x-custom-header": req.headers["x-custom-header"] || "not provided",
      },
      body: req.body,
      query: req.query,
      timestamp: new Date().toISOString(),
    },
  });
});

// Also support all methods for echo
app.all("/api/echo/:anything?", (req, res) => {
  res.json({
    success: true,
    yourRequest: {
      method: req.method,
      url: req.url,
      params: req.params,
      query: req.query,
      headers: req.headers,
      body: req.body,
    },
  });
});

// ============================================================================
// 📊 STATUS CODE DEMO
// ============================================================================

/**
 * GET /api/status/:code - Returns different HTTP status codes
 *
 * 🎯 CONCEPT: Status codes indicate the result of the request
 *
 * Common codes:
 * - 200: OK (Success)
 * - 201: Created
 * - 400: Bad Request
 * - 401: Unauthorized
 * - 403: Forbidden
 * - 404: Not Found
 * - 500: Internal Server Error
 */
app.get("/api/status/:code", (req, res) => {
  const code = parseInt(req.params.code);

  const statusMessages = {
    200: { meaning: "OK", description: "The request was successful" },
    201: { meaning: "Created", description: "A new resource was created" },
    204: {
      meaning: "No Content",
      description: "Success, but no content to return",
    },
    301: {
      meaning: "Moved Permanently",
      description: "Resource has moved to a new URL",
    },
    304: {
      meaning: "Not Modified",
      description: "Cached version is still valid",
    },
    400: {
      meaning: "Bad Request",
      description: "The request was malformed or invalid",
    },
    401: { meaning: "Unauthorized", description: "Authentication is required" },
    403: { meaning: "Forbidden", description: "You don't have permission" },
    404: { meaning: "Not Found", description: "The resource doesn't exist" },
    405: {
      meaning: "Method Not Allowed",
      description: "HTTP method not supported for this endpoint",
    },
    409: {
      meaning: "Conflict",
      description: "Request conflicts with current state",
    },
    429: { meaning: "Too Many Requests", description: "Rate limit exceeded" },
    500: {
      meaning: "Internal Server Error",
      description: "Something went wrong on the server",
    },
    502: {
      meaning: "Bad Gateway",
      description: "Invalid response from upstream server",
    },
    503: {
      meaning: "Service Unavailable",
      description: "Server is temporarily unavailable",
    },
  };

  const info = statusMessages[code] || {
    meaning: "Unknown",
    description: "Not a standard status code",
  };

  res.status(code).json({
    statusCode: code,
    ...info,
    tip: "Try different codes: 200, 201, 400, 401, 403, 404, 500",
  });
});

// ============================================================================
// ⏱️ SLOW RESPONSE DEMO
// ============================================================================

/**
 * GET /api/slow - Simulates a slow API response
 *
 * 🎯 CONCEPT: APIs can be slow! Learn about timeouts and loading states.
 *
 * Query param: delay (in milliseconds, default 3000)
 */
app.get("/api/slow", (req, res) => {
  const delay = parseInt(req.query.delay) || 3000;
  const maxDelay = 10000;
  const actualDelay = Math.min(delay, maxDelay);

  setTimeout(() => {
    res.json({
      success: true,
      message: `Response after ${actualDelay}ms delay`,
      tip: "Use ?delay=5000 to wait 5 seconds",
      timestamp: new Date().toISOString(),
    });
  }, actualDelay);
});

// ============================================================================
// 🎲 RANDOM DATA API
// ============================================================================

/**
 * GET /api/random - Returns random data each time
 *
 * 🎯 CONCEPT: APIs can return dynamic data
 */
app.get("/api/random", (req, res) => {
  const quotes = [
    "REST is a beautiful thing.",
    "APIs make the world go round.",
    "HTTP methods are your friends.",
    "Status codes tell a story.",
    "JSON is the universal language of APIs.",
  ];

  const colors = ["red", "blue", "green", "yellow", "purple", "orange"];

  res.json({
    success: true,
    randomNumber: Math.floor(Math.random() * 1000),
    randomQuote: quotes[Math.floor(Math.random() * quotes.length)],
    randomColor: colors[Math.floor(Math.random() * colors.length)],
    uuid: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }),
    timestamp: new Date().toISOString(),
  });
});

// ============================================================================
// 🧮 CALCULATOR API - POST with operations
// ============================================================================

/**
 * POST /api/calculate - Perform mathematical operations
 *
 * Body: { operation: "add|subtract|multiply|divide", a: number, b: number }
 */
app.post("/api/calculate", (req, res) => {
  const { operation, a, b } = req.body;

  if (typeof a !== "number" || typeof b !== "number") {
    return res.status(400).json({
      success: false,
      error: "a and b must be numbers",
      received: { a: typeof a, b: typeof b },
    });
  }

  let result;
  switch (operation) {
    case "add":
      result = a + b;
      break;
    case "subtract":
      result = a - b;
      break;
    case "multiply":
      result = a * b;
      break;
    case "divide":
      if (b === 0) {
        return res.status(400).json({
          success: false,
          error: "Cannot divide by zero",
        });
      }
      result = a / b;
      break;
    default:
      return res.status(400).json({
        success: false,
        error: "Unknown operation",
        validOperations: ["add", "subtract", "multiply", "divide"],
      });
  }

  res.json({
    success: true,
    operation,
    a,
    b,
    result,
    formula: `${a} ${operation} ${b} = ${result}`,
  });
});

// ============================================================================
// 📝 FORM DATA DEMO
// ============================================================================

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

/**
 * POST /api/form - Handle form submissions
 *
 * 🎯 CONCEPT: Forms can send data as application/x-www-form-urlencoded
 */
app.post("/api/form", (req, res) => {
  res.json({
    success: true,
    message: "Form data received!",
    contentType: req.headers["content-type"],
    formData: req.body,
  });
});

// ============================================================================
// 📄 PAGINATION API - Understanding paginated responses
// ============================================================================

// Generate a larger dataset for pagination demos
const allProducts = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Product ${i + 1}`,
  price: Math.floor(Math.random() * 1000) + 10,
  category: ["Electronics", "Books", "Clothing", "Food", "Toys"][i % 5],
  inStock: Math.random() > 0.3,
}));

/**
 * GET /api/products - Paginated product list
 *
 * 🎯 CONCEPT: Pagination prevents overwhelming responses with too much data
 *
 * Query Parameters:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 10, max: 50)
 * - category: Filter by category
 *
 * Example: /api/products?page=2&limit=5
 */
app.get("/api/products", (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
  const category = req.query.category;

  let filtered = [...allProducts];

  if (category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
  }

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = filtered.slice(startIndex, endIndex);

  res.json({
    success: true,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      nextPage: page < totalPages ? page + 1 : null,
      prevPage: page > 1 ? page - 1 : null,
    },
    links: {
      self: `/api/products?page=${page}&limit=${limit}`,
      first: `/api/products?page=1&limit=${limit}`,
      last: `/api/products?page=${totalPages}&limit=${limit}`,
      next:
        page < totalPages
          ? `/api/products?page=${page + 1}&limit=${limit}`
          : null,
      prev: page > 1 ? `/api/products?page=${page - 1}&limit=${limit}` : null,
    },
    data: items,
  });
});

// ============================================================================
// 🚦 RATE LIMITING DEMO
// ============================================================================

const rateLimitStore = new Map();

/**
 * GET /api/limited - Experience rate limiting
 *
 * 🎯 CONCEPT: APIs limit requests to prevent abuse and ensure fair usage
 *
 * This endpoint allows only 5 requests per minute per "user"
 * Use ?userId=xxx to simulate different users
 */
app.get("/api/limited", (req, res) => {
  const userId = req.query.userId || req.ip || "anonymous";
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  const maxRequests = 5;

  // Get or create rate limit record
  let record = rateLimitStore.get(userId);
  if (!record || now - record.windowStart > windowMs) {
    record = { windowStart: now, count: 0 };
  }

  record.count++;
  rateLimitStore.set(userId, record);

  const remaining = Math.max(0, maxRequests - record.count);
  const resetTime = new Date(record.windowStart + windowMs);

  // Set rate limit headers (standard practice)
  res.set({
    "X-RateLimit-Limit": maxRequests,
    "X-RateLimit-Remaining": remaining,
    "X-RateLimit-Reset": Math.ceil(resetTime.getTime() / 1000),
  });

  if (record.count > maxRequests) {
    const retryAfter = Math.ceil((record.windowStart + windowMs - now) / 1000);
    res.set("Retry-After", retryAfter);

    return res.status(429).json({
      success: false,
      error: "Too Many Requests",
      message: `Rate limit exceeded. You made ${record.count} requests.`,
      limit: maxRequests,
      windowSeconds: windowMs / 1000,
      retryAfterSeconds: retryAfter,
      tip: "Wait for the window to reset, or use a different userId parameter",
    });
  }

  res.json({
    success: true,
    message: `Request ${record.count} of ${maxRequests} allowed`,
    rateLimit: {
      limit: maxRequests,
      remaining,
      resetAt: resetTime.toISOString(),
      userId,
    },
    tip: "Keep refreshing to see rate limiting in action!",
  });
});

// ============================================================================
// 📦 BULK OPERATIONS API
// ============================================================================

let inventory = [
  { sku: "SKU001", name: "Widget A", quantity: 100 },
  { sku: "SKU002", name: "Widget B", quantity: 50 },
  { sku: "SKU003", name: "Gadget X", quantity: 75 },
];

/**
 * POST /api/bulk/create - Create multiple items at once
 *
 * 🎯 CONCEPT: Bulk operations are efficient for batch processing
 *
 * Body: { items: [{ name, quantity }, ...] }
 */
app.post("/api/bulk/create", (req, res) => {
  const { items } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Body must contain 'items' array with at least one item",
      example: { items: [{ name: "Item 1", quantity: 10 }] },
    });
  }

  if (items.length > 100) {
    return res.status(400).json({
      success: false,
      error: "Maximum 100 items per bulk operation",
    });
  }

  const results = items.map((item, index) => {
    if (!item.name) {
      return { index, success: false, error: "Missing 'name' field" };
    }
    const newItem = {
      sku: `SKU${String(Date.now() + index).slice(-6)}`,
      name: item.name,
      quantity: item.quantity || 0,
    };
    inventory.push(newItem);
    return { index, success: true, created: newItem };
  });

  const successful = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  res.status(successful > 0 ? 201 : 400).json({
    success: failed === 0,
    summary: {
      total: items.length,
      successful,
      failed,
    },
    results,
  });
});

/**
 * PATCH /api/bulk/update - Update multiple items at once
 *
 * Body: { updates: [{ sku, quantity }, ...] }
 */
app.patch("/api/bulk/update", (req, res) => {
  const { updates } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Body must contain 'updates' array",
    });
  }

  const results = updates.map((update) => {
    const item = inventory.find((i) => i.sku === update.sku);
    if (!item) {
      return { sku: update.sku, success: false, error: "SKU not found" };
    }
    if (update.quantity !== undefined) item.quantity = update.quantity;
    if (update.name !== undefined) item.name = update.name;
    return { sku: update.sku, success: true, updated: item };
  });

  res.json({
    success: true,
    summary: {
      total: updates.length,
      successful: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    },
    results,
  });
});

/**
 * GET /api/inventory - View current inventory
 */
app.get("/api/inventory", (req, res) => {
  res.json({
    success: true,
    count: inventory.length,
    data: inventory,
  });
});

// ============================================================================
// 🔗 NESTED RESOURCES API - Books with Reviews
// ============================================================================

let reviews = [
  {
    id: 1,
    bookId: 1,
    rating: 5,
    comment: "Excellent book on API design!",
    author: "Reader1",
  },
  {
    id: 2,
    bookId: 1,
    rating: 4,
    comment: "Very informative",
    author: "Reader2",
  },
  {
    id: 3,
    bookId: 2,
    rating: 5,
    comment: "A must-read for web developers",
    author: "DevFan",
  },
];
let nextReviewId = 4;

/**
 * GET /api/books/:bookId/reviews - Get reviews for a specific book
 *
 * 🎯 CONCEPT: Nested resources show relationships (a book HAS MANY reviews)
 */
app.get("/api/books/:bookId/reviews", (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({
      success: false,
      error: "Book not found",
    });
  }

  const bookReviews = reviews.filter((r) => r.bookId === bookId);
  const avgRating =
    bookReviews.length > 0
      ? (
          bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length
        ).toFixed(1)
      : null;

  res.json({
    success: true,
    book: { id: book.id, title: book.title },
    reviewCount: bookReviews.length,
    averageRating: avgRating,
    data: bookReviews,
  });
});

/**
 * POST /api/books/:bookId/reviews - Add a review to a book
 *
 * Body: { rating: 1-5, comment, author }
 */
app.post("/api/books/:bookId/reviews", (req, res) => {
  const bookId = parseInt(req.params.bookId);
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({ success: false, error: "Book not found" });
  }

  const { rating, comment, author } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      error: "Rating must be between 1 and 5",
    });
  }

  const newReview = {
    id: nextReviewId++,
    bookId,
    rating,
    comment: comment || "",
    author: author || "Anonymous",
  };

  reviews.push(newReview);

  res.status(201).json({
    success: true,
    message: "Review added!",
    data: newReview,
  });
});

// ============================================================================
// 🎛️ FIELD SELECTION API - Choose which fields to return
// ============================================================================

/**
 * GET /api/books-select - Get books with specific fields only
 *
 * 🎯 CONCEPT: Field selection reduces payload size (like GraphQL's field selection)
 *
 * Query param: fields (comma-separated list)
 * Example: /api/books-select?fields=id,title,year
 */
app.get("/api/books-select", (req, res) => {
  const fieldsParam = req.query.fields;
  const availableFields = ["id", "title", "author", "year", "genre"];

  if (!fieldsParam) {
    return res.json({
      success: true,
      tip: "Add ?fields=id,title to select specific fields",
      availableFields,
      data: books,
    });
  }

  const requestedFields = fieldsParam
    .split(",")
    .map((f) => f.trim().toLowerCase());
  const validFields = requestedFields.filter((f) =>
    availableFields.includes(f),
  );
  const invalidFields = requestedFields.filter(
    (f) => !availableFields.includes(f),
  );

  const selectedData = books.map((book) => {
    const selected = {};
    validFields.forEach((field) => {
      selected[field] = book[field];
    });
    return selected;
  });

  res.json({
    success: true,
    selectedFields: validFields,
    invalidFields: invalidFields.length > 0 ? invalidFields : undefined,
    availableFields,
    data: selectedData,
  });
});

// ============================================================================
// 📋 HEAD REQUEST DEMO
// ============================================================================

/**
 * HEAD /api/books - Get metadata without the response body
 *
 * 🎯 CONCEPT: HEAD is like GET but returns only headers, no body
 *
 * Useful for: checking if resource exists, getting content length, caching
 */
app.head("/api/books", (req, res) => {
  res.set({
    "X-Total-Count": books.length,
    "X-Last-Modified": new Date().toISOString(),
    "Content-Type": "application/json",
  });
  res.status(200).end();
});

// ============================================================================
// 🔀 CONTENT NEGOTIATION API
// ============================================================================

/**
 * GET /api/data - Returns data in different formats based on Accept header
 *
 * 🎯 CONCEPT: Content negotiation lets clients request their preferred format
 *
 * Headers:
 * - Accept: application/json (default)
 * - Accept: application/xml
 * - Accept: text/csv
 * - Accept: text/plain
 */
app.get("/api/data", (req, res) => {
  const sampleData = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com" },
  ];

  const acceptHeader = req.headers.accept || "application/json";

  if (acceptHeader.includes("text/csv")) {
    res.set("Content-Type", "text/csv");
    const csv =
      "id,name,email\n" +
      sampleData.map((d) => `${d.id},${d.name},${d.email}`).join("\n");
    return res.send(csv);
  }

  if (acceptHeader.includes("application/xml")) {
    res.set("Content-Type", "application/xml");
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<users>
${sampleData.map((d) => `  <user><id>${d.id}</id><name>${d.name}</name><email>${d.email}</email></user>`).join("\n")}
</users>`;
    return res.send(xml);
  }

  if (acceptHeader.includes("text/plain")) {
    res.set("Content-Type", "text/plain");
    const text = sampleData
      .map((d) => `ID: ${d.id}, Name: ${d.name}, Email: ${d.email}`)
      .join("\n");
    return res.send(text);
  }

  // Default: JSON
  res.json({
    success: true,
    message: "Content negotiation demo",
    tip: "Try different Accept headers: application/json, application/xml, text/csv, text/plain",
    acceptedFormat: "application/json",
    data: sampleData,
  });
});

// ============================================================================
// 🔑 IDEMPOTENCY KEY DEMO
// ============================================================================

const processedIdempotencyKeys = new Map();

/**
 * POST /api/payment - Simulates a payment with idempotency key
 *
 * 🎯 CONCEPT: Idempotency keys prevent duplicate operations (crucial for payments!)
 *
 * Header: X-Idempotency-Key: unique-key-here
 */
app.post("/api/payment", (req, res) => {
  const idempotencyKey = req.headers["x-idempotency-key"];
  const { amount, currency, description } = req.body;

  if (!idempotencyKey) {
    return res.status(400).json({
      success: false,
      error: "Missing X-Idempotency-Key header",
      tip: "Include a unique key to prevent duplicate payments",
      example: "X-Idempotency-Key: order-12345-attempt-1",
    });
  }

  if (!amount || typeof amount !== "number") {
    return res.status(400).json({
      success: false,
      error: "Invalid amount",
    });
  }

  // Check if we've seen this idempotency key before
  if (processedIdempotencyKeys.has(idempotencyKey)) {
    const cachedResponse = processedIdempotencyKeys.get(idempotencyKey);
    return res.status(200).json({
      ...cachedResponse,
      note: "⚠️ This is a cached response - the original request was already processed",
      idempotencyKeyReused: true,
    });
  }

  // Process the "payment"
  const payment = {
    id: `PAY-${Date.now()}`,
    amount,
    currency: currency || "USD",
    description: description || "No description",
    status: "completed",
    processedAt: new Date().toISOString(),
  };

  // Cache the response
  const response = {
    success: true,
    message: "Payment processed successfully!",
    idempotencyKey,
    data: payment,
  };
  processedIdempotencyKeys.set(idempotencyKey, response);

  res.status(201).json(response);
});

// ============================================================================
// 🏷️ API VERSIONING DEMO
// ============================================================================

/**
 * GET /api/v1/greeting - Version 1 of the greeting API
 * GET /api/v2/greeting - Version 2 with more features
 *
 * 🎯 CONCEPT: API versioning allows backward compatibility while adding features
 */
app.get("/api/v1/greeting", (req, res) => {
  const name = req.query.name || "World";
  res.json({
    apiVersion: "1.0",
    message: `Hello, ${name}!`,
  });
});

app.get("/api/v2/greeting", (req, res) => {
  const name = req.query.name || "World";
  const language = req.query.lang || "en";

  const greetings = {
    en: "Hello",
    es: "Hola",
    fr: "Bonjour",
    de: "Hallo",
    ja: "こんにちは",
    hi: "नमस्ते",
  };

  const greeting = greetings[language] || greetings.en;

  res.json({
    apiVersion: "2.0",
    message: `${greeting}, ${name}!`,
    language,
    supportedLanguages: Object.keys(greetings),
    newInV2: ["Multiple language support", "Language detection"],
  });
});

// ============================================================================
// ⏰ CONDITIONAL REQUESTS - ETag Demo
// ============================================================================

let articleContent = "This is the original article content.";
let articleETag = '"v1"'; // ETags are usually quoted strings

/**
 * GET /api/article - Get article with ETag for caching
 *
 * 🎯 CONCEPT: ETags enable efficient caching - only fetch if content changed
 *
 * Headers:
 * - If-None-Match: "etag-value" - Returns 304 if content unchanged
 */
app.get("/api/article", (req, res) => {
  const clientETag = req.headers["if-none-match"];

  if (clientETag === articleETag) {
    // Content hasn't changed - tell client to use cached version
    return res.status(304).end();
  }

  res.set("ETag", articleETag);
  res.json({
    success: true,
    etag: articleETag,
    content: articleContent,
    tip: 'Save the ETag and send it as "If-None-Match" header to check for updates',
  });
});

/**
 * PUT /api/article - Update article (changes the ETag)
 *
 * Body: { content: "new content" }
 */
app.put("/api/article", (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ success: false, error: "Missing content" });
  }

  articleContent = content;
  articleETag = `"v${Date.now()}"`;

  res.set("ETag", articleETag);
  res.json({
    success: true,
    message: "Article updated",
    newETag: articleETag,
    content: articleContent,
  });
});

// ============================================================================
// 🔄 WEBHOOK SIMULATION
// ============================================================================

const webhookEvents = [];

/**
 * POST /api/webhooks/register - Register a webhook URL
 *
 * 🎯 CONCEPT: Webhooks are callback URLs that receive notifications when events occur
 *
 * Body: { url, events: ["order.created", "order.updated"] }
 */
app.post("/api/webhooks/simulate", (req, res) => {
  const { event, data } = req.body;

  if (!event) {
    return res.status(400).json({
      success: false,
      error: "Missing 'event' field",
      availableEvents: [
        "order.created",
        "order.shipped",
        "payment.completed",
        "user.registered",
      ],
    });
  }

  const webhookPayload = {
    id: `evt_${Date.now()}`,
    type: event,
    timestamp: new Date().toISOString(),
    data: data || { message: "Sample event data" },
  };

  webhookEvents.push(webhookPayload);

  res.status(201).json({
    success: true,
    message: "Webhook event simulated!",
    explanation:
      "In a real system, this payload would be sent to your registered webhook URL",
    payload: webhookPayload,
    tip: "GET /api/webhooks/events to see all simulated events",
  });
});

app.get("/api/webhooks/events", (req, res) => {
  res.json({
    success: true,
    count: webhookEvents.length,
    events: webhookEvents.slice(-10), // Last 10 events
  });
});

// ============================================================================
// 🔍 HEALTH CHECK & METADATA API
// ============================================================================

/**
 * GET /api/health - Standard health check endpoint
 *
 * 🎯 CONCEPT: Health endpoints let monitoring tools check if the API is running
 */
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: "1.0.0",
  });
});

/**
 * GET /api/info - API metadata and documentation hints
 */
app.get("/api/info", (req, res) => {
  res.json({
    name: "API 101 Learning Playground",
    version: "1.0.0",
    description: "An interactive API for learning REST concepts",
    endpoints: {
      core: ["/api/books", "/api/users", "/api/search"],
      learning: ["/api/echo", "/api/status/:code", "/api/slow", "/api/random"],
      advanced: [
        "/api/products (pagination)",
        "/api/limited (rate limiting)",
        "/api/bulk/* (batch operations)",
        "/api/books/:id/reviews (nested resources)",
        "/api/books-select (field selection)",
        "/api/data (content negotiation)",
        "/api/payment (idempotency)",
        "/api/v1/greeting, /api/v2/greeting (versioning)",
        "/api/article (ETags/caching)",
        "/api/webhooks/* (webhook simulation)",
        "/api/health (health check)",
      ],
    },
    documentation: "Visit http://localhost:3000 for the interactive playground",
  });
});

// ============================================================================
// ❌ ERROR HANDLING
// ============================================================================

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Endpoint not found",
    requestedUrl: req.url,
    method: req.method,
    tip: "Visit / to see all available endpoints",
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    message: err.message,
  });
});

// ============================================================================
// 🚀 START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log("\n");
  console.log(
    "╔══════════════════════════════════════════════════════════════════╗",
  );
  console.log(
    "║                                                                  ║",
  );
  console.log(
    "║   🎉 API 101 Learning Playground is running!                     ║",
  );
  console.log(
    "║                                                                  ║",
  );
  console.log(
    `║   🌐 Server: http://localhost:${PORT}                              ║`,
  );
  console.log(
    "║   📖 Open in browser to see the interactive playground          ║",
  );
  console.log(
    "║                                                                  ║",
  );
  console.log(
    "║   Try these in your browser:                                    ║",
  );
  console.log(
    `║   - http://localhost:${PORT}/                                      ║`,
  );
  console.log(
    `║   - http://localhost:${PORT}/api/books                             ║`,
  );
  console.log(
    `║   - http://localhost:${PORT}/api/books?genre=Technology            ║`,
  );
  console.log(
    `║   - http://localhost:${PORT}/api/random                            ║`,
  );
  console.log(
    "║                                                                  ║",
  );
  console.log(
    "║   Press Ctrl+C to stop the server                               ║",
  );
  console.log(
    "║                                                                  ║",
  );
  console.log(
    "╚══════════════════════════════════════════════════════════════════╝",
  );
  console.log("\n");
});
