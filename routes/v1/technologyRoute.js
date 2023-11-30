const express = require("express");
const routes = express.Router();
const technologyController = require("../../Controllers/technologyController");
const auth = require("../../Middleware/checkAuth");

routes
  .route("/technology")
  .get(auth ,technologyController.getTechnology)
  .post(auth ,technologyController.createTechnology)
  .delete(auth ,technologyController.deleteTechnology);

module.exports = routes;
