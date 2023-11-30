const express = require("express");
const routes = express.Router();
const userController = require("../../Controllers/userController");
const auth = require("../../Middleware/checkAuth");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

routes
  .route("/user")
  .get(auth, userController.getUser)
  .post(userController.addUser)
  .put(auth, userController.updateUser);

// user get by designation
routes.get("/getUserByDesignation", auth, userController.getUserByDesignation);

// insert user role
routes.get("/insertUserRole", userController.insertUserRole);
// get user role
routes.get("/getUserRole", userController.getUserRole);

// upload user data sheet
routes.post(
  "/uploadUsersSheet",
  upload.single("dataFile"),
  userController.uploadUsersSheet
);

module.exports = routes;
