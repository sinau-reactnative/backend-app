const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");

module.exports = {
  getTenantLogs: (req, res) => {
    const { offset, limit } = req.query;
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
    let total = `SELECT COUNT(*) as total FROM tenant_logs WHERE tenant_id = ? `;

    const getSql = new Promise((resolve, reject) => {
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const totalSql = new Promise((resolve, reject) => {
      db.query(total, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    Promise.all([getSql, totalSql])
      .then(result => {
        const page = offset / limit + 1;
        const total = result[1].map(i => i.total)[0];
        const hasNext = total - page * limit > 0 ? true : false;
        const pagination = {
          page,
          hasNext,
          total
        };
        sendResponse(res, 200, { result: result[0], pagination });
      })
      .catch(err => {
        sendResponse(res, 500, {
          response: "error_when_get_all_tenant_logs",
          err
        });
      });
  },

  getMerchantLogs: (req, res) => {
    const { offset, limit } = req.query;
    const { id } = req.params;

    const sql = `
        SELECT L.*, U.fullname, U.email, U.role
        FROM merchant_logs L
        JOIN users U
        ON L.user_id = U.id
        WHERE L.merchant_id = ?
        ORDER BY L.created_at DESC;
    `;

    let total = `SELECT COUNT(*) as total FROM merchant_logs WHERE merchant_id = ? `;

    const getSql = new Promise((resolve, reject) => {
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const totalSql = new Promise((resolve, reject) => {
      db.query(total, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    Promise.all([getSql, totalSql])
      .then(result => {
        const page = offset / limit + 1;
        const total = result[1].map(i => i.total)[0];
        const hasNext = total - page * limit > 0 ? true : false;
        const pagination = {
          page,
          hasNext,
          total
        };
        sendResponse(res, 200, { result: result[0], pagination });
      })
      .catch(err => {
        sendResponse(res, 500, {
          response: "error_when_get_all_merchant_logs",
          err
        });
      });
  },

  getBillingLogs: (req, res) => {
    const { offset, limit } = req.query;
    const { id } = req.params;

    const sql = `
        SELECT *, U.fullname, U.email, U.role
        FROM billing_logs L
        JOIN users U
        ON L.user_id = U.id
        WHERE L.id = ?
        ORDER BY L.created_at DESC;
    `;

    let total = `SELECT COUNT(*) as total FROM billing_logs WHERE id = ? `;

    const getSql = new Promise((resolve, reject) => {
      db.query(sql, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const totalSql = new Promise((resolve, reject) => {
      db.query(total, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    Promise.all([getSql, totalSql])
      .then(result => {
        const page = offset / limit + 1;
        const total = result[1].map(i => i.total)[0];
        const hasNext = total - page * limit > 0 ? true : false;
        const pagination = {
          page,
          hasNext,
          total
        };
        sendResponse(res, 200, { result: result[0], pagination });
      })
      .catch(err => {
        sendResponse(res, 500, {
          response: "error_when_get_all_billing_logs",
          err
        });
      });
  }
};
