const jwt = require("jsonwebtoken");

const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");

module.exports = {
  isAuthenticated: (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (token === undefined || token === null) {
      return sendResponse(res, 500, { authentication: "token_is_not_found" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const sql = `SELECT * FROM users WHERE id = ?`;

      db.query(sql, [decoded.id], (err, result) => {
        if (err) {
          sendResponse(res, 500, { authentication: "token_is_not_valid" });
        } else {
          result === null
            ? sendResponse(res, 500, { authentication: "token_is_not_valid" })
            : (req.user = result);
          next();
        }
      });
    } catch (error) {
      sendResponse(res, 500, error);
    }
  }
};
