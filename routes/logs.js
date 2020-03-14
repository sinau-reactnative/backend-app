const express = require("express");
const Router = express.Router();

const { isAuthenticated } = require("../middlewares");
const logs = require("../controllers/logs");

Router.route("/merchant/:id").get(isAuthenticated, logs.getMerchantLogs);
Router.route("/tenant/:id").get(isAuthenticated, logs.getTenantLogs);
Router.route("/billing/:id").get(isAuthenticated, logs.getBillingLogs);

module.exports = Router;
