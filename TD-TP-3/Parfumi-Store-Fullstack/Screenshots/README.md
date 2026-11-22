# Screenshot Index

All 30 screenshots from the uploaded project archive are included. Copies containing passwords, JWTs, or the account email were redacted for safer submission. Original screenshots with exposed test credentials are not included in this package.


## 01-Storefront

- `01-storefront-catalog-overview.png` - Initial storefront view with the perfume catalogue and shopping cart.
- `02-storefront-catalog-products.png` - A second catalogue view showing additional products.
- `03-shopping-cart.png` - Shopping cart view with selected products.
- `04-guest-account-sidebar.png` - Account/sidebar layout before sign-in.
- `05-local-sign-in-modal.png` - Local account sign-in interface.
- `06-storefront-browser-run.png` - Storefront running in the browser during development.

## 02-MongoDB-Atlas

- `07-mongodb-products-data-view.png` - MongoDB Atlas data view.
- `08-mongodb-user-data-view.png` - MongoDB Atlas collection/data view.
- `09-mongodb-atlas-cluster-overview.png` - MongoDB Atlas cluster overview.
- `10-mongodb-network-access-list.png` - MongoDB Atlas network access configuration.
- `11-mongodb-database-users.png` - MongoDB Atlas database users configuration.
- `21-mongodb-users-admin-role.png` - MongoDB users collection showing role values, including administrator role.

## 03-Authentication-and-Public-API

- `12-postman-register-success-201.png` - Registration request returned 201 Created. Password and JWT redacted in this copy.
- `13-postman-duplicate-register-409.png` - Duplicate registration returned 409 Conflict. Password redacted in this copy.
- `14-postman-login-success-200.png` - Login request returned 200 OK. Password and JWT redacted in this copy.
- `15-postman-invalid-login-401.png` - Invalid login credentials returned 401 Unauthorized. Password redacted in this copy.
- `16-postman-get-products-200.png` - Public product-list request returned 200 OK.
- `17-postman-get-product-by-id-200.png` - Public single-product request returned 200 OK.

## 04-Admin-Storefront-and-CRUD

- `18-admin-storefront-product-catalog.png` - Signed-in administrator view with product cards and management actions. Email redacted in this copy.
- `19-admin-add-product-form.png` - Administrator product creation form. Email redacted in this copy.
- `20-postman-create-product-201.png` - Postman product creation request returned 201 Created.
- `22-postman-create-product-201.png` - Product creation request returned 201 Created. Bearer token is masked in the captured interface.
- `23-postman-update-product.png` - Postman product update/API request evidence.
- `24-postman-delete-product-200.png` - Product deletion request returned 200 OK. Bearer token is masked in the captured interface.

## 05-API-Security-and-Validation

- `25-postman-protected-route-no-token.png` - Protected-route test without a token.
- `26-postman-invalid-token.png` - Protected-route test with an invalid token.
- `27-postman-invalid-product-id.png` - Invalid product identifier validation test.
- `28-postman-invalid-product-data.png` - Product input validation test.
- `29-postman-login-invalid-credentials.png` - Login request with incorrect credentials; this screenshot does not establish the login rate-limit result.

## 06-Rate-Limiting

- `30-postman-general-rate-limit-101-requests.png` - General API rate-limit run: 101 iterations; the final request returned 429 Too Many Requests.