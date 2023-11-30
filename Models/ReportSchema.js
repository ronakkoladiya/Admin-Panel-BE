const mongoose = require("mongoose");
const constant = require("../Utils/constant");

const ReportSchema = new mongoose.Schema(
  {
    reportDate: {
      type: Date,
      require: true,
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalTime: Number,
    project: [
      {
        projectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
        },
        hours: Number,
        minutes: Number,
        description: String,
      },
    ],
  },
  { timestamps: true }
);

const Report = mongoose.model("Report", ReportSchema);

module.exports = Report;
