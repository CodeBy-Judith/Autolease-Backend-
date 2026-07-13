const AppDataSource = require("../config/db");
const Vehicle = require("../models/vehicle");

const vehicleRepository = AppDataSource.getRepository(Vehicle);

const addVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      color,
      plateNumber,
      pricePerDay,
    } = req.body;

    if (
      !brand ||
      !model ||
      !year ||
      !color ||
      !plateNumber ||
      !pricePerDay
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const existingVehicle = await vehicleRepository.findOne({
      where: { plateNumber },
    });

    if (existingVehicle) {
      return res.status(400).json({
        message: "Vehicle already exists",
      });
    }

    const vehicle = vehicleRepository.create({
      brand,
      model,
      year,
      color,
      plateNumber,
      pricePerDay,
    });

    await vehicleRepository.save(vehicle);

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleRepository.find();

    res.status(200).json({
      message: "Vehicles fetched successfully",
      count: vehicles.length,
      vehicles,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await vehicleRepository.findOne({
      where: { id: Number(id) },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    const {
      brand,
      model,
      year,
      color,
      plateNumber,
      pricePerDay,
    } = req.body;

    vehicle.brand = brand || vehicle.brand;
    vehicle.model = model || vehicle.model;
    vehicle.year = year || vehicle.year;
    vehicle.color = color || vehicle.color;
    vehicle.plateNumber = plateNumber || vehicle.plateNumber;
    vehicle.pricePerDay = pricePerDay || vehicle.pricePerDay;

    await vehicleRepository.save(vehicle);

    res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await vehicleRepository.findOne({
      where: { id: Number(id) },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    await vehicleRepository.remove(vehicle);

    res.status(200).json({
      message: "Vehicle deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicle = await vehicleRepository.findOne({
      where: { id: Number(id) },
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    vehicle.available = !vehicle.available;

    await vehicleRepository.save(vehicle);

    res.status(200).json({
      message: "Vehicle availability updated successfully",
      available: vehicle.available,
      vehicle,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  addVehicle,
  getAllVehicles,
  updateVehicle,
  deleteVehicle,
  toggleAvailability,
};