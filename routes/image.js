const express = require("express");
const multer = require("multer");

const Router = express.Router();
const upload = multer();

const { isAuthenticated } = require("../middlewares");
const image = require("../controllers/images");

Router.route("/").post(
  isAuthenticated,
  upload.single("attachment"),
  image.uploadNewImage
);

Router.route("/:merchant_id", isAuthenticated, image.getImageByMerchantId);

module.exports = Router;
