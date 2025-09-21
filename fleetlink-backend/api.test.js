require("dotenv").config();
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("./server");
const Vehicle = require("./models/Vehicle");
const Booking = require("./models/Booking");

const MONGODB_URI = process.env.MONGODB_TEST_URI;

describe("FleetLink API Tests", () => {
  let vehicleId;
  let bookingId;

  beforeAll(async () => {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});
  });

  afterAll(async () => {
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});
    await mongoose.connection.close();
  });

  describe("POST /api/vehicles", () => {
    it("should create a new vehicle with valid data", async () => {
      const vehicleData = {
        name: "Test Truck",
        capacityKg: 1000,
        tyres: 6,
        vehicleType: "truck",
        fuelType: "diesel",
      };

      const response = await request(app)
        .post("/api/vehicles")
        .send(vehicleData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(vehicleData.name);
      expect(response.body.data.capacityKg).toBe(vehicleData.capacityKg);

      vehicleId = response.body.data._id;
    });

    it("should reject vehicle with missing required fields", async () => {
      const invalidData = {
        name: "Test Truck",
      };

      const response = await request(app)
        .post("/api/vehicles")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should reject vehicle with invalid capacity", async () => {
      const invalidData = {
        name: "Test Truck",
        capacityKg: -100,
        tyres: 4,
      };

      const response = await request(app)
        .post("/api/vehicles")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/vehicles/available", () => {
    beforeEach(async () => {
      // Create test vehicles
      const vehicle1 = new Vehicle({
        name: "Available Truck",
        capacityKg: 1000,
        tyres: 6,
        isActive: true,
      });

      const vehicle2 = new Vehicle({
        name: "Small Van",
        capacityKg: 500,
        tyres: 4,
        isActive: true,
      });

      await vehicle1.save();
      await vehicle2.save();
      vehicleId = vehicle1._id;
    });

    it("should find available vehicles", async () => {
      const startTime = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour from now

      const response = await request(app)
        .get("/api/vehicles/available")
        .query({
          capacityRequired: 800,
          fromPincode: "400001",
          toPincode: "400002",
          startTime: startTime,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.estimatedRideDurationHours).toBeDefined();
    });

    it("should return empty array when no vehicles meet capacity requirement", async () => {
      const startTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      const response = await request(app)
        .get("/api/vehicles/available")
        .query({
          capacityRequired: 5000,
          fromPincode: "400001",
          toPincode: "400002",
          startTime: startTime,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBe(0);
    });

    it("should reject invalid pincode format", async () => {
      const startTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      const response = await request(app)
        .get("/api/vehicles/available")
        .query({
          capacityRequired: 500,
          fromPincode: "123",
          toPincode: "400002",
          startTime: startTime,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it("should reject past start time", async () => {
      const pastTime = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // 1 hour ago

      const response = await request(app)
        .get("/api/vehicles/available")
        .query({
          capacityRequired: 500,
          fromPincode: "400001",
          toPincode: "400002",
          startTime: pastTime,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe("POST /api/bookings", () => {
    beforeEach(async () => {
      // Create a test vehicle
      const vehicle = new Vehicle({
        name: "Booking Test Truck",
        capacityKg: 1000,
        tyres: 6,
        isActive: true,
      });

      const savedVehicle = await vehicle.save();
      vehicleId = savedVehicle._id;
    });

    it("should create a booking with valid data", async () => {
      const bookingData = {
        vehicleId: vehicleId,
        customerId: "CUST001",
        fromPincode: "400001",
        toPincode: "400010",
        startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        customerInfo: {
          name: "John Doe",
          phone: "+1234567890",
          email: "john@example.com",
        },
      };

      const response = await request(app)
        .post("/api/bookings")
        .send(bookingData)
        .expect(201);

      expect(response.body.success).toBe(true);
      const responseVehicleId =
        typeof response.body.data.vehicleId === "object"
          ? response.body.data.vehicleId._id
          : response.body.data.vehicleId;

      expect(responseVehicleId).toBe(vehicleId.toString());
      expect(response.body.data.customerId).toBe(bookingData.customerId);

      bookingId = response.body.data._id;
    });

    it("should reject booking for non-existent vehicle", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const bookingData = {
        vehicleId: fakeId,
        customerId: "CUST001",
        fromPincode: "400001",
        toPincode: "400010",
        startTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      };

      const response = await request(app)
        .post("/api/bookings")
        .send(bookingData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Vehicle not found");
    });

    it("should detect booking conflicts", async () => {
      const startTime = new Date(Date.now() + 60 * 60 * 1000);

      const booking1 = {
        vehicleId: vehicleId,
        customerId: "CUST001",
        fromPincode: "400001",
        toPincode: "400010",
        startTime: startTime.toISOString(),
      };

      await request(app).post("/api/bookings").send(booking1).expect(201);

      const booking2 = {
        vehicleId: vehicleId,
        customerId: "CUST002",
        fromPincode: "400005",
        toPincode: "400015",
        startTime: new Date(startTime.getTime() + 30 * 60 * 1000).toISOString(), // 30 minutes later
      };

      const response = await request(app)
        .post("/api/bookings")
        .send(booking2)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already booked");
    });
  });

  describe("GET /api/bookings", () => {
    beforeEach(async () => {
      const vehicle = new Vehicle({
        name: "Test Vehicle",
        capacityKg: 1000,
        tyres: 6,
      });
      const savedVehicle = await vehicle.save();

      const booking = new Booking({
        vehicleId: savedVehicle._id,
        customerId: "CUST001",
        fromPincode: "400001",
        toPincode: "400010",
        startTime: new Date(Date.now() + 60 * 60 * 1000),
        endTime: new Date(Date.now() + 120 * 60 * 1000),
        estimatedRideDurationHours: 2,
      });

      const savedBooking = await booking.save();
      bookingId = savedBooking._id;
    });

    it("should retrieve all bookings", async () => {
      const response = await request(app).get("/api/bookings").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.pagination).toBeDefined();
    });

    it("should filter bookings by customer ID", async () => {
      const response = await request(app)
        .get("/api/bookings")
        .query({ customerId: "CUST001" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(
        response.body.data.every((booking) => booking.customerId === "CUST001")
      ).toBe(true);
    });
  });

  describe("DELETE /api/bookings/:id", () => {
    beforeEach(async () => {
      const vehicle = new Vehicle({
        name: "Test Vehicle",
        capacityKg: 1000,
        tyres: 6,
      });
      const savedVehicle = await vehicle.save();

      const booking = new Booking({
        vehicleId: savedVehicle._id,
        customerId: "CUST001",
        fromPincode: "400001",
        toPincode: "400010",
        startTime: new Date(Date.now() + 60 * 60 * 1000),
        endTime: new Date(Date.now() + 120 * 60 * 1000),
        estimatedRideDurationHours: 2,
        bookingStatus: "confirmed",
      });

      const savedBooking = await booking.save();
      bookingId = savedBooking._id;
    });

    it("should cancel a booking", async () => {
      const response = await request(app)
        .delete(`/api/bookings/${bookingId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookingStatus).toBe("cancelled");
    });

    it("should return 404 for non-existent booking", async () => {
      const fakeId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/bookings/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("Ride Duration Logic", () => {
    const {
      calculateRideDuration,
      calculateRealisticRideDuration,
      checkTimeOverlap,
    } = require("./utils/rideDuration");

    it("should calculate ride duration correctly", () => {
      expect(calculateRideDuration("400001", "400010")).toBe(9);
      expect(calculateRideDuration("400010", "400001")).toBe(9);
      expect(calculateRideDuration("400000", "400000")).toBe(1); // Minimum 1 hour
    });

    it("should calculate realistic ride duration", () => {
      const duration = calculateRealisticRideDuration(
        "400001",
        "400010",
        "truck"
      );
      expect(duration).toBeGreaterThan(0);
      expect(duration).toBeLessThanOrEqual(48);
    });

    it("should detect time overlaps correctly", () => {
      const start1 = new Date("2023-10-01T10:00:00Z");
      const end1 = new Date("2023-10-01T12:00:00Z");
      const start2 = new Date("2023-10-01T11:00:00Z");
      const end2 = new Date("2023-10-01T13:00:00Z");

      expect(checkTimeOverlap(start1, end1, start2, end2)).toBe(true);

      const start3 = new Date("2023-10-01T13:00:00Z");
      const end3 = new Date("2023-10-01T15:00:00Z");

      expect(checkTimeOverlap(start1, end1, start3, end3)).toBe(false);
    });
  });
});
