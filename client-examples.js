/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    API 101 - Client Examples                                  ║
 * ║           Learn how to make HTTP requests programmatically                    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Before running this file:
 * 1. Start the server: npm start
 * 2. In another terminal: npm run client
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * BASIC CONCEPTS (Examples 1-15):
 * ═══════════════════════════════════════════════════════════════════════════════
 * - GET requests (retrieve data)
 * - POST requests (create data)
 * - PUT requests (replace data)
 * - PATCH requests (update data)
 * - DELETE requests (remove data)
 * - Path parameters (/books/:id)
 * - Query parameters (?genre=Tech&limit=5)
 * - Request headers (Authorization, Content-Type)
 * - Request body (JSON)
 * - Error handling
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 * ADVANCED CONCEPTS (Examples 16-27):
 * ═══════════════════════════════════════════════════════════════════════════════
 * - Pagination (?page=1&limit=10)
 * - Rate Limiting (X-RateLimit-* headers, 429 status)
 * - Bulk Operations (batch create/update)
 * - Nested Resources (/books/1/reviews)
 * - Field Selection (?fields=id,title)
 * - Content Negotiation (Accept header for JSON/XML/CSV)
 * - Idempotency Keys (X-Idempotency-Key header)
 * - API Versioning (/api/v1/ vs /api/v2/)
 * - ETags & Conditional Requests (If-None-Match, 304)
 * - Webhooks (event simulation)
 * - Health Checks (/api/health)
 * - API Discovery (/api/info)
 */

const BASE_URL = "http://localhost:3000";

// Helper function to print responses nicely
function printResponse(label, response) {
  console.log("\n" + "═".repeat(70));
  console.log(`🔹 ${label}`);
  console.log("─".repeat(70));
  console.log(JSON.stringify(response, null, 2));
  console.log("═".repeat(70));
}

// Helper to add delay between examples
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runExamples() {
  console.log("\n");
  console.log(
    "╔══════════════════════════════════════════════════════════════════════╗",
  );
  console.log(
    "║                    API 101 - Client Examples                         ║",
  );
  console.log(
    "╚══════════════════════════════════════════════════════════════════════╝",
  );
  console.log(
    "\n⏳ Make sure the server is running (npm start) in another terminal!\n",
  );

  await delay(1000);

  try {
    // ====================================================================
    // EXAMPLE 1: Simple GET Request
    // ====================================================================
    console.log("\n📚 EXAMPLE 1: Simple GET Request");
    console.log('   fetch("http://localhost:3000/api/books")');
    console.log("   This retrieves all books from the API");

    const booksResponse = await fetch(`${BASE_URL}/api/books`);
    const booksData = await booksResponse.json();
    printResponse("GET /api/books - All Books", booksData);

    await delay(500);

    // ====================================================================
    // EXAMPLE 2: GET with Path Parameter
    // ====================================================================
    console.log("\n📚 EXAMPLE 2: GET with Path Parameter");
    console.log('   fetch("http://localhost:3000/api/books/1")');
    console.log('   The number at the end (1) is a "path parameter"');

    const singleBookResponse = await fetch(`${BASE_URL}/api/books/1`);
    const singleBookData = await singleBookResponse.json();
    printResponse("GET /api/books/1 - Single Book", singleBookData);

    await delay(500);

    // ====================================================================
    // EXAMPLE 3: GET with Query Parameters
    // ====================================================================
    console.log("\n📚 EXAMPLE 3: GET with Query Parameters");
    console.log(
      '   fetch("http://localhost:3000/api/books?genre=Technology&limit=2")',
    );
    console.log("   Query params come after ? and filter/modify the results");

    const filteredResponse = await fetch(
      `${BASE_URL}/api/books?genre=Technology&limit=2`,
    );
    const filteredData = await filteredResponse.json();
    printResponse("GET /api/books?genre=Technology&limit=2", filteredData);

    await delay(500);

    // ====================================================================
    // EXAMPLE 4: POST Request (Create New Data)
    // ====================================================================
    console.log("\n📚 EXAMPLE 4: POST Request - Create New Data");
    console.log(`   fetch(url, {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ ... })
   })`);

    const newBook = {
      title: "Learning APIs the Fun Way",
      author: "You, the Learner",
      year: 2024,
      genre: "Education",
    };

    const postResponse = await fetch(`${BASE_URL}/api/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Tell the server we're sending JSON
      },
      body: JSON.stringify(newBook), // Convert object to JSON string
    });
    const postData = await postResponse.json();
    printResponse("POST /api/books - Create Book", postData);

    await delay(500);

    // ====================================================================
    // EXAMPLE 5: PUT Request (Replace Entire Resource)
    // ====================================================================
    console.log("\n📚 EXAMPLE 5: PUT Request - Replace Entire Resource");
    console.log(
      "   PUT requires ALL fields because it replaces the whole resource",
    );

    const replaceBook = {
      title: "Completely New Title",
      author: "Completely New Author",
      year: 2025,
      genre: "Fiction",
    };

    const putResponse = await fetch(`${BASE_URL}/api/books/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(replaceBook),
    });
    const putData = await putResponse.json();
    printResponse("PUT /api/books/1 - Replace Book", putData);

    await delay(500);

    // ====================================================================
    // EXAMPLE 6: PATCH Request (Partial Update)
    // ====================================================================
    console.log("\n📚 EXAMPLE 6: PATCH Request - Partial Update");
    console.log("   PATCH only updates the fields you send");

    const partialUpdate = {
      year: 2030, // Only updating the year
    };

    const patchResponse = await fetch(`${BASE_URL}/api/books/2`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partialUpdate),
    });
    const patchData = await patchResponse.json();
    printResponse("PATCH /api/books/2 - Update Year Only", patchData);

    await delay(500);

    // ====================================================================
    // EXAMPLE 7: DELETE Request
    // ====================================================================
    console.log("\n📚 EXAMPLE 7: DELETE Request");
    console.log("   DELETE removes a resource from the server");

    const deleteResponse = await fetch(`${BASE_URL}/api/books/4`, {
      method: "DELETE",
    });
    const deleteData = await deleteResponse.json();
    printResponse("DELETE /api/books/4", deleteData);

    await delay(500);

    // ====================================================================
    // EXAMPLE 8: Request with Authorization Header
    // ====================================================================
    console.log("\n📚 EXAMPLE 8: Request with Authorization Header");
    console.log("   Many APIs require authentication via headers");

    // First, try WITHOUT the header (should fail)
    const noAuthResponse = await fetch(`${BASE_URL}/api/users`);
    const noAuthData = await noAuthResponse.json();
    printResponse(
      "GET /api/users (No Auth) - Status: " + noAuthResponse.status,
      noAuthData,
    );

    await delay(300);

    // Now WITH the authorization header
    const authResponse = await fetch(`${BASE_URL}/api/users`, {
      headers: {
        Authorization: "Bearer secret-token-123",
      },
    });
    const authData = await authResponse.json();
    printResponse(
      "GET /api/users (With Auth) - Status: " + authResponse.status,
      authData,
    );

    await delay(500);

    // ====================================================================
    // EXAMPLE 9: Custom Headers (API Key)
    // ====================================================================
    console.log("\n📚 EXAMPLE 9: Custom Headers - API Key");
    console.log("   APIs often use custom headers like X-API-Key");

    const apiKeyResponse = await fetch(`${BASE_URL}/api/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "my-secret-api-key", // Custom header
      },
      body: JSON.stringify({
        username: "newuser",
        email: "newuser@example.com",
      }),
    });
    const apiKeyData = await apiKeyResponse.json();
    printResponse("POST /api/users with X-API-Key header", apiKeyData);

    await delay(500);

    // ====================================================================
    // EXAMPLE 10: Echo Request (Debug Tool)
    // ====================================================================
    console.log("\n📚 EXAMPLE 10: Echo Request - See What You Sent");
    console.log("   The echo endpoint shows exactly what the server received");

    const echoResponse = await fetch(`${BASE_URL}/api/echo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": "Hello from client!",
        Authorization: "Bearer my-token",
      },
      body: JSON.stringify({
        message: "This is my message",
        data: { nested: { values: [1, 2, 3] } },
      }),
    });
    const echoData = await echoResponse.json();
    printResponse("POST /api/echo", echoData);

    await delay(500);

    // ====================================================================
    // EXAMPLE 11: Handling Different Status Codes
    // ====================================================================
    console.log("\n📚 EXAMPLE 11: Different HTTP Status Codes");

    const statusCodes = [200, 404, 500];
    for (const code of statusCodes) {
      const statusResponse = await fetch(`${BASE_URL}/api/status/${code}`);
      const statusData = await statusResponse.json();
      console.log(
        `\n   Status ${code}:`,
        statusData.meaning,
        "-",
        statusData.description,
      );
    }

    await delay(500);

    // ====================================================================
    // EXAMPLE 12: Search with Multiple Query Parameters
    // ====================================================================
    console.log("\n📚 EXAMPLE 12: Search with Multiple Query Parameters");

    const searchParams = new URLSearchParams({
      q: "API",
      minYear: "2020",
      maxYear: "2025",
    });

    const searchResponse = await fetch(
      `${BASE_URL}/api/search?${searchParams}`,
    );
    const searchData = await searchResponse.json();
    printResponse(`GET /api/search?${searchParams}`, searchData);

    await delay(500);

    // ====================================================================
    // EXAMPLE 13: Calculator API (POST with operations)
    // ====================================================================
    console.log("\n📚 EXAMPLE 13: Calculator API");

    const calcResponse = await fetch(`${BASE_URL}/api/calculate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        operation: "multiply",
        a: 7,
        b: 8,
      }),
    });
    const calcData = await calcResponse.json();
    printResponse("POST /api/calculate (7 × 8)", calcData);

    await delay(500);

    // ====================================================================
    // EXAMPLE 14: Handling Errors
    // ====================================================================
    console.log("\n📚 EXAMPLE 14: Error Handling");
    console.log("   Always check response.ok and status codes!");

    const errorResponse = await fetch(`${BASE_URL}/api/books/99999`);

    console.log(`   Response OK: ${errorResponse.ok}`);
    console.log(`   Status Code: ${errorResponse.status}`);
    console.log(`   Status Text: ${errorResponse.statusText}`);

    if (!errorResponse.ok) {
      const errorData = await errorResponse.json();
      printResponse("GET /api/books/99999 - Error Response", errorData);
    }

    await delay(500);

    // ====================================================================
    // EXAMPLE 15: Random Data
    // ====================================================================
    console.log("\n📚 EXAMPLE 15: Dynamic/Random Data");
    console.log(
      "   Call the same endpoint multiple times for different results",
    );

    for (let i = 1; i <= 3; i++) {
      const randomResponse = await fetch(`${BASE_URL}/api/random`);
      const randomData = await randomResponse.json();
      console.log(
        `\n   Call ${i}: Random number = ${randomData.randomNumber}, Color = ${randomData.randomColor}`,
      );
    }

    await delay(500);

    // ════════════════════════════════════════════════════════════════════
    // ═══════════════════ ADVANCED API EXAMPLES ══════════════════════════
    // ════════════════════════════════════════════════════════════════════

    console.log("\n\n");
    console.log(
      "╔══════════════════════════════════════════════════════════════════════╗",
    );
    console.log(
      "║              ADVANCED API CONCEPTS - EXAMPLES 16-27                  ║",
    );
    console.log(
      "╚══════════════════════════════════════════════════════════════════════╝",
    );

    await delay(500);

    // ====================================================================
    // EXAMPLE 16: Pagination
    // ====================================================================
    /**
     * 🎯 CONCEPT: Pagination
     * When APIs have lots of data, they return it in "pages" to avoid
     * overwhelming the client with huge responses.
     *
     * Common parameters:
     * - page: which page number (1, 2, 3...)
     * - limit: how many items per page
     */
    console.log("\n📚 EXAMPLE 16: Pagination");
    console.log("   Large datasets are split into pages for efficiency");
    console.log("   Use ?page=N&limit=M to navigate through data");

    // Get first page
    const page1Response = await fetch(
      `${BASE_URL}/api/products?page=1&limit=5`,
    );
    const page1Data = await page1Response.json();
    console.log(`\n   Page 1: Got ${page1Data.data.length} items`);
    console.log(`   Total items: ${page1Data.pagination.totalItems}`);
    console.log(`   Total pages: ${page1Data.pagination.totalPages}`);
    console.log(`   Has next page: ${page1Data.pagination.hasNextPage}`);

    // Get second page
    const page2Response = await fetch(
      `${BASE_URL}/api/products?page=2&limit=5`,
    );
    const page2Data = await page2Response.json();
    console.log(
      `\n   Page 2: Got items ${page2Data.data[0]?.id} through ${page2Data.data[page2Data.data.length - 1]?.id}`,
    );

    // Filter + paginate
    const filteredPageResponse = await fetch(
      `${BASE_URL}/api/products?page=1&limit=3&category=Electronics`,
    );
    const filteredPageData = await filteredPageResponse.json();
    console.log(
      `\n   Filtered (Electronics only): ${filteredPageData.pagination.totalItems} items total`,
    );

    await delay(500);

    // ====================================================================
    // EXAMPLE 17: Rate Limiting
    // ====================================================================
    /**
     * 🎯 CONCEPT: Rate Limiting
     * APIs limit how many requests you can make to prevent abuse.
     * Watch the X-RateLimit-* headers in the response!
     *
     * When you exceed the limit, you get 429 Too Many Requests.
     */
    console.log("\n📚 EXAMPLE 17: Rate Limiting");
    console.log(
      "   APIs protect themselves by limiting requests per time window",
    );
    console.log(
      "   Making 6 requests to trigger the rate limit (5/minute)...\n",
    );

    for (let i = 1; i <= 6; i++) {
      const rateLimitResponse = await fetch(`${BASE_URL}/api/limited`);
      const rateLimitData = await rateLimitResponse.json();

      // Extract rate limit headers
      const remaining = rateLimitResponse.headers.get("X-RateLimit-Remaining");

      if (rateLimitResponse.status === 429) {
        console.log(`   Request ${i}: ❌ RATE LIMITED! (Status: 429)`);
        console.log(`   Message: ${rateLimitData.message}`);
        console.log(
          `   Retry after: ${rateLimitData.retryAfterSeconds} seconds`,
        );
      } else {
        console.log(`   Request ${i}: ✓ OK - Remaining: ${remaining}`);
      }
    }

    await delay(500);

    // ====================================================================
    // EXAMPLE 18: Bulk Operations
    // ====================================================================
    /**
     * 🎯 CONCEPT: Bulk Operations
     * Create or update multiple items in a single request.
     * Much more efficient than making separate API calls!
     */
    console.log("\n📚 EXAMPLE 18: Bulk Operations");
    console.log("   Create/update multiple items in one request");

    // Bulk create
    const bulkCreateResponse = await fetch(`${BASE_URL}/api/bulk/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [
          { name: "Widget Alpha", quantity: 100 },
          { name: "Widget Beta", quantity: 50 },
          { name: "Widget Gamma", quantity: 75 },
        ],
      }),
    });
    const bulkCreateData = await bulkCreateResponse.json();
    console.log(
      `\n   Bulk Create: ${bulkCreateData.summary.successful}/${bulkCreateData.summary.total} items created`,
    );

    // View inventory
    const inventoryResponse = await fetch(`${BASE_URL}/api/inventory`);
    const inventoryData = await inventoryResponse.json();
    console.log(`   Current inventory: ${inventoryData.count} items`);

    // Bulk update
    const bulkUpdateResponse = await fetch(`${BASE_URL}/api/bulk/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        updates: [
          { sku: "SKU001", quantity: 999 },
          { sku: "SKU002", quantity: 888 },
        ],
      }),
    });
    const bulkUpdateData = await bulkUpdateResponse.json();
    console.log(
      `   Bulk Update: ${bulkUpdateData.summary.successful} items updated`,
    );

    await delay(500);

    // ====================================================================
    // EXAMPLE 19: Nested Resources
    // ====================================================================
    /**
     * 🎯 CONCEPT: Nested Resources
     * Resources can belong to other resources.
     * URL pattern: /parent/:parentId/children
     * Example: /books/1/reviews = reviews for book 1
     */
    console.log("\n📚 EXAMPLE 19: Nested Resources (Books → Reviews)");
    console.log("   URL pattern shows relationships: /books/1/reviews");

    // Get reviews for book 1
    const reviewsResponse = await fetch(`${BASE_URL}/api/books/1/reviews`);
    const reviewsData = await reviewsResponse.json();
    console.log(`\n   Book: "${reviewsData.book.title}"`);
    console.log(`   Reviews: ${reviewsData.reviewCount}`);
    console.log(`   Average Rating: ${reviewsData.averageRating}/5`);

    // Add a new review
    const newReviewResponse = await fetch(`${BASE_URL}/api/books/1/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rating: 5,
        comment: "Learned so much about APIs!",
        author: "Client Example User",
      }),
    });
    const newReviewData = await newReviewResponse.json();
    console.log(
      `   Added review: "${newReviewData.data.comment}" (${newReviewData.data.rating}★)`,
    );

    await delay(500);

    // ====================================================================
    // EXAMPLE 20: Field Selection
    // ====================================================================
    /**
     * 🎯 CONCEPT: Field Selection (Sparse Fieldsets)
     * Request only the fields you need to reduce payload size.
     * Similar to GraphQL's field selection but in REST.
     */
    console.log("\n📚 EXAMPLE 20: Field Selection");
    console.log("   Request only the fields you need with ?fields=...");

    // Get all fields
    const allFieldsResponse = await fetch(`${BASE_URL}/api/books-select`);
    const allFieldsData = await allFieldsResponse.json();
    console.log(
      `\n   All fields: ${Object.keys(allFieldsData.data[0]).join(", ")}`,
    );

    // Get only id and title
    const selectFieldsResponse = await fetch(
      `${BASE_URL}/api/books-select?fields=id,title`,
    );
    const selectFieldsData = await selectFieldsResponse.json();
    console.log(
      `   Selected fields: ${Object.keys(selectFieldsData.data[0]).join(", ")}`,
    );
    console.log(
      `   Sample: { id: ${selectFieldsData.data[0].id}, title: "${selectFieldsData.data[0].title}" }`,
    );

    await delay(500);

    // ====================================================================
    // EXAMPLE 21: Content Negotiation
    // ====================================================================
    /**
     * 🎯 CONCEPT: Content Negotiation
     * The Accept header tells the server what format you want.
     * Same data, different representations (JSON, XML, CSV).
     */
    console.log("\n📚 EXAMPLE 21: Content Negotiation (Accept Header)");
    console.log("   Same endpoint, different formats based on Accept header");

    // JSON (default)
    const jsonResponse = await fetch(`${BASE_URL}/api/data`, {
      headers: { Accept: "application/json" },
    });
    const contentTypeJson = jsonResponse.headers.get("Content-Type");
    console.log(
      `\n   Accept: application/json → Content-Type: ${contentTypeJson}`,
    );

    // XML
    const xmlResponse = await fetch(`${BASE_URL}/api/data`, {
      headers: { Accept: "application/xml" },
    });
    const contentTypeXml = xmlResponse.headers.get("Content-Type");
    const xmlText = await xmlResponse.text();
    console.log(`   Accept: application/xml → Content-Type: ${contentTypeXml}`);
    console.log(`   Response preview: ${xmlText.substring(0, 60)}...`);

    // CSV
    const csvResponse = await fetch(`${BASE_URL}/api/data`, {
      headers: { Accept: "text/csv" },
    });
    const contentTypeCsv = csvResponse.headers.get("Content-Type");
    const csvText = await csvResponse.text();
    console.log(`   Accept: text/csv → Content-Type: ${contentTypeCsv}`);
    console.log(`   Response preview: ${csvText.substring(0, 50)}...`);

    await delay(500);

    // ====================================================================
    // EXAMPLE 22: Idempotency Keys
    // ====================================================================
    /**
     * 🎯 CONCEPT: Idempotency Keys
     * Prevent duplicate operations (crucial for payments!).
     * Same idempotency key = same result, no matter how many times you call.
     */
    console.log("\n📚 EXAMPLE 22: Idempotency Keys (Prevent Duplicates)");
    console.log("   Critical for payments - same key returns cached result");

    const idempotencyKey = `order-${Date.now()}-unique`;

    // First payment attempt
    const payment1Response = await fetch(`${BASE_URL}/api/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify({
        amount: 99.99,
        currency: "USD",
        description: "API Course Purchase",
      }),
    });
    const payment1Data = await payment1Response.json();
    console.log(
      `\n   1st request: Payment ${payment1Data.data.id} created (Status: ${payment1Response.status})`,
    );

    // Retry with SAME key (simulates network retry)
    const payment2Response = await fetch(`${BASE_URL}/api/payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": idempotencyKey, // Same key!
      },
      body: JSON.stringify({
        amount: 99.99,
        currency: "USD",
        description: "API Course Purchase",
      }),
    });
    const payment2Data = await payment2Response.json();
    console.log(
      `   2nd request (same key): ${payment2Data.idempotencyKeyReused ? "⚠️ CACHED RESPONSE - No duplicate charge!" : "New payment"}`,
    );
    console.log(`   Same payment ID: ${payment2Data.data.id}`);

    await delay(500);

    // ====================================================================
    // EXAMPLE 23: API Versioning
    // ====================================================================
    /**
     * 🎯 CONCEPT: API Versioning
     * APIs evolve over time. Versioning maintains backward compatibility.
     * Old clients use v1, new features available in v2.
     */
    console.log("\n📚 EXAMPLE 23: API Versioning");
    console.log("   /api/v1/ vs /api/v2/ - Different features, same base");

    // Version 1 - Simple
    const v1Response = await fetch(
      `${BASE_URL}/api/v1/greeting?name=Developer`,
    );
    const v1Data = await v1Response.json();
    console.log(`\n   V1 (${v1Data.apiVersion}): ${v1Data.message}`);

    // Version 2 - English
    const v2Response = await fetch(
      `${BASE_URL}/api/v2/greeting?name=Developer`,
    );
    const v2Data = await v2Response.json();
    console.log(`   V2 (${v2Data.apiVersion}): ${v2Data.message}`);

    // Version 2 - Spanish (new feature!)
    const v2EsResponse = await fetch(
      `${BASE_URL}/api/v2/greeting?name=Amigo&lang=es`,
    );
    const v2EsData = await v2EsResponse.json();
    console.log(`   V2 Spanish: ${v2EsData.message}`);

    // Version 2 - Japanese
    const v2JaResponse = await fetch(
      `${BASE_URL}/api/v2/greeting?name=友達&lang=ja`,
    );
    const v2JaData = await v2JaResponse.json();
    console.log(`   V2 Japanese: ${v2JaData.message}`);

    console.log(`   V2 new features: ${v2Data.newInV2.join(", ")}`);

    await delay(500);

    // ====================================================================
    // EXAMPLE 24: ETags and Conditional Requests
    // ====================================================================
    /**
     * 🎯 CONCEPT: ETags (Entity Tags)
     * ETags identify specific versions of a resource.
     * Send If-None-Match header to check if your cache is still valid.
     * If unchanged, server returns 304 (use your cached copy).
     */
    console.log("\n📚 EXAMPLE 24: ETags and Conditional Requests (Caching)");
    console.log("   ETags help avoid transferring unchanged data");

    // First request - get the article and its ETag
    const articleResponse = await fetch(`${BASE_URL}/api/article`);
    const articleData = await articleResponse.json();
    const etag = articleResponse.headers.get("ETag");
    console.log(`\n   GET /api/article → ETag: ${etag}`);
    console.log(`   Content: "${articleData.content.substring(0, 40)}..."`);

    // Conditional request with If-None-Match
    const conditionalResponse = await fetch(`${BASE_URL}/api/article`, {
      headers: { "If-None-Match": etag },
    });
    console.log(`   GET with If-None-Match: ${etag}`);
    console.log(
      `   Status: ${conditionalResponse.status} ${conditionalResponse.status === 304 ? "(Not Modified - use cache!)" : ""}`,
    );

    // Update the article (changes ETag)
    const updateArticleResponse = await fetch(`${BASE_URL}/api/article`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: "Updated article content at " + new Date().toISOString(),
      }),
    });
    const updateArticleData = await updateArticleResponse.json();
    console.log(`   PUT (update) → New ETag: ${updateArticleData.newETag}`);

    // Now conditional request returns full content (ETag changed)
    const newConditionalResponse = await fetch(`${BASE_URL}/api/article`, {
      headers: { "If-None-Match": etag }, // Old ETag
    });
    console.log(
      `   GET with OLD ETag: Status ${newConditionalResponse.status} (${newConditionalResponse.status === 200 ? "Full content - cache invalid" : ""})`,
    );

    await delay(500);

    // ====================================================================
    // EXAMPLE 25: Webhooks (Event Simulation)
    // ====================================================================
    /**
     * 🎯 CONCEPT: Webhooks
     * Instead of polling an API, webhooks push events TO YOU.
     * When something happens, the server calls YOUR endpoint.
     * This simulates what a webhook payload looks like.
     */
    console.log("\n📚 EXAMPLE 25: Webhooks (Event-Driven Architecture)");
    console.log("   Webhooks push events to your server when things happen");

    // Simulate an order.created event
    const webhook1Response = await fetch(`${BASE_URL}/api/webhooks/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "order.created",
        data: {
          orderId: "ORD-12345",
          customer: "john@example.com",
          total: 149.99,
        },
      }),
    });
    const webhook1Data = await webhook1Response.json();
    console.log(`\n   Simulated: ${webhook1Data.payload.type}`);
    console.log(`   Event ID: ${webhook1Data.payload.id}`);

    // Simulate a payment.completed event
    const webhook2Response = await fetch(`${BASE_URL}/api/webhooks/simulate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "payment.completed",
        data: { paymentId: "PAY-67890", amount: 149.99, status: "success" },
      }),
    });
    const webhook2Data = await webhook2Response.json();
    console.log(`   Simulated: ${webhook2Data.payload.type}`);

    // View all simulated events
    const eventsResponse = await fetch(`${BASE_URL}/api/webhooks/events`);
    const eventsData = await eventsResponse.json();
    console.log(`   Total events in log: ${eventsData.count}`);

    await delay(500);

    // ====================================================================
    // EXAMPLE 26: Health Check Endpoint
    // ====================================================================
    /**
     * 🎯 CONCEPT: Health Checks
     * Monitoring tools ping /health to verify the API is running.
     * Load balancers use this to route traffic only to healthy servers.
     */
    console.log("\n📚 EXAMPLE 26: Health Check Endpoint");
    console.log("   Monitoring tools use /health to check if API is up");

    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthResponse.json();
    console.log(`\n   Status: ${healthData.status}`);
    console.log(`   Uptime: ${Math.round(healthData.uptime)} seconds`);
    console.log(`   Version: ${healthData.version}`);

    await delay(500);

    // ====================================================================
    // EXAMPLE 27: API Info/Discovery
    // ====================================================================
    /**
     * 🎯 CONCEPT: API Discovery
     * Info endpoints help developers discover available endpoints.
     * Acts as a lightweight alternative to full documentation.
     */
    console.log("\n📚 EXAMPLE 27: API Info/Discovery");
    console.log("   Metadata endpoint showing all available endpoints");

    const infoResponse = await fetch(`${BASE_URL}/api/info`);
    const infoData = await infoResponse.json();
    console.log(`\n   API: ${infoData.name}`);
    console.log(`   Version: ${infoData.version}`);
    console.log(`   Core endpoints: ${infoData.endpoints.core.length}`);
    console.log(`   Learning endpoints: ${infoData.endpoints.learning.length}`);
    console.log(`   Advanced endpoints: ${infoData.endpoints.advanced.length}`);

    // ====================================================================
    // SUMMARY
    // ====================================================================
    console.log("\n\n");
    console.log(
      "╔══════════════════════════════════════════════════════════════════════╗",
    );
    console.log(
      "║                         SUMMARY                                      ║",
    );
    console.log(
      "╠══════════════════════════════════════════════════════════════════════╣",
    );
    console.log(
      "║                                                                      ║",
    );
    console.log(
      "║  HTTP Methods:                                                       ║",
    );
    console.log(
      "║  • GET    - Retrieve data (no body, safe, idempotent)               ║",
    );
    console.log(
      "║  • POST   - Create new data (has body)                              ║",
    );
    console.log(
      "║  • PUT    - Replace entire resource (has body, idempotent)          ║",
    );
    console.log(
      "║  • PATCH  - Partial update (has body)                               ║",
    );
    console.log(
      "║  • DELETE - Remove resource (idempotent)                            ║",
    );
    console.log(
      "║  • HEAD   - Get headers only (no body)                              ║",
    );
    console.log(
      "║                                                                      ║",
    );
    console.log(
      "║  Basic Concepts:                                                     ║",
    );
    console.log(
      "║  • Path params: /books/1 (identify resource)                        ║",
    );
    console.log(
      "║  • Query params: ?genre=Tech (filter/modify)                        ║",
    );
    console.log(
      "║  • Headers: Authorization, Content-Type, custom                     ║",
    );
    console.log(
      "║  • Body: JSON data sent with POST/PUT/PATCH                         ║",
    );
    console.log(
      "║  • Status codes: 2xx success, 4xx client error, 5xx server error   ║",
    );
    console.log(
      "║                                                                      ║",
    );
    console.log(
      "║  Advanced Concepts:                                                  ║",
    );
    console.log(
      "║  • Pagination: ?page=1&limit=10 for large datasets                  ║",
    );
    console.log(
      "║  • Rate Limiting: X-RateLimit-* headers, 429 status                 ║",
    );
    console.log(
      "║  • Bulk Operations: Create/update multiple items at once            ║",
    );
    console.log(
      "║  • Nested Resources: /books/1/reviews (parent/child)                ║",
    );
    console.log(
      "║  • Field Selection: ?fields=id,name (reduce payload)                ║",
    );
    console.log(
      "║  • Content Negotiation: Accept header for JSON/XML/CSV              ║",
    );
    console.log(
      "║  • Idempotency: X-Idempotency-Key prevents duplicates               ║",
    );
    console.log(
      "║  • API Versioning: /api/v1/ vs /api/v2/ paths                       ║",
    );
    console.log(
      "║  • ETags: If-None-Match for efficient caching (304)                 ║",
    );
    console.log(
      "║  • Webhooks: Server pushes events to your endpoint                  ║",
    );
    console.log(
      "║  • Health Checks: /health for monitoring                            ║",
    );
    console.log(
      "║                                                                      ║",
    );
    console.log(
      "╚══════════════════════════════════════════════════════════════════════╝",
    );
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log("\n💡 Make sure the server is running: npm start");
  }
}

// Run all examples
runExamples();
