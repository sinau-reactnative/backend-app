const db = require("../configs/db")
const stringify = require("csv-stringify")
const AWS_LINK = process.env.AWS_LINK

const { sendResponse } = require("../helpers/response")
const { uploadFile } = require("../helpers/upload")
const { merchantLogs } = require("../helpers/updateLogs")
const { exportMerchantToExcel } = require("../helpers/export")

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
    } = req.body
    const user_id = req.user[0].id

    let _tenantId = merchant_status === "bebas" ? "0000000000000000" : tenant_id
    let attachment_1 = req.files["attachment_1"]
    let attachment_2 = req.files["attachment_2"]
    let _attachment_1
    let _attachment_2
    let _data = [
      merchant_no,
      _tenantId,
      merchant_status,
      floor_position,
      type_of_sale,
      type_of_merchant,
      merchant_space,
      price_per_meter,
      total_price
    ]

    if (attachment_1 && attachment_2) {
      uploadFile(attachment_1[0], "attachment_1", merchant_no)
      uploadFile(attachment_2[0], "attachment_2", merchant_no)

      _attachment_1 = `${AWS_LINK}${merchant_no}-attachment_1.jpg`
      _attachment_2 = `${AWS_LINK}${merchant_no}-attachment_2.jpg`

      _data.push(_attachment_1)
      _data.push(_attachment_2)
    } else if (attachment_1) {
      uploadFile(attachment_1[0], "attachment_1", merchant_no)
      _attachment_1 = `${AWS_LINK}${merchant_no}-attachment_1.jpg`
      _data.push(_attachment_1)
      _data.push("")
    } else if (attachment_2) {
      uploadFile(attachment_2[0], "attachment_2", merchant_no)
      _attachment_2 = `${AWS_LINK}${merchant_no}-attachment_2.jpg`
      _data.push(_attachment_2)
      _data.push("")
    } else {
      _data.push("")
      _data.push("")
    }

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
    `

    const logSql = `
        INSERT INTO merchant_logs
        VALUES (
            NULL,
            ?,
            ?,
            ?,
            ?,
            DEFAULT,
            DEFAULT
        );
    `

    db.query(sql, _data, err => {
      if (err) {
        sendResponse(res, 500, {
          response: "error_when_create_new_merchant",
          err
        })
      } else {
        db.query(logSql, [
          user_id,
          merchant_no,
          "-",
          `Merchant dengan nomer = ${merchant_no} berhasil dibuat`
        ])
        sendResponse(res, 200, { id: merchant_no })
      }
    })
  },

  getAllMerchants: (req, res) => {
    const { limit, offset, search, type, csv, xls, filter } = req.query
    let total = `SELECT COUNT(*) as total FROM merchants M `
    let totalEksisting = `SELECT COUNT(*) as total FROM merchants M WHERE M.merchant_status = 'eksisting' AND EXISTS (SELECT * FROM billings B WHERE B.payment_term = 'booking_fee' AND B.payment_status = 'sudah_validasi' AND B.merchant_id = M.merchant_no)`
    let totalBebas = `SELECT COUNT(*) as total FROM merchants M WHERE M.merchant_status = 'bebas'`

    // Download CSV ?
    let _csv = csv ? (csv === "true" ? true : false) : false
    let _xls = xls ? (xls === "true" ? true : false) : false

    let sql = `
    SELECT M.merchant_no,M.merchant_status, M.floor_position, M.type_of_sale, 
           M.type_of_merchant, M.merchant_space, M.price_per_meter, M.total_price, M.attachment_1, M.attachment_2,
           T.no_ktp, T.name, T.phone_number, T.address, T.place_of_birth, T.date_of_birth, T.ktp_scan,
           (SELECT SUM(B.nominal) FROM billings B WHERE B.merchant_id = M.merchant_no AND payment_status="sudah_validasi") AS income_nominal,
           ROUND((((SELECT SUM(B.nominal) FROM billings B WHERE B.merchant_id = M.merchant_no AND payment_status="sudah_validasi") / (M.total_price)) * 100),2) as income_progress,
           (SELECT SUM(B.nominal) FROM billings B WHERE B.merchant_id = M.merchant_no AND payment_status="outstanding") AS outstanding_nominal,
           ROUND((((SELECT SUM(B.nominal) FROM billings B WHERE B.merchant_id = M.merchant_no AND payment_status="outstanding") / (M.total_price)) * 100),2) as outstanding_progress
           FROM merchants M
           JOIN tenants T
           ON M.tenant_id = T.no_ktp
    `

    if (search && type === "name") {
      sql += `WHERE T.name LIKE '%${search}%'`
      total += `JOIN tenants T ON M.tenant_id = T.no_ktp WHERE T.name LIKE '%${search}%'`
    } else if (search && type === "nik") {
      sql += `WHERE T.no_ktp LIKE '%${search}%'`
      total += `JOIN tenants T ON M.tenant_id = T.no_ktp WHERE T.no_ktp LIKE '%${search}%'`
    } else if (search && type === "merchant_no") {
      sql += `WHERE M.merchant_no LIKE '%${search}%'`
      total += `JOIN tenants T ON M.tenant_id = T.no_ktp WHERE M.merchant_no LIKE '%${search}%'`
    } else if (filter === "eksisting") {
      sql += `WHERE M.merchant_status = 'eksisting' AND EXISTS (SELECT * FROM billings B WHERE B.payment_term = 'booking_fee' AND B.payment_status = 'sudah_validasi' AND B.merchant_id = M.merchant_no) `
      total += `JOIN tenants T ON M.tenant_id = T.no_ktp WHERE M.merchant_status = 'eksisting'`
    } else if (filter === "bebas") {
      sql += `WHERE M.merchant_status = 'bebas'`
      total += `JOIN tenants T ON M.tenant_id = T.no_ktp WHERE M.merchant_status = 'bebas'`
    }

    sql += `LIMIT ${Number(limit) || 20} OFFSET ${Number(offset) || 0};`
    const getSql = new Promise((resolve, reject) => {
      db.query(sql, [], (err, result) => {
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

    const totalEksistingSql = new Promise((resolve, reject) => {
      db.query(totalEksisting, [], (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

    const totalBebasSql = new Promise((resolve, reject) => {
      db.query(totalBebas, [], (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

    Promise.all([getSql, totalSql, totalEksistingSql, totalBebasSql])
      .then(result => {
        const page = offset / limit + 1
        const total = result[1].map(i => i.total)[0]
        const hasNext = total - page * limit > 0 ? true : false
        const pagination = {
          page,
          hasNext,
          total
        }
        const totalEksisting = result[2].map(i => i.total)[0]
        const totalBebas = result[3].map(i => i.total)[0]
        const totalByMerchantStatus = {
          eksisting: totalEksisting,
          bebas: totalBebas
        }
        if (_csv) {
          res.set("Content-Type", "text/csv")
          res.setHeader(
            "Content-Disposition",
            'attachment; filename="' + "tempat-usaha-" + Date.now() + '.csv"'
          )
          stringify(result[0], { header: true }).pipe(res)
        } else if (_xls) {
          exportMerchantToExcel(res, result[0])
        } else {
          sendResponse(res, 200, {
            result: result[0],
            pagination,
            total: totalByMerchantStatus
          })
        }
      })
      .catch(err => {
        sendResponse(res, 500, {
          response: "error_when_get_all_merchants",
          err
        })
      })
  },

  getMerchantById: (req, res) => {
    const { id } = req.params
    const { summary } = req.query

    let sql = `
    SELECT M.*, T.name,
           (SELECT SUM(B.nominal) FROM billings B WHERE B.merchant_id = M.merchant_no) AS progress_nominal,
           ROUND((((SELECT SUM(B.nominal) FROM billings B WHERE B.merchant_id = M.merchant_no) / (M.total_price)) * 100),2) as progress_billing
           FROM merchants M
           JOIN tenants T
           ON M.tenant_id = T.no_ktp
    WHERE M.merchant_no = ?;`

    if (summary === "true") {
      sql = `
      SELECT T.name, T.phone_number, M.merchant_no, M.total_price,
            (SELECT SUM(B.nominal) FROM billings B WHERE B.merchant_id = M.merchant_no AND payment_status="sudah_validasi") AS income_nominal,
            ROUND((((SELECT SUM(B.nominal) FROM billings B WHERE B.merchant_id = M.merchant_no AND payment_status="sudah_validasi") / (M.total_price)) * 100),2) as income_progress,
            (SELECT SUM(B.nominal) FROM billings B WHERE B.merchant_id = M.merchant_no AND payment_status="outstanding") AS outstanding_nominal,
            ROUND((((SELECT SUM(B.nominal) FROM billings B WHERE B.merchant_id = M.merchant_no AND payment_status="outstanding") / (M.total_price)) * 100),2) as outstanding_progress
            FROM merchants M
            JOIN tenants T
            ON M.tenant_id = T.no_ktp
      WHERE M.merchant_no = ?;`
    }

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, { response: "error_when_get_merchants", err })
      } else {
        sendResponse(res, 200, result)
      }
    })
  },

  updateMerchantId: (req, res) => {
    const { id } = req.params
    const user_id = req.user[0].id
    const {
      tenant_id,
      merchant_status,
      floor_position,
      type_of_sale,
      type_of_merchant,
      merchant_space,
      price_per_meter,
      total_price
    } = req.body

    let _tenantId = merchant_status === "bebas" ? "0000000000000000" : tenant_id
    let attachment_1 = req.files["attachment_1"]
    let attachment_2 = req.files["attachment_2"]
    let _attachment_1
    let _attachment_2

    let data = [
      _tenantId,
      merchant_status,
      Number(floor_position),
      type_of_sale,
      type_of_merchant,
      merchant_space,
      price_per_meter,
      total_price
    ]

    // ============== SQL Script
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
    `
    const getOld = `SELECT * FROM merchants WHERE merchant_no = ?;`
    // ==========================

    if (attachment_1 && attachment_2) {
      uploadFile(attachment_1[0], "attachment_1", id)
      uploadFile(attachment_2[0], "attachment_2", id)

      _attachment_1 = `${AWS_LINK}${id}-attachment_1.jpg`
      _attachment_2 = `${AWS_LINK}${id}-attachment_2.jpg`

      sql += `, attachment_1 = ? `
      sql += `, attachment_2 = ? `

      data.push(_attachment_1)
      data.push(_attachment_2)
    } else if (attachment_1) {
      uploadFile(attachment_1[0], "attachment_1", id)
      _attachment_1 = `${AWS_LINK}${id}-attachment_1.jpg`
      sql += `, attachment_1 = ?`
      data.push(_attachment_1)
    } else if (attachment_2) {
      uploadFile(attachment_2[0], "attachment_2", id)
      _attachment_2 = `${AWS_LINK}${id}-attachment_2.jpg`
      sql += `, attachment_2 = ?`
      data.push(_attachment_2)
    }

    data.push(id)
    sql += `, updated_at = DATE(NOW()) WHERE merchant_no = ?`

    const getOldSql = new Promise((resolve, reject) => {
      db.query(getOld, [id], (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

    const updateNewSql = new Promise((resolve, reject) => {
      db.query(sql, data, (err, result) => {
        if (err) reject(err)
        else resolve(result)
      })
    })

    Promise.all([getOldSql, updateNewSql])
      .then(async result => {
        const oldData = result[0][0]

        let newData = {
          tenant_id: _tenantId,
          merchant_status,
          floor_position,
          type_of_sale,
          type_of_merchant,
          merchant_space,
          price_per_meter,
          total_price
        }

        if (attachment_1) {
          newData["attachment_1"] = attachment_1
        }

        if (attachment_2) {
          newData["attachment_2"] = attachment_2
        }

        await merchantLogs(user_id, id, newData, oldData)
        await sendResponse(res, 200, { result: result[1] })
      })
      .catch(err => {
        sendResponse(res, 500, {
          response: "error_when_update_tenant",
          err
        })
      })
  },

  deleteMerchantById: (req, res) => {
    const { id } = req.params
    const sql = `DELETE FROM merchants WHERE merchant_no = ? ;`

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, {
          response: "error_when_delete_merchants",
          err
        })
      } else {
        sendResponse(res, 200, result)
      }
    })
  }
}
