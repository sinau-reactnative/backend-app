const db = require("../configs/db");

const sqlTenant = `
INSERT INTO tenants VALUES 
    (
        NULL,
        'Marco Yogananta',
        '3501922993019122',
        'Malang,22-05-1997',
        'Jl. Nipah 3 No 5, Jakarta Selatan',
        'http://ini-link-kegambar.com',
        DEFAULT,
        DEFAULT
    ),(
        NULL,
        'Alexandro Yogananto',
        '3501927630112523',
        'Yogyakarta,05-05-1998',
        'Jl. Hapin 5 No 3, Selatan Jakarta',
        'http://ini-link-kegambar.com',
        DEFAULT,
        DEFAULT  
    );
`;

const sqlMerchant = `
INSERT INTO merchants VALUES
 (
    NULL,
    'AB20100102',
    'eksisting',
    120,
    'KERUPUK',
    'DODOLAN',
    130,
    '100000',
    '13000000',
    'http://ini-attachment-1.com',
    'http://ini-attachment-2.com',
    DEFAULT,
    DEFAULT
),(
    NULL,
    'AB30200301',
    'bebas',
    305,
    'UDANG',
    'JUALAN',
    100,
    '100000',
    '10000000',
    'http://ini-attachment-1.com',
    'http://ini-attachment-2.com',
    DEFAULT,
    DEFAULT
);
`;

const sqlBilling = `
INSERT INTO billings VALUES
(
    NULL,
    1,
    1,
    'PEMBAYARAN 1',
    '2019-02-22',
    1000000,
    'menunggu_validasi',
    'http://link-ke-payment-proof',
    '',
    DEFAULT,
    DEFAULT
),(
    NULL,
    2,
    1,
    'PEMBAYARAN 2',
    '2019-01-21',
    30000,
    'sudah_validasi',
    'http://link-ke-payment-proof',
    'http://link-ke-kwitansi',
    DEFAULT,
    DEFAULT
);
`;

const seederMerchant = new Promise((resolve, reject) => {
  db.query(sqlMerchant, err => {
    if (err) reject(err);
    else resolve("Merchant Seeders Inserted");
  });
});

const seederTenant = new Promise((resolve, reject) => {
  db.query(sqlTenant, err => {
    if (err) reject(err);
    else resolve("Tenant Seeders Inserted");
  });
});

const seederBilling = new Promise((resolve, reject) => {
  db.query(sqlBilling, err => {
    if (err) reject(err);
    else resolve("Billing Seeders Inserted");
  });
});

Promise.all([seederMerchant, seederTenant, seederBilling]).then(result => {
  result.map(i => console.log(i));
});
