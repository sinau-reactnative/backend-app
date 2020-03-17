const moment = require("moment");
const stringify = require("csv-stringify");
const db = require("../configs/db");
const AWS_LINK = process.env.AWS_LINK;

const { sendResponse } = require("../helpers/response");
const { uploadFile } = require("../helpers/upload");
const { billingLogs } = require("../helpers/updateLogs");
const { exportToExcel } = require("../helpers/export");

module.exports = {
  createBilling: (req, res) => {
    const { merchant_id, payment_term, due_date, nominal } = req.body;
    const user_id = req.user[0].id;

    let payment_status = "";
    let payment_proof = req.files["payment_proof"];
    let receipt = req.files["receipt"];

    // Payment Proof ========================
    if (payment_proof) {
      uploadFile(payment_proof[0], "payment_proof", merchant_id);
      payment_proof = `${AWS_LINK}${merchant_id}-payment_proof.jpg`;
    } else {
      payment_proof = "";
    }
    // ======================================

    // Receipt =============================
    if (receipt) {
      uploadFile(receipt[0], "receipt", merchant_id);
      receipt = `${AWS_LINK}${merchant_id}-receipt.jpg`;
    } else {
      receipt = "";
    }
    // ======================================

    if (payment_proof && receipt) {
      payment_status = "sudah_validasi";
    } else {
      payment_status = "menunggu_validasi";
    }

    const sql = `
        INSERT INTO billings
        VALUES (
            NULL,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            DEFAULT,
            DEFAULT
        );
    `;

    const logSql = `
        INSERT INTO billing_logs
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
      [merchant_id, payment_term, due_date, nominal, payment_status, payment_proof, receipt],
      (err, result) => {
        if (err) {
          sendResponse(res, 500, {
            response: "error_when_create_new_merchant",
            err
          });
        } else {
          db.query(logSql, [
            user_id,
            result.insertId,
            "-",
            `Billing dengan merchant_id = ${merchant_id} berhasil dibuat`
          ]);
          sendResponse(res, 200, { id: result.insertId });
        }
      }
    );
  },

  getAllBillings: (req, res) => {
    const {
      limit,
      offset,
      start_date,
      end_date,
      type,
      sort,
      sort_type,
      merchant_id,
      outstanding,
      canceled,
      csv,
      xls
      // summary
    } = req.query;

    // Outstanding and Canceled
    let _outstanding = null;
    let _canceled = null;

    // Cek outstanding
    if (outstanding === "true") {
      _outstanding = true;
    }

    // Cek canceled
    if (canceled === "true") {
      _canceled = true;
    }

    // Download CSV ?
    let _csv = csv ? (csv === "true" ? true : false) : false;
    let _xls = xls ? (xls === "true" ? true : false) : false;

    let total = `SELECT COUNT(id) as total FROM billings `;
    let sql = `
        SELECT * FROM billings 
    `;

    if (start_date && end_date && type === "incoming") {
      sql += `WHERE updated_at BETWEEN DATE('${start_date}') AND DATE('${end_date}') AND payment_status = 'sudah_validasi' `;
      total += `WHERE updated_at BETWEEN DATE('${start_date}') AND DATE('${end_date}')`;
    } else if (start_date && end_date && type === "due_date") {
      sql += `WHERE due_date BETWEEN DATE('${start_date}') AND DATE('${end_date}') `;
      total += `WHERE due_date BETWEEN DATE('${start_date}') AND DATE('${end_date}')`;
    } else if (start_date && end_date && type === "estimation") {
      sql = `
        SELECT *, 
        (SELECT SUM(nominal) FROM billings WHERE due_date BETWEEN DATE('${start_date}') AND DATE('${end_date}')) as TOTAL
        FROM billings
        WHERE due_date BETWEEN DATE('${start_date}') AND DATE('${end_date}') `;
      total += `WHERE due_date BETWEEN DATE('${start_date}') AND DATE('${end_date}') `;
    } else if (start_date && end_date && type === "summary") {
      sql = `
        SELECT *, 
        (SELECT SUM(nominal) FROM billings WHERE due_date BETWEEN DATE('${start_date}') AND DATE('${end_date}')) as TOTAL
        FROM billings
        WHERE updated_at BETWEEN DATE('${start_date}') AND DATE('${end_date}') AND payment_status = "sudah_validasi" `;
      total += `WHERE updated_at BETWEEN DATE('${start_date}') AND DATE('${end_date}') AND payment_status = "sudah_validasi" `;
    } else if (_outstanding !== null) {
      sql += `WHERE payment_status = 'outstanding' `;
      total += `WHERE payment_status = 'outstanding' `;
    } else if (_canceled !== null) {
      sql += `WHERE payment_status = 'canceled'`;
      total += `WHERE payment_status = 'canceled' `;
    }

    if (sort && sort_type === "incoming") {
      sql += `ORDER BY created_at ${sort}`;
    } else if (sort && sort_type === "due_date") {
      sql += `ORDER BY due_date ${sort}`;
    }

    if (merchant_id) {
      sql = `SELECT * FROM billings WHERE merchant_id = '${merchant_id}' ORDER BY created_at ASC`;
    }

    sql += ` LIMIT ${Number(limit) || 20} OFFSET ${Number(offset) || 0};`;

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
        if (_csv) {
          res.set("Content-Type", "text/csv");
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="' + "billing-" + Date.now() + '.csv"'
          );
          stringify(result[0], { header: true }).pipe(res);
        } else if (_xls) {
          exportToExcel(res, result[0]);
        } else {
          sendResponse(res, 200, { result: result[0], pagination });
        }
      })
      .catch(err => {
        sendResponse(res, 500, {
          response: "error_when_get_all_billings",
          err
        });
      });
  },

  getBillingById: (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT * FROM billings WHERE id = ?;
      `;

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_get_billings", err });
      } else {
        sendResponse(res, 200, result);
      }
    });
  },

  updateBillingId: (req, res) => {
    const { id } = req.params;
    const { merchant_id, payment_term, due_date, nominal } = req.body;
    const user_id = req.user[0].id;

    let payment_status = "";
    let payment_proof = req.files["payment_proof"];
    let receipt = req.files["receipt"];
    let data = [merchant_id, payment_term, due_date, nominal];

    // ============== SQL Script
    let sql = `
      UPDATE billings
      SET merchant_id = ?,
          payment_term = ?,
          due_date = ?,
          nominal = ?,
          payment_status = ?,
    `;
    const getOld = `SELECT * FROM billings WHERE id = ?;`;
    // ==========================

    db.query(getOld, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_get_old_data", err });
      } else {
        const oldData = {
          ...result[0],
          due_date: moment(result[0].due_date).format("YYYY-MM-DD")
        };

        let newData = {
          merchant_id,
          payment_term,
          due_date,
          nominal
        };

        if (payment_proof && receipt) {
          // ============ Upload Image ============
          uploadFile(payment_proof[0], "payment_proof", merchant_id);
          uploadFile(receipt[0], "receipt", merchant_id);
          // ======================================

          // ============= Data Name ==============
          payment_proof = `${AWS_LINK}${merchant_id}-payment_proof.jpg`;
          receipt = `${AWS_LINK}${merchant_id}-receipt.jpg`;
          // ======================================

          payment_status = "sudah_validasi";
          sql += `payment_proof = ?, receipt = ?, `;

          // ========== Insert Data Name ==========
          data.push(payment_status);
          data.push(payment_proof);
          data.push(receipt);
          // ======================================
        } else if (payment_proof) {
          // ============ Upload Image ============
          uploadFile(payment_proof[0], "payment_proof", merchant_id);
          payment_proof = `${AWS_LINK}${merchant_id}-payment_proof.jpg`;
          // ======================================

          payment_status = oldData.receipt.length > 0 ? "sudah_validasi" : "menunggu_validasi";

          // ========== Insert Data Name ==========
          sql += `payment_proof = ?, `;
          data.push(payment_status);
          data.push(payment_proof);
          // ======================================
        } else if (receipt) {
          // ============ Upload Image ============
          uploadFile(receipt[0], "receipt", merchant_id);
          receipt = `${AWS_LINK}${merchant_id}-receipt.jpg`;
          // ======================================

          payment_status =
            oldData.payment_proof.length > 0 ? "sudah_validasi" : "menunggu_validasi";

          // ========== Insert Data Name ==========
          sql += `receipt = ?, `;
          data.push(payment_status);
          data.push(receipt);
          // ======================================
        } else {
          payment_status =
            oldData.payment_proof.length > 0 && oldData.receipt.length > 0
              ? "sudah_validasi"
              : "menunggu_validasi";
          data.push(payment_status);
        }

        data.push(id);
        sql += `updated_at = DATE(NOW()) 
            WHERE id = ? ;`;

        newData["payment_status"] = payment_status;
        if (payment_proof) {
          newData["payment_proof"] = payment_proof;
        }

        if (receipt) {
          newData["receipt"] = receipt;
        }

        db.query(sql, data, (err, result) => {
          if (err) {
            sendResponse(res, 500, { response: "error_when_update_billings", err });
          } else {
            billingLogs(user_id, id, newData, oldData);
            sendResponse(res, 200, result);
          }
        });
      }
    });

    // const getOldSql = new Promise((resolve, reject) => {
    //   db.query(getOld, [id], (err, result) => {
    //     if (err) reject(err);
    //     else resolve(result);
    //   });
    // });

    // const updateNewSql = new Promise((resolve, reject) => {
    //   db.query(sql, data, (err, result) => {
    //     if (err) reject(err);
    //     else resolve(result);
    //   });
    // });

    // Promise.all([getOldSql, updateNewSql])
    //   .then(async result => {
    //     const oldData = {
    //       ...result[0][0],
    //       due_date: moment(result[0][0].due_date).format("YYYY-MM-DD")
    //     };

    //     let newData = {
    //       merchant_id,
    //       payment_term,
    //       due_date,
    //       nominal,
    //       payment_status
    //     };

    //     if (payment_proof) {
    //       newData["payment_proof"] = payment_proof;
    //     }

    //     if (receipt) {
    //       newData["receipt"] = receipt;
    //     }

    //     await billingLogs(user_id, id, newData, oldData);
    //     await sendResponse(res, 200, { result: result[1] });
    //   })
    //   .catch(err => {
    //     sendResponse(res, 500, {
    //       response: "error_when_update_billing",
    //       err
    //     });
    //   });
  },

  deleteBillingById: (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM billings WHERE id = ? ;`;

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, {
          response: "error_when_delete_billings",
          err
        });
      } else {
        sendResponse(res, 200, result);
      }
    });
  },

  downloadCSVbyDate: (req, res) => {
    const { start_date, end_date } = req.query;

    const sql = `
        SELECT * FROM billings WHERE created_at BETWEEN DATE('${start_date}') AND DATE('${end_date}');
    `;

    db.query(sql, [], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_get_billings", err });
      } else {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          'attachment; filename="' + "billing-" + Date.now() + '.csv"'
        );
        stringify(result, { header: true }).pipe(res);
      }
    });
  }
};
