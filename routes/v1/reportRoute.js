const express = require("express");
const routes = express.Router();
const reportController = require("../../Controllers/reportController");
const auth = require("../../Middleware/checkAuth");

// create report route
routes.post("/createReport", auth, reportController.createReport);
routes.get("/getEmployeeReport", auth, reportController.getEmployeeReport);

module.exports = routes;
