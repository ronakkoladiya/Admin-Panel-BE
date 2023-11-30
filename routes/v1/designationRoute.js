const express = require("express");
const routes = express.Router();
const designationController = require("../../Controllers/designationController");
const auth = require("../../Middleware/checkAuth");

routes
  .route("/designation")
  .get(auth ,designationController.getDesignation)
  .post(auth ,designationController.createDesignation)
  .delete(auth ,designationController.deleteDesignation);

module.exports = routes;
