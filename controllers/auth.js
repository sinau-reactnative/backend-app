const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");
const { encrypt, decrypt } = require("../helpers/encryption");

module.exports = {
  signup: (req, res) => {
    const { fullname, email, username, role, address } = req.body;
    const password = encrypt(req.body.password);
    const sql = `
        INSERT INTO users VALUES (
            NULL,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            DEFAULT,
            DEFAULT
        );`;

    try {
      db.query(
        sql,
        [fullname, email, username, password, role, address],
        (err, result) => {
          if (err) {
            sendResponse(res, 500, { response: "error_when_make_user", err });
          } else {
            sendResponse(res, 200, result.insertId);
          }
        }
      );
    } catch (error) {
      sendResponse(res, 500, error);
    }
  },

  signin: (req, res) => {
    const { email, password } = req.body;
    const sql = `
        SELECT * FROM users
        WHERE email = ?
      `;
    try {
      db.query(sql, [email], (err, result) => {
        if (err) {
          sendResponse(res, 500, { response: "check_your_email_address", err });
        } else {
          const decryptedPassword = decrypt(result[0].password);
          if (password === decryptedPassword) {
            sendResponse(res, 200, result);
          } else {
            sendResponse(res, 500, { response: "check_your_password", err });
          }
        }
      });
    } catch (error) {
      sendResponse(res, 500, error);
    }
  }
};
