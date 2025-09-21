const express = require("express");
const {
  vehicleValidation,
  availabilityValidation,
} = require("../middleware/validation");
const { searchLimiter } = require("../middleware/rateLimiter");
const {
  AddNewVehicle,
  FindAvailableVehicles,
  GetAllVehicles,
  GetSingleVehicle,
} = require("../controller/vehicleController");

const router = express.Router();

router.post("/", vehicleValidation, AddNewVehicle);

router.get(
  "/available",
  searchLimiter,
  availabilityValidation,
  FindAvailableVehicles
);

router.get("/", GetAllVehicles);

router.get("/:id", GetSingleVehicle);

module.exports = router;
