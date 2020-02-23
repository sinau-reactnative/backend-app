const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");

module.exports = {
  createBilling: (req, res) => {
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
            ?,
            DEFAULT,
            DEFAULT
        );
    `;

    db.query(
      sql,
      [
        merchant_id,
        tenant_id,
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
    const { limit, offset } = req.query;
    let sql = `
        SELECT * FROM billings LIMIT ${Number(limit) || 20} OFFSET ${Number(
      offset
    ) || 0}
    `;

    const total = `SELECT COUNT(id) as total FROM billings`;

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
    let data = [];
    let sql = `
      UPDATE merchants
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
      data = [
        merchant_id,
        tenant_id,
        payment_term,
        due_date,
        nominal,
        payment_status,
        payment_proof,
        receipt,
        id
      ];
    } else if (payment_proof) {
      payment_proof = payment_proof ? "ADA IMAGE UPDATE" : "NGGAK ADA IMAGE";
      payment_status = "menunggu_validasi";
      sql += `, payment_proof = ? `;
      data = [
        merchant_id,
        tenant_id,
        payment_term,
        due_date,
        nominal,
        payment_status,
        payment_proof,
        id
      ];
    } else if (receipt) {
      receipt = receipt ? "ADA IMAGE UPDATE" : "NGGAK ADA IMAGE";
      payment_status = "menunggu_validasi";
      sql += `, receipt = ? `;
      data = [
        merchant_id,
        tenant_id,
        payment_term,
        due_date,
        nominal,
        payment_status,
        receipt,
        id
      ];
    } else {
      data = [
        merchant_id,
        tenant_id,
        payment_term,
        due_date,
        nominal,
        payment_status,
        id
      ];
    }
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
