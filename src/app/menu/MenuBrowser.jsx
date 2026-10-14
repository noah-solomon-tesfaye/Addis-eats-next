"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher";
import AddToCartButton from "./AddToCartButton";
import CategoryBar from "./CategoryBar";

const categories = [
  { value: "all", label: "All Dishes" },
  { value: "ethiopian", label: "Ethiopian" },
  { value: "fasting", label: "Fasting" },
  { value: "hot-drinks", label: "Hot Drinks" },
  { value: "juice-smoothie", label: "Juice & Smoothie" },
  { value: "burger", label: "Burger" },
  { value: "pizza", label: "Pizza" },
  { value: "pasta", label: "Pasta" },
  { value: "soft-drinks", label: "Soft Drinks" },
];

export default function MenuBrowser({
  initialDishes = [],
  category = "all",
  onCategoryChange,
}) {
  const [term, setTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [page, setPage] = useState(1);

  // Debounce search input to avoid requesting the API on every keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(term.trim());
    }, 300);

    return () => clearTimeout(timer);
  }, [term]);

  function handleCategoryChange(value) {
    onCategoryChange?.(value);
    setPage(1);
  }

  function handleSearchChange(value) {
    setTerm(value);
    setPage(1);
  }

  function clearFilters() {
    setTerm("");
    setDebouncedTerm("");
    onCategoryChange?.("all");
    setPage(1);
  }

  // Request dishes for every category, including All Dishes.
  const query = new URLSearchParams({
    category,
    page: String(page),
  });

  if (debouncedTerm) {
    query.set("q", debouncedTerm);
  }

  const { data, error, isLoading } = useSWR(
    `/api/dishes?${query.toString()}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  // Use API results when available; retain initial server-rendered dishes
  // as a fallback while data is loading.
  const dishes = data?.dishes ?? initialDishes;
  const totalPages =
    data?.totalPages ?? Math.ceil(initialDishes.length / 6);
  const totalDishes = data?.total ?? initialDishes.length;

  const selectedCategory =
    categories.find((item) => item.value === category)?.label ??
    "All Dishes";

  return (
    <div className="w-full min-w-0">
      {/* Mobile category filters */}
      <div className="mb-5 lg:hidden">
        <CategoryBar
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
          mobile
        />
      </div>

      {/* Search */}
      <section className="mb-6 rounded-2xl border border-[#e9e2d7] bg-white p-4 shadow-sm sm:p-6">
        <label
          htmlFor="menu-live-search"
          className="mb-2 block text-sm font-semibold text-[#29443a]"
        >
          Search dishes
        </label>

        <input
          id="menu-live-search"
          type="search"
          value={term}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder="Search by dish name or description..."
          autoComplete="off"
          className="min-h-12 w-full min-w-0 rounded-xl border border-[#e9e2d7] bg-[#faf8f3] px-4 py-3 text-sm text-[#242923] outline-none transition focus:border-[#a86f2b] focus:ring-2 focus:ring-[#a86f2b]/20"
        />

        {term && (
          <button
            type="button"
            onClick={() => handleSearchChange("")}
            className="mt-2 text-xs font-semibold text-[#365c49] hover:text-[#a86f2b]"
          >
            Clear search
          </button>
        )}
      </section>

      {/* Results heading */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-[#29443a]">
          {selectedCategory}
        </h2>

        <p className="text-sm text-[#777970]" aria-live="polite">
          {totalDishes} {totalDishes === 1 ? "dish" : "dishes"} found
        </p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <p className="py-3 text-center text-sm text-[#777970]" role="status">
          Updating dishes...
        </p>
      )}

      {/* Error state */}
      {error && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          role="alert"
        >
          Could not load dishes. Please try again.
        </div>
      )}

      {/* Dish cards */}
      {!error && dishes.length > 0 && (
        <>
          <div
            className={`grid min-w-0 grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-2 xl:grid-cols-3 ${
              isLoading ? "opacity-60" : ""
            }`}
            aria-busy={isLoading}
          >
            {dishes.map((dish, index) => (
              <article
                key={dish.id}
                className="group min-w-0 overflow-hidden rounded-2xl border border-[#e9e2d7] bg-white shadow-sm transition duration-300 hover:shadow-lg hover:shadow-[#51412b]/10 sm:hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-[#eee7dc]">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    width={600}
                    height={400}
                    sizes="(max-width: 419px) calc(100vw - 32px), (max-width: 639px) 50vw, (max-width: 1023px) 50vw, (max-width: 1279px) 40vw, 33vw"
                    loading={index === 0 ? "eager" : "lazy"}
                    fetchPriority={index === 0 ? "high" : "auto"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {dish.discountPer > 0 && (
                    <span className="absolute left-2 top-2 rounded-full bg-[#fffdf9]/95 px-2.5 py-1 text-xs font-bold text-[#946326] shadow-sm sm:left-3 sm:top-3">
                      {dish.discountPer}% off
                    </span>
                  )}

                  {dish.isFasting && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-[#e8eee8]/95 px-2.5 py-1 text-xs font-semibold text-[#365c49] sm:bottom-3 sm:left-3">
                      Fasting friendly
                    </span>
                  )}
                </div>

                <div className="p-3 sm:p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="min-w-0 break-words text-base font-bold text-[#29332c] sm:text-lg">
                      {dish.name}
                    </h3>

                    <span className="max-w-[48%] shrink-0 rounded-lg bg-[#f4f0e8] px-2 py-1 text-[10px] leading-4 text-[#65675f] sm:text-xs">
                      {dish.spiceLevel}
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-3 min-h-[60px] text-xs leading-5 text-[#777970] sm:mt-3 sm:min-h-[72px] sm:text-sm sm:leading-6">
                    {dish.description}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#eee7dc] pt-3 sm:mt-4 sm:pt-4">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#29443a] sm:text-base">
                        {dish.price.toLocaleString("en-US")} ETB
                      </p>

                      {dish.discountPer > 0 && (
                        <p className="mt-1 text-[10px] leading-4 text-[#946326] sm:text-xs">
                          {dish.discountPer}% discount available
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/menu/${dish.id}`}
                      className="inline-flex min-h-10 items-center rounded-lg text-xs font-semibold text-[#365c49] transition hover:text-[#a86f2b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b] sm:text-sm"
                    >
                      View details →
                    </Link>
                  </div>

                  <div className="mt-3 sm:mt-4">
                    <AddToCartButton dish={dish} />
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Dish pagination"
              className="mt-8 flex flex-wrap items-center justify-center gap-3"
            >
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => {
                  setPage((current) => Math.max(1, current - 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="min-h-11 rounded-full border border-[#e9e2d7] px-4 py-2 text-sm font-semibold text-[#29443a] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-sm text-[#777970]" aria-live="polite">
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => {
                  setPage((current) => Math.min(totalPages, current + 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="min-h-11 rounded-full border border-[#e9e2d7] px-4 py-2 text-sm font-semibold text-[#29443a] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}

      {/* Empty state */}
      {!error && !isLoading && dishes.length === 0 && (
        <div className="rounded-2xl border border-[#e9e2d7] bg-white px-4 py-12 text-center">
          <p className="text-lg font-semibold text-[#29443a]">
            No dishes found
          </p>

          <p className="mt-2 text-sm text-[#777970]">
            Try another search or category.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 min-h-11 rounded-full bg-[#29443a] px-5 py-2 text-sm font-semibold text-white hover:bg-[#1d332a]"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}