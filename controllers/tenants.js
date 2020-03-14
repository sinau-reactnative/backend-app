const moment = require("moment");
const db = require("../configs/db");
const AWS_LINK = process.env.AWS_LINK;

const { sendResponse } = require("../helpers/response");
const { uploadFile } = require("../helpers/upload");
const { tenantLogs } = require("../helpers/updateLogs");

module.exports = {
  createTenant: (req, res) => {
    const { name, no_ktp, place_of_birth, phone_number, date_of_birth, address } = req.body;
    const user_id = req.user[0].id;
    let ktp_scan = req.file;

    if (ktp_scan) {
      uploadFile(ktp_scan, "ktp_scan", no_ktp);
      ktp_scan = `${AWS_LINK}${no_ktp}-ktp_scan.jpg`;
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
            DATE(?),
            ?,
            ?,
            DEFAULT,
            DEFAULT
        );`;

    const logSql = `
        INSERT INTO tenant_logs
        VALUES (
            NULL,
            ?,
            ?,
            ?,
            ?,
            DEFAULT,
            DEFAULT
        );
    `;

    db.query(
      sql,
      [no_ktp, name, place_of_birth, phone_number, date_of_birth, address, ktp_scan],
      err => {
        if (err) {
          sendResponse(res, 500, {
            response: "error_when_make_new_tenant",
            err
          });
        } else {
          db.query(logSql, [user_id, no_ktp, "-", `Tenant dengan NIK = ${no_ktp} berhasil dibuat`]);
          sendResponse(res, 200, { id: no_ktp });
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
    const user_id = req.user[0].id;

    const { name, place_of_birth, phone_number, date_of_birth, address } = req.body;
    let ktp_scan = req.file;
    let data = [name, place_of_birth, phone_number, date_of_birth, address];

    // ============== SQL Script
    let sql = `
        UPDATE tenants
        SET name = ?,
            place_of_birth = ?,
            phone_number = ?,
            date_of_birth = DATE(?),
            address = ?       
    `;
    const getOld = `SELECT * FROM tenants WHERE no_ktp = ?;`;
    // ==========================

    if (ktp_scan) {
      uploadFile(ktp_scan, "ktp_scan", id);
      ktp_scan = `${AWS_LINK}${id}-ktp_scan.jpg`;
      sql += `, ktp_scan = ?,`;
      data.push(ktp_scan);
    }
    data.push(id);
    sql += ` updated_at = DATE(NOW()) WHERE no_ktp = ?;`;

    const getOldSql = new Promise((resolve, reject) => {
      db.query(getOld, [id], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    const updateNewSql = new Promise((resolve, reject) => {
      db.query(sql, data, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    Promise.all([getOldSql, updateNewSql])
      .then(async result => {
        const oldData = {
          ...result[0][0],
          date_of_birth: moment(result[0][0].date_of_birth).format("YYYY-MM-DD")
        };

        const newData = {
          name,
          place_of_birth,
          phone_number,
          date_of_birth,
          address,
          ktp_scan
        };
        await tenantLogs(user_id, id, newData, oldData);
        await sendResponse(res, 200, { result: result[1] });
      })
      .catch(err => {
        sendResponse(res, 500, {
          response: "error_when_update_tenant",
          err
        });
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
