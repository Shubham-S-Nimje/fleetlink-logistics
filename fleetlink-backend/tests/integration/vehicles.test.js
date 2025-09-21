const request = require("supertest");
const app = require("../../server");
const Vehicle = require("../../models/Vehicle");
const { createTestVehicle } = require("../helpers/testData");

describe("Vehicle API Integration Tests", () => {
  beforeEach(async () => {
    await Vehicle.deleteMany({});
  });

  describe("POST /api/vehicles", () => {
    it("should create a new vehicle with valid data", async () => {
      const vehicleData = createTestVehicle();

      const response = await request(app)
        .post("/api/vehicles")
        .send(vehicleData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(vehicleData.name);
      expect(response.body.data.capacityKg).toBe(vehicleData.capacityKg);

      const savedVehicle = await Vehicle.findById(response.body.data._id);
      expect(savedVehicle).toBeTruthy();
    });

    it("should reject vehicle with missing required fields", async () => {
      const invalidData = { name: "Test Truck" };

      const response = await request(app)
        .post("/api/vehicles")
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toHaveLength(2);
    });

    it("should reject duplicate registration numbers", async () => {
      const vehicleData = createTestVehicle({ registrationNumber: "TEST123" });

      await request(app).post("/api/vehicles").send(vehicleData).expect(201);

      const response = await request(app)
        .post("/api/vehicles")
        .send(vehicleData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain(
        "registration number already exists"
      );
    });

    it("should create vehicle with complete information", async () => {
      const completeVehicleData = createTestVehicle({
        registrationNumber: "MH27AB1234",
        driverInfo: {
          name: "Shubham Driver",
          phone: "+919876543210",
          licenseNumber: "LIC123456",
        },
        location: {
          currentPincode: "400001",
          latitude: 19.076,
          longitude: 72.8777,
        },
      });

      const response = await request(app)
        .post("/api/vehicles")
        .send(completeVehicleData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.driverInfo.name).toBe("Shubham Driver");
      expect(response.body.data.location.currentPincode).toBe("400001");
    });
  });

  describe("GET /api/vehicles/available", () => {
    let testVehicleId;

    beforeEach(async () => {
      const vehicle = new Vehicle(
        createTestVehicle({
          name: "Available Truck",
          capacityKg: 2000,
        })
      );
      const savedVehicle = await vehicle.save();
      testVehicleId = savedVehicle._id;
    });

    it("should find available vehicles with correct parameters", async () => {
      const startTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      const response = await request(app)
        .get("/api/vehicles/available")
        .query({
          capacityRequired: 1500,
          fromPincode: "400001",
          toPincode: "400010",
          startTime: startTime,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0]._id).toBe(testVehicleId.toString());
      expect(response.body.estimatedRideDurationHours).toBe(9);
    });

    it("should return empty when capacity requirement not met", async () => {
      const startTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      const response = await request(app)
        .get("/api/vehicles/available")
        .query({
          capacityRequired: 5000,
          fromPincode: "400001",
          toPincode: "400010",
          startTime: startTime,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.message).toContain("No vehicles found");
    });

    it("should validate pincode format", async () => {
      const startTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();

      const response = await request(app)
        .get("/api/vehicles/available")
        .query({
          capacityRequired: 1000,
          fromPincode: "123",
          toPincode: "400010",
          startTime: startTime,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should reject past start times", async () => {
      const pastTime = new Date(Date.now() - 60 * 60 * 1000).toISOString();

      const response = await request(app)
        .get("/api/vehicles/available")
        .query({
          capacityRequired: 1000,
          fromPincode: "400001",
          toPincode: "400010",
          startTime: pastTime,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors[0].msg).toContain("cannot be in the past");
    });
  });

  describe("GET /api/vehicles", () => {
    it("should return all active vehicles", async () => {
      await Vehicle.create([
        createTestVehicle({ name: "Vehicle 1" }),
        createTestVehicle({ name: "Vehicle 2" }),
        createTestVehicle({ name: "Inactive Vehicle", isActive: false }),
      ]);

      const response = await request(app).get("/api/vehicles").expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
    });
  });
});
