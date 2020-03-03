const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");

module.exports = {
  createBilling: (req, res) => {
    const { merchant_id, payment_term, due_date, nominal } = req.body;
    let payment_status = "";
    let payment_proof = req.files["payment_proof"];
    let receipt = req.files["receipt"];
    payment_proof = payment_proof ? 1 : 0;
    receipt = receipt ? 1 : 0;
    if (payment_proof == 1 && receipt == 1) {
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
      [
        merchant_id,
        payment_term,
        due_date,
        nominal,
        payment_status,
        payment_proof,
        receipt
      ],
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
      due_date_start,
      due_date_end
    } = req.query;
    let total = `SELECT COUNT(id) as total FROM billings `;
    let sql = `
        SELECT * FROM billings 
    `;

    if (start_date && end_date) {
      sql += `WHERE created_at BETWEEN DATE('${start_date}') AND DATE('${end_date}') AND payment_status = 'sudah_validasi'`;
      total += `WHERE created_at BETWEEN DATE('${start_date}') AND DATE('${end_date}')`;
    }

    if (due_date_start && due_date_end) {
      sql += `WHERE due_date BETWEEN DATE('${due_date_start}') AND DATE('${due_date_end}') `;
      total = `WHERE due_date BETWEEN DATE('${due_date_start}') AND DATE('${due_date_end}')`;
    }

    sql += `LIMIT ${Number(limit) || 20} OFFSET ${Number(offset) || 0};`;

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
    const {
      merchant_id,
      tenant_id,
      payment_term,
      due_date,
      nominal
    } = req.body;
    let payment_status = "";
    let payment_proof = req.files["payment_proof"];
    let receipt = req.files["receipt"];
    let data = [
      merchant_id,
      tenant_id,
      payment_term,
      due_date,
      nominal,
      payment_status
    ];
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
      payment_proof = payment_proof ? "ADA IMAGE UPDATE" : "NGGAK ADA IMAGE";
      receipt = receipt ? "ADA IMAGE UPDATE" : "NGGAK ADA IMAGE";
      payment_status = "sudah_validasi";
      sql += `, payment_proof = ?, receipt = ? `;
      data.push(payment_proof);
      data.push(receipt);
    } else if (payment_proof) {
      payment_proof = payment_proof ? "ADA IMAGE UPDATE" : "NGGAK ADA IMAGE";
      payment_status = "menunggu_validasi";
      sql += `, payment_proof = ? `;
      data.push(payment_proof);
    } else if (receipt) {
      receipt = receipt ? "ADA IMAGE UPDATE" : "NGGAK ADA IMAGE";
      payment_status = "menunggu_validasi";
      sql += `, receipt = ? `;
      data.push(receipt);
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
  }
};
