const express = require("express");
const multer = require("multer");

const Router = express.Router();
const upload = multer();

const { isAuthenticated } = require("../middlewares");
const image = require("../controllers/images");

Router.route("/").post(isAuthenticated, upload.single("attachment"), image.uploadNewImage);

Router.route("/:id")
  .get(isAuthenticated, image.getImageByMerchantId)
  .delete(isAuthenticated, image.deleteImageById);

module.exports = Router;
