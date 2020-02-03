require("dotenv").config();

const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

db.connect(err => {
  if (err) console.log(`Error ${err}`);
  else {
    console.log("database connected");
  }
});

module.exports = db;
