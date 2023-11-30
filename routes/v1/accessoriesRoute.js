const express = require("express");
const routes = express.Router();
const accessoriesController = require("../../Controllers/accessoriesController");
const auth = require("../../Middleware/checkAuth");

routes
  .route("/accessories")
  .get(auth , accessoriesController.getAccessories)
  .post(auth, accessoriesController.createAccessories)

module.exports = routes;
