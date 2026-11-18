# Restaurant Ordering App: Backend API

REST API for a restaurant ordering app. Customers browse the menu and place orders. The restaurant owner (admin) manages the menu and moves orders through their status flow.

Built with **Node.js, Express, MongoDB (Mongoose) and JWT**, using an MVC-style structure (routes, controllers, models, middleware).

> Status: backend in progress. A Flutter customer app and admin side are planned (see [Roadmap](#roadmap)).

## Features

- **Authentication:** register and login, passwords hashed with bcrypt, JWT tokens
- **Role-based access:** `customer` and `admin`; admin routes are enforced on the server
- **Menu:** admin can add, edit, delete and mark items out of stock; customers browse available items with a category filter
- **Orders:** customers place, view and cancel their own orders; admin lists all orders and updates status
- **Server-side pricing:** the client sends only item IDs and quantities; prices and totals are calculated on the server from the database
- **Price snapshot:** each order stores the item name and price at the time of ordering
- **Order status flow:** status can only move forward in a fixed sequence
- **Validation and error handling:** input type checks, proper HTTP status codes (400, 401, 403, 404, 409, 500)

## Tech stack

| Area | Tools |
|---|---|
| Runtime / framework | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JSON Web Tokens (jsonwebtoken), bcryptjs |
| Other | cors, dotenv |

## Project structure

```
.
├── index.js
├── package.json
└── App/
    ├── models/
    │   ├── userModel.js
    │   ├── menuModel.js
    │   └── orderModel.js
    ├── controllers/
    │   ├── web/          (customer: auth, menu, orders)
    │   └── admin/        (admin: menu, orders)
    ├── routes/
    │   ├── web/
    │   └── admin/
    └── middleware/
        └── authMiddleware.js   (protect, adminOnly)
```

## Getting started

**Requirements:** Node.js 18+ and a running MongoDB instance (local or MongoDB Atlas).

```bash
git clone https://github.com/MuhammadTahir18/Restaurant-backend.git
cd Restaurant-backend
npm install
```

Create a `.env` file in the project root:

```env
PORT=8020
DB_URI=mongodb://127.0.0.1:27017/restaurant_app
JWT_SECRET=replace_with_a_long_random_string
```

Generate a secure secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Run the server:

```bash
npm run dev     # development (nodemon)
npm start       # production
```

Check it is running: `GET http://localhost:8020/health`

> `.env` is listed in `.gitignore` and must never be committed.

## Creating an admin

For security, registration always creates a `customer`. To create an admin:

1. Register a normal user through the API.
2. In MongoDB (Compass or Atlas), open that user in the `users` collection and change `role` to `"admin"`.
3. Log in again to get a fresh token.

## Authentication

Protected routes need the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

| Status | Meaning |
|---|---|
| 401 | Not logged in, or token invalid or expired |
| 403 | Logged in, but not allowed (for example a customer on an admin route) |

## API reference

Base path for customers: `/web/api`. Base path for admin: `/admin/api`.

### Health

| Method | Endpoint | Access |
|---|---|---|
| GET | `/health` | Public |

### Auth

| Method | Endpoint | Access | Body |
|---|---|---|---|
| POST | `/web/api/auth/register` | Public | `sName`, `sEmail`, `sPhone` (optional), `sPassword` (min 6 chars) |
| POST | `/web/api/auth/login` | Public | `sEmail`, `sPassword` |
| GET | `/web/api/auth/me` | Logged in | none |

### Menu (customer)

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| GET | `/web/api/menu` | Public | Only available items. Optional `?category=Burgers` |
| GET | `/web/api/menu/:id` | Public | Single item |

### Menu (admin)

| Method | Endpoint | Access | Body |
|---|---|---|---|
| GET | `/admin/api/menu` | Admin | none (includes unavailable items) |
| POST | `/admin/api/menu` | Admin | `sName`, `nPrice`, `sCategory`, optional `sDescription`, `sImageUrl` |
| PUT | `/admin/api/menu/:id` | Admin | any of `sName`, `sDescription`, `nPrice`, `sCategory`, `sImageUrl`, `bAvailable` |
| DELETE | `/admin/api/menu/:id` | Admin | none |

### Orders (customer)

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| POST | `/web/api/orders` | Logged in | Place an order (see body below) |
| GET | `/web/api/orders` | Logged in | Your own orders, newest first |
| GET | `/web/api/orders/:id` | Logged in | Your own order only (404 otherwise) |
| PATCH | `/web/api/orders/:id/cancel` | Logged in | Only while status is `pending` |

Place order body:

```json
{
  "sAddress": "House 12, Street 5, Lahore",
  "sPhone": "03001234567",
  "aItems": [
    { "sMenuId": "<menu item id>", "nQty": 2 },
    { "sMenuId": "<menu item id>", "nQty": 1 }
  ]
}
```

Prices are never read from the request. The server loads each item from the database and calculates `totalAmount` itself.

### Orders (admin)

| Method | Endpoint | Access | Notes |
|---|---|---|---|
| GET | `/admin/api/orders` | Admin | All orders with customer name, email and phone. Optional `?status=pending` |
| PATCH | `/admin/api/orders/:id/status` | Admin | Body: `{ "sStatus": "accepted" }` |

### Order status flow

```
pending -> accepted -> preparing -> out_for_delivery -> delivered
   |           |
   +-----------+--> cancelled
```

Invalid jumps (for example `pending` to `delivered`, or any change after `delivered`) return `400`.

## Response format

```json
{ "status": 1, "message": "Order place ho gaya", "data": { } }
```

`status` is `1` for success and `0` for failure, alongside the matching HTTP status code.

## Security notes

- Passwords are hashed with bcrypt and never returned in responses
- The password field is excluded from queries by default (`select: false`)
- Role is never taken from the request body; new users are always `customer`
- Admin routes use `protect` and `adminOnly` middleware
- Orders are scoped to the logged-in user; another user's order returns 404
- Login returns the same message for wrong email and wrong password
- Secrets are kept in environment variables

## Roadmap

- [ ] Deploy backend (live URL)
- [ ] Flutter customer app (login, menu, cart, checkout, order tracking)
- [ ] Admin panel for menu and order management
- [ ] Push notifications on order status changes
- [ ] Automated tests

## Author

**Muhammad Tahir**: Flutter and Node.js developer
GitHub: [MuhammadTahir18](https://github.com/MuhammadTahir18)