const db = require("../configs/db");
const { encrypt } = require("../helpers/encryption");

const queryCreateTable = `
CREATE TABLE users (
    id int primary key not null auto_increment,
    first_name varchar(60),
    last_name varchar(80),
    email varchar(30),
    username varchar(25),
    password varchar(250),
    avatar varchar(255),
    role enum('admin', 'superadmin', 'user'),
    address varchar(100),
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp
);
`;

const password = encrypt("password123");
const firstUserCreated = `
INSERT INTO users VALUES (
    NULL,
    'Azerino Yogananta',
    'Gatot Subroto',
    'azerino25@gmail.com',
    'ayogatot',
    '${password}',
    'https://i0.wp.com/content.invisioncic.com/Mgonitro/monthly_2018_03/K_member_3218.png?ssl=1',
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
