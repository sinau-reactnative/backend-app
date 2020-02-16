const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");

module.exports = {
  createBilling: (req, res) => {
    const {
      merchant_id,
      tenant_id,
      payment_term,
      due_date,
      nominal,
      payment_status
    } = req.body;
    let attachment = req.files;
    attachment = attachment ? "ADA IMAGE" : "NGGAK ADA IMAGE";
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
            ?
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
        attachment,
        attachment
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
    const sql = `SELECT * FROM billings;`;

    db.query(sql, [], (err, result) => {
      if (err) {
        sendResponse(res, 500, {
          response: "error_when_get_all_billings",
          err
        });
      } else {
        sendResponse(res, 200, result);
      }
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
      nominal,
      payment_status
    } = req.body;
    let attachment = req.files;
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

    if (attachment) {
      attachment = attachment ? "ADA IMAGE UPDATE" : "NGGAK ADA IMAGE";
      sql += `, payment_proof = ?, receipt = ? `;
      data = [
        merchant_id,
        tenant_id,
        payment_term,
        due_date,
        nominal,
        payment_status,
        attachment,
        attachment,
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
