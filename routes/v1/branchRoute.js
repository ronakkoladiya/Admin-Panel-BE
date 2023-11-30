const express = require("express");
const routes = express.Router();
const branchController = require("../../Controllers/branchController");
const auth = require("../../Middleware/checkAuth");

// get all branch //
routes
  .route("/branch")
  .get(auth, branchController.getBranch)
  .post(auth ,branchController.createBranch)
  .put(auth ,branchController.updateBranch)
  .delete(auth ,branchController.branchDelete);

module.exports = routes;
