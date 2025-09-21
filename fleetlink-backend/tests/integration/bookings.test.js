const request = require("supertest");
const app = require("../../server");
const Vehicle = require("../../models/Vehicle");
const Booking = require("../../models/Booking");
const { createTestVehicle, createTestBooking } = require("../helpers/testData");

describe("Booking API Integration Tests", () => {
  let testVehicleId;

  beforeEach(async () => {
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});

    const vehicle = new Vehicle(createTestVehicle());
    const savedVehicle = await vehicle.save();
    testVehicleId = savedVehicle._id;
  });

  describe("POST /api/bookings", () => {
    it("should create a booking with valid data", async () => {
      const bookingData = createTestBooking(testVehicleId);

      const response = await request(app)
        .post("/api/bookings")
        .send(bookingData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.customerId).toBe(bookingData.customerId);
      expect(response.body.data.bookingStatus).toBe("confirmed");
      expect(response.body.data.totalCost).toBeGreaterThan(0);
    });

    it("should create booking with customer and cargo info", async () => {
      const bookingData = createTestBooking(testVehicleId, {
        customerInfo: {
          name: "Jane Doe",
          phone: "+91-9876543210",
          email: "jane@example.com",
          company: "Test Corp",
        },
        cargoDetails: {
          weight: 500,
          description: "Electronics",
          specialRequirements: "Fragile",
        },
      });

      const response = await request(app)
        .post("/api/bookings")
        .send(bookingData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.customerInfo.name).toBe("Jane Doe");
      expect(response.body.data.cargoDetails.weight).toBe(500);
    });

    it("should reject booking for non-existent vehicle", async () => {
      const fakeVehicleId = "64f8a2b3c1d2e3f4a5b6c7d8";
      const bookingData = createTestBooking(fakeVehicleId);

      const response = await request(app)
        .post("/api/bookings")
        .send(bookingData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Vehicle not found");
    });

    it("should reject booking with cargo exceeding vehicle capacity", async () => {
      const bookingData = createTestBooking(testVehicleId, {
        cargoDetails: {
          weight: 2000,
        },
      });

      const response = await request(app)
        .post("/api/bookings")
        .send(bookingData)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("exceeds vehicle capacity");
    });

    it("should detect booking time conflicts", async () => {
      const baseTime = new Date(Date.now() + 60 * 60 * 1000);

      const booking1 = createTestBooking(testVehicleId, {
        startTime: baseTime.toISOString(),
        customerId: "CUSTOMER_1",
      });

      await request(app).post("/api/bookings").send(booking1).expect(201);

      const booking2 = createTestBooking(testVehicleId, {
        startTime: new Date(baseTime.getTime() + 30 * 60 * 1000).toISOString(),
        customerId: "CUSTOMER_2",
      });

      const response = await request(app)
        .post("/api/bookings")
        .send(booking2)
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("already booked");
      expect(response.body.conflictingBookings).toBeDefined();
    });

    it("should validate required fields", async () => {
      const incompleteData = {
        vehicleId: testVehicleId,
      };

      const response = await request(app)
        .post("/api/bookings")
        .send(incompleteData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it("should validate pincode format", async () => {
      const invalidData = createTestBooking(testVehicleId, {
        fromPincode: "123",
        toPincode: "45678",
      });

      const response = await request(app)
        .post("/api/bookings")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(
        response.body.errors.some((err) => err.msg.includes("6-digit"))
      ).toBe(true);
    });

    it("should reject past start time", async () => {
      const pastTime = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      const invalidData = createTestBooking(testVehicleId, {
        startTime: pastTime,
      });

      const response = await request(app)
        .post("/api/bookings")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(
        response.body.errors.some((err) =>
          err.msg.includes("cannot be in the past")
        )
      ).toBe(true);
    });
  });

  describe("GET /api/bookings", () => {
    let booking1Id, booking2Id;

    beforeEach(async () => {
      const booking1 = new Booking(
        createTestBooking(testVehicleId, {
          customerId: "CUSTOMER_1",
          bookingStatus: "confirmed",
        })
      );
      const booking2 = new Booking(
        createTestBooking(testVehicleId, {
          customerId: "CUSTOMER_2",
          bookingStatus: "completed",
          startTime: new Date(Date.now() + 180 * 60 * 1000),
          endTime: new Date(Date.now() + 240 * 60 * 1000),
        })
      );

      const saved1 = await booking1.save();
      const saved2 = await booking2.save();
      booking1Id = saved1._id;
      booking2Id = saved2._id;
    });

    it("should retrieve all bookings with pagination", async () => {
      const response = await request(app).get("/api/bookings").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBe(2);
    });

    it("should filter bookings by customer ID", async () => {
      const response = await request(app)
        .get("/api/bookings")
        .query({ customerId: "CUSTOMER_1" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].customerId).toBe("CUSTOMER_1");
    });

    it("should filter bookings by status", async () => {
      const response = await request(app)
        .get("/api/bookings")
        .query({ status: "completed" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].bookingStatus).toBe("completed");
    });

    it("should filter bookings by vehicle ID", async () => {
      const response = await request(app)
        .get("/api/bookings")
        .query({ vehicleId: testVehicleId.toString() })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it("should support pagination", async () => {
      const response = await request(app)
        .get("/api/bookings")
        .query({ page: 1, limit: 1 })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(1);
    });
  });

  describe("GET /api/bookings/:id", () => {
    let bookingId;

    beforeEach(async () => {
      const booking = new Booking(createTestBooking(testVehicleId));
      const savedBooking = await booking.save();
      bookingId = savedBooking._id;
    });

    it("should retrieve single booking with vehicle details", async () => {
      const response = await request(app)
        .get(`/api/bookings/${bookingId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(bookingId.toString());
      expect(response.body.data.vehicleId.name).toBe("Test Truck");
    });

    it("should return 404 for non-existent booking", async () => {
      const fakeId = "64f8a2b3c1d2e3f4a5b6c7d8";

      const response = await request(app)
        .get(`/api/bookings/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Booking not found");
    });
  });

  describe("PUT /api/bookings/:id/status", () => {
    let bookingId;

    beforeEach(async () => {
      const booking = new Booking(
        createTestBooking(testVehicleId, {
          bookingStatus: "confirmed",
        })
      );
      const savedBooking = await booking.save();
      bookingId = savedBooking._id;
    });

    it("should update booking status to in-progress", async () => {
      const response = await request(app)
        .put(`/api/bookings/${bookingId}/status`)
        .send({ status: "in-progress" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookingStatus).toBe("in-progress");
      expect(response.body.data.actualPickupTime).toBeTruthy();
    });

    it("should update booking status to completed", async () => {
      await request(app)
        .put(`/api/bookings/${bookingId}/status`)
        .send({ status: "in-progress" });

      const response = await request(app)
        .put(`/api/bookings/${bookingId}/status`)
        .send({ status: "completed" })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookingStatus).toBe("completed");
      expect(response.body.data.actualDeliveryTime).toBeTruthy();
      expect(response.body.data.actualDurationHours).toBeGreaterThan(0);
    });

    it("should reject invalid status", async () => {
      const response = await request(app)
        .put(`/api/bookings/${bookingId}/status`)
        .send({ status: "invalid-status" })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain("Invalid status");
    });

    it("should return 404 for non-existent booking", async () => {
      const fakeId = "64f8a2b3c1d2e3f4a5b6c7d8";

      const response = await request(app)
        .put(`/api/bookings/${fakeId}/status`)
        .send({ status: "in-progress" })
        .expect(404);

      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /api/bookings/:id", () => {
    let confirmedBookingId, completedBookingId, inProgressBookingId;

    beforeEach(async () => {
      const confirmedBooking = new Booking(
        createTestBooking(testVehicleId, {
          bookingStatus: "confirmed",
          startTime: new Date(Date.now() + 60 * 60 * 1000),
        })
      );

      const completedBooking = new Booking(
        createTestBooking(testVehicleId, {
          bookingStatus: "completed",
          startTime: new Date(Date.now() + 120 * 60 * 1000),
          customerId: "CUSTOMER_2",
        })
      );

      const inProgressBooking = new Booking(
        createTestBooking(testVehicleId, {
          bookingStatus: "in-progress",
          startTime: new Date(Date.now() + 180 * 60 * 1000),
          customerId: "CUSTOMER_3",
        })
      );

      const saved1 = await confirmedBooking.save();
      const saved2 = await completedBooking.save();
      const saved3 = await inProgressBooking.save();

      confirmedBookingId = saved1._id;
      completedBookingId = saved2._id;
      inProgressBookingId = saved3._id;
    });

    it("should cancel a confirmed booking", async () => {
      const response = await request(app)
        .delete(`/api/bookings/${confirmedBookingId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.bookingStatus).toBe("cancelled");

      const updatedBooking = await Booking.findById(confirmedBookingId);
      expect(updatedBooking.bookingStatus).toBe("cancelled");
    });

    it("should not cancel a completed booking", async () => {
      const response = await request(app)
        .delete(`/api/bookings/${completedBookingId}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(
        "Cannot cancel a completed booking"
      );
    });

    it("should not cancel an in-progress booking", async () => {
      const response = await request(app)
        .delete(`/api/bookings/${inProgressBookingId}`)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(
        "Cannot cancel a booking that is in progress"
      );
    });

    it("should return 404 for non-existent booking", async () => {
      const fakeId = "64f8a2b3c1d2e3f4a5b6c7d8";

      const response = await request(app)
        .delete(`/api/bookings/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Booking not found");
    });
  });
});
