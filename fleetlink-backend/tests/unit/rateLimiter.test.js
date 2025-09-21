const {
  generalLimiter,
  searchLimiter,
  bookingLimiter,
} = require("../../middleware/rateLimiter");

describe("Rate Limiter Middleware", () => {
  const createMockReq = (ip = "127.0.0.1") => ({
    ip,
    method: "GET",
    originalUrl: "/api/test",
  });

  const createMockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.set = jest.fn();
    return res;
  };

  beforeEach(() => {
    // Clear rate limiter stores before each test
    if (generalLimiter.resetKey) {
      generalLimiter.resetKey("127.0.0.1");
    }
    if (searchLimiter.resetKey) {
      searchLimiter.resetKey("127.0.0.1");
    }
    if (bookingLimiter.resetKey) {
      bookingLimiter.resetKey("127.0.0.1");
    }
  });

  describe("generalLimiter", () => {
    it("should allow requests within limit", async () => {
      const req = createMockReq();
      const res = createMockRes();
      const next = jest.fn();

      await generalLimiter(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should have correct configuration", () => {
      expect(generalLimiter).toBeDefined();
      // Rate limiter middleware should be a function
      expect(typeof generalLimiter).toBe("function");
    });
  });

  describe("searchLimiter", () => {
    it("should allow search requests within limit", async () => {
      const req = createMockReq();
      const res = createMockRes();
      const next = jest.fn();

      await searchLimiter(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe("bookingLimiter", () => {
    it("should allow booking requests within limit", async () => {
      const req = createMockReq();
      const res = createMockRes();
      const next = jest.fn();

      await bookingLimiter(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});

// tests/integration/health.test.js
