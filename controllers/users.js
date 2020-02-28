const db = require("../configs/db")
const { sendResponse } = require("../helpers/response")

module.exports = {
  getAllUser: (req, res) => {
    const { limit, offset, role } = req.query
    let sql = `SELECT * FROM users `
    role ? (sql += `WHERE role = ?`) : null
    sql += `ORDER BY updated_at DESC LIMIT ${Number(limit) ||
      20} OFFSET ${Number(offset) || 0}`

    const total = `SELECT COUNT(id) as total FROM users`

    const getSql = new Promise((resolve, reject) => {
      db.query(sql, role ? [role] : [], (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

    const totalSql = new Promise((resolve, reject) => {
      db.query(total, [], (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

    Promise.all([getSql, totalSql])
      .then(result => {
        const page = offset / limit + 1
        const total = result[1].map(i => i.total)[0]
        const hasNext = total - page * limit > 0 ? true : false
        const pagination = {
          page,
          hasNext,
          total
        }
        sendResponse(res, 200, { result: result[0], pagination })
      })
      .catch(err => {
        sendResponse(res, 500, {
          response: "error_when_get_all_users",
          err
        })
      })
  },

  getUserById: (req, res) => {
    const { id } = req.params
    const sql = `SELECT * FROM users WHERE id= ?;`

    try {
      db.query(sql, [id], (err, result) => {
        if (err) {
          sendResponse(res, 500, err)
        } else {
          sendResponse(res, 200, result)
        }
      })
    } catch (error) {
      sendResponse(res, 500, error)
    }
  },

  updateUser: (req, res) => {
    const { id } = req.params
    const { fullname, email, username, address, role } = req.body
    const sql = `
        UPDATE users
        SET fullname = ?,
            email = ?,
            username = ?,
            address = ?,
            role = ?
        WHERE id = ?
    ;`

    try {
      db.query(
        sql,
        [fullname, email, username, address, role, id],
        (err, result) => {
          if (err) {
            sendResponse(res, 500, err)
          } else {
            sendResponse(res, 200, {
              msg: `data has been updated => ${result}`
            })
          }
        }
      )
    } catch (error) {
      sendResponse(res, 500, error)
    }
  },

  deleteUserById: (req, res) => {
    const { id } = req.params
    const sql = `DELETE FROM users WHERE id = ?`

    try {
      db.query(sql, [id], (err, result) => {
        if (err) {
          sendResponse(res, 500, err)
        } else {
          sendResponse(res, 200, result)
        }
      })
    } catch (error) {
      sendResponse(res, 500, error)
    }
  }
}
