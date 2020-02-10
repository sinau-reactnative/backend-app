const express = require("express");
const Router = express.Router();

const user = require("../controllers/users");

Router.route("/").get(user.getAllUser);

Router.route("/:id")
  .get(user.getUserById)
  .patch(user.updateUser)
  .delete(user.updateUser);

module.exports = Router;
