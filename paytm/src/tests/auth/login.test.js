import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";


// ==================================================
// 1. Prisma mock
// ==================================================

const { prismaMock } = vi.hoisted(() => {
  return {
    prismaMock: {
      user: {
        findUnique: vi.fn(),
      },
    },
  };
});


// ==================================================
// 2. Cookie mock
// ==================================================

const { cookieStoreMock } = vi.hoisted(() => {
  return {
    cookieStoreMock: {
      set: vi.fn(),
    },
  };
});


// ==================================================
// 3. bcrypt mock
// ==================================================

const { bcryptMock } = vi.hoisted(() => {
  return {
    bcryptMock: {
      compare: vi.fn(),
    },
  };
});


// ==================================================
// 4. Mock Prisma
// ==================================================

vi.mock("@/lib/prisma", () => ({
  default: prismaMock,
}));


// ==================================================
// 5. Mock Next.js cookies
// ==================================================

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue(
    cookieStoreMock
  ),
}));


// ==================================================
// 6. Mock bcrypt
// ==================================================

vi.mock("bcryptjs", () => ({
  default: bcryptMock,
}));


// ==================================================
// 7. Mock JWT
// ==================================================

vi.mock("@/lib/jwt", () => ({
  generateToken: vi.fn().mockReturnValue(
    "fake-jwt-token"
  ),
}));


// ==================================================
// 8. Import POST after mocks
// ==================================================

import { POST } from "@/app/api/auth/login/route.js";


// ==================================================
// LOGIN TESTS
// ==================================================

describe("POST /api/auth/login", () => {

  // Reset mock call history before every test
  beforeEach(() => {
    vi.clearAllMocks();
  });


  // =================================================
  // TEST 1: Successful login
  // =================================================

  it("should login successfully", async () => {

    // Simulate user found in database
    prismaMock.user.findUnique.mockResolvedValue({
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
      password: "hashed-password",
    });


    // Simulate correct password
    bcryptMock.compare.mockResolvedValue(true);


    // Create request
    const request = new Request(
      "http://localhost:3000/api/auth/login",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email: "test@example.com",
          password: "password123",
        }),
      }
    );


    // Call route
    const response = await POST(request);

    // Parse response
    const data = await response.json();


    // Check status
    expect(response.status).toBe(200);


    // Check response
    expect(data.success).toBe(true);

    expect(data.message).toBe(
      "Login Successful"
    );


    // Make sure password was checked
    expect(
      bcryptMock.compare
    ).toHaveBeenCalledWith(
      "password123",
      "hashed-password"
    );


    // Make sure cookie was set
    expect(
      cookieStoreMock.set
    ).toHaveBeenCalledWith(
      "token",
      "fake-jwt-token",
      expect.objectContaining({
        httpOnly: true,
        maxAge: 60 * 60,
        path: "/",
      })
    );

  });


  // =================================================
  // TEST 2: User not found
  // =================================================

  it(
    "should return 404 if user does not exist",
    async () => {

      // Simulate user not found
      prismaMock.user.findUnique.mockResolvedValue(
        null
      );


      // Create request
      const request = new Request(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: "unknown@example.com",
            password: "password123",
          }),
        }
      );


      // Call route
      const response = await POST(request);

      // Parse response
      const data = await response.json();


      // Check status
      expect(response.status).toBe(404);


      // Check response
      expect(data.success).toBe(false);

      expect(data.message).toBe(
        "User not found"
      );


      // Password should never be checked
      expect(
        bcryptMock.compare
      ).not.toHaveBeenCalled();


      // Cookie should not be set
      expect(
        cookieStoreMock.set
      ).not.toHaveBeenCalled();

    }
  );


  // =================================================
  // TEST 3: Incorrect password
  // =================================================

  it(
    "should return 401 if password is incorrect",
    async () => {

      // Simulate user found
      prismaMock.user.findUnique.mockResolvedValue({
        id: "user-123",
        name: "Test User",
        email: "test@example.com",
        password: "hashed-password",
      });


      // Simulate wrong password
      bcryptMock.compare.mockResolvedValue(false);


      // Create request
      const request = new Request(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: "test@example.com",
            password: "wrong-password",
          }),
        }
      );


      // Call route
      const response = await POST(request);

      // Parse response
      const data = await response.json();


      // Check status
      expect(response.status).toBe(401);


      // Check response
      expect(data.success).toBe(false);

      expect(data.message).toBe(
        "Invalid Credentials"
      );


      // Password should have been checked
      expect(
        bcryptMock.compare
      ).toHaveBeenCalledWith(
        "wrong-password",
        "hashed-password"
      );


      // Cookie should not be set
      expect(
        cookieStoreMock.set
      ).not.toHaveBeenCalled();

    }
  );


  // =================================================
  // TEST 4: Invalid input
  // =================================================

  it(
    "should return 400 for invalid login data",
    async () => {

      // Create request with invalid data
      const request = new Request(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: "invalid-email",
            password: "",
          }),
        }
      );


      // Call route
      const response = await POST(request);

      // Parse response
      const data = await response.json();


      // Check status
      expect(response.status).toBe(400);


      // Check response
      expect(data.success).toBe(false);


      // Validation errors should exist
      expect(data.errors).toBeDefined();


      // Database should not be called
      expect(
        prismaMock.user.findUnique
      ).not.toHaveBeenCalled();


      // bcrypt should not be called
      expect(
        bcryptMock.compare
      ).not.toHaveBeenCalled();


      // Cookie should not be set
      expect(
        cookieStoreMock.set
      ).not.toHaveBeenCalled();

    }
  );


  // =================================================
  // TEST 5: Database error
  // =================================================

  it(
    "should return 500 if database operation fails",
    async () => {

      // Simulate database error
      prismaMock.user.findUnique.mockRejectedValue(
        new Error("Database connection failed")
      );


      // Create request
      const request = new Request(
        "http://localhost:3000/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
        }
      );


      // Call route
      const response = await POST(request);

      // Parse response
      const data = await response.json();


      // Check status
      expect(response.status).toBe(500);


      // Check response
      expect(data.success).toBe(false);

      expect(data.message).toBe(
        "Internal Server Error"
      );


      // bcrypt should not be called
      expect(
        bcryptMock.compare
      ).not.toHaveBeenCalled();


      // Cookie should not be set
      expect(
        cookieStoreMock.set
      ).not.toHaveBeenCalled();

    }
  );

});