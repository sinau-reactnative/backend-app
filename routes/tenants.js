const express = require("express");
const multer = require("multer");

const Router = express.Router();
const upload = multer();

const { isAuthenticated } = require("../middlewares");
const tenant = require("../controllers/tenants");

Router.route("/")
  .get(isAuthenticated, tenant.getAllTenant)
  .post(isAuthenticated, upload.array("ktp_scan"), tenant.createTenant);
Router.route("/:id")
  .get(isAuthenticated, tenant.getTenantById)
  .patch(isAuthenticated, upload.array("ktp_scan"), tenant.updateTenantId)
  .delete(isAuthenticated, tenant.deleteTenantId);

module.exports = Router;
