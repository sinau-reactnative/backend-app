const db = require("../configs/db");
const schedule = require("node-schedule");

const d = new Date();
const date = d.getDate();
const month = d.getMonth() + 1 ? "0" + (d.getMonth() + 1) : date;
const year = d.getFullYear();
const fullDate = `${year}-${month}-${date}`;

module.exports = schedule.scheduleJob("59 59 23 * * *", function() {
  let sql = `
          UPDATE billings
          SET payment_status = "outstanding"
          WHERE due_date = DATE('${fullDate}');
  `;
  db.query(sql, [], err => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Billing wiht due date ${fullDate} is now outstanding`);
    }
  });
});
