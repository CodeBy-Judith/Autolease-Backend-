const AppDataSource = require("../config/db");
const Booking = require("../models/booking");
const Vehicle = require("../models/vehicle");

const bookingRepository = AppDataSource.getRepository(Booking);
const vehicleRepository = AppDataSource.getRepository(Vehicle);

const createBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      vehicleId,
      pickupDate,
      returnDate,
      totalAmount,
    } = req.body;

    if (
      !customerName ||
      !customerEmail ||
      !vehicleId ||
      !pickupDate ||
      !returnDate ||
      !totalAmount
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const vehicle = await vehicleRepository.findOne({
      where: { id: Number(vehicleId) },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    // Prevent booking unavailable vehicles
    if (!vehicle.available) {
      return res.status(400).json({
        message: "This vehicle is currently unavailable for booking",
      });
    }

    const existingBooking = await bookingRepository
  .createQueryBuilder("booking")
  .where("booking.vehicleId = :vehicleId", { vehicleId })
  .andWhere("booking.status != :status", { status: "Cancelled" })
  .andWhere(
    ":pickupDate <= booking.returnDate AND :returnDate >= booking.pickupDate",
    {
      pickupDate,
      returnDate,
    }
  )
  .getOne();

if (existingBooking) {
  return res.status(400).json({
    message: "Vehicle is already booked for the selected dates",
  });
}

    const booking = bookingRepository.create({
      customerName,
      customerEmail,
      vehicleId,
      pickupDate,
      returnDate,
      totalAmount,
      status: "Pending",
    });

    await bookingRepository.save(booking);

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await bookingRepository.find();

    res.status(200).json({
      message: "Bookings fetched successfully",
      count: bookings.length,
      bookings,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
};