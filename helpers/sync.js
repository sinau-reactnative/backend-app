const db = require("../configs/db");
const { encrypt } = require("../helpers/encryption");

const createUserTable = `
CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
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
    no_ktp varchar(16) NOT NULL,
    name varchar(60),
    place_of_birth varchar(50),
    phone_number varchar(20),
    date_of_birth date,
    address varchar(100),
    ktp_scan varchar(150),
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp DEFAULT current_timestamp,
    PRIMARY KEY (no_ktp)
);
`;

const createMerchantTable = `
CREATE TABLE merchants (
    merchant_no varchar(20) NOT NULL,
    tenant_id varchar(16),
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
    updated_at timestamp DEFAULT current_timestamp,
    PRIMARY KEY (merchant_no),
    FOREIGN KEY (tenant_id) REFERENCES tenants(no_ktp)
);
`;

const createBillingTable = `
CREATE TABLE billings (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    merchant_id varchar(20),
    payment_term varchar(50),
    due_date date,
    nominal varchar(10),
    payment_status enum('menunggu_validasi', 'sudah_validasi', 'canceled', 'outstanding'),
    payment_proof varchar(150),
    receipt varchar(150),
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp DEFAULT current_timestamp,
    FOREIGN KEY (merchant_id) REFERENCES merchants(merchant_no)
);
`;

const createLogsTable = `
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

const createImageTable = `
CREATE TABLE images (
    id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    merchant_id varchar(20),
    url varchar(150),
    created_at timestamp DEFAULT current_timestamp,
    updated_at timestamp DEFAULT current_timestamp,
    FOREIGN KEY (merchant_id) REFERENCES merchants(merchant_no)
)
`;

const createUser = new Promise((resolve, reject) => {
  db.query(createUserTable, err => {
    if (err) reject(err);
    else {
      db.query(firstUserCreated, err => {
        if (err) reject(err);
        else resolve("User Table Created");
      });
    }
  });
});

const createTenant = new Promise((resolve, reject) => {
  db.query(createTenantTable, err => {
    if (err) reject(err);
    else resolve("Tenant Table Created");
  });
});

const createMerchant = new Promise((resolve, reject) => {
  db.query(createMerchantTable, err => {
    if (err) reject(err);
    else resolve("Merchant Table Created");
  });
});

const createBilling = new Promise((resolve, reject) => {
  db.query(createBillingTable, err => {
    if (err) reject(err);
    else resolve("Billing Table Created");
  });
});

const createLogs = new Promise((resolve, reject) => {
  db.query(createLogsTable, err => {
    if (err) reject(err);
    else resolve("Logs Table Created");
  });
});

const createImage = new Promise((resolve, reject) => {
  db.query(createImageTable, err => {
    if (err) reject(err);
    else resolve("Image Table Created");
  });
});

Promise.all([
  createUser,
  createTenant,
  createMerchant,
  createLogs,
  createImage,
  createBilling
]).then(result => {
  result.map(i => console.log(i));
});
