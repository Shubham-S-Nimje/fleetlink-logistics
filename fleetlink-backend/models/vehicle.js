const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
      maxlength: [100, "Vehicle name cannot exceed 100 characters"],
    },
    capacityKg: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1 kg"],
    },
    tyres: {
      type: Number,
      required: [true, "Number of tyres is required"],
      min: [2, "Vehicle must have at least 2 tyres"],
    },
    vehicleType: {
      type: String,
      enum: ["truck", "van", "pickup", "trailer"],
      default: "truck",
    },
    fuelType: {
      type: String,
      enum: ["diesel", "petrol", "electric", "hybrid"],
      default: "diesel",
    },
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    driverInfo: {
      name: String,
      phone: String,
      licenseNumber: String,
    },
    maintenanceSchedule: {
      lastService: Date,
      nextService: Date,
      mileage: Number,
    },
    insuranceInfo: {
      provider: String,
      policyNumber: String,
      expiryDate: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    location: {
      currentPincode: String,
      latitude: Number,
      longitude: Number,
    },
  },
  {
    timestamps: true,
  }
);

vehicleSchema.index({ capacityKg: 1 });
vehicleSchema.index({ isActive: 1 });
vehicleSchema.index({ vehicleType: 1 });

module.exports = mongoose.model("Vehicle", vehicleSchema);
