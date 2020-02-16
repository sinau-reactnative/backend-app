const express = require("express");
const multer = require("multer");

const Router = express.Router();
const upload = multer();

const tenant = require("../controllers/tenants");

Router.route("/")
  .get(tenant.getAllTenant)
  .post(upload.array("scan_ktp"), tenant.createTenant);
Router.route("/:id")
  .get(tenant.getTenantById)
  .patch(tenant.updateTenantId)
  .delete(upload.array("scan_ktp"), tenant.deleteTenantId);

module.exports = Router;
