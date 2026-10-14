"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "../providers";

function formatPrice(amount) {
  return `${amount.toLocaleString("en-ET")} ETB`;
}

export default function CheckoutForm({ customerName = "" }) {
  const router = useRouter();
  const { cart, cartTotal, clearCart } = useCart();

  const [name, setName] = useState(customerName);
  const [phone, setPhone] = useState("");
  const [neighbourhood, setNeighbourhood] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (cart.length === 0) {
      setError("Your cart is empty. Please add dishes before checking out.");
      return;
    }

    if (neighbourhood.trim().length < 2) {
      setError("Please enter your delivery neighbourhood.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          neighbourhood: neighbourhood.trim(),
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "We couldn't place your order.");
        return;
      }

      if (!result.order?.id) {
        setError("Your order was created, but its confirmation was incomplete.");
        return;
      }

      clearCart();
      router.push(`/orders/${encodeURIComponent(result.order.id)}`);
      router.refresh();
    } catch {
      setError("Unable to reach the server. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-[#e9e2d7] bg-white p-5 shadow-sm sm:p-7"
      >
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-[#29443a]"
          >
            Full name
          </label>

          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            minLength={2}
            maxLength={100}
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-[#e9e2d7] px-4 py-3 outline-none transition focus:border-[#a86f2b] focus:ring-2 focus:ring-[#a86f2b]/20"
            placeholder="Your name"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-[#29443a]"
          >
            Phone number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            minLength={7}
            maxLength={20}
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-[#e9e2d7] px-4 py-3 outline-none transition focus:border-[#a86f2b] focus:ring-2 focus:ring-[#a86f2b]/20"
            placeholder="Your phone number"
          />
        </div>

        <div>
          <label
            htmlFor="neighbourhood"
            className="mb-2 block text-sm font-semibold text-[#29443a]"
          >
            Delivery neighbourhood
          </label>

          <input
            id="neighbourhood"
            name="neighbourhood"
            type="text"
            autoComplete="address-level3"
            minLength={2}
            maxLength={100}
            required
            value={neighbourhood}
            onChange={(event) => setNeighbourhood(event.target.value)}
            className="min-h-12 w-full rounded-xl border border-[#e9e2d7] px-4 py-3 outline-none transition focus:border-[#a86f2b] focus:ring-2 focus:ring-[#a86f2b]/20"
            placeholder="Enter your neighbourhood"
            aria-describedby="neighbourhood-help"
          />

          <p
            id="neighbourhood-help"
            className="mt-2 text-xs leading-5 text-[#73766f]"
          >
            Enter the neighbourhood where your order should be delivered.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || cart.length === 0}
          className="inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#29443a] px-5 py-3 font-semibold text-white transition hover:bg-[#20372e] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
        >
          {submitting ? "Placing your order…" : "Place order"}
        </button>

        <p className="text-center text-xs leading-5 text-[#73766f]">
          Your order total is calculated using the current menu prices.
        </p>
      </form>

      <section
        aria-labelledby="checkout-summary"
        className="rounded-2xl border border-[#e9e2d7] bg-white p-5 shadow-sm sm:p-7"
      >
        <h2
          id="checkout-summary"
          className="text-lg font-bold text-[#29443a]"
        >
          Order summary
        </h2>

        {cart.length === 0 ? (
          <div className="py-5">
            <p className="text-sm text-[#73766f]">
              Your cart is empty.
            </p>

            <Link
              href="/menu"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#a86f2b] px-5 py-3 font-semibold text-white hover:bg-[#8e5b22]"
            >
              Browse menu
            </Link>
          </div>
        ) : (
          <>
            <ul className="mt-4 divide-y divide-[#e9e2d7]">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="flex items-start justify-between gap-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-[#242923]">
                      {item.name}
                    </p>

                    <p className="mt-1 text-sm text-[#73766f]">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-[#29443a]">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-[#e9e2d7] pt-4">
              <span className="font-semibold text-[#29443a]">
                Total
              </span>

              <span className="text-xl font-bold text-[#29443a]">
                {formatPrice(cartTotal)}
              </span>
            </div>

            <Link
              href="/cart"
              className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-[#29443a] px-5 py-3 text-sm font-semibold text-[#29443a] transition hover:bg-[#29443a] hover:text-white"
            >
              Edit cart
            </Link>
          </>
        )}
      </section>
    </div>
  );
}