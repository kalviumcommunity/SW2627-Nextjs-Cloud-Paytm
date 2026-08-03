import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";


// ==================================================
// 1. Create cookie mock
// ==================================================

const { cookieStoreMock } = vi.hoisted(() => {
  return {
    cookieStoreMock: {
      delete: vi.fn(),
    },
  };
});


// ==================================================
// 2. Mock Next.js cookies
// ==================================================

vi.mock("next/headers", () => ({
  cookies: vi.fn().mockResolvedValue(
    cookieStoreMock
  ),
}));


// ==================================================
// 3. Import POST after mocking
// ==================================================

import { POST } from "@/app/api/auth/logout/route.js";


// ==================================================
// LOGOUT TESTS
// ==================================================

describe("POST /api/auth/logout", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });


  // =================================================
  // TEST 1: Successful logout
  // =================================================

  it(
    "should logout successfully and delete token cookie",
    async () => {

      // Call logout route
      const response = await POST();

      // Parse response
      const data = await response.json();


      // =============================================
      // Check HTTP status
      // =============================================

      expect(response.status).toBe(200);


      // =============================================
      // Check response body
      // =============================================

      expect(data.success).toBe(true);

      expect(data.message).toBe(
        "Logged out successfully"
      );


      // =============================================
      // Check token cookie deletion
      // =============================================

      expect(
        cookieStoreMock.delete
      ).toHaveBeenCalledWith(
        "token"
      );


      // =============================================
      // Make sure delete was called exactly once
      // =============================================

      expect(
        cookieStoreMock.delete
      ).toHaveBeenCalledTimes(1);

    }
  );

});