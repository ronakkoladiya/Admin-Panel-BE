const mongoose = require("mongoose");

const DesignationSchema = new mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const Designation = mongoose.model("Designation", DesignationSchema);
module.exports = Designation;
