# Parfumi Store

**WAMD - React Application with Redux State Management**  
**Student:** Abdeldjabbar  
**Institution:** Higher National School of Advanced Technologies (ENSTA)  
**Semester:** First Semester, 2026

## Project description

Parfumi Store is a small perfume e-commerce frontend built with React. It presents a perfume catalogue, lets users search by product name, and provides a shopping cart managed with Redux Toolkit. The interface keeps the original Parfumi storefront layout.

This submission is **frontend-only**. Product data, the demo account session, and cart data are handled in the browser. No backend, database, real authentication service, or payment gateway is used.

## Technologies

- React and JSX
- JavaScript (ES6+)
- Redux Toolkit and React-Redux
- Vite
- CSS
- Node.js and npm

## Main React components

| Component / file | Responsibility |
|---|---|
| `App.jsx` | Main storefront layout and shared page interactions. |
| `Navbar.jsx` | Brand header and product search input. |
| `AccountSidebar.jsx` | Account area and local demo account actions. |
| `Products.jsx` | Product catalogue, name search, and local product management. |
| `ProductCard.jsx` | Displays a perfume and dispatches the add-to-cart action. |
| `Cart.jsx` | Displays cart items, quantity controls, subtotals, and total. |
| `ProductForm.jsx` | Form used to add or edit a local catalogue item. |
| `AuthModal.jsx` | Local demonstration sign-in and account-creation interface. |
| `AuthContext.jsx` | Keeps the local demo session available to the components. |

## Redux state management

The Redux store contains the cart state:

- `state.cart.items` - the products currently in the shopping cart, including their quantities.
- `addToCart(product)` - adds a product or increases its quantity.
- `decreaseQuantity(id)` - decreases a product quantity when it is greater than one.
- `removeFromCart(id)` - removes a product from the cart.

The cart is saved in the browser's `localStorage` under `parfumi_cart` and restored when the application is opened again.

## Implemented features

- Display a starter catalogue of four perfume products with images, prices, and categories.
- Search the catalogue by perfume name.
- Add products to the shopping cart.
- Increase and decrease quantities, remove items, and calculate item subtotals and the cart total.
- Persist the cart in browser `localStorage`.
- Persist catalogue changes in browser `localStorage`.
- Add, edit, and delete catalogue items in the local admin demonstration.
- Show a frontend-only checkout notice; no payment or order is processed.

## Run the application

**Requirements:** Node.js 20.19+ or 22.12+, and npm.

Open a terminal in this project folder and run:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

To create and preview a production build:

```bash
npm run build
npm run preview
```

To run the code checks:

```bash
npm run lint
```

## Local admin demonstration

Open the Sign in dialog and use:

- **Email:** `admin@parfumi.local`
- **Password:** any value with at least 6 characters

This only enables the local product-management interface for demonstration. It is not secure authentication or authorization and must not be used to protect real data.

## Scope and limitations

- There is no backend server, API, or database.
- Account registration and sign-in are local UI demonstrations. No password is sent to or stored on a server.
- Product and cart changes are saved only in the current browser's local storage. They do not sync between browsers or devices.
- The checkout button displays an informational message only. No payment or order is created.
- Clearing this site's browser storage resets the saved demo session, cart, and product catalogue to their starter state.

## Screenshots

Place screenshots of the **frontend-only version** in the `Screenshots/` folder at the root of this project (next to `src/`, `public/`, and this README). Suggested filenames:

1. `01-storefront.png` - the full storefront showing the header, catalogue, account sidebar, and cart.
2. `02-shopping-cart.png` - the cart with products, quantities, and total visible.
3. `03-product-search.png` - the catalogue after searching for a perfume.
4. `04-local-admin.png` - optional: the local product-management form or catalogue controls.

Capture these after running this frontend-only project. Avoid including personal email addresses or other private information in the screenshots.

The project report is available at `Documentation/Parfumi-Store-Report.pdf`.
