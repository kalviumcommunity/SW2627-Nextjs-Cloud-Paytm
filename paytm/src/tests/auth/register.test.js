import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";

// --------------------------------------------------
// 1. Create Prisma mock
// --------------------------------------------------

const { prismaMock } = vi.hoisted(() => {
  return {
    prismaMock: {
      user: {
        findFirst: vi.fn(),
        create: vi.fn(),
      },
    },
  };
});

// --------------------------------------------------
// 2. Create cookie store mock
// --------------------------------------------------

const { cookieStoreMock } = vi.hoisted(() => {
  return {
    cookieStoreMock: {
      set: vi.fn(),
    },
  };
});

// --------------------------------------------------
// 3. Mock Prisma
// --------------------------------------------------

vi.mock("@/lib/prisma.js", () => ({
  default: prismaMock,
}));

// --------------------------------------------------
// 4. Mock Next.js cookies
// --------------------------------------------------

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue(cookieStoreMock),
}));

// --------------------------------------------------
// 5. Mock JWT
// --------------------------------------------------

vi.mock("@/lib/jwt.js", () => ({
  generateToken: vi.fn().mockReturnValue("fake-jwt-token"),
}));

// --------------------------------------------------
// 6. Import route AFTER mocks
// --------------------------------------------------

import { POST } from "@/app/api/auth/register/route.js";


// ==================================================
// REGISTER ROUTE TESTS
// ==================================================

describe("POST /api/auth/register", () => {

  // ------------------------------------------------
  // Clear mocks before every test
  // ------------------------------------------------

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // =================================================
  // TEST 1: Successful registration
  // =================================================

  it("should register a user successfully", async () => {

    // Database says no user exists
    prismaMock.user.findFirst.mockResolvedValue(null);

    // Database successfully creates user
    prismaMock.user.create.mockResolvedValue({
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
      phoneNumber: "9876543210",
      password: "hashed-password",
    });

    // Create request
    const request = new Request(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          phoneNumber: "9876543210",
        }),
      }
    );

    // Call route
    const response = await POST(request);

    // Convert response to JSON
    const data = await response.json();


    // Check response status
    expect(response.status).toBe(201);

    // Check success
    expect(data.success).toBe(true);

    // Check message
    expect(data.message).toBe(
      "Registration successful"
    );

    // Check returned user
    expect(data.user).toEqual({
      id: "user-123",
      name: "Test User",
      email: "test@example.com",
    });

    // Make sure cookie was set
    expect(cookieStoreMock.set).toHaveBeenCalled();

  });


  // =================================================
  // TEST 2: Duplicate email
  // =================================================

  it("should return 409 if email already exists", async () => {

    // Simulate existing user with same email
    prismaMock.user.findFirst.mockResolvedValue({
      id: "existing-user",
      name: "Existing User",
      email: "test@example.com",
      phoneNumber: "9999999999",
    });


    // Create request
    const request = new Request(
      "http://localhost:3000/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: "New User",
          email: "test@example.com",
          password: "password123",
          phoneNumber: "9876543210",
        }),
      }
    );


    // Call route
    const response = await POST(request);

    // Convert response to JSON
    const data = await response.json();


    // Check status
    expect(response.status).toBe(409);

    // Check success is false
    expect(data.success).toBe(false);

    // Check error message
    expect(data.message).toBe(
      "Email already exists."
    );


    // User should NOT be created
    expect(
      prismaMock.user.create
    ).not.toHaveBeenCalled();


    // Cookie should NOT be set
    expect(
      cookieStoreMock.set
    ).not.toHaveBeenCalled();

  });


  // =================================================
  // TEST 3: Duplicate phone number
  // =================================================

  it(
    "should return 409 if phone number already exists",
    async () => {

      // Simulate existing user with same phone
      prismaMock.user.findFirst.mockResolvedValue({
        id: "existing-user",
        name: "Existing User",
        email: "existing@example.com",
        phoneNumber: "9876543210",
      });


      // Create request
      const request = new Request(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: "New User",
            email: "new@example.com",
            password: "password123",
            phoneNumber: "9876543210",
          }),
        }
      );


      // Call route
      const response = await POST(request);

      // Convert response to JSON
      const data = await response.json();


      // Check status
      expect(response.status).toBe(409);

      // Check success
      expect(data.success).toBe(false);

      // Check message
      expect(data.message).toBe(
        "Phone number already exists."
      );


      // User should NOT be created
      expect(
        prismaMock.user.create
      ).not.toHaveBeenCalled();


      // Cookie should NOT be set
      expect(
        cookieStoreMock.set
      ).not.toHaveBeenCalled();

    }
  );


  // =================================================
  // TEST 4: Invalid input
  // =================================================

  it(
    "should return 400 for invalid registration data",
    async () => {

      // Create request with invalid data
      const request = new Request(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: "",
            email: "invalid-email",
            password: "123",
            phoneNumber: "123",
          }),
        }
      );


      // Call route
      const response = await POST(request);

      // Convert response to JSON
      const data = await response.json();


      // Check status
      expect(response.status).toBe(400);

      // Check success
      expect(data.success).toBe(false);

      // Validation errors should exist
      expect(data.errors).toBeDefined();


      // Database should NOT be queried
      expect(
        prismaMock.user.findFirst
      ).not.toHaveBeenCalled();


      // User should NOT be created
      expect(
        prismaMock.user.create
      ).not.toHaveBeenCalled();


      // Cookie should NOT be set
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

      // Simulate database failure
      prismaMock.user.findFirst.mockRejectedValue(
        new Error("Database connection failed")
      );


      // Create request
      const request = new Request(
        "http://localhost:3000/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name: "Test User",
            email: "test@example.com",
            password: "password123",
            phoneNumber: "9876543210",
          }),
        }
      );


      // Call route
      const response = await POST(request);

      // Convert response to JSON
      const data = await response.json();


      // Check status
      expect(response.status).toBe(500);

      // Check error response
      expect(data.error).toBe(
        "Internal Server Error"
      );


      // User should NOT be created
      expect(
        prismaMock.user.create
      ).not.toHaveBeenCalled();


      // Cookie should NOT be set
      expect(
        cookieStoreMock.set
      ).not.toHaveBeenCalled();

    }
  );

});