const db = require("../configs/db");

const sqlTenant = `
INSERT INTO tenants VALUES 
    (
        '0000000000000000',
        'PT. CAHAYA ABADI',
        'Jakarta',
        '081220330440',
        '1990-01-01',
        'Jl. Jakarta Selatan',
        'http://ini-link-kegambar.com',
        DEFAULT,
        DEFAULT
    ),(
        '3501922993019122',
        'Marco Yogananta',
        'Malang',
        '0895360159807',
        '1997-05-22',
        'Jl. Nipah 3 No 5, Jakarta Selatan',
        'http://ini-link-kegambar.com',
        DEFAULT,
        DEFAULT
    ),(
        '3501927630112523',
        'Alexandro Yogananto',
        'Yogyakarta',
        '0895360159807',
        '1998-12-03',
        'Jl. Hapin 5 No 3, Selatan Jakarta',
        'http://ini-link-kegambar.com',
        DEFAULT,
        DEFAULT  
    );
`;

const sqlMerchant = `
INSERT INTO merchants VALUES
 (
    'AB20100102',
    '3501922993019122',
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
    'AB30200301',
    '0000000000000000',
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
),(
    'AB30200401',
    '0000000000000000',
    'bebas',
    305,
    'RAMBAK',
    'JUALAN',
    100,
    '100000',
    '10000000',
    'http://ini-attachment-1.com',
    'http://ini-attachment-2.com',
    DEFAULT,
    DEFAULT
),(
    'AB30200501',
    '3501922993019122',
    'eksisting',
    305,
    'POKEMON',
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
    'AB30200501',
    'Booking Fee',
    '2020-06-22',
    '1000000',
    'menunggu_pembayaran',
    '',
    '',
    DEFAULT,
    DEFAULT
),(
  NULL,
  'AB30200501',
  'Pembayaran 1',
  '2020-07-11',
  '30000',
  'menunggu_validasi',
  'http://link-ke-payment-proof',
  '',
  DATE('2020-07-11'),
  DEFAULT
),(
    NULL,
    'AB30200501',
    'Pembayaran 2',
    '2020-07-22',
    '30000',
    'sudah_validasi',
    'http://link-ke-payment-proof',
    'http://link-ke-kwitansi',
    DATE('2020-07-22'),
    DEFAULT
),(
    NULL,
    'AB20100102',
    'Booking Fee',
    '2020-07-21',
    '30000',
    'sudah_validasi',
    'http://link-ke-payment-proof',
    'http://link-ke-kwitansi',
    DATE('2020-07-21'),
    DEFAULT
),(
    NULL,
    'AB20100102',
    'Pembayaran 2',
    '2020-07-01',
    '350000',
    'sudah_validasi',
    'http://link-ke-payment-proof',
    'http://link-ke-kwitansi',
    DATE('2020-07-01'),
    DEFAULT
),(
  NULL,
  'AB20100102',
  'Pembayaran 3',
  '2020-03-01',
  '350000',
  'outstanding',
  'http://link-ke-payment-proof',
  'http://link-ke-kwitansi',
  DATE('2020-02-21'),
  DEFAULT
),(
  NULL,
  'AB20100102',
  'Pembayaran 4',
  '2020-03-10',
  '350000',
  'canceled',
  'http://link-ke-payment-proof',
  'http://link-ke-kwitansi',
  DATE('2020-02-21'),
  DEFAULT
);
`;

const seederTenant = new Promise((resolve, reject) => {
  db.query(sqlTenant, (err) => {
    if (err) reject(err);
    else resolve("Tenant Seeders Inserted");
  });
});

const seederMerchant = new Promise((resolve, reject) => {
  db.query(sqlMerchant, (err) => {
    if (err) reject(err);
    else resolve("Merchant Seeders Inserted");
  });
});

const seederBilling = new Promise((resolve, reject) => {
  db.query(sqlBilling, (err) => {
    if (err) reject(err);
    else resolve("Billing Seeders Inserted");
  });
});

Promise.all([seederTenant, seederMerchant, seederBilling]).then((result) => {
  result.map((i) => console.log(i));
});
