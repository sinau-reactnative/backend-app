const db = require("../configs/db");

module.exports = {
  tenantLogs: (user_id, id, newData, oldData) => {
    let beforeChange = "";
    let afterChange = "";

    if (oldData.name !== newData.name) {
      beforeChange += `nama: ${oldData.name}\n`;
      afterChange += `nama: ${newData.name}\n`;
    }

    if (oldData.place_of_birth !== newData.place_of_birth) {
      beforeChange += `tempat lahir: ${oldData.place_of_birth}\n`;
      afterChange += `tempat lahir: ${newData.place_of_birth}\n`;
    }

    if (oldData.phone_number !== newData.phone_number) {
      beforeChange += `telepon: ${oldData.phone_number}\n`;
      afterChange += `telepon: ${newData.phone_number}\n`;
    }

    if (oldData.date_of_birth !== newData.date_of_birth) {
      beforeChange += `tanggal lahir: ${oldData.date_of_birth}\n`;
      afterChange += `tanggal lahir: ${newData.date_of_birth}\n`;
    }

    if (oldData.address !== newData.address) {
      beforeChange += `alamat: ${oldData.address}\n`;
      afterChange += `alamat: ${newData.address}\n`;
    }

    if (oldData.ktp_scan !== newData.ktp_scan) {
      beforeChange += `ktp: ${oldData.ktp_scan}\n`;
      afterChange += `ktp: ${newData.ktp_scan}\n`;
    }

    let logSql = `
        INSERT INTO tenant_logs
        VALUES (
            NULL,
            ?,
            ?,
            ?,
            ?,
            DEFAULT,
            DEFAULT
        );`;

    if (beforeChange && afterChange) {
      db.query(logSql, [user_id, id, beforeChange, afterChange]);
    }
  },

  merchantLogs: (user_id, id, newData, oldData) => {
    let beforeChange = "";
    let afterChange = "";

    if (oldData.tenant_id !== newData.tenant_id) {
      beforeChange += `tenant id: ${oldData.tenant_id}\n`;
      afterChange += `tenant id: ${newData.tenant_id}\n`;
    }

    if (oldData.merchant_status !== newData.merchant_status) {
      beforeChange += `status TU: ${oldData.merchant_status}\n`;
      afterChange += `status TU: ${newData.merchant_status}\n`;
    }

    if (oldData.floor_position != newData.floor_position) {
      beforeChange += `lokasi lantai: ${oldData.floor_position}\n`;
      afterChange += `lokasi lantai: ${newData.floor_position}\n`;
    }

    if (oldData.type_of_sale != newData.type_of_sale) {
      beforeChange += `jenis jualan: ${oldData.type_of_sale}\n`;
      afterChange += `jenis jualan: ${newData.type_of_sale}\n`;
    }

    if (oldData.type_of_merchant !== newData.type_of_merchant) {
      beforeChange += `macam dangangan TU: ${oldData.type_of_merchant}\n`;
      afterChange += `macam dangangan TU: ${newData.type_of_merchant}\n`;
    }

    if (oldData.merchant_space != newData.merchant_space) {
      beforeChange += `luas TU: ${oldData.merchant_space}\n`;
      afterChange += `luas TU: ${newData.merchant_space}\n`;
    }

    if (oldData.price_per_meter != newData.price_per_meter) {
      beforeChange += `harga TU: ${oldData.price_per_meter}\n`;
      afterChange += `harga TU: ${newData.price_per_meter}\n`;
    }

    if (oldData.total_price != newData.total_price) {
      beforeChange += `total harga TU: ${oldData.total_price}\n`;
      afterChange += `total harga TU: ${newData.total_price}\n`;
    }

    if (oldData.attachment_1 && oldData.attachment_1 !== newData.attachment_1) {
      beforeChange += `lampiran 1: ${oldData.attachment_1}\n`;
      afterChange += `lampiran 1: ${newData.attachment_1}\n`;
    }

    if (oldData.attachment_2 && oldData.attachment_2 !== newData.attachment_2) {
      beforeChange += `lampiran 2: ${oldData.attachment_2}\n`;
      afterChange += `lampiran 2: ${newData.attachment_2}\n`;
    }

    let logSql = `
        INSERT INTO merchant_logs
        VALUES (
            NULL,
            ?,
            ?,
            ?,
            ?,
            DEFAULT,
            DEFAULT
        );`;

    if (beforeChange && afterChange) {
      db.query(logSql, [user_id, id, beforeChange, afterChange]);
    }
  },

  billingLogs: (user_id, id, newData, oldData) => {
    let beforeChange = "";
    let afterChange = "";

    if (oldData.merchant_id !== newData.merchant_id) {
      beforeChange += `nomer TU: ${oldData.merchant_id}\n`;
      afterChange += `nomer TU: ${newData.merchant_id}\n`;
    }

    if (oldData.payment_term !== newData.payment_term) {
      beforeChange += `termin pembayaran: ${oldData.payment_term}\n`;
      afterChange += `termin pembayaran: ${newData.payment_term}\n`;
    }

    if (oldData.due_date != newData.due_date) {
      beforeChange += `tanggal jatuh tempo: ${oldData.due_date}\n`;
      afterChange += `tanggal jatuh tempo: ${newData.due_date}\n`;
    }

    if (oldData.nominal != newData.nominal) {
      beforeChange += `nominal: ${oldData.nominal}\n`;
      afterChange += `nominal: ${newData.nominal}\n`;
    }

    if (oldData.payment_status !== newData.payment_status) {
      beforeChange += `status pembayaran: ${oldData.payment_status}\n`;
      afterChange += `status pembayaran: ${newData.payment_status}\n`;
    }

    if (oldData.payment_proof && oldData.payment_proof !== newData.payment_proof) {
      beforeChange += `bukti pembayaran: ${oldData.payment_proof}\n`;
      afterChange += `bukti pembayaran: ${newData.payment_proof}\n`;
    }

    if (oldData.receipt && oldData.receipt !== newData.receipt) {
      beforeChange += `kuitansi: ${oldData.receipt}\n`;
      afterChange += `kuitansi: ${newData.receipt}\n`;
    }

    let logSql = `
        INSERT INTO billing_logs
        VALUES (
            NULL,
            ?,
            ?,
            ?,
            ?,
            DEFAULT,
            DEFAULT
        );`;

    if (beforeChange && afterChange) {
      db.query(logSql, [user_id, id, beforeChange, afterChange]);
    }
  }
};
