const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Vehicle ID is required"],
    },
    customerId: {
      type: String,
      required: [true, "Customer ID is required"],
      trim: true,
    },
    fromPincode: {
      type: String,
      required: [true, "From pincode is required"],
      trim: true,
      match: [/^\d{6}$/, "Please provide a valid 6-digit pincode"],
    },
    toPincode: {
      type: String,
      required: [true, "To pincode is required"],
      trim: true,
      match: [/^\d{6}$/, "Please provide a valid 6-digit pincode"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    estimatedRideDurationHours: {
      type: Number,
      required: [true, "Estimated ride duration is required"],
    },
    bookingStatus: {
      type: String,
      enum: ["confirmed", "in-progress", "completed", "cancelled"],
      default: "confirmed",
    },
    totalCost: {
      type: Number,
      min: [0, "Total cost cannot be negative"],
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    customerInfo: {
      name: String,
      phone: String,
      email: String,
      company: String,
    },
    cargoDetails: {
      weight: Number,
      description: String,
      specialRequirements: String,
    },
    actualPickupTime: Date,
    actualDeliveryTime: Date,
    actualDurationHours: Number,
    notes: String,
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ vehicleId: 1, startTime: 1, endTime: 1 });
bookingSchema.index({ customerId: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ startTime: 1, endTime: 1 });

// Validation to ensure endTime is after startTime
bookingSchema.pre("save", function (next) {
  if (this.endTime <= this.startTime) {
    next(new Error("End time must be after start time"));
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);
