const db = require("../configs/db");
const { encrypt } = require("../helpers/encryption");

const queryCreateTable = `
CREATE TABLE users (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    fullname varchar(60),
    email varchar(30) UNIQUE,
    username varchar(25),
    password varchar(250),
    role enum('admin', 'superadmin', 'user'),
    address varchar(100),
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp DEFAULT current_timestamp
);
`;

const password = encrypt("password123");
const firstUserCreated = `
INSERT INTO users VALUES (
    NULL,
    'Azerino Yogananta',
    'azerino25@gmail.com',
    'ayogatot',
    '${password}',
    'superadmin',
    'Jl. Sebuku Gg.3 Kec. Blimbing, Malang',
    DEFAULT,
    DEFAULT
);
`;

db.query(queryCreateTable, err => {
  if (err) {
    throw err;
  } else {
    console.log("New Table User has been created");
    return db.query(firstUserCreated, err => {
      if (err) throw err;
      else console.log("New User has been created");
    });
  }
});
