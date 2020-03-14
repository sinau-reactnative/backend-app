const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");

module.exports = {
  getTenantLogs: (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT L*, U.fullname, U.email, U.role
        FROM tenant_logs L
        JOIN users U
        ON L.user_id = U.id
        WHERE L.tenant_id = ?
        ORDER BY L.created_at DESC;
        ;
    `;

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_get_tenant_logs", err });
      } else {
        sendResponse(res, 200, result);
      }
    });
  },

  getMerchantLogs: (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT L.*, U.fullname, U.email, U.role
        FROM merchant_logs L
        JOIN users U
        ON L.user_id = U.id
        WHERE L.merchant_id = ?
        ORDER BY L.created_at DESC;
    `;

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_get_merchant_logs", err });
      } else {
        sendResponse(res, 200, result);
      }
    });
  },

  getBillingLogs: (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT *, U.fullname, U.email, U.role
        FROM billing_logs L
        JOIN users U
        ON L.user_id = U.id
        WHERE L.id = ?
        ORDER BY L.created_at DESC;
    `;

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_get_merchant_logs", err });
      } else {
        sendResponse(res, 200, result);
      }
    });
  }
};
