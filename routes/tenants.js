const express = require("express");
const multer = require("multer");

const Router = express.Router();
const upload = multer();

const { isAuthenticated } = require("../middlewares");
const tenant = require("../controllers/tenants");

Router.route("/")
  .get(isAuthenticated, tenant.getAllTenant)
  .post(isAuthenticated, upload.array("scan_ktp"), tenant.createTenant);
Router.route("/:id")
  .get(isAuthenticated, tenant.getTenantById)
  .patch(isAuthenticated, tenant.updateTenantId)
  .delete(isAuthenticated, upload.array("scan_ktp"), tenant.deleteTenantId);

module.exports = Router;
