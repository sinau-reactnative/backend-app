const express = require("express");
const multer = require("multer");

const Router = express.Router();
const upload = multer();

const merchants = require("../controllers/merchant");

const cpUpload = upload.fields([
  { name: "attachment_1", maxCount: 1 },
  { name: "attachment_2", maxCount: 1 }
]);

Router.route("/")
  .get(merchants.getAllMerchants)
  .post(cpUpload, merchants.createMerchant);

Router.route("/:id")
  .get(merchants.getMerchantById)
  .patch(cpUpload, merchants.updateMerchantId)
  .delete(merchants.deleteMerchantById);

module.exports = Router;
