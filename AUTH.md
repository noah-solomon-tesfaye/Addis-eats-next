# Addis Eats — Authentication

## Authentication Library

This project uses Auth.js with the Credentials provider.

A local test account is used to demonstrate the sign-in flow.
The account is stored in memory for this learning project and is
not intended for production use.

## Local Test Account

- Phone: 0911000000
- Password: AddisEats123!
- Role: customer

## Session Handling

The shared session helper is located at:

`src/lib/session.js`

It exports `getSession()`, which uses Auth.js to retrieve the
current session.

The Auth.js configuration is located in the project root:

`auth.js`

The authentication route is:

`src/app/api/auth/[...nextauth]/route.js`

## Route Protection

The proxy is located at:

`src/proxy.js`

Protected routes:

- `/checkout`
- `/orders/:path*`

Unauthenticated users are redirected to `/signin`, with a `next`
query parameter indicating the requested path.

## Order Ownership

Order access is checked on the server.

The application compares the authenticated user's ID with the
owner ID associated with the requested order.

The order API also checks the session and order ownership before
returning order information.

## Staff Access

The `/kitchen` page checks the authenticated user's role on the
server.

Users without the `staff` role are denied access to the kitchen
dashboard.

The local test account has the `customer` role.

## Security Notes

- The local account is hardcoded for demonstration purposes.
- Password comparison uses bcryptjs.
- The account data and order ownership data are stored in memory.
- This setup is not a production-ready user database.
- Never commit real secrets to source control.
- Configure `AUTH_SECRET` privately in `.env.local`.