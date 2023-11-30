const mongoose = require("mongoose");

const TechnologySchema = new mongoose.Schema(
  {
    name: String,
  },
  { timestamps: true }
);

const Technology = mongoose.model("Technology", TechnologySchema);
module.exports = Technology;
