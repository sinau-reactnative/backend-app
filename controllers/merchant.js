const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");

module.exports = {
  createMerchant: (req, res) => {
    const {
      merchant_no,
      merchant_status,
      floor_position,
      type_of_sale,
      type_of_merchant,
      merchant_space,
      price_per_meter,
      total_price
    } = req.body;
    let attachment = req.files;
    attachment = attachment ? "ADA IMAGE" : "NGGAK ADA IMAGE";
    const sql = `
        INSERT INTO merchants
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
            ?,
            ?,
            DEFAULT,
            DEFAULT
        );
    `;

    db.query(
      sql,
      [
        merchant_no,
        merchant_status,
        floor_position,
        type_of_sale,
        type_of_merchant,
        merchant_space,
        price_per_meter,
        total_price,
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

  getAllMerchants: (req, res) => {
    const sql = `
        SELECT * FROM merchants;
    `;

    db.query(sql, [], (err, result) => {
      if (err) {
        sendResponse(res, 500, {
          response: "error_when_get_all_merchants",
          err
        });
      } else {
        sendResponse(res, 200, result);
      }
    });
  },

  getMerchantById: (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT * FROM merchants WHERE id = ?;
      `;

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_get_merchants", err });
      } else {
        sendResponse(res, 200, result);
      }
    });
  },

  updateMerchantId: (req, res) => {
    const { id } = req.params;
    const {
      merchant_no,
      merchant_status,
      floor_position,
      type_of_sale,
      type_of_merchant,
      merchant_space,
      price_per_meter,
      total_price
    } = req.body;
    let attachment = req.files;
    let data = [];
    let sql = `
      UPDATE merchants
      SET merchant_no = ?,
          merchant_status = ?,
          floor_position = ?,
          type_of_sale = ?,
          type_of_merchant = ?,
          merchant_space = ?,
          price_per_meter = ?,
          total_price = ?
    `;

    if (attachment) {
      attachment = attachment ? "ADA IMAGE UPDATE" : "NGGAK ADA IMAGE";
      sql += `, attachment_1 = ?, attachment_2 = ? `;
      data = [
        merchant_no,
        merchant_status,
        floor_position,
        type_of_sale,
        type_of_merchant,
        merchant_space,
        price_per_meter,
        total_price,
        attachment,
        attachment,
        id
      ];
    } else {
      data = [
        merchant_no,
        merchant_status,
        floor_position,
        type_of_sale,
        type_of_merchant,
        merchant_space,
        price_per_meter,
        total_price,
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

  deleteMerchantById: (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM merchants WHERE id = ? ;`;

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, {
          response: "error_when_delete_merchants",
          err
        });
      } else {
        sendResponse(res, 200, result);
      }
    });
  }
};
