const db = require("../configs/db");
const stringify = require("csv-stringify");
const { sendResponse } = require("../helpers/response");
const { uploadFile } = require("../helpers/upload");
const AWS_LINK = process.env.AWS_LINK;

module.exports = {
  createBilling: (req, res) => {
    const { merchant_id, payment_term, due_date, nominal } = req.body;
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
      csv
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

    let total = `SELECT COUNT(id) as total FROM billings `;
    let sql = `
        SELECT * FROM billings 
    `;

    if (start_date && end_date && type === "incoming") {
      sql += `WHERE created_at BETWEEN DATE('${start_date}') AND DATE('${end_date}') AND payment_status = 'sudah_validasi' `;
      total += `WHERE created_at BETWEEN DATE('${start_date}') AND DATE('${end_date}')`;
    } else if (start_date && end_date && type === "due_date") {
      sql += `WHERE due_date BETWEEN DATE('${start_date}') AND DATE('${end_date}') `;
      total += `WHERE due_date BETWEEN DATE('${start_date}') AND DATE('${end_date}')`;
    } else if (start_date && end_date && type === "estimation") {
      sql = `
        SELECT *, 
        (SELECT SUM(nominal) FROM billings WHERE due_date BETWEEN DATE('${start_date}') AND DATE('${end_date}')) as TOTAL
        FROM billings
        WHERE due_date BETWEEN DATE('${start_date}') AND DATE('${end_date}') `;
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

    // if (type === "summary"){
    //   let d = new Date()
    //   if(summary === "day"){
    //     // let today = d.get
    //     sql = `SELECT *,
    //           (SELECT SUM(nominal) FROM billings WHERE created_at = DATE('${d}')) as TOTAL
    //           FROM billings
    //           WHERE created_at = DATE('${d}')`
    //   } else if (summa)
    // }

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
          res.setHeader("Content-Type", "text/csv");
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="' + "billing-" + Date.now() + '.csv"'
          );
          stringify(result[0], { header: true }).pipe(res);
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

  updateMerchantId: (req, res) => {
    const { id } = req.params;
    const { merchant_id, tenant_id, payment_term, due_date, nominal } = req.body;
    let payment_status = "";
    let payment_proof = req.files["payment_proof"];
    let receipt = req.files["receipt"];
    let data = [merchant_id, tenant_id, payment_term, due_date, nominal, payment_status];
    let sql = `
      UPDATE billings
      SET merchant_id = ?,
          tenant_id = ?,
          payment_term = ?,
          due_date = ?,
          nominal = ?,
          payment_status = ?
    `;

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
      sql += `, payment_proof = ?, receipt = ? `;

      // ========== Insert Data Name ==========
      data.push(payment_proof);
      data.push(receipt);
      // ======================================
    } else if (payment_proof) {
      // ============ Upload Image ============
      uploadFile(payment_proof[0], "payment_proof", merchant_id);
      payment_proof = `${AWS_LINK}${merchant_id}-payment_proof.jpg`;
      // ======================================

      payment_status = "menunggu_validasi";

      // ========== Insert Data Name ==========
      sql += `, payment_proof = ? `;
      data.push(payment_proof);
      // ======================================
    } else if (receipt) {
      // ============ Upload Image ============
      uploadFile(receipt[0], "receipt", merchant_id);
      receipt = `${AWS_LINK}${merchant_id}-receipt.jpg`;
      // ======================================

      payment_status = "menunggu_validasi";

      // ========== Insert Data Name ==========
      sql += `, receipt = ? `;
      data.push(receipt);
      // ======================================
    }

    data.push(id);
    sql += `WHERE id = ?`;

    db.query(sql, data, (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_update_merchant", err });
      } else {
        sendResponse(res, 200, result);
      }
    });
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
