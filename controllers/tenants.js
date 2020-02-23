const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");

module.exports = {
  createTenant: (req, res) => {
    const { name, no_ktp, place_of_birth, date_of_birth, address } = req.body;
    let ktp_scan = req.files;
    ktp_scan = ktp_scan ? "ADA IMAGE" : "NGGAK ADA IMAGE";
    const sql = `
        INSERT INTO tenants 
        VALUES (
            NULL,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            DEFAULT,
            DEFAULT
        );`;

    db.query(
      sql,
      [name, no_ktp, place_of_birth, date_of_birth, address, ktp_scan],
      (err, result) => {
        if (err) {
          sendResponse(res, 500, {
            response: "error_when_make_new_tenant",
            err
          });
        } else {
          sendResponse(res, 200, { id: result.insertId });
        }
      }
    );
  },

  getAllTenant: (req, res) => {
    const { limit, offset } = req.query;
    let sql = `
        SELECT * FROM tenants LIMIT ${Number(limit) || 20} OFFSET ${Number(
      offset
    ) || 0}
    `;

    const total = `SELECT COUNT(id) as total FROM tenants`;

    const getSql = new Promise((resolve, reject) => {
      db.query(sql, [], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const totalSql = new Promise((resolve, reject) => {
      db.query(total, [], (err, result) => {
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
          response: "error_when_get_all_tenants",
          err
        });
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
    const { name, no_ktp, place_of_birth, date_of_birth, address } = req.body;
    let ktp_scan = req.files;
    let data = [];
    let sql = `
        UPDATE tenants
        SET name = ?,
            no_ktp = ?,
            place_of_birth = ?,
            date_of_birth = ?,
            address = ?       
    `;
    if (ktp_scan) {
      ktp_scan = ktp_scan ? "ADA IMAGE UPDATE" : "NGGAK ADA IMAGE";
      sql += `, ktp_scan = ?`;
      data = [
        name,
        no_ktp,
        place_of_birth,
        date_of_birth,
        address,
        ktp_scan,
        id
      ];
    } else {
      data = [name, no_ktp, place_of_birth, date_of_birth, address, id];
    }
    sql += `WHERE id = ?;`;

    db.query(sql, data, (err, result) => {
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
