const excel = require("node-excel-export");

module.exports = {
  exportBillingToExcel: (res, data) => {
    const styles = {
      headerDark: {
        fill: {
          fgColor: {
            rgb: "60E38E00"
          }
        },
        font: {
          color: {
            rgb: "FFFFFFFF"
          },
          sz: 14,
          bold: true,
          underline: true
        }
      }
    };
    const specification = {
      id: {
        displayName: "id",
        headerStyle: styles.headerDark,
        width: 50
      },
      merchant_id: {
        displayName: "Nomor TU",
        headerStyle: styles.headerDark,
        width: "10"
      },
      payment_term: {
        displayName: "Termin Pembayaran",
        headerStyle: styles.headerDark,
        width: 220
      },
      due_date: {
        displayName: "Jatuh Tempo",
        headerStyle: styles.headerDark,
        width: 120
      },
      nominal: {
        displayName: "Nominal",
        headerStyle: styles.headerDark,
        width: "10"
      },
      payment_status: {
        displayName: "Status Pembayaran",
        headerStyle: styles.headerDark,
        width: 220
      },
      payment_proof: {
        displayName: "Bukti Pembayaran",
        headerStyle: styles.headerDark,
        width: 500
      },
      receipt: {
        displayName: "Kwitansi",
        headerStyle: styles.headerDark,
        width: 500
      }
    };

    const dataset = data;
    const report = excel.buildExport([
      // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
      {
        name: "Billing - Report", // <- Specify sheet name (optional)
        specification: specification, // <- Report specification
        data: dataset // <-- Report data
      }
    ]);
    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader("Content-Disposition", "attachment; filename=" + "Billing - Report.xlsx");
    res.end(report, "binary");
  },

  exportMerchantToExcel: (res, data) => {
    const styles = {
      headerDark: {
        fill: {
          fgColor: {
            rgb: "60E38E00"
          }
        },
        font: {
          color: {
            rgb: "FFFFFFFF"
          },
          sz: 14,
          bold: true,
          underline: true
        }
      }
    };
    const specification = {
      merchant_no: {
        displayName: "Nomer TU",
        headerStyle: styles.headerDark,
        width: "20"
      },
      merchant_status: {
        displayName: "Status Merchant",
        headerStyle: styles.headerDark,
        width: 70
      },
      floor_position: {
        displayName: "Posisi Lantai",
        headerStyle: styles.headerDark,
        width: 100
      },
      type_of_sale: {
        displayName: "Jenis Jualan",
        headerStyle: styles.headerDark,
        width: "30"
      },
      type_of_merchant: {
        displayName: "Macam Dagangan TU",
        headerStyle: styles.headerDark,
        width: "30"
      },
      merchant_space: {
        displayName: "Luas TU",
        headerStyle: styles.headerDark,
        width: 100
      },
      price_per_meter: {
        displayName: "Harga per Meter",
        headerStyle: styles.headerDark,
        width: 200
      },
      total_price: {
        displayName: "Total Harga",
        headerStyle: styles.headerDark,
        width: 200
      },
      attachment_1: {
        displayName: "Lampiran 1",
        headerStyle: styles.headerDark,
        width: 500
      },
      attachment_2: {
        displayName: "Lampiran 2",
        headerStyle: styles.headerDark,
        width: 500
      },
      no_ktp: {
        displayName: "No KTP",
        headerStyle: styles.headerDark,
        width: 220
      },
      name: {
        displayName: "Nama",
        headerStyle: styles.headerDark,
        width: 220
      },
      phone: {
        displayName: "Nomor Telepon",
        headerStyle: styles.headerDark,
        width: 150
      },
      address: {
        displayName: "Alamat",
        headerStyle: styles.headerDark,
        width: 220
      },
      place_of_birth: {
        displayName: "Tempat Lahir",
        headerStyle: styles.headerDark,
        width: 140
      },
      date_of_birth: {
        displayName: "Tanggal Lahir",
        headerStyle: styles.headerDark,
        width: 120
      },

      ktp_scan: {
        displayName: "Scan KTP",
        headerStyle: styles.headerDark,
        width: 500
      },
      income_nominal: {
        displayName: "Uang masuk (nominal)",
        headerStyle: styles.headerDark,
        width: 170
      },
      income_progress: {
        displayName: "Uang masuk (progress)",
        headerStyle: styles.headerDark,
        width: 170
      },
      outstanding_nominal: {
        displayName: "Outstanding (nominal)",
        headerStyle: styles.headerDark,
        width: 170
      },
      outstanding_progress: {
        displayName: "Outstanding (progress)",
        headerStyle: styles.headerDark,
        width: 170
      }
    };

    const dataset = data;
    const report = excel.buildExport([
      // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
      {
        name: "Merchant - Report", // <- Specify sheet name (optional)
        specification: specification, // <- Report specification
        data: dataset // <-- Report data
      }
    ]);
    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader("Content-Disposition", "attachment; filename=" + "Merchant - Report.xlsx");
    res.end(report, "binary");
  }
};
