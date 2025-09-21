require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const morgan = require("morgan");
const connectDB = require("./config/database");
const { generalLimiter } = require("./middleware/rateLimiter");

// routes
const vehicleRoutes = require("./routes/vehicles");
const bookingRoutes = require("./routes/bookings");
const corsOptions = require("./config/corsOption");

const app = express();
const PORT = process.env.PORT || 4000;

connectDB();

// Middleware
app.use(helmet());
app.use(cors(corsOptions));

app.use(compression());
app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
// app.use(
//   mongoSanitize({
//     onQuery: false, // skip query sanitization
//     onBody: true,
//     onParams: true,
//   })
// ); // Prevent NoSQL injection

app.use(generalLimiter);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FleetLink API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// API routes
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/bookings", bookingRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);

  // validation errors
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors,
    });
  }

  // cast errors
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  // key errors
  if (error.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value entered",
    });
  }

  // Default error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
});

// shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
    process.exit(0);
  });
});

const server = app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
