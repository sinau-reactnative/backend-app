const express = require("express");
const multer = require("multer");

const Router = express.Router();
const upload = multer();

const { isAuthenticated } = require("../middlewares");
const billing = require("../controllers/billings");

const cpUpload = upload.fields([
  { name: "payment_proof", maxCount: 1 },
  { name: "receipt", maxCount: 1 }
]);

Router.route("/")
  .get(isAuthenticated, billing.getAllBillings)
  .post(cpUpload, isAuthenticated, billing.createBilling);
Router.route("/csv").get(isAuthenticated, billing.downloadCSVbyDate);
Router.route("/:id")
  .get(isAuthenticated, billing.getBillingById)
  .patch(cpUpload, isAuthenticated, billing.updateBillingId)
  .delete(isAuthenticated, billing.deleteBillingById);

module.exports = Router;
