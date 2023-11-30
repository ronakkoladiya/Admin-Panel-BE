const express = require("express");
const routes = express.Router();
const leaveController = require("../../Controllers/LeaveController");
const auth = require("../../Middleware/checkAuth");

// get all leaves
routes
  .route("/leave")
  .post(auth, leaveController.addLeave)
  .get(auth, leaveController.getLeave)
  .put(auth, leaveController.updateLeaveStatus);

module.exports = routes;
