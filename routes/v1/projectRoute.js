const express = require("express");
const routes = express.Router();
const projectController = require("../../Controllers/projectController");
const auth = require("../../Middleware/checkAuth");

// get all branch //
routes
  .route("/project")
  .get(auth, projectController.getProject)
  .post(auth, projectController.createProject)
  .put(auth, projectController.updateProject);

routes.get("/getAllProjectName", auth, projectController.getAllProjectName);

module.exports = routes;
