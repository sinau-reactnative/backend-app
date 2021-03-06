# Backend App

## Step by Step

1. Clone repo and install dependencies
2. Make sure you already install mysql and setting up the .env ( the format is like .env.default )
3. Create database, name is up to you and don't forget to setting up in .env file in app.js if you run that in the first time you need to uncomment the sync func. ( sync is to make firstuser to signin, feel free to remake that )
4. Also if you need to some data, you can uncommet seeder helper
5. And you can check the endpoint and play around

## /api/v1/auth

| Endpoint              | HTTP | Description       | Body                                               |
| --------------------- | ---- | ----------------- | -------------------------------------------------- |
| `/api/v1/auth/signin` | POST | Update user by id | `email`, `password`                                |
| `/api/v1/auth/signup` | POST | Get all auth      | `fullname`, `email`, `username`, `address`, `role` |

- please take note : signup and all of users endpoint can be perform by `superadmin` only

## /api/v1/users

| Endpoint            | HTTP   | Description       | Body                                               |
| ------------------- | ------ | ----------------- | -------------------------------------------------- |
| `/api/v1/users/`    | PATCH  | Update user by id | `fullname`, `email`, `username`, `address`, `role` |
| `/api/v1/users/`    | GET    | Get all users     |                                                    |
| `/api/v1/users/:id` | GET    | Get user by id    |                                                    |
| `/api/v1/users/:id` | DELETE | DELETE user by id |                                                    |

## /api/v1/tenants

| Endpoint                  | HTTP   | Description             | Body                                                                          |
| ------------------------- | ------ | ----------------------- | ----------------------------------------------------------------------------- |
| `/api/v1/tenants/`        | POST   | Create tenant           | `name`, `no_ktp`, `place_of_birth`,`phone_number`, `date_of_birth`, `address` |
| `/api/v1/tenants/`        | GET    | Get all tenants         |                                                                               |
| `/api/v1/tenants/:no_ktp` | PATCH  | Update tenant by no_ktp | `name`, `place_of_birth`,`phone_number`, `date_of_birth`, `address`           |
| `/api/v1/tenants/:no_ktp` | GET    | Get tenant by no_ktp    |                                                                               |
| `/api/v1/tenants/:no_ktp` | DELETE | DELETE tenant by no_ktp |                                                                               |

## /api/v1/merchants

| Endpoint                         | HTTP   | Description           | Body                                                                                                                                                   |
| -------------------------------- | ------ | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/api/v1/merchants/`             | POST   | Create tenant         | `tenant_id`,`merchant_no`, `merchant_status`, `floor_position`, `type_of_sale`, `type_of_merchant`, `merchant_space`, `price_per_meter`, `total_price` |
| `/api/v1/merchants/`             | GET    | Get all merchants     |                                                                                                                                                        |
| `/api/v1/merchants/:merchant_no` | PATCH  | Update merchant by id | `tenant_id`, `merchant_status`, `floor_position`,`type_of_sale`, `type_of_merchant`, `merchant_space`, `price_per_meter`, `total_price`                |
| `/api/v1/merchants/:merchant_no` | GET    | Get merchant by id    |                                                                                                                                                        |
| `/api/v1/merchants/:merchant_no` | DELETE | DELETE merchant by id |                                                                                                                                                        |

- params-download-billing-as-csv: csv(`true`)
- params-download-billing-as-xls: xls(`true`)
- params-summary: summary(`true`)

## /api/v1/billings

| Endpoint               | HTTP   | Description             | Body                                                 |
| ---------------------- | ------ | ----------------------- | ---------------------------------------------------- |
| `/api/v1/billings/`    | POST   | Create tenant           | `merchant_id`, `payment_term`, `due_date`, `nominal` |
| `/api/v1/billings/`    | GET    | Get all billings        |                                                      |
| `/api/v1/billings/csv` | GET    | Download billing as csv |                                                      |
| `/api/v1/billings/`    | PATCH  | Update merchant by id   | `merchant_id`, `payment_term`, `due_date`, `nominal` |
| `/api/v1/billings/:id` | GET    | Get merchant by id      |                                                      |
| `/api/v1/billings/:id` | DELETE | DELETE merchant by id   |                                                      |

- note: for download csv you must add query `start_date` and `end_date`
- params-get-all-filter : start_date(`date`), end_date(`date`), type (`incoming`,`due_date`,`estimation`), outstanding(`true`), canceled(`true`)
- params-get-all-sort : sort(`asc`, `desc`), sort_type(`incoming`,`due_date`)
- params-get-all-billing-by-merchang-id: merchant_id(`merchant_no`)
- params-download-billing-as-csv: csv(`true`)
- params-download-billing-as-xls: xls(`true`)

## /api/v1/images

| Endpoint             | HTTP | Description                   | Body                        |
| -------------------- | ---- | ----------------------------- | --------------------------- |
| `/api/v1/images/`    | POST | Create tenant                 | `merchant_id`, `id`(number) |
| `/api/v1/images/:id` | GET  | Get all images by Merchant Id |                             |

## /api/v1/logs

| Endpoint                    | HTTP | Description                 | Body |
| --------------------------- | ---- | --------------------------- | ---- |
| `/api/v1/logs/merchant/:id` | GET  | Get all logs by Merchant Id |      |
| `/api/v1/logs/tenant/:id`   | GET  | Get all logs by Tenant Id   |      |
| `/api/v1/logs/billing/:id`  | GET  | Get all logs by Billing Id  |      |
