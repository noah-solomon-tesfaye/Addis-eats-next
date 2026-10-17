"use client";

import { useCart } from "../providers";

export default function AddToCartButton({ dish }) {
  const { addToCart } = useCart();

  const isUnavailable = dish.available === false;

  function handleAddToCart() {
    if (isUnavailable) {
      return;
    }

    if (typeof addToCart !== "function") {
      console.error("The cart provider does not expose addToCart.");
      return;
    }

    addToCart(dish);
  }

  if (isUnavailable) {
    return (
      <div className="space-y-2">
        <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
          Currently unavailable
        </span>

        <button
          type="button"
          disabled
          aria-disabled="true"
          className="flex min-h-11 w-full cursor-not-allowed items-center justify-center rounded-xl bg-gray-200 px-4 py-3 text-sm font-semibold text-gray-500"
        >
          Unavailable
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="flex min-h-11 w-full items-center justify-center rounded-xl bg-[#29443a] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#20372e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
    >
      Add to Cart
    </button>
  );
}