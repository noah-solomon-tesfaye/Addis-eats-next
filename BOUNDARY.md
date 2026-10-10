# Addis Eats — Server & Client Boundary

## Server Components

### `app/layout.js`

Runs on the server.

The root layout does not need state, event handlers, or browser APIs. It remains a server component and passes page content into `Providers`.

### `app/menu/page.js`

Runs on the server.

The menu page is an async server component. Server components can await data directly.

### `app/menu/layout.js`

Runs on the server.

The menu layout contains structural markup and does not need client-side interactivity.

### `app/menu/loading.js`

Runs on the server.

It provides the loading UI for the menu route segment.

### `app/cart/page.js`

Runs on the server.

The page currently contains no client-side interactivity.

### `app/checkout/page.js`

Runs on the server.

The page currently contains no client-side interactivity.

### `app/menu/[id]/page.js`

Runs on the server.

The dynamic dish page does not require client-side state or event handlers.

### `app/page.js`

Runs on the server.

The homepage does not require client-side interactivity.

### `app/not-found.js`

Runs on the server.

The not-found UI does not require client-side interactivity.

## Client Components

### `app/providers.jsx`

Runs on the client.

It is a client entry point that accepts `children`. This allows server-rendered content to be passed through without importing the server components into the client component.

### `app/menu/CategoryBar.jsx`

Runs on the client.

It uses `useState` and an `onClick` handler to remember and change the selected category.

### `app/menu/FilterShell.jsx`

Runs on the client.

It is a client shell that receives server-rendered content through `children`.

### `app/menu/error.js`

Runs on the client.

`error.js` requires a client boundary.

## Boundary Rule

Server components are the default.

The `"use client"` directive is placed at interactive entry points rather than high in the component tree.

The project currently has four `"use client"` entry points:

- `Providers`
- `CategoryBar`
- `FilterShell`
- `error.js`

## Bundle Measurement

The Day 38 exercise asks for the First Load JS before and after the boundary changes.

The installed Next.js 16.3.8 build output used for this project does not display a First Load JS table, so no bundle-size number is recorded here rather than inventing a measurement.