# Parfumi Store - TD-TP 3 Submission

This is the prepared submission package for **TD-TP 3 only**.

## Open these first

1. `Documentation/Parfumi-Store-TD-TP3-Report.pdf` - the project report.
2. `Project/README.md` - installation, setup, features, routes, and notes.
3. `Screenshots/README.md` - index of all 30 organized screenshots.
4. `Code-Snapshots/README.md` - selected source files and their original paths.

## Package contents

- `Project/` - the React/Vite frontend, Express backend, MongoDB models, package manifests, `.env.example` templates, and Postman collection.
- `Documentation/` - the final PDF report.
- `Screenshots/` - all 30 supplied screenshots, grouped by subject.
- `Code-Snapshots/` - direct copies of selected files from the actual source code.
- `Postman/` - a clean importable collection with saved token values cleared.

## Before running the project

Install dependencies in both locations:

```powershell
cd Project
npm install

cd backend
npm install
npm start
```

In a second terminal, from `Project/`:

```powershell
npm run dev
```

Create `Project/backend/.env` from `Project/backend/.env.example` and set your own MongoDB connection string and JWT secret. Do not share or commit this file.

## Important

The original archive contained a populated `backend/.env`. It has been excluded from this package. The submission contains only placeholder `.env.example` files. Because a populated environment file was present in the uploaded archive, rotate the MongoDB password/connection credentials and JWT secret if the original archive was shared anywhere outside a trusted private location.

The cart is client-side only; checkout/order persistence is not implemented. Auth0 helper code and API token verification are present, but the visible sign-in dialog currently exposes local email/password login only, and the final Auth0 protected-endpoint test was not completed.
