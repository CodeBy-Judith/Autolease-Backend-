const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "Booking",
  tableName: "bookings",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    customerName: {
      type: "varchar",
    },

    customerEmail: {
      type: "varchar",
    },

    vehicleId: {
  type: "int",
},
  
  pickupDate: {
      type: "date",
    },

    returnDate: {
      type: "date",
    },

    totalAmount: {
      type: "decimal",
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