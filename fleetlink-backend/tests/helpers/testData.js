const mongoose = require("mongoose");

const createTestVehicle = (overrides = {}) => ({
  name: "Test Truck",
  capacityKg: 1000,
  tyres: 6,
  vehicleType: "truck",
  fuelType: "diesel",
  isActive: true,
  ...overrides,
});

const createTestBooking = (vehicleId, overrides = {}) => ({
  vehicleId,
  customerId: "TEST_CUSTOMER_001",
  fromPincode: "400001",
  toPincode: "400010",
  startTime: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
  endTime: new Date(Date.now() + 120 * 60 * 1000), // 2 hours from now
  estimatedRideDurationHours: 1,
  bookingStatus: "confirmed",
  ...overrides,
});

module.exports = {
  createTestVehicle,
  createTestBooking,
};
