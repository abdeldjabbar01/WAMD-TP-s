# Parfumi Store – Mobile App (React Native / Expo)

**Student name:** _<your full name here>_
**Module:** WAMD – TD/TP 5 – ENSTA (SS/IA, First Semester 2026)

## Application description
Mobile version of the Parfumi perfume store built in Labs 2–4. It reuses the **same
Node.js / Express backend and MongoDB database** (no new backend). Users can browse
perfumes, search, see product details, manage a cart, register / log in with JWT, and
(admin only) add, edit and delete products.

## Technologies used
- React Native + Expo (Expo Go for testing)
- JavaScript
- React Navigation (native stack + bottom tabs)
- Redux Toolkit (cart state, persisted on the device)
- Axios (HTTP client with a JWT interceptor)
- AsyncStorage (session + cart persistence)
- Backend: Node.js, Express, MongoDB/Mongoose, JWT (from previous labs)

## API used
Base URL: `http://<host>:5000/api`

| Method | Endpoint | Auth | Used for |
|---|---|---|---|
| POST | `/auth/register` | – | Create an account |
| POST | `/auth/login` | – | Sign in, returns JWT |
| GET | `/products` | – | Product list |
| GET | `/products/:id` | – | Product details |
| POST | `/products` | JWT + admin | Create a product |
| PUT | `/products/:id` | JWT + admin | Update a product |
| DELETE | `/products/:id` | JWT + admin | Delete a product |

## Main features
- Login / Register screens connected to the API, JWT stored on the device and sent as `Authorization: Bearer <token>`
- Product list loaded from MongoDB (2-column grid), live search, pull-to-refresh
- Product details screen with stock, quantity selector and add to cart
- Cart with quantity controls, remove, total, persisted between launches
- Loading indicators, network-error screens with "Try again", API error messages
- Admin: add / edit / delete products (protected requests)
- Layout forced to left-to-right

## Project structure
```
App.js                 navigation + providers
src/config.js          API URL
src/services/api.js    Axios instance, error handling, API helpers
src/context/           AuthContext (JWT session)
src/store/             Redux cart + persistence
src/screens/           Products, ProductDetails, Cart, Account, Login, Register, ProductForm
src/components/        ProductCard, Button, FormField, Loading/Error/Empty views
assets/images/         perfume images (same files as the web app)
```

## Running the application

### 1. Start the existing backend (unchanged)
```bash
cd backend
npm install
# .env must contain MONGO_URI and JWT_SECRET
node seed.js        # optional: insert the 4 sample perfumes
npm start           # http://localhost:5000
```

### 2. Start the mobile app
```bash
cd parfumi-mobile
npm install
npx expo start
```
- **Android emulator:** press `a`. The default API URL is `http://10.0.2.2:5000/api`.
- **Physical phone (Expo Go):** phone and computer must be on the same Wi-Fi.
  Copy `.env.example` to `.env`, set your computer's LAN IP, then restart Expo:
  ```
  EXPO_PUBLIC_API_URL=http://192.168.1.20:5000/api
  ```
  Scan the QR code with Expo Go. If it cannot connect, allow port 5000 in your firewall.

### Notes
- The backend only stores image paths like `/images/perfume-1.jpg`; the app bundles those
  same images and maps them by file name. Full `https://` image URLs also work.
- The backend limits login to 5 attempts per 15 minutes per IP.
- To create an admin, set `role: "admin"` on a user in MongoDB.
- The backend has no orders endpoint, so "checkout" only simulates an order and clears the cart.

## Screenshots
Add your screenshots here (product list, product details, cart, login).
