const request = require("supertest");
const app = require("../../server");

describe("Health Check API", () => {
  describe("GET /health", () => {
    it("should return health status", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain("FleetLink API is running");
      expect(response.body.timestamp).toBeDefined();
      expect(response.body.environment).toBeDefined();
    });

    it("should return correct environment", async () => {
      const response = await request(app).get("/health").expect(200);

      expect(["development", "test", "production"]).toContain(
        response.body.environment
      );
    });
  });

  describe("404 Handler", () => {
    it("should return 404 for non-existent routes", async () => {
      const response = await request(app)
        .get("/non-existent-route")
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Route not found");
    });

    it("should handle POST to non-existent routes", async () => {
      const response = await request(app)
        .post("/non-existent-route")
        .send({ test: "data" })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Route not found");
    });
  });
});
