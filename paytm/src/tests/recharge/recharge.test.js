import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";


// ==================================================
// 1. Auth mock
// ==================================================

const { authMock } = vi.hoisted(() => {
  return {
    authMock: vi.fn(),
  };
});


// ==================================================
// 2. Prisma mock
// ==================================================

const { prismaMock } = vi.hoisted(() => {
  return {
    prismaMock: {
      recharge: {
        findFirst: vi.fn(),
        create: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        groupBy: vi.fn(),
      },
    },
  };
});


// ==================================================
// 3. Razorpay mock
// ==================================================

const { razorpayMock } = vi.hoisted(() => {
  return {
    razorpayMock: {
      orders: {
        create: vi.fn(),
      },
    },
  };
});


// ==================================================
// 4. Mock auth
// ==================================================

vi.mock("@/lib/auth", () => ({
  auth: authMock,
}));


// ==================================================
// 5. Mock Prisma
// ==================================================

vi.mock("@/lib/prisma", () => ({
  default: prismaMock,
}));


// ==================================================
// 6. Mock Razorpay
// ==================================================

vi.mock("@/lib/razorpay", () => ({
  getRazorpay: vi.fn(() => razorpayMock),
}));


// ==================================================
// 7. Import POST and GET
// ==================================================

import {
  POST,
  GET,
} from "@/app/api/recharge/route.js";


// ==================================================
// RECHARGE TESTS
// ==================================================

describe("Recharge API", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // =================================================
  // POST /api/recharge
  // =================================================

  describe("POST /api/recharge", () => {


    // ===============================================
    // TEST 1: Successful recharge
    // ===============================================

    it(
      "should initiate recharge successfully",
      async () => {

        // Simulate authenticated user
        authMock.mockResolvedValue({
          id: "user-123",
          name: "Test User",
          email: "test@example.com",
        });


        // No duplicate recharge
        prismaMock.recharge.findFirst.mockResolvedValue(
          null
        );


        // Razorpay order successfully created
        razorpayMock.orders.create.mockResolvedValue({
          id: "order_123",
          amount: 10000,
          currency: "INR",
        });


        // Recharge successfully created
        prismaMock.recharge.create.mockResolvedValue({
          id: "recharge-123",
          userId: "user-123",
          mobileNumber: "9876543210",
          operator: "JIO",
          amount: 100,
          transactionId: "TXN123",
          razorpayOrderId: "order_123",
          status: "PENDING",
        });


        // Create request
        const request = new Request(
          "http://localhost:3000/api/recharge",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              mobileNumber: "9876543210",
              operator: "JIO",
              amount: 100,
            }),
          }
        );


        // Call route
        const response = await POST(request);

        // Parse response
        const data = await response.json();


        // Check response
        expect(response.status).toBe(201);

        expect(data.success).toBe(true);

        expect(data.message).toBe(
          "Recharge initiated successfully."
        );


        // Check Razorpay order
        expect(
          razorpayMock.orders.create
        ).toHaveBeenCalledWith({
          amount: 10000,
          currency: "INR",
          receipt: expect.stringMatching(/^TXN/),
        });


        // Check Prisma create
        expect(
          prismaMock.recharge.create
        ).toHaveBeenCalled();


        // Make sure authenticated user ID was used
        expect(
          prismaMock.recharge.create
        ).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              userId: "user-123",
              mobileNumber: "9876543210",
              operator: "JIO",
              amount: 100,
              razorpayOrderId: "order_123",
            }),
          })
        );

      }
    );


    // ===============================================
    // TEST 2: Invalid request body
    // ===============================================

    it(
      "should return 400 for invalid recharge data",
      async () => {

        // User authentication doesn't matter here
        // because validation happens first

        const request = new Request(
          "http://localhost:3000/api/recharge",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              mobileNumber: "123",
              operator: "INVALID",
              amount: -100,
            }),
          }
        );


        const response = await POST(request);

        const data = await response.json();


        // Check response
        expect(response.status).toBe(400);

        expect(data.success).toBe(false);

        expect(data.errors).toBeDefined();


        // Auth should not be called
        expect(
          authMock
        ).not.toHaveBeenCalled();


        // Database should not be called
        expect(
          prismaMock.recharge.findFirst
        ).not.toHaveBeenCalled();


        // Razorpay should not be called
        expect(
          razorpayMock.orders.create
        ).not.toHaveBeenCalled();

      }
    );


    // ===============================================
    // TEST 3: Unauthorized
    // ===============================================

    it(
      "should return 401 if user is not authenticated",
      async () => {

        // No authenticated user
        authMock.mockResolvedValue(null);


        const request = new Request(
          "http://localhost:3000/api/recharge",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              mobileNumber: "9876543210",
              operator: "JIO",
              amount: 100,
            }),
          }
        );


        const response = await POST(request);

        const data = await response.json();


        expect(response.status).toBe(401);

        expect(data.success).toBe(false);

        expect(data.message).toBe(
          "Unauthorized"
        );


        // Database should not be called
        expect(
          prismaMock.recharge.findFirst
        ).not.toHaveBeenCalled();


        // Razorpay should not be called
        expect(
          razorpayMock.orders.create
        ).not.toHaveBeenCalled();

      }
    );


    // ===============================================
    // TEST 4: Duplicate recharge
    // ===============================================

    it(
      "should return 409 for duplicate recharge",
      async () => {

        // Authenticated user
        authMock.mockResolvedValue({
          id: "user-123",
          name: "Test User",
          email: "test@example.com",
        });


        // Existing recharge found
        prismaMock.recharge.findFirst.mockResolvedValue({
          id: "existing-recharge",
          userId: "user-123",
          mobileNumber: "9876543210",
          operator: "JIO",
          amount: 100,
          createdAt: new Date(),
        });


        const request = new Request(
          "http://localhost:3000/api/recharge",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              mobileNumber: "9876543210",
              operator: "JIO",
              amount: 100,
            }),
          }
        );


        const response = await POST(request);

        const data = await response.json();


        expect(response.status).toBe(409);

        expect(data.success).toBe(false);

        expect(data.message).toBe(
          "Duplicate recharge detected. Please wait 10 seconds."
        );


        // Should not create another recharge
        expect(
          prismaMock.recharge.create
        ).not.toHaveBeenCalled();


        // Should not create Razorpay order
        expect(
          razorpayMock.orders.create
        ).not.toHaveBeenCalled();

      }
    );


    // ===============================================
    // TEST 5: Database / Razorpay error
    // ===============================================

    it(
      "should return 500 if an unexpected error occurs",
      async () => {

        // Authenticated user
        authMock.mockResolvedValue({
          id: "user-123",
          name: "Test User",
          email: "test@example.com",
        });


        // Database throws error
        prismaMock.recharge.findFirst.mockRejectedValue(
          new Error("Database connection failed")
        );


        const request = new Request(
          "http://localhost:3000/api/recharge",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              mobileNumber: "9876543210",
              operator: "JIO",
              amount: 100,
            }),
          }
        );


        const response = await POST(request);

        const data = await response.json();


        expect(response.status).toBe(500);

        expect(data.success).toBe(false);

        expect(data.message).toBe(
          "Internal Server Error"
        );


        // Razorpay should not be called
        expect(
          razorpayMock.orders.create
        ).not.toHaveBeenCalled();

      }
    );

  });


  // =================================================
  // GET /api/recharge
  // =================================================

  describe("GET /api/recharge", () => {


    // ===============================================
    // TEST 6: Get recharge history
    // ===============================================

    it(
      "should return recharge history successfully",
      async () => {

        // Authenticated user
        authMock.mockResolvedValue({
          id: "user-123",
          name: "Test User",
          email: "test@example.com",
        });


        // Mock recharge history
        prismaMock.recharge.findMany.mockResolvedValue([
          {
            id: "recharge-1",
            userId: "user-123",
            mobileNumber: "9876543210",
            operator: "JIO",
            amount: 100,
            status: "SUCCESS",
          },
        ]);


        // Total count
        prismaMock.recharge.count
          .mockResolvedValueOnce(1)
          .mockResolvedValueOnce(0);


        // Grouped statistics
        prismaMock.recharge.groupBy.mockResolvedValue([
          {
            status: "SUCCESS",
            _count: {
              _all: 1,
            },
          },
        ]);


        const request = new Request(
          "http://localhost:3000/api/recharge?page=1&limit=10"
        );


        const response = await GET(request);

        const data = await response.json();


        expect(response.status).toBe(200);

        expect(data.success).toBe(true);


        expect(data.recharges).toHaveLength(1);


        expect(data.pagination).toEqual({
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        });


        expect(data.statistics).toEqual({
          total: 1,
          successful: 1,
          pending: 0,
          failed: 0,
        });


        expect(data.hasPending).toBe(false);

      }
    );


    // ===============================================
    // TEST 7: Unauthorized GET
    // ===============================================

    it(
      "should return 401 if user is not authenticated",
      async () => {

        authMock.mockResolvedValue(null);


        const request = new Request(
          "http://localhost:3000/api/recharge"
        );


        const response = await GET(request);

        const data = await response.json();


        expect(response.status).toBe(401);

        expect(data.success).toBe(false);

        expect(data.message).toBe(
          "Unauthorized"
        );


        // Database should not be queried
        expect(
          prismaMock.recharge.findMany
        ).not.toHaveBeenCalled();

      }
    );


    // ===============================================
    // TEST 8: Invalid date
    // ===============================================

    it(
      "should return 400 for invalid date",
      async () => {

        authMock.mockResolvedValue({
          id: "user-123",
          name: "Test User",
          email: "test@example.com",
        });


        const request = new Request(
          "http://localhost:3000/api/recharge?date=invalid-date"
        );


        const response = await GET(request);

        const data = await response.json();


        expect(response.status).toBe(400);

        expect(data.success).toBe(false);

        expect(data.message).toBe(
          "Invalid date format"
        );


        // Database should not be queried
        expect(
          prismaMock.recharge.findMany
        ).not.toHaveBeenCalled();

      }
    );


    // ===============================================
    // TEST 9: Database error
    // ===============================================

    it(
      "should return 500 if database operation fails",
      async () => {

        authMock.mockResolvedValue({
          id: "user-123",
          name: "Test User",
          email: "test@example.com",
        });


        prismaMock.recharge.findMany.mockRejectedValue(
          new Error("Database error")
        );


        const request = new Request(
          "http://localhost:3000/api/recharge"
        );


        const response = await GET(request);

        const data = await response.json();


        expect(response.status).toBe(500);

        expect(data.success).toBe(false);

        expect(data.message).toBe(
          "Internal Server Error"
        );

      }
    );

  });

});