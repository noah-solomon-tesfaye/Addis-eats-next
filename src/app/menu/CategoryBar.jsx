"use client";

import { useState } from "react";

export default function CategoryBar() {
  const [selected, setSelected] = useState("All");

  const categories = [
    "All",
    "ethiopian",
    "fasting",
    "hot-drinks",
    "juice-smoothie",
    "burger",
    "pizza",
    "pasta",
    "soft-drinks",
  ];

  const formatCategory = (category) => {
    if (category === "All") return "All Dishes";

    return category
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <aside className="w-full min-w-0">
      <div
        className="
          flex gap-2 overflow-x-auto overscroll-x-contain
          pb-3
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
          lg:flex-col lg:overflow-visible lg:pb-0
        "
        aria-label="Dish categories"
      >
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelected(category)}
            aria-pressed={selected === category}
            className={`min-h-10 shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b] lg:w-full lg:rounded-xl lg:text-left ${
              selected === category
                ? "border-[#29443a] bg-[#29443a] text-white"
                : "border-[#e9e2d7] bg-white text-[#29443a] hover:bg-[#f3ede3]"
            }`}
          >
            {formatCategory(category)}
          </button>
        ))}
      </div>
    </aside>
  );
}