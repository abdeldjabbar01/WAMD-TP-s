<div align="center">
<img src="assets/banner.png" alt="PARFUMI – WAMD practical work" width="100%" />
# WAMD · TD/TP Assignments
 
**Web And Mobile Development — practical work, from first page to full-stack mobile app.**
 
![Module](https://img.shields.io/badge/Module-WAMD-000000?style=for-the-badge)
![School](https://img.shields.io/badge/ENSTA-TD%2FTP-0a84ff?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-In%20progress-000000?style=for-the-badge)
 
![JavaScript](https://img.shields.io/badge/JavaScript-000000?style=flat-square&logo=javascript&logoColor=F7DF1E)
![React Native](https://img.shields.io/badge/React%20Native-000000?style=flat-square&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000000?style=flat-square&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-000000?style=flat-square&logo=nodedotjs&logoColor=339933)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-000000?style=flat-square&logo=mongodb&logoColor=47A248)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-000000?style=flat-square&logo=redux&logoColor=764ABC)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
 
[About](#-about) · [Structure](#-repository-structure) · [Featured project](#-featured-project--parfumi) · [Getting started](#-getting-started) · [API](#-api-reference) · [Author](#-author)
 
</div>
---
 
## ✦ About
 
This repository gathers the **TD/TP assignments** of the *Web And Mobile Development* module.
Each folder is one self-contained practical work, built step by step — the later ones reuse and extend
what was learned in the earlier ones.
 
## ✦ Repository structure
 
```text
WAMD-TP-s/
├── TD-TP-1/             # Practical work 1
├── TD-TP-2/             # Practical work 2
├── TD_TP_3/             # Practical work 3
├── 04-parfumi-mobile/   # Full-stack store: Express API + React Native app
├── assets/              # Images used by this README
├── .gitignore
└── README.md
```
 
| Folder | Topic | Stack |
| :-- | :-- | :-- |
| [`TD-TP-1`](./TD-TP-1) | _Add a one-line summary_ | _…_ |
| [`TD-TP-2`](./TD-TP-2) | _Add a one-line summary_ | _…_ |
| [`TD_TP_3`](./TD_TP_3) | _Add a one-line summary_ | _…_ |
| [`04-parfumi-mobile`](./04-parfumi-mobile) | **Parfumi** — mobile store with customer & admin roles | React Native · Express · MongoDB |
 
> 💡 Fill the three `Add a one-line summary` cells with what each TP is about.
 
---
 
## ✦ Featured project · PARFUMI
 
> A fragrance store that feels like a real app: Apple-style design, a floating animated tab bar,
> a three-phase cart, and an admin side to manage products, orders and customers.
 
<div align="center">
<img src="assets/screens.png" alt="Parfumi – Home, Cart and Admin Orders" width="100%" />
<sub>UI previews of the main screens: customer home, the three-phase cart, and admin orders.</sub>
</div>
### Features
 
<table>
<tr>
<td width="50%" valign="top">
#### 🛍 Customer
- **Home** — one perfume per row: picture on the left, name, details and price on the right
- Category chips and live **search** from the header
- Product page with quantity picker and sticky *Add to bag* bar
- **Cart in 3 phases:** `On cart → Ordered → Confirmed (shipping)`
- Checkout with delivery address and phone, order progress tracker
- **Account** — profile picture, email, customer ID, number of orders, member since
</td>
<td width="50%" valign="top">
#### 🛠 Admin
- **Home** — revenue, orders to ship, product count, quick *Add perfume*
- Tap a perfume to open it, or **Edit / Delete** it
- **Orders** — *To ship* and *Shipped* lists with a **Ship order** button
- **Customers** — profile picture, email and ID of every customer
- **Account** — role, orders handled, customers count
</td>
</tr>
</table>
**Shared:** header with `P` logo · search bar · menu button, floating **animated bottom navigation**
(3 tabs for customers, 4 for admins), JWT authentication, persistent cart, pull-to-refresh, loading / empty / error states.
 
### How an order moves
 
```mermaid
stateDiagram-v2
    direction LR
    [*] --> OnCart: add perfumes
    OnCart --> Ordered: customer checks out
    Ordered --> Confirmed: admin presses "Ship order"
    Confirmed --> [*]: shipping
```
 
| Phase | Customer sees | Who triggers it |
| :-- | :-- | :-- |
| **On cart** | Items, quantities, total | Customer |
| **Ordered** | Order waiting for the store | Customer → *Check out* |
| **Confirmed** | *Confirmed · Shipping* + progress tracker | Admin → *Ship order* |
 
### Architecture
 
```mermaid
flowchart LR
    subgraph Phone["📱 React Native (Expo)"]
        UI[Screens & animated tab bar]
        Redux[(Redux cart)]
        Auth[AuthContext · JWT]
        UI --- Redux
        UI --- Auth
    end
    subgraph Server["🖥 Node.js + Express"]
        Routes["/api/auth · /products · /orders · /users"]
        MW[JWT + admin middleware]
        Routes --- MW
    end
    DB[(MongoDB<br/>Users · Products · Orders)]
    UI -- "Axios · Bearer token" --> Routes
    Routes -- Mongoose --> DB
```
 
### Tech stack
 
| Layer | Tools |
| :-- | :-- |
| **Mobile** | React Native 0.88 · Expo · React Navigation (tabs + stack) · Redux Toolkit · Axios · AsyncStorage · `Animated` API · Ionicons |
| **Backend** | Node.js · Express 5 · Mongoose · JSON Web Tokens · bcrypt · express-rate-limit · CORS |
| **Database** | MongoDB |
| **Design** | Apple-style typography (San Francisco on iOS), black & white with a single blue accent |
 
### Design system
 
| Token | Value | Used for |
| :-- | :-- | :-- |
| ⬛ Ink | `#000000` | Text, logo, tab bar, primary buttons |
| ⬜ White | `#FFFFFF` | Backgrounds |
| 🩶 Group | `#F5F5F7` | Cards, search bar, inputs |
| 🟦 Blue | `#0A84FF` | Accent: badges, *Ship order*, active states |
 
Typography follows Apple's scale: large titles at 34 pt, headlines at 17 pt semibold, tight letter spacing.
 
---
 
## ✦ Getting started
 
**Requirements:** Node.js 18+, a MongoDB connection string, and Expo Go on your phone (or an emulator).
 
```bash
# 1. Clone
git clone https://github.com/abdeldjabbar01/WAMD-TP-s.git
cd WAMD-TP-s/04-parfumi-mobile
 
# 2. Configure the backend
cp backend/.env.example backend/.env
#    then edit backend/.env → set MONGO_URI and JWT_SECRET
 
# 3. Run everything with one command
npm start
```
 
`npm start` installs the dependencies on the first run, starts the API on port **5000**, then starts Expo and prints a **QR code**.
Scan it with Expo Go (phone and computer on the same Wi-Fi). The app finds the backend automatically.
 
```bash
npm run seed     # insert the sample perfumes (first run with an empty database)
```
 
<details>
<summary><b>Environment variables</b></summary>
| File | Variable | Description |
| :-- | :-- | :-- |
| `backend/.env` | `PORT` | API port (default `5000`) |
| `backend/.env` | `MONGO_URI` | MongoDB connection string |
| `backend/.env` | `JWT_SECRET` | Long random secret used to sign tokens |
| `mobile/.env` | `EXPO_PUBLIC_API_URL` | Optional — force the API address, e.g. `http://192.168.1.20:5000/api` |
 
</details>
<details>
<summary><b>Creating an admin account</b></summary>
Registration always creates a **customer**. To make someone an admin, register normally, then set
`role: "admin"` on that user in the `users` collection of MongoDB and sign in again.
 
</details>
---
 
## ✦ API reference
 
Base URL: `http://<host>:5000/api` — 🔒 means a Bearer token is required, 👑 means admin only.
 
| Method | Endpoint | Access | Description |
| :-- | :-- | :-: | :-- |
| `POST` | `/auth/register` | | Create a customer account |
| `POST` | `/auth/login` | | Sign in, returns token and user |
| `GET` | `/products` | | List perfumes |
| `GET` | `/products/:id` | | One perfume |
| `POST` `PUT` `DELETE` | `/products` · `/products/:id` | 🔒 👑 | Add, edit, delete a perfume |
| `POST` | `/orders` | 🔒 | Place an order (prices and stock checked server-side) |
| `GET` | `/orders/mine` | 🔒 | My orders |
| `GET` | `/orders` | 🔒 👑 | All orders with customer info |
| `PATCH` | `/orders/:id/ship` | 🔒 👑 | Confirm and ship an order |
| `GET` | `/users` | 🔒 👑 | Customers: id, email, picture, orders count |
 
## ✦ Project layout
 
```text
04-parfumi-mobile/
├── backend/
│   ├── models/        User · Product · Order
│   ├── routes/        authRoutes · orderRoutes · userRoutes
│   ├── middleware/    JWT protect · admin guard
│   └── server.js
├── mobile/
│   ├── App.js         navigation (customer vs admin tabs)
│   └── src/
│       ├── components/  AppHeader · TabBar · MenuSheet · ProductRow · OrderCard · Segmented …
│       ├── screens/     Home · Cart · Account · AdminHome · Orders · Customers · …
│       ├── context/     Auth · Search
│       ├── store/       Redux cart (persisted)
│       └── theme.js     colors & Apple-style type scale
└── start.js           one-command launcher
```
 
## ✦ Roadmap
 
- [ ] Upload a real profile picture
- [ ] Order history details and cancellation
- [ ] Push notification when an order is shipped
- [ ] Favorites / wishlist
## ✦ Author
 
**abdeldjabbar01** — [github.com/abdeldjabbar01](https://github.com/abdeldjabbar01)
 
<div align="center">
<sub>Built for the WAMD module · ENSTA</sub>
</div>
 