const jwt = require("jsonwebtoken");
const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");
const { encrypt, decrypt } = require("../helpers/encryption");

module.exports = {
  signup: (req, res) => {
    const { fullname, email, username, role, address } = req.body;
    const creatorRole = req.user[0].role;
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
      if (creatorRole !== "superadmin") {
        return sendResponse(res, 500, {
          response: `you're_not_allowed_to_do_this_action`
        });
      }

      db.query(
        sql,
        [fullname, email, username, password, role, address],
        (err, result) => {
          if (err) {
            sendResponse(res, 500, { response: "error_when_make_user", err });
          } else {
            sendResponse(res, 200, { id: result.insertId });
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
            const token = jwt.sign(
              {
                id: result[0].id,
                email: result[0].email,
                role: result[0].role
              },
              process.env.JWT_SECRET,
              { expiresIn: "7d" }
            );
            sendResponse(res, 200, {
              message: "You're logged in",
              token,
              user: {
                id: result[0].id,
                name: result[0].name,
                email: result[0].email,
                role: result[0].role
              }
            });
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
