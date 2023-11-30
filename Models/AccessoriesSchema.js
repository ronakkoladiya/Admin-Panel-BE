const mongoose = require("mongoose");

const AccessoriesSchema = new mongoose.Schema(
  {
    name: String,
    total: String,
  },
  {
    timestamps: true,
  }
);

const Accessories = mongoose.model("Accessories", AccessoriesSchema);

module.exports = Accessories;
