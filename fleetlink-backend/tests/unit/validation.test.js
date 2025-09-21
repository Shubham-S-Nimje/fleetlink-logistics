const { validationResult } = require("express-validator");
const {
  vehicleValidation,
  availabilityValidation,
  bookingValidation,
  handleValidationErrors,
} = require("../../middleware/validation");

const createMockReq = (body = {}, query = {}) => ({
  body,
  query,
});

const createMockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const createMockNext = () => jest.fn();

describe("Validation Middleware", () => {
  describe("vehicleValidation", () => {
    it("should pass validation with valid vehicle data", async () => {
      const req = createMockReq({
        name: "Test Vehicle",
        capacityKg: 1000,
        tyres: 6,
        vehicleType: "truck",
        fuelType: "diesel",
      });
      const res = createMockRes();
      const next = createMockNext();

      for (const validator of vehicleValidation) {
        if (typeof validator === "function") {
          await validator(req, res, next);
        }
      }

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should reject empty vehicle name", async () => {
      const req = createMockReq({
        name: "",
        capacityKg: 1000,
        tyres: 6,
      });
      const res = createMockRes();
      const next = createMockNext();

      for (const validator of vehicleValidation) {
        if (typeof validator === "function") {
          await validator(req, res, next);
        }
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should reject negative capacity", async () => {
      const req = createMockReq({
        name: "Test Vehicle",
        capacityKg: -100,
        tyres: 6,
      });
      const res = createMockRes();
      const next = createMockNext();

      for (const validator of vehicleValidation) {
        if (typeof validator === "function") {
          await validator(req, res, next);
        }
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should reject invalid vehicle type", async () => {
      const req = createMockReq({
        name: "Test Vehicle",
        capacityKg: 1000,
        tyres: 6,
        vehicleType: "invalid-type",
      });
      const res = createMockRes();
      const next = createMockNext();

      for (const validator of vehicleValidation) {
        if (typeof validator === "function") {
          await validator(req, res, next);
        }
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("availabilityValidation", () => {
    it("should validate correct availability search parameters", async () => {
      const req = createMockReq(
        {},
        {
          capacityRequired: 1000,
          fromPincode: "400001",
          toPincode: "400010",
          startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        }
      );
      const res = createMockRes();
      const next = createMockNext();

      for (const validator of availabilityValidation) {
        if (typeof validator === "function") {
          await validator(req, res, next);
        }
      }

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should reject invalid pincode format", async () => {
      const req = createMockReq(
        {},
        {
          capacityRequired: 1000,
          fromPincode: "123",
          toPincode: "400010",
          startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        }
      );
      const res = createMockRes();
      const next = createMockNext();

      for (const validator of availabilityValidation) {
        if (typeof validator === "function") {
          await validator(req, res, next);
        }
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should reject past start time", async () => {
      const req = createMockReq(
        {},
        {
          capacityRequired: 1000,
          fromPincode: "400001",
          toPincode: "400010",
          startTime: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Past time
        }
      );
      const res = createMockRes();
      const next = createMockNext();

      for (const validator of availabilityValidation) {
        if (typeof validator === "function") {
          await validator(req, res, next);
        }
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("bookingValidation", () => {
    const validBookingData = {
      vehicleId: "64f8a2b3c1d2e3f4a5b6c7d8",
      customerId: "CUSTOMER_001",
      fromPincode: "400001",
      toPincode: "400010",
      startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      customerInfo: {
        name: "Shubham nimje",
        phone: "+919876543210",
        email: "shubham@nimje.com",
      },
    };

    it("should validate correct booking data", async () => {
      const req = createMockReq(validBookingData);
      const res = createMockRes();
      const next = createMockNext();

      for (const validator of bookingValidation) {
        if (typeof validator === "function") {
          await validator(req, res, next);
        }
      }

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should reject invalid vehicle ID", async () => {
      const req = createMockReq({
        ...validBookingData,
        vehicleId: "invalid-id",
      });
      const res = createMockRes();
      const next = createMockNext();

      for (const validator of bookingValidation) {
        if (typeof validator === "function") {
          await validator(req, res, next);
        }
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should reject invalid phone number", async () => {
      const req = createMockReq({
        ...validBookingData,
        customerInfo: {
          ...validBookingData.customerInfo,
          phone: "123",
        },
      });
      const res = createMockRes();
      const next = createMockNext();

      for (const validator of bookingValidation) {
        if (typeof validator === "function") {
          await validator(req, res, next);
        }
      }

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
