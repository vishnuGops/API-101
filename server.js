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
    availableEndpoints: [
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
