const { DataSource } = require("typeorm");
require("dotenv").config();

const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Booking = require("../models/booking");
const Review = require("../models/review");
const Payment = require("../models/payment");

const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [User, Vehicle, Booking, Review, Payment],
});

module.exports = AppDataSource;