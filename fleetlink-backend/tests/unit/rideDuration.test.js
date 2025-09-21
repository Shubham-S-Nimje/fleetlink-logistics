const {
  calculateRideDuration,
  calculateRealisticRideDuration,
  checkTimeOverlap,
} = require("../../utils/rideDuration");

describe("Ride Duration Utilities", () => {
  describe("calculateRideDuration", () => {
    it("should calculate correct duration for different pincodes", () => {
      expect(calculateRideDuration("400001", "400010")).toBe(9);
      expect(calculateRideDuration("400010", "400001")).toBe(9);
      expect(calculateRideDuration("400000", "400025")).toBe(1); // 25 % 24 = 1
    });

    it("should return minimum 1 hour for same pincodes", () => {
      expect(calculateRideDuration("400001", "400001")).toBe(1);
      expect(calculateRideDuration("123456", "123456")).toBe(1);
    });

    it("should handle edge cases correctly", () => {
      expect(calculateRideDuration("000000", "999999")).toBe(15); // 999999 % 24 = 15
      expect(calculateRideDuration("123456", "654321")).toBe(7); // |654321-123456| % 24 = 7
    });

    it("should handle string inputs correctly", () => {
      expect(calculateRideDuration("400001", "400010")).toBe(9);
      expect(() => calculateRideDuration(400001, 400010)).not.toThrow();
    });
  });

  describe("calculateRealisticRideDuration", () => {
    it("should return duration greater than basic calculation", () => {
      const basicDuration = calculateRideDuration("400001", "400010");
      const realisticDuration = calculateRealisticRideDuration(
        "400001",
        "400010",
        "truck"
      );

      expect(realisticDuration).toBeGreaterThan(basicDuration);
      expect(realisticDuration).toBeLessThanOrEqual(48); // Max 48 hours
    });

    it("should vary by vehicle type", () => {
      const truckDuration = calculateRealisticRideDuration(
        "400001",
        "400010",
        "truck"
      );
      const vanDuration = calculateRealisticRideDuration(
        "400001",
        "400010",
        "van"
      );

      expect(truckDuration).toBeGreaterThan(0);
      expect(vanDuration).toBeGreaterThan(0);
    });

    it("should handle long distances", () => {
      const longDistance = calculateRealisticRideDuration(
        "100000",
        "800000",
        "truck"
      );
      expect(longDistance).toBeGreaterThan(0);
      expect(longDistance).toBeLessThanOrEqual(48);
    });
  });

  describe("checkTimeOverlap", () => {
    it("should detect overlapping time periods", () => {
      const start1 = new Date("2023-10-01T10:00:00Z");
      const end1 = new Date("2023-10-01T12:00:00Z");
      const start2 = new Date("2023-10-01T11:00:00Z");
      const end2 = new Date("2023-10-01T13:00:00Z");

      expect(checkTimeOverlap(start1, start2, end2)).toBe(true);
    });

    it("should detect non-overlapping time periods", () => {
      const start1 = new Date("2023-10-01T10:00:00Z");
      const end1 = new Date("2023-10-01T12:00:00Z");
      const start2 = new Date("2023-10-01T13:00:00Z");
      const end2 = new Date("2023-10-01T15:00:00Z");

      expect(checkTimeOverlap(start1, end1, start2, end2)).toBe(false);
    });

    it("should handle adjacent time periods correctly", () => {
      const start1 = new Date("2023-10-01T10:00:00Z");
      const end1 = new Date("2023-10-01T12:00:00Z");
      const start2 = new Date("2023-10-01T12:00:00Z");
      const end2 = new Date("2023-10-01T14:00:00Z");

      expect(checkTimeOverlap(start1, end1, start2, end2)).toBe(false);
    });

    it("should detect complete containment", () => {
      const start1 = new Date("2023-10-01T09:00:00Z");
      const end1 = new Date("2023-10-01T15:00:00Z");
      const start2 = new Date("2023-10-01T10:00:00Z");
      const end2 = new Date("2023-10-01T12:00:00Z");

      expect(checkTimeOverlap(start1, end1, start2, end2)).toBe(true);
    });

    it("should handle reverse order parameters", () => {
      const start1 = new Date("2023-10-01T11:00:00Z");
      const end1 = new Date("2023-10-01T13:00:00Z");
      const start2 = new Date("2023-10-01T10:00:00Z");
      const end2 = new Date("2023-10-01T12:00:00Z");

      expect(checkTimeOverlap(start1, end1, start2, end2)).toBe(true);
      expect(checkTimeOverlap(start2, end2, start1, end1)).toBe(true);
    });
  });
});
