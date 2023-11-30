const express = require("express");
const routes = express.Router();
const authenticationController = require("../../Controllers/authenticationController");
const auth = require("../../Middleware/checkAuth")

// register //
routes.post("/auth/register", authenticationController.register);
// login //
routes.post("/auth/login", authenticationController.login);
// forgot password //
routes.post("/auth/forgot_password", authenticationController.forgotPassword);
// reset password //
routes.post("/auth/reset_password", authenticationController.resetPassword);
// refresh page //
routes.get("/refreshPage", auth, authenticationController.refreshPage);

module.exports = routes;
