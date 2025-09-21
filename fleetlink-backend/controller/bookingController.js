const mongoose = require("mongoose");
const Vehicle = require("../models/Vehicle");
const Booking = require("../models/Booking");
const {
  calculateRideDuration,
  calculateRealisticRideDuration,
  checkTimeOverlap,
} = require("../utils/rideDuration");

exports.BookAVehicle = async (req, res) => {
  const session = await mongoose.startSession();
  // console.log(req.body)
  try {
    await session.withTransaction(async () => {
      const {
        vehicleId,
        customerId,
        fromPincode,
        toPincode,
        startTime,
        customerInfo,
        cargoDetails,
      } = req.body;

      // Verify vehicle exists and is active
      const vehicle = await Vehicle.findById(vehicleId).session(session);
      if (!vehicle) {
        throw new Error("Vehicle not found");
      }

      if (!vehicle.isActive) {
        throw new Error("Vehicle is not active");
      }

      // Calculate ride duration and end time
      const estimatedRideDurationHours = calculateRideDuration(
        fromPincode,
        toPincode
      );
      const startDateTime = new Date(startTime);
      const endDateTime = new Date(
        startDateTime.getTime() + estimatedRideDurationHours * 60 * 60 * 1000
      );

      // Check for conflicting bookings (race condition prevention)
      const conflictingBookings = await Booking.find({
        vehicleId: vehicleId,
        bookingStatus: { $in: ["confirmed", "in-progress"] },
        $or: [
          {
            startTime: { $lt: endDateTime },
            endTime: { $gt: startDateTime },
          },
        ],
      }).session(session);

      if (conflictingBookings.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Vehicle is already booked for the selected time slot",
          conflictingBookings: conflictingBookings.map((booking) => ({
            id: booking._id,
            startTime: booking.startTime,
            endTime: booking.endTime,
          })),
        });
      }

      // Validate cargo weight against vehicle capacity
      if (cargoDetails?.weight && cargoDetails.weight > vehicle.capacityKg) {
        throw new Error(
          `Cargo weight (${cargoDetails.weight} kg) exceeds vehicle capacity (${vehicle.capacityKg} kg)`
        );
      }

      // Calculate total cost (simplified pricing)
      const basePricePerHour = 500;
      const distanceFactor =
        Math.abs(parseInt(toPincode) - parseInt(fromPincode)) / 1000;
      const totalCost = Math.round(
        basePricePerHour * estimatedRideDurationHours + distanceFactor * 100
      );

      // Create booking
      const booking = new Booking({
        vehicleId,
        customerId,
        fromPincode,
        toPincode,
        startTime: startDateTime,
        endTime: endDateTime,
        estimatedRideDurationHours,
        totalCost,
        customerInfo: customerInfo || {},
        cargoDetails: cargoDetails || {},
      });

      const savedBooking = await booking.save({ session });
      await savedBooking.populate("vehicleId");

      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: savedBooking,
      });
    });
  } catch (error) {
    console.error("Error creating booking:", error);

    if (error.message === "Vehicle not found") {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    if (
      error.message.includes("already booked") ||
      error.message.includes("capacity")
    ) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
      error: error.message,
    });
  } finally {
    await session.endSession();
  }
};

exports.GetAllBookings = async (req, res) => {
  // console.log(req.query)
  try {
    const {
      customerId,
      vehicleId,
      status,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter object
    const filter = {};
    if (customerId) filter.customerId = customerId;
    if (vehicleId) filter.vehicleId = vehicleId;
    if (status) filter.bookingStatus = status;

    if (startDate && endDate) {
      filter.startTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(filter)
      .populate(
        "vehicleId",
        "name capacityKg tyres vehicleType registrationNumber"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(filter);
    // console.log(bookings, total)

    res.status(200).json({
      success: true,
      message: "Bookings retrieved successfully",
      data: bookings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve bookings",
      error: error.message,
    });
  }
};

exports.GetBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "vehicleId",
      "name capacityKg tyres vehicleType registrationNumber driverInfo"
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // console.log(booking)
    res.status(200).json({
      success: true,
      message: "Booking retrieved successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error retrieving booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve booking",
      error: error.message,
    });
  }
};

exports.RemoveBooking = async (req, res) => {
  // console.log(req.params)
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if booking can be cancelled (not completed or in-progress)
    if (booking.bookingStatus === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a completed booking",
      });
    }

    if (booking.bookingStatus === "in-progress") {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel a booking that is in progress",
      });
    }

    // Update booking status to cancelled instead of deleting
    booking.bookingStatus = "cancelled";
    const updatedBooking = await booking.save();
    // console.log(updatedBooking)

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
      error: error.message,
    });
  }
};

exports.UpdateBooking = async (req, res) => {
  // console.log(req.body)
  try {
    const { status } = req.body;
    const validStatuses = [
      "confirmed",
      "in-progress",
      "completed",
      "cancelled",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Valid statuses are: " + validStatuses.join(", "),
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Update timestamps based on status
    if (status === "in-progress" && !booking.actualPickupTime) {
      booking.actualPickupTime = new Date();
    }

    if (status === "completed" && !booking.actualDeliveryTime) {
      booking.actualDeliveryTime = new Date();
      if (booking.actualPickupTime) {
        booking.actualDurationHours =
          (booking.actualDeliveryTime - booking.actualPickupTime) /
          (1000 * 60 * 60);
      }
    }

    booking.bookingStatus = status;
    const updatedBooking = await booking.save();
    // console.log(updatedBooking)

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: updatedBooking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};
