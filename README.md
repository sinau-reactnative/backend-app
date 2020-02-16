# Backend App

## Step by Step

1. Clone repo and install dependencies
2. Make sure you already install mysql and setting up the .env ( the format is like .env.default )
3. Create database, name is up to you and don't forget to setting up in .env file in app.js if you run that in the first time you need to uncomment the sync func. ( sync is to make firstuser to signin, feel free to remake that )
4. And you can check the endpoint and play around

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

| Endpoint              | HTTP   | Description       | Body                               |
| --------------------- | ------ | ----------------- | ---------------------------------- |
| `/api/v1/tenants/`    | POST   | Create tenant     | `name`, `no_ktp`, `ttl`, `address` |
| `/api/v1/tenants/`    | GET    | Get all tenants   |                                    |
| `/api/v1/tenants/`    | PATCH  | Update user by id | `name`, `no_ktp`, `ttl`, `address` |
| `/api/v1/tenants/:id` | GET    | Get user by id    |                                    |
| `/api/v1/tenants/:id` | DELETE | DELETE user by id |                                    |
