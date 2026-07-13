const express = require("express");
const router = express.Router();

const {
  createBooking,
  getAllBookings,
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");

// Get all bookings
router.get("/", getAllBookings);

// Create a booking (Protected)
router.post("/", authMiddleware, createBooking);

module.exports = router;