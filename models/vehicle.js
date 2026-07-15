const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Vehicle",
  tableName: "vehicles",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    brand: {
      type: "varchar",
    },

    model: {
      type: "varchar",
    },

    year: {
      type: "int",
    },

    color: {
      type: "varchar",
    },

    plateNumber: {
      type: "varchar",
      unique: true,
    },

    vin: {
  type: "varchar",
  unique: true,
  nullable: true,
},

engineType: {
  type: "varchar",
  nullable: true,
},

fuelType: {
  type: "varchar",
  nullable: true,
},

transmission: {
  type: "varchar",
  nullable: true,
},

description: {
  type: "text",
  nullable: true,
},

address: {
  type: "varchar",
  nullable: true,
},

pricePerDay: {
  type: "decimal",
},

available: {
  type: "boolean",
  default: true,
},

isPaused: {
  type: "boolean",
  default: false,
},

    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
});