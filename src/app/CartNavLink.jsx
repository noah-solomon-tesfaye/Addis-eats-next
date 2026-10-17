"use client";

import Link from "next/link";
import { useCart } from "./providers";

export default function CartNavLink() {
  const { cartCount } = useCart();

  return (
    <Link
      href="/cart"
      aria-label={`Shopping cart, ${cartCount} ${
        cartCount === 1 ? "item" : "items"
      }`}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 font-medium text-[#29443a] transition hover:bg-[#f3ede3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
    >
      <span aria-hidden="true">🛒</span>
      <span>Cart</span>

      <span
        className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#a86f2b] px-1.5 py-0.5 text-xs font-bold text-white"
        aria-hidden="true"
      >
        {cartCount > 99 ? "99+" : cartCount}
      </span>
    </Link>
  );
}