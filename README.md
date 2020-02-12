# Backend App

## /api/v1/auth

| Endpoint              | HTTP | Description       | Body                                               |
| --------------------- | ---- | ----------------- | -------------------------------------------------- |
| `/api/v1/auth/login`  | POST | Update user by id | `email`, `password`                                |
| `/api/v1/auth/signup` | POST | Get all auth      | `fullname`, `email`, `username`, `address`, `role` |

- please take note : signup and all of users endpoint can be perform by `superadmin` only

## /api/v1/users

| Endpoint            | HTTP   | Description       | Body                                               |
| ------------------- | ------ | ----------------- | -------------------------------------------------- |
| `/api/v1/users/`    | PATCH  | Update user by id | `fullname`, `email`, `username`, `address`, `role` |
| `/api/v1/users/`    | GET    | Get all users     |                                                    |
| `/api/v1/users/:id` | GET    | Get user by id    |                                                    |
| `/api/v1/users/:id` | DELETE | DELETE user by id |                                                    |
