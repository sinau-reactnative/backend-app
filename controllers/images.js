const db = require("../configs/db");
const { sendResponse } = require("../helpers/response");
const { uploadFile } = require("../helpers/upload");
const AWS_LINK = process.env.AWS_LINK;

module.exports = {
  uploadNewImage: (req, res) => {
    let attachment = req.file;
    const { id, merchant_id } = req.body;
    uploadFile(attachment, `lampiran_${id}`, merchant_id);
    attachment = `${AWS_LINK}${merchant_id}-lampiran_${id}.jpg`;
    let sql = `INSERT INTO images VALUES (NULL, ?, ?, DEFAULT, DEFAULT);`;
    db.query(sql, [merchant_id, attachment], (err, result) => {
      if (err) {
        sendResponse(res, 500, {
          response: "error_when_upload_new_image",
          err
        });
      } else {
        sendResponse(res, 200, { id: result.insertId });
      }
    });
  },

  getImageByMerchantId: (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM images WHERE merchant_id = ? ORDER BY created_at ASC;`;

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, {
          response: "error_when_upload_new_image",
          err
        });
      } else {
        sendResponse(res, 200, result);
      }
    });
  },

  deleteImageById: (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM images WHERE id = ? ;`;

    db.query(sql, [id], (err, result) => {
      if (err) {
        sendResponse(res, 500, {
          response: "error_when_delete_images",
          err
        });
      } else {
        sendResponse(res, 200, result);
      }
    });
  }
};
