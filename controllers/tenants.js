const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");

module.exports = {
  createTenant: (req, res) => {
    const { name, no_ktp, ttl, address, ktp_scan } = req.body;
    const sql = `
        INSERT INTO tenants 
        VALUES (
            NULL,
            ?,
            ?,
            ?,
            ?,
            ?,
            DEFAULT,
            DEFAULT
        );`;

    db.query(sql, [name, no_ktp, ttl, address, ktp_scan], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_make_new_tenant", err });
      } else {
        sendResponse(res, 200, { id: result.insertId });
      }
    });
  },

  getAllTenant: (req, res) => {
    const sql = `
        SELECT * FROM tenants;
    `;
    db.query(sql, [], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_get_all_tenants", err });
      } else {
        sendResponse(res, 200, result);
      }
    });
  },

  getTenantById: (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT * FROM tenants WHERE id = ?;
      `;

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_get_tenant", err });
      } else {
        sendResponse(res, 200, result);
      }
    });
  },

  updateTenantId: (req, res) => {
    const { id } = req.params;
    const { name, no_ktp, ttl, address, ktp_scan } = req.body;
    const sql = `
        UPDATE tenants
        SET name = ?,
            no_ktp = ?,
            ttl = ?,
            address = ?,
            ktp_scan = ?
        WHERE id = ? ;
    `;
    db.query(sql, [name, no_ktp, ttl, address, ktp_scan, id], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_update_tenant", err });
      } else {
        sendResponse(res, 200, result);
      }
    });
  },

  deleteTenantId: (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM tenants WHERE id = ? ;`;

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_delete_tenant", err });
      } else {
        sendResponse(res, 200, result);
      }
    });
  }
};
