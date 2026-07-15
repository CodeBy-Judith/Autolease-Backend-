const { DataSource } = require("typeorm");
require("dotenv").config();

const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Booking = require("../models/booking");
const Review = require("../models/review");
const Payment = require("../models/payment");

const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  synchronize: true,
  logging: false,
  entities: [User, Vehicle, Booking, Review, Payment],
});

module.exports = AppDataSource;