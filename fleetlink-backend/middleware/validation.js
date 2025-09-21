const { body, query, param, validationResult } = require("express-validator");

// Validation middleware to handle errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// Vehicle validation rules
const vehicleValidation = [
  body("name")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Vehicle name must be between 1 and 100 characters"),
  body("capacityKg")
    .isNumeric()
    .custom((value) => {
      if (value < 1) {
        throw new Error("Capacity must be at least 1 kg");
      }
      return true;
    }),
  body("tyres")
    .isInt({ min: 2 })
    .withMessage("Vehicle must have at least 2 tyres"),
  body("vehicleType")
    .optional()
    .isIn(["truck", "van", "pickup", "trailer"])
    .withMessage("Invalid vehicle type"),
  body("fuelType")
    .optional()
    .isIn(["diesel", "petrol", "electric", "hybrid"])
    .withMessage("Invalid fuel type"),
  body("registrationNumber")
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage("Registration number cannot exceed 20 characters"),
  handleValidationErrors,
];

// Availability search validation rules
const availabilityValidation = [
  query("capacityRequired")
    .isNumeric()
    .custom((value) => {
      if (value < 1) {
        throw new Error("Capacity required must be at least 1 kg");
      }
      return true;
    }),
  query("fromPincode")
    .matches(/^\d{6}$/)
    .withMessage("From pincode must be a 6-digit number"),
  query("toPincode")
    .matches(/^\d{6}$/)
    .withMessage("To pincode must be a 6-digit number"),
  query("startTime")
    .isISO8601()
    .withMessage("Start time must be in ISO 8601 format")
    .custom((value) => {
      const startTime = new Date(value);
      const now = new Date();
      if (startTime < now) {
        throw new Error("Start time cannot be in the past");
      }
      return true;
    }),
  handleValidationErrors,
];

// Booking validation rules
const bookingValidation = [
  body("vehicleId").isMongoId().withMessage("Invalid vehicle ID"),
  body("customerId")
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Customer ID must be between 1 and 50 characters"),
  body("fromPincode")
    .matches(/^\d{6}$/)
    .withMessage("From pincode must be a 6-digit number"),
  body("toPincode")
    .matches(/^\d{6}$/)
    .withMessage("To pincode must be a 6-digit number"),
  body("startTime")
    .isISO8601()
    .withMessage("Start time must be in ISO 8601 format")
    .custom((value) => {
      const startTime = new Date(value);
      const now = new Date();
      if (startTime < now) {
        throw new Error("Start time cannot be in the past");
      }
      return true;
    }),
  body("customerInfo.name")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Customer name cannot exceed 100 characters"),
  body("customerInfo.phone")
    .optional()
    .matches(/^\+?[\d\s-]{10,15}$/)
    .withMessage("Invalid phone number format"),
  body("customerInfo.email")
    .optional()
    .isEmail()
    .withMessage("Invalid email format"),
  body("cargoDetails.weight")
    .optional()
    .isNumeric()
    .custom((value) => {
      if (value < 0) {
        throw new Error("Cargo weight cannot be negative");
      }
      return true;
    }),
  handleValidationErrors,
];

// Booking deletion validation
const deleteBookingValidation = [
  param("id").isMongoId().withMessage("Invalid booking ID"),
  handleValidationErrors,
];

module.exports = {
  vehicleValidation,
  availabilityValidation,
  bookingValidation,
  deleteBookingValidation,
  handleValidationErrors,
};
