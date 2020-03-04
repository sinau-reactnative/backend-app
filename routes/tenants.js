const express = require("express");
const multer = require("multer");

const Router = express.Router();
const upload = multer();

const { isAuthenticated } = require("../middlewares");
const tenant = require("../controllers/tenants");

// const cpUpload = upload.fields([{ name: "ktp_scan", maxCount: 1 }]);

Router.route("/")
  .get(isAuthenticated, tenant.getAllTenant)
  .post(isAuthenticated, upload.single("ktp_scan"), tenant.createTenant);
Router.route("/:id")
  .get(isAuthenticated, tenant.getTenantById)
  .patch(isAuthenticated, upload.single("ktp_scan"), tenant.updateTenantId)
  .delete(isAuthenticated, tenant.deleteTenantId);

module.exports = Router;
