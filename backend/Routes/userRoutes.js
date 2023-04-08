const express = require("express");
const Router = express.Router();
const { createUser, login } = require("../controller/userController")
const verifyToken = require("../middlewares/auth");

Router.post("/createUser", createUser);
Router.post("/login", verifyToken, login);

module.exports = Router;