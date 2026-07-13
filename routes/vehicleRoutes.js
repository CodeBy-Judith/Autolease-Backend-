const express = require("express");
const router = express.Router();

const {
  addVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
  toggleAvailability,
} = require("../controllers/vehicleController");

const authMiddleware = require("../middleware/authMiddleware");

// Add Vehicle
router.post("/", authMiddleware, addVehicle);

// Get All Vehicles
router.get("/", getAllVehicles);

// Update Vehicle
router.put("/:id", authMiddleware, updateVehicle);

// Delete Vehicle
router.delete("/:id", authMiddleware, deleteVehicle);

// Toggle Vehicle Availability
router.patch("/:id/availability", authMiddleware, toggleAvailability);

module.exports = router;