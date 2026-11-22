# Parfumi Store - Backend

This is the Express API for the Parfumi Store TD-TP 3 project.

## Responsibilities

- Connect to MongoDB with Mongoose.
- Register users and verify login credentials.
- Hash passwords with bcryptjs.
- Issue and verify one-day HS256 JWTs.
- Optionally verify Auth0 RS256 access tokens through JWKS. The final Auth0 protected-endpoint test was not completed in the supplied evidence.
- Serve product read and admin-only write endpoints.
- Apply general API and login rate limits.

## Setup

```powershell
npm install
```

Create `backend/.env` from `.env.example`, then configure `MONGO_URI` and `JWT_SECRET`. Auth0 settings are optional unless Auth0 tokens are used.

```powershell
npm start
```

The server defaults to port `5000`.

## Routes

| Method | Path | Access |
|---|---|---|
| GET | `/api/health` | Public |
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public, 5 attempts per 15 minutes |
| GET | `/api/products` | Public |
| GET | `/api/products/:id` | Public |
| POST | `/api/products` | Admin only |
| PUT | `/api/products/:id` | Admin only |
| DELETE | `/api/products/:id` | Admin only |

The three product write routes use both authentication and administrator authorization middleware. Newly registered local users receive the `customer` role.

The general `/api` rate limiter is configured for 100 requests per 15 minutes. The login route applies an additional limit of 5 attempts per 15 minutes.

## Security

Keep `.env` private. Do not commit credentials, passwords, JWTs, or Auth0 secrets. The supplied `.env.example` contains placeholders only.
