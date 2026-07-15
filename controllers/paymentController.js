const AppDataSource = require("../config/db");
const Payment = require("../models/payment");
const Booking = require("../models/booking");

const paymentRepository = AppDataSource.getRepository(Payment);
const bookingRepository = AppDataSource.getRepository(Booking);

// Initialize Payment
const initializePayment = async (req, res) => {
  try {
    const { bookingId, amount } = req.body;
    const booking = await bookingRepository.findOne({
  where: { id: Number(bookingId) },
});

if (!booking) {
  return res.status(404).json({
    message: "Booking not found",
  });
}

    if (!bookingId || !amount) {
      return res.status(400).json({
        message: "Booking ID and amount are required",
      });
    }

    const reference = "PAY-" + Date.now();

    const payment = paymentRepository.create({
      bookingId,
      amount,
      reference,
      status: "Pending",
    });

    await paymentRepository.save(payment);

    res.status(201).json({
      message: "Payment initialized successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Verify Payment
const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    const payment = await paymentRepository.findOne({
      where: { reference },
    });

    if (!payment) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    if (payment.status === "Successful") {
  return res.status(400).json({
    message: "Payment has already been verified",
  });
}
    payment.status = "Successful";

    await paymentRepository.save(payment);

    res.status(200).json({
      message: "Payment verified successfully",
      payment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Payment History
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await paymentRepository.find();

    res.status(200).json({
      message: "Payments fetched successfully",
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  initializePayment,
  verifyPayment,
  getPaymentHistory,
};