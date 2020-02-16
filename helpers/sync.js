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

const createTenantTable = `
CREATE TABLE tenants (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name varchar(60),
    no_ktp varchar(16) UNIQUE,
    ttl varchar(15),
    address varchar(100),
    ktp_scan varchar(150),
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp DEFAULT current_timestamp
);
`;

const createMerchantTable = `
CREATE TABLE merchants (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    merchant_no varchar(20) NOT NULL,
    merchant_status enum('eksisting', 'bebas') NOT NULL,
    floor_position int(3),
    type_of_sale varchar(30),
    type_of_merchant varchar(30),
    merchant_space int(5),
    price_per_meter varchar(10),
    total_price varchar(10),
    attachment_1 varchar(150),
    attachment_2 varchar(150),
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp DEFAULT current_timestamp
);
`;

const createProgressTable = `
CREATE TABLE progress (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    merchant_id int,
    tenant_id int,
    payment_term varchar(50),
    due_date date,
    nominal varchar(10),
    payment_proof varchar(150),
    receipt varchar(150),
    payment_status enum('menunggu_validasi', 'sudah_validasi'),
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp DEFAULT current_timestamp,
    FOREIGN KEY (merchant_id) REFERENCES merchants(id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);
`;

const createLogTable = `
CREATE TABLE logs (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    user_id int,
    fullname varchar(60),
    after_changed varchar(250),
    before_changed varchar(250),
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp DEFAULT current_timestamp,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
`;

db.query(queryCreateTable, err => {
  if (err) {
    throw err;
  } else {
    console.log("New Table User has been created");
    return db.query(firstUserCreated, err => {
      if (err) throw err;
      else {
        console.log("New User has been created");
        return db.query(createTenantTable, err => {
          if (err) throw err;
          else {
            console.log("New tenant table");
            return db.query(createMerchantTable, err => {
              if (err) throw err;
              else {
                console.log("New merchant table");
                return db.query(createProgressTable, err => {
                  if (err) throw err;
                  else {
                    console.log("New progress table");
                    return db.query(createLogTable, err => {
                      if (err) throw err;
                      else console.log("New logs table");
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});
