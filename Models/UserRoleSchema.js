const mongoose = require("mongoose");
const UserRoleSchema = new mongoose.Schema(
  {
    name: String,
  },
  {
    timestamps: true,
  }
);

const UserRole = mongoose.model("UserRole", UserRoleSchema);

module.exports = UserRole;
