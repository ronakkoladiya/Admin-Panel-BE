const mongoose = require("mongoose");

const BankDetailsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bankName: String,
    accountNumber: String,
    ifsc: String,
    upiNumber: String,
    passbook: String,
  },
  {
    timestamps: true,
  }
);

const bankDetails = mongoose.model("BankDetails", BankDetailsSchema);

module.exports = bankDetails;
