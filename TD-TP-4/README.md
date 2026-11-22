# Parfumi Store

A React Native / Expo fragrance storefront with customer and administrator experiences.

## What changed

- Minimal black-and-white visual system with a restrained blue accent and native system typography.
- Compact top bar with the `P` mark, global fragrance search, and a role-aware menu.
- Animated-feeling, icon-led bottom tab navigation with customer and administrator destinations.
- Customer catalogue redesigned as one fragrance per row, with image on the left and details/actions on the right.
- Customer cart, placed-order history, and shipped-order tracking.
- Customer account profile with email, account ID, role, and order count.
- Admin catalogue management, order fulfilment, customer directory, and account.
- Added order persistence and protected admin endpoints for order fulfilment and customer listing.

## Run the mobile app

```bash
cd mobile
npm install
npx expo start
```

Set `EXPO_PUBLIC_API_URL` in `mobile/.env` if the API is not reachable at the automatically detected development host, for example:

```env
EXPO_PUBLIC_API_URL=http://YOUR_COMPUTER_LAN_IP:5000/api
```

## Run the backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `MONGO_URI` and `JWT_SECRET` in `backend/.env`, then run:

```bash
npm start
```

The backend must be reachable from the device/emulator. Configure `CORS_ORIGIN` for any web client origins you use.

## Order workflow

- Customer checkout creates a persisted order with status `placed`.
- The customer's **Ordered** tab lists placed orders.
- An administrator marks an order as shipped from **Orders**.
- The order then appears in the customer's **Confirmed · shipping** tab.

## Admin access

Administrator access is controlled by the backend `role` field. Do not grant admin privileges from the mobile client. Promote an account in the database or use your trusted server-side admin provisioning process.

## Security note

Secrets are intentionally not included in this archive. Create `backend/.env` from `.env.example` and supply your own credentials. Dependency folders are excluded; install packages with `npm install` in each app folder.
