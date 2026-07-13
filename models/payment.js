const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Payment",
  tableName: "payments",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    bookingId: {
      type: "int",
    },

    amount: {
      type: "decimal",
    },

    reference: {
      type: "varchar",
      unique: true,
    },

    status: {
      type: "varchar",
      default: "Pending",
    },

    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
});