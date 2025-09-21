const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const {
  calculateRideDuration,
  calculateRealisticRideDuration,
  checkTimeOverlap,
} = require("../utils/rideDuration");

exports.AddNewVehicle = async (req, res) => {
  // console.log(req.body)
  try {
    const vehicle = new Vehicle(req.body);
    const savedVehicle = await vehicle.save();

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: savedVehicle,
    });
  } catch (error) {
    console.error("Error adding vehicle:", error);

    // Handle duplicate registration number
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Vehicle with this registration number already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add vehicle",
      error: error.message,
    });
  }
};

exports.FindAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;
    // console.log(req.query)

    // Calculate ride duration
    const estimatedRideDurationHours = calculateRideDuration(
      fromPincode,
      toPincode
    );
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(
      startDateTime.getTime() + estimatedRideDurationHours * 60 * 60 * 1000
    );

    // Find vehicles that meet capacity requirements and are active
    const suitableVehicles = await Vehicle.find({
      capacityKg: { $gte: parseInt(capacityRequired) },
      isActive: true,
    });

    if (suitableVehicles.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No vehicles found matching capacity requirements",
        data: [],
        estimatedRideDurationHours,
      });
    }
    // console.log(suitableVehicles)

    // Check each vehicle for booking conflicts
    const availableVehicles = [];

    for (const vehicle of suitableVehicles) {
      // Find overlapping bookings for this vehicle
      const conflictingBookings = await Booking.find({
        vehicleId: vehicle._id,
        bookingStatus: { $in: ["confirmed", "in-progress"] },
        $or: [
          {
            startTime: { $lt: endDateTime },
            endTime: { $gt: startDateTime },
          },
        ],
      });

      // If no conflicting bookings, vehicle is available
      if (conflictingBookings.length === 0) {
        // Calculate realistic duration
        const realisticDuration = calculateRealisticRideDuration(
          fromPincode,
          toPincode,
          vehicle.vehicleType
        );

        availableVehicles.push({
          ...vehicle.toObject(),
          estimatedRideDurationHours,
          realisticRideDurationHours: realisticDuration,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Found ${availableVehicles.length} available vehicles`,
      data: availableVehicles,
      estimatedRideDurationHours,
      searchParams: {
        capacityRequired: parseInt(capacityRequired),
        fromPincode,
        toPincode,
        startTime: startDateTime,
      },
    });
  } catch (error) {
    console.error("Error finding available vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search available vehicles",
      error: error.message,
    });
  }
};

exports.GetAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ isActive: true });
    // console.log(vehicles)

    res.status(200).json({
      success: true,
      message: "Vehicles retrieved successfully",
      data: vehicles,
      count: vehicles.length,
    });
  } catch (error) {
    console.error("Error retrieving vehicles:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vehicles",
      error: error.message,
    });
  }
};

exports.GetSingleVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }
    // console.log(vehicle)
    res.status(200).json({
      success: true,
      message: "Vehicle retrieved successfully",
      data: vehicle,
    });
  } catch (error) {
    console.error("Error retrieving vehicle:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve vehicle",
      error: error.message,
    });
  }
};
