const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");

module.exports = {
  getAllUser: (req, res) => {
    const { role } = req.query;
    let sql = `SELECT * FROM users `;
    role ? (sql += `WHERE role = ?`) : null;
    sql += `ORDER BY updated_at DESC LIMIT 10 OFFSET 0`;

    try {
      db.query(sql, role ? [role] : [], (err, result) => {
        if (err) {
          sendResponse(res, 500, err);
        } else {
          sendResponse(res, 200, result);
        }
      });
    } catch (error) {
      sendResponse(res, 500, error);
    }
  },

  getUserById: (req, res) => {
    const { id } = req.params.id;
    const sql = `DELETE FROM users WHERE id = ?`;

    try {
      db.query(sql, [id], (err, result) => {
        if (err) {
          sendResponse(res, 500, err);
        } else {
          sendResponse(res, 200, result);
        }
      });
    } catch (error) {
      sendResponse(res, 500, error);
    }
  },

  updateUser: (req, res) => {
    const { id } = req.params;
    const { fullname, email, username, address, role } = req.body;
    const sql = `
        UPDATE user
        SET fullname = ?,
            email = ?,
            username = ?,
            address = ?,
            role = ?
        WHERE id = ?
    ;`;

    try {
      db.query(
        sql,
        [fullname, email, address, username, role, id],
        (err, result) => {
          if (err) {
            sendResponse(res, 500, err);
          } else {
            sendResponse(res, 200, {
              msg: `data has been updated => ${result}`
            });
          }
        }
      );
    } catch (error) {
      sendResponse(res, 500, error);
    }
  }
};
