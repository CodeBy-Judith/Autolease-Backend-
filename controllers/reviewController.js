const AppDataSource = require("../config/db");
const Review = require("../models/review");
const Vehicle = require("../models/vehicle");

const reviewRepository = AppDataSource.getRepository(Review);
const vehicleRepository = AppDataSource.getRepository(Vehicle);

// Create Review
const createReview = async (req, res) => {
  try {
    const { reviewerName, comment, rating, vehicleId } = req.body;

    if (!reviewerName || !comment || !rating || !vehicleId) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const vehicle = await vehicleRepository.findOne({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    const review = reviewRepository.create({
      reviewerName,
      comment,
      rating,
      vehicleId,
    });

    await reviewRepository.save(review);

    res.status(201).json({
      message: "Review created successfully",
      review,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Reviews
const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewRepository.find();

    res.status(200).json({
      message: "Reviews fetched successfully",
      count: reviews.length,
      reviews,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;

    const review = await reviewRepository.findOne({
      where: { id: Number(id) },
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    review.comment = comment || review.comment;
    review.rating = rating || review.rating;

    await reviewRepository.save(review);

    res.status(200).json({
      message: "Review updated successfully",
      review,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await reviewRepository.findOne({
      where: { id: Number(id) },
    });

    if (!review) {
      return res.status(404).json({
        message: "Review not found",
      });
    }

    await reviewRepository.remove(review);

    res.status(200).json({
      message: "Review deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createReview,
  getAllReviews,
  updateReview,
  deleteReview,
};