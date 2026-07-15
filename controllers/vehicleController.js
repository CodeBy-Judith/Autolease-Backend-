const AppDataSource = require("../config/db");
const Vehicle = require("../models/vehicle");

const vehicleRepository = AppDataSource.getRepository(Vehicle);

// ====================== ADD VEHICLE ======================
const addVehicle = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      color,
      plateNumber,
      vin,
      engineType,
      fuelType,
      transmission,
      description,
      address,
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
        message: "Brand, model, year, color, plate number and price are required",
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
      vin,
      engineType,
      fuelType,
      transmission,
      description,
      address,
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

// ====================== GET ALL VEHICLES ======================
const getAllVehicles = async (req, res) => {
  try {
    const {
      search,
      available,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    let query = vehicleRepository.createQueryBuilder("vehicle");

    // Search by brand or model
    if (search) {
      query = query.where(
        "LOWER(vehicle.brand) LIKE LOWER(:search) OR LOWER(vehicle.model) LIKE LOWER(:search)",
        {
          search: `%${search}%`,
        }
      );
    }

    // Filter by availability
    if (available !== undefined) {
      query = query.andWhere(
        "vehicle.available = :available",
        {
          available: available === "true",
        }
      );
    }

    // Sort by price
    if (sort === "asc") {
      query = query.orderBy("vehicle.pricePerDay", "ASC");
    } else if (sort === "desc") {
      query = query.orderBy("vehicle.pricePerDay", "DESC");
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);

    query = query.skip(skip).take(Number(limit));

    const [vehicles, total] = await query.getManyAndCount();

    res.status(200).json({
      message: "Vehicles fetched successfully",
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      vehicles,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ====================== UPDATE VEHICLE ======================
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
      vin,
      engineType,
      fuelType,
      transmission,
      description,
      address,
      pricePerDay,
    } = req.body;

    vehicle.brand = brand || vehicle.brand;
    vehicle.model = model || vehicle.model;
    vehicle.year = year || vehicle.year;
    vehicle.color = color || vehicle.color;
    vehicle.plateNumber = plateNumber || vehicle.plateNumber;
    vehicle.vin = vin || vehicle.vin;
    vehicle.engineType = engineType || vehicle.engineType;
    vehicle.fuelType = fuelType || vehicle.fuelType;
    vehicle.transmission = transmission || vehicle.transmission;
    vehicle.description = description || vehicle.description;
    vehicle.address = address || vehicle.address;
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

// ====================== DELETE VEHICLE ======================
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

// ====================== TOGGLE AVAILABILITY ======================
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