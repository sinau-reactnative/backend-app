const express = require("express");
const Router = express.Router();

const auth = require("../controllers/auth");

Router.route("/signin").post(auth.signin);
Router.route("/signup").post(auth.signup);

module.exports = Router;
