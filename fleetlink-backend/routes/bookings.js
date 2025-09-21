const express = require("express");
const {
  bookingValidation,
  deleteBookingValidation,
} = require("../middleware/validation");
const { bookingLimiter } = require("../middleware/rateLimiter");
const {
  BookAVehicle,
  GetAllBookings,
  GetBookingById,
  RemoveBooking,
  UpdateBooking,
} = require("../controller/bookingController");

const router = express.Router();

router.post("/", bookingLimiter, bookingValidation, BookAVehicle);

router.get("/", GetAllBookings);

router.get("/:id", GetBookingById);

router.delete("/:id", deleteBookingValidation, RemoveBooking);

router.put("/:id/status", UpdateBooking);

module.exports = router;
