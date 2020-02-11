const express = require("express");
const Router = express.Router();

const { isAuthenticated } = require("../middlewares");
const auth = require("../controllers/auth");

Router.route("/signin").post(auth.signin);
Router.route("/signup").post(isAuthenticated, auth.signup);

module.exports = Router;
