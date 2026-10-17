"use client";

import { useState } from "react";
import CategoryBar from "./CategoryBar";
import MenuBrowser from "./MenuBrowser";

export default function MenuLayoutClient({ initialDishes = [] }) {
  const [category, setCategory] = useState("all");

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-5 overflow-x-clip px-4 py-5 sm:px-6 sm:py-8 lg:flex-row lg:gap-8 lg:px-12">
      {/* Desktop category sidebar */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <div className="sticky top-6 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm">
          <h2 className="mb-5 text-xl font-bold text-[var(--secondary)]">
            Categories
          </h2>

          <CategoryBar
            selectedCategory={category}
            onCategoryChange={setCategory}
          />
        </div>
      </aside>

      {/* Menu content */}
      <main className="w-full min-w-0 flex-1">
        <MenuBrowser
          initialDishes={initialDishes}
          category={category}
          onCategoryChange={setCategory}
        />
      </main>
    </div>
  );
}