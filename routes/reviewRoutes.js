const express = require("express");
const router = express.Router();

const {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const authMiddleware = require("../middleware/authMiddleware");

// Create Review
router.post("/", authMiddleware, createReview);

// Get All Reviews
router.get("/", getAllReviews);

// Update Review
router.put("/:id", authMiddleware, updateReview);

// Delete Review
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;