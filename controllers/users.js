const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");
// const { encrypt, decrypt } = require("../helpers/encryption");

module.exports = {
  getAllUser: (req, res) => {
    const { role } = req.query;
    let sql = `SELECT * FROM users `;
    role ? (sql += `WHERE role = ?`) : null;
    sql += `ORDER BY updated_at DESC LIMIT 10 OFFSET 0`;

    db.query(sql, role ? [role] : [], (err, result) => {
      if (err) {
        throw err;
      } else {
        sendResponse(res, 200, result);
      }
    });
  },

  getUserById: (req, res) => {
    const { id } = req.params.id;
    const sql = `DELETE FROM users WHERE id = ?`;

    db.query(sql, [id], (err, result) => {
      if (err) {
        throw err;
      } else {
        sendResponse(res, 200, result);
      }
    });
  },

  updateUser: (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, email, username, avatar, role } = req.body;
    const sql = `
        UPDATE user
        SET first_name = ?,
            last_name = ?,
            email = ?,
            username = ?,
            avatar = ?,
            role = ?
        WHERE id = ?
    ;`;

    db.query(
      sql,
      [first_name, last_name, email, username, avatar, role, id],
      (err, result) => {
        if (err) {
          throw err;
        } else {
          sendResponse(res, 200, { msg: `data has been updated => ${result}` });
        }
      }
    );
  }
};
