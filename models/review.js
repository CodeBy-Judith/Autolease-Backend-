const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Review",
  tableName: "reviews",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    reviewerName: {
      type: "varchar",
    },

    comment: {
      type: "text",
    },

    rating: {
      type: "int",
    },

    vehicleId: {
      type: "int",
    },

    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
});