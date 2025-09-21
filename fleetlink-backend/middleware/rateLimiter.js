const rateLimit = require("express-rate-limit");

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: "Too many requests from this IP, please try again later.",
    retryAfter: "15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for booking endpoints
const bookingLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10, // limit each IP to 10 booking requests per 5 minutes
  message: {
    error: "Too many booking requests from this IP, please try again later.",
    retryAfter: "5 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Search rate limiter
const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 30, // limit each IP to 30 search requests per minute
  message: {
    error: "Too many search requests from this IP, please try again later.",
    retryAfter: "1 minute",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  bookingLimiter,
  searchLimiter,
};
