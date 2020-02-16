const express = require("express");
const Router = express.Router();

const tenant = require("../controllers/tenants");

Router.route("/")
  .get(tenant.getAllTenant)
  .post(tenant.createTenant);
Router.route("/:id")
  .get(tenant.getTenantById)
  .patch(tenant.updateTenantId)
  .delete(tenant.deleteTenantId);

module.exports = Router;
