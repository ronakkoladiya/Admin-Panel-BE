const express = require("express");
const routes = express.Router();
const bankController = require("../../Controllers/bankController");
const auth = require("../../Middleware/checkAuth");

// get all branch //
routes
  .route("/bank")
  .get(auth,bankController.getUserBankDetails)
  .post(auth, bankController.createBankDetails)

module.exports = routes;
