"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "../providers";

export default function CartPage() {
  const {
    cart,
    cartCount,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useCart();

  return (
    <main className="min-h-screen bg-[#faf8f3] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        {/* Page heading */}
        <header className="mb-8 sm:mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#a86f2b]">
            Addis Eats
          </p>

          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#242923] sm:text-4xl">
                Your Cart
              </h1>

              <p className="mt-2 text-sm text-[#73766f] sm:text-base">
                Review your delicious choices before checkout.
              </p>
            </div>

            {cart.length > 0 && (
              <span className="rounded-full bg-[#29443a] px-4 py-2 text-sm font-semibold text-white">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
            )}
          </div>
        </header>

        {cart.length === 0 ? (
          /* Empty cart */
          <section className="rounded-2xl border border-[#e9e2d7] bg-white px-5 py-12 text-center shadow-sm sm:px-10 sm:py-16">
            <div
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f3ede3] text-3xl"
              aria-hidden="true"
            >
              🛒
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#242923] sm:text-2xl">
              Your cart is waiting for something delicious
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#73766f] sm:text-base">
              Explore our menu and discover your favorite Ethiopian dishes.
            </p>

            <Link
              href="/menu"
              className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#29443a] px-6 py-3 font-semibold text-white transition hover:bg-[#1f352d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
            >
              Explore the Menu
            </Link>
          </section>
        ) : (
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_320px] lg:gap-8">
            {/* Cart items */}
            <section
              aria-label="Items in your cart"
              className="min-w-0 space-y-4"
            >
              {cart.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#e9e2d7] bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
                >
                  <div className="flex gap-3 sm:gap-5">
                    {/* Dish image */}
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-[#f3ede3] sm:h-32 sm:w-32">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 96px, 128px"
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-2xl">
                          🍽️
                        </div>
                      )}
                    </div>

                    {/* Dish details */}
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h2 className="break-words text-base font-bold text-[#242923] sm:text-lg">
                            {item.name}
                          </h2>

                          <p className="mt-1 text-sm text-[#73766f]">
                            {item.price.toLocaleString()} ETB each
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          aria-label={`Remove ${item.name} from cart`}
                          className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg text-lg text-[#8b5145] transition hover:bg-[#f9eeeb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
                          title={`Remove ${item.name}`}
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </div>

                      <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-4">
                        {/* Quantity controls */}
                        <div
                          className="inline-flex items-center rounded-xl border border-[#e9e2d7]"
                          aria-label={`Quantity of ${item.name}`}
                        >
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            aria-label={`Decrease ${item.name} quantity`}
                            className="flex h-11 w-11 items-center justify-center rounded-l-xl text-xl font-medium text-[#29443a] transition hover:bg-[#f3ede3] focus-visible:outline-2 focus-visible:outline-[#a86f2b]"
                          >
                            −
                          </button>

                          <span
                            className="min-w-10 px-2 text-center text-sm font-semibold text-[#242923]"
                            aria-live="polite"
                          >
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.id)}
                            aria-label={`Increase ${item.name} quantity`}
                            className="flex h-11 w-11 items-center justify-center rounded-r-xl text-xl font-medium text-[#29443a] transition hover:bg-[#f3ede3] focus-visible:outline-2 focus-visible:outline-[#a86f2b]"
                          >
                            +
                          </button>
                        </div>

                        <p className="text-right text-base font-bold text-[#29443a] sm:text-lg">
                          {(item.price * item.quantity).toLocaleString()} ETB
                        </p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <Link
                href="/menu"
                className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[#29443a] transition hover:text-[#a86f2b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
              >
                <span aria-hidden="true">←</span>
                Continue shopping
              </Link>
            </section>

            {/* Order summary */}
            <aside className="rounded-2xl border border-[#e9e2d7] bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-xl font-bold text-[#242923]">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-[#73766f]">
                    Subtotal ({cartCount} {cartCount === 1 ? "item" : "items"})
                  </span>

                  <span className="font-semibold text-[#242923]">
                    {cartTotal.toLocaleString()} ETB
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 text-sm">
                  <span className="text-[#73766f]">Delivery fee</span>

                  <span className="text-right text-[#73766f]">
                    Calculated at checkout
                  </span>
                </div>

                <div className="border-t border-[#e9e2d7] pt-4">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-[#242923]">
                      Subtotal
                    </span>

                    <span className="text-xl font-bold text-[#29443a]">
                      {cartTotal.toLocaleString()} ETB
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 flex min-h-12 w-full items-center justify-center rounded-xl bg-[#29443a] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#1f352d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
              >
                Proceed to Checkout
                <span className="ml-2" aria-hidden="true">
                  →
                </span>
              </Link>

              <p className="mt-4 text-center text-xs leading-5 text-[#73766f]">
                Your order details will be reviewed before you place your order.
              </p>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}