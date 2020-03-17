const excel = require("node-excel-export");

module.exports = {
  exportToExcel: (res, data) => {
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
        displayName: "id", // <- Here you specify the column header
        headerStyle: styles.headerDark, // <- Header style
        width: 50 // <- width in pixels
      },
      merchant_id: {
        displayName: "Nomor TU",
        headerStyle: styles.headerDark,
        width: "10" // <- width in chars (when the number is passed as string)
      },
      payment_term: {
        displayName: "Termin Pembayaran",
        headerStyle: styles.headerDark,
        width: 220 // <- width in pixels
      },
      due_date: {
        displayName: "Jatuh Tempo", // <- Here you specify the column header
        headerStyle: styles.headerDark, // <- Header style
        width: 120 // <- width in pixels
      },
      nominal: {
        displayName: "Nominal",
        headerStyle: styles.headerDark,
        width: "10" // <- width in chars (when the number is passed as string)
      },
      payment_status: {
        displayName: "Status Pembayaran",
        headerStyle: styles.headerDark,
        width: 220 // <- width in pixels
      },
      payment_proof: {
        displayName: "Bukti Pembayaran",
        headerStyle: styles.headerDark,
        width: 500 // <- width in chars (when the number is passed as string)
      },
      receipt: {
        displayName: "Kwitansi",
        headerStyle: styles.headerDark,
        width: 500 // <- width in pixels
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
  }
};
