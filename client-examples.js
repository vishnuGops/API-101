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
 * This file demonstrates:
 * - GET requests (retrieve data)
 * - POST requests (create data)
 * - PUT requests (replace data)
 * - PATCH requests (update data)
 * - DELETE requests (remove data)
 * - Query parameters
 * - Request headers
 * - Request body (JSON)
 * - Error handling
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
      "║                                                                      ║",
    );
    console.log(
      "║  Key Concepts:                                                       ║",
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
      "╚══════════════════════════════════════════════════════════════════════╝",
    );
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.log("\n💡 Make sure the server is running: npm start");
  }
}

// Run all examples
runExamples();
