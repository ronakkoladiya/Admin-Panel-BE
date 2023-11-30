const mongoose = require("mongoose");

const SalarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  salaryPaidOn: [
    {
      month: {
        type: String,
      },
      amount: {
        type: String,
      },
      paidOn: {
        type: Date,
      },
    },
  ],
  salaryInfo: [
    {
      Date: Date,
      amount: Number,
    },
  ],
});

const salary = mongoose.model("Salary", SalarySchema);

module.exports = salary;
