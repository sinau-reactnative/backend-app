const express = require("express");
const multer = require("multer");

const Router = express.Router();
const upload = multer();

const billing = require("../controllers/billings");

const cpUpload = upload.fields([
  { name: "payment_proof", maxCount: 1 },
  { name: "receipt", maxCount: 1 }
]);

Router.route("/")
  .get(billing.getAllBillings)
  .post(cpUpload, billing.createBilling);
Router.route("/:id")
  .get(billing.getBillingById)
  .patch(cpUpload, billing.updateMerchantId)
  .delete(billing.deleteBillingById);

module.exports = Router;
