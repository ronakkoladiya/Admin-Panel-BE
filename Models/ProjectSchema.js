const mongoose = require("mongoose");
const constant = require("../Utils/constant");

const ProjectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      require: true,
    },
    client: {
      type: String,
      require: true,
    },
    startDate: {
      type: Date,
      require: true,
    },
    endDate: Date,
    status: {
      type: String,
      require: true,
      default: "none",
      enum: constant.VALUES.STATUS_ARRAY,
    },
    technology: Array,
    teamLeader: Array,
    teamMembers: Array,
    description: String,
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);

module.exports = Project;
