const AppDataSource = require("../config/db");

const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Booking = require("../models/booking");
const Review = require("../models/review");
const Payment = require("../models/payment");

const userRepository = AppDataSource.getRepository(User);
const vehicleRepository = AppDataSource.getRepository(Vehicle);
const bookingRepository = AppDataSource.getRepository(Booking);
const reviewRepository = AppDataSource.getRepository(Review);
const paymentRepository = AppDataSource.getRepository(Payment);

const getDashboard = async (req, res) => {
  try {
    const totalUsers = await userRepository.count();
    const totalVehicles = await vehicleRepository.count();
    const totalBookings = await bookingRepository.count();
    const totalReviews = await reviewRepository.count();
    const totalPayments = await paymentRepository.count();

    const payments = await paymentRepository.find();

    const totalRevenue = payments.reduce((sum, payment) => {
      if (payment.status === "Successful") {
        return sum + Number(payment.amount);
      }
      return sum;
    }, 0);

    res.status(200).json({
      message: "Dashboard fetched successfully",
      dashboard: {
        totalUsers,
        totalVehicles,
        totalBookings,
        totalReviews,
        totalPayments,
        totalRevenue,
      },
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};