# Addis Eats Rendering Strategy

## `/`

Static rendering.

The homepage does not depend on request-specific data.

## `/menu`

Incremental Static Regeneration (ISR).

The menu uses:

`revalidate = 3600`

This allows the menu to be regenerated after one hour.

The menu data is read directly by the Server Component.

## `/menu/[id]`

Static Site Generation (SSG).

`generateStaticParams()` prebuilds the known dishes from the menu data.

The build generates all 22 known dish routes.

Examples:

- `/menu/doro-wat`
- `/menu/tibs`
- `/menu/kitfo`
- `/menu/shiro-wat`
- `/menu/misir-wot`

## `/cart`

Client-side rendering.

The cart represents user-specific state.

## `/checkout`

Dynamic rendering.

The route uses:

`dynamic = "force-dynamic"`

Checkout is treated as request-dependent.

## Streaming

`loading.js` provides a loading boundary for the menu segment.

`Suspense` provides a boundary inside the menu page.