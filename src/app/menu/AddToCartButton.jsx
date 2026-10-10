"use client";

import { useState } from "react";
import { useCart } from "../providers";

export default function AddToCartButton({ dish }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart(dish);
    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1000);
  }

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      className="w-full rounded-lg bg-black px-4 py-3 font-semibold text-white hover:bg-gray-800"
    >
      {added ? "Added to Cart ✓" : "Add to Cart"}
    </button>
  );
}