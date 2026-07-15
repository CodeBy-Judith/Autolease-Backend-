const { EntitySchema } = require("typeorm");

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",

  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },

    fullName: {
      type: "varchar",
    },

    email: {
      type: "varchar",
      unique: true,
    },

    password: {
      type: "varchar",
    },

    resetToken: {
  type: "varchar",
  nullable: true,
},

resetTokenExpires: {
  type: "timestamp",
  nullable: true,
},

role: {
      type: "varchar",
      default: "user",
    },

    createdAt: {
      type: "timestamp",
      createDate: true,
    },
  },
});