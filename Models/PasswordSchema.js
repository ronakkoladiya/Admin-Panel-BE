const mongoose = require("mongoose");
const validator = require("validator");

const PasswordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const password = mongoose.model("Password", PasswordSchema);

module.exports = password;
