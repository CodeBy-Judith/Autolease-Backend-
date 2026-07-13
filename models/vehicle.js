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

    pricePerDay: {
      type: "decimal",
    },

    available: {
      type: "boolean",
      default: true,
    },

    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
});