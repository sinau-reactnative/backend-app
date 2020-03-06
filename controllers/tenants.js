const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");
const { uploadFile } = require("../helpers/upload");
const AWS_LINK = process.env.AWS_LINK;

module.exports = {
  createTenant: (req, res) => {
    const { name, no_ktp, place_of_birth, date_of_birth, address } = req.body;
    let ktp_scan = req.file;
    if (ktp_scan) {
      uploadFile(ktp_scan, "ktp_scan", no_ktp);
      ktp_scan = `${AWS_LINK}ktp_scan-${no_ktp}.jpg`;
    } else {
      ktp_scan = "";
    }
    const sql = `
        INSERT INTO tenants 
        VALUES (
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
      [no_ktp, name, place_of_birth, date_of_birth, address, ktp_scan],
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
    const { limit, offset, search } = req.query;
    let total = `SELECT COUNT(*) as total FROM tenants `;
    let sql = `SELECT * FROM tenants `;
    if (search) {
      sql += `WHERE name LIKE '%${search}%'`;
      total += `WHERE name LIKE '%${search}%'`;
    }
    sql += `
        LIMIT ${Number(limit) || 20} 
        OFFSET ${Number(offset) || 0}
    `;

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
        SELECT * FROM tenants WHERE no_ktp = ?;
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
    const { name, place_of_birth, date_of_birth, address } = req.body;
    let ktp_scan = req.file;
    let data = [name, place_of_birth, date_of_birth, address];
    let sql = `
        UPDATE tenants
        SET name = ?,
            place_of_birth = ?,
            date_of_birth = ?,
            address = ?       
    `;
    if (ktp_scan) {
      uploadFile(ktp_scan, "ktp_scan", id);
      ktp_scan = `${AWS_LINK}ktp_scan-${id}.jpg`;
      sql += `, ktp_scan = ?`;
      data.push(ktp_scan);
    }
    data.push(id);
    sql += `WHERE no_ktp = ?;`;

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
    const sql = `DELETE FROM tenants WHERE no_ktp = ? ;`;

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_delete_tenant", err });
      } else {
        sendResponse(res, 200, result);
      }
    });
  }
};
