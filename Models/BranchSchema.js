const mongoose = require("mongoose");
const constant = require("../Utils/constant");
const BranchSchema = new mongoose.Schema(
  {
    branchName: {
      type: String,
      require: true,
      unique: true,
    },
    location: {
      type: String,
      require: true,
    },
    contact: {
      type: String,
      require: true,
      unique: true,
      match: [/\d{10}/, constant.VALIDATION.CONTACT_MESSAGE],
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    accessories: [
      {
        accessoriesId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Accessories",
        },
        total: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const branch = mongoose.model("Branch", BranchSchema);

module.exports = branch;
