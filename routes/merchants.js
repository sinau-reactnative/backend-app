const express = require("express");
const multer = require("multer");

const Router = express.Router();
const upload = multer();

const { isAuthenticated } = require("../middlewares");
const merchants = require("../controllers/merchant");

const cpUpload = upload.fields([
  { name: "attachment_1", maxCount: 1 },
  { name: "attachment_2", maxCount: 1 }
]);

Router.route("/")
  .get(isAuthenticated, merchants.getAllMerchants)
  .post(isAuthenticated, cpUpload, merchants.createMerchant);

Router.route("/:id")
  .get(isAuthenticated, merchants.getMerchantById)
  .patch(isAuthenticated, cpUpload, merchants.updateMerchantId)
  .delete(isAuthenticated, merchants.deleteMerchantById);

module.exports = Router;
