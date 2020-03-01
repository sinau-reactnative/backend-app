const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");

module.exports = {
  createMerchant: (req, res) => {
    const {
      tenant_id,
      merchant_no,
      merchant_status,
      floor_position,
      type_of_sale,
      type_of_merchant,
      merchant_space,
      price_per_meter,
      total_price
    } = req.body;
    let _tenantId =
      merchant_status === "bebas" ? "0000000000000000" : tenant_id;
    let attachment = req.files;
    attachment = attachment ? "ADA IMAGE" : "NGGAK ADA IMAGE";
    const sql = `
        INSERT INTO merchants
        VALUES (
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
            ?,
            DEFAULT,
            DEFAULT
        );
    `;

    db.query(
      sql,
      [
        merchant_no,
        _tenantId,
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
      err => {
        if (err) {
          sendResponse(res, 500, {
            response: "error_when_create_new_merchant",
            err
          });
        } else {
          sendResponse(res, 200, { id: merchant_no });
        }
      }
    );
  },

  getAllMerchants: (req, res) => {
    const { limit, offset } = req.query;
    const sql = `
    SELECT *, T.name,
           (SELECT SUM(B.nominal) FROM billings B WHERE B.merchant_id = M.merchant_no) AS progress_nominal,
           ROUND((((SELECT SUM(B.nominal) FROM billings B WHERE B.merchant_id = M.merchant_no) / (M.total_price)) * 100),2) as progress_billing
           FROM merchants M 
           JOIN tenants T
           ON M.tenant_id = T.no_ktp
           LIMIT ${Number(limit) || 20} OFFSET ${Number(offset) || 0};
    `;
    const total = `SELECT COUNT(*) as total FROM merchants`;

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
          response: "error_when_get_all_merchants",
          err
        });
      });
  },

  getMerchantById: (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT * FROM merchants WHERE merchant_no = ?;
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
      tenant_id,
      merchant_status,
      floor_position,
      type_of_sale,
      type_of_merchant,
      merchant_space,
      price_per_meter,
      total_price
    } = req.body;
    let _tenantId =
      merchant_status === "bebas" ? "0000000000000000" : tenant_id;
    let attachment = req.files;
    let data = [
      _tenantId,
      merchant_status,
      floor_position,
      type_of_sale,
      type_of_merchant,
      merchant_space,
      price_per_meter,
      total_price
    ];
    let sql = `
      UPDATE merchants
      SET tenant_id = ?,
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
      data.push(attachment);
      data.push(attachment);
      data.push(id);
    } else {
      data.push(id);
    }
    sql += `WHERE merchant_no = ?`;

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
    const sql = `DELETE FROM merchants WHERE merchant_no = ? ;`;

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
