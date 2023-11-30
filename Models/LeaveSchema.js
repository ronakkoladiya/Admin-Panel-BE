const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema(
  {
    timeOffLeave: String,
    leaveType: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fromDate: Date,
    toDate: Date,
    reasonDescribe: String,
    status: String
  },
  {
    timestamps: true,
  }
);

const Leave = mongoose.model("Leave", LeaveSchema);

module.exports = Leave;
