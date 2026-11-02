# Parfumi Store - TD-TP 3 Submission

A perfume storefront built with React, Vite, Redux Toolkit, Express, and MongoDB. This package contains the **TD-TP 3 project only**.

## What is included

- React storefront with product search, product cards, and a Redux shopping cart.
- Express REST API connected to MongoDB through Mongoose.
- Local registration and login with bcryptjs password hashing and one-day HS256 JWTs.
- Protected product create, update, and delete routes with server-side administrator checks.
- General API and login rate limiters.
- Optional Auth0 RS256 access-token verification on the API.
- A Postman collection for repeatable API checks.

## Requirements

- Node.js 20.19+ or 22.12+ (the Vite 8 requirement in the supplied package).
- npm.
- A MongoDB Atlas database or local MongoDB instance.
- Postman (optional, for API testing).

## Setup

### 1. Configure the backend

```powershell
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and set your own values:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=replace_with_a_long_random_secret
AUTH0_DOMAIN=your-tenant.region.auth0.com
AUTH0_AUDIENCE=your_auth0_api_identifier
CORS_ORIGIN=http://localhost:5173
```

`MONGO_URI` and `JWT_SECRET` are required for the local API. Auth0 values are needed only when verifying Auth0 RS256 access tokens. The frontend Auth0 helper code is present, but the visible sign-in dialog does not currently start an Auth0 login flow. Never share or commit the real `.env` file.

Start the backend:

```powershell
npm start
```

The API runs on `http://localhost:5000`. Health check: `http://localhost:5000/api/health`.

### 2. Configure and start the frontend

Open a second terminal at the project root:

```powershell
npm install
```

Copy the root `.env.example` to `.env` if you need to change the API URL or configure the optional Auth0 frontend values. The default API URL is `http://localhost:5000/api`.

Start Vite:

```powershell
npm run dev
```

Open `http://localhost:5173`.

## Main features

- Browse perfumes from the backend product catalogue.
- Search products by name.
- Add items to the cart, increase/decrease quantities, remove items, and view totals.
- Register and sign in with email and password.
- Manage products from the storefront when signed in as an administrator.
- Create, update, and delete products through protected API routes.

**Current scope note:** the cart is stored in Redux client state. It is not persisted to MongoDB, and a checkout/order workflow is not implemented in this version.

## API endpoints

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/` | Public | API welcome message |
| GET | `/api/health` | Public | Health check |
| POST | `/api/auth/register` | Public | Create an account |
| POST | `/api/auth/login` | Public | Authenticate and return a JWT |
| GET | `/api/products` | Public | List products |
| GET | `/api/products/:id` | Public | Get one product |
| POST | `/api/products` | Admin only | Create a product |
| PUT | `/api/products/:id` | Admin only | Update a product |
| DELETE | `/api/products/:id` | Admin only | Delete a product |

Protected requests use:

```http
Authorization: Bearer <access_token>
```

Product fields: `name`, `description`, `price`, `category`, `imageUrl`, and `stock`.

## Authentication and security

- Registration validates the submitted fields and hashes passwords with bcryptjs before storing them.
- Local JWTs use HS256 and expire after one day.
- The API accepts local HS256 tokens and can verify Auth0 RS256 access tokens through the Auth0 JWKS, issuer, and audience configuration.
- The frontend contains Auth0 helper/callback code, but the visible account dialog in this version exposes local email/password sign-in only; an Auth0 sign-in button is not wired into that dialog.
- Product write operations pass through both token verification and the `requireAdmin` middleware. A valid customer token is not enough.
- New local registrations are assigned the `customer` role by the backend.
- The general `/api` rate limiter is configured for 100 requests per 15 minutes.
- The login endpoint has an additional limit of 5 attempts per 15 minutes.
- CORS uses the configured `CORS_ORIGIN` allow-list.

## Postman

Import `backend/postman/Parfumi-Store.postman_collection.json` into Postman. Set `baseUrl` to `http://localhost:5000`. Set your own test email and password before registration/login. The collection does not contain saved access tokens.

The screenshots in the submission evidence folder show the tests that were captured during the work. Some test outcomes are identified as unverified in the report rather than being presented as successful without evidence.

## Important safety notes

- Do not add `.env`, database credentials, JWT secrets, Auth0 client secrets, passwords, or access tokens to GitHub or a submission archive.
- `backend/.env` was intentionally excluded from this package. Create your own local copy from `backend/.env.example`.
- `node_modules` and generated build folders are intentionally excluded. Run `npm install` in each application folder to restore dependencies.
- `backend/seed.js` deletes all documents in the products collection before inserting sample products. Do not run it against a database whose existing products you want to keep.

## Folder guide

- `Project/` - application source code and Postman collection.
- `Documentation/` - final PDF report.
- `Screenshots/` - organized evidence, with credential-bearing parts redacted in the submission copies.
- `Code-Snapshots/` - selected source files copied from the actual project code.
- `Postman/` - clean importable Postman collection.
