const express = require("express");
const Router = express.Router();

const { isAuthenticated } = require("../middlewares");
const user = require("../controllers/users");

Router.route("/").get(isAuthenticated, user.getAllUser);

Router.route("/:id")
  .get(isAuthenticated, user.getUserById)
  .patch(isAuthenticated, user.updateUser)
  .delete(isAuthenticated, user.deleteUserById);

module.exports = Router;
