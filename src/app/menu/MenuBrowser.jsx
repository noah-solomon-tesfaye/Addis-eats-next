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

  // Debounce search input.
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

  const dishes = data?.dishes ?? initialDishes;
  const totalPages =
    data?.totalPages ?? Math.max(1, Math.ceil(initialDishes.length / 6));
  const totalDishes = data?.total ?? initialDishes.length;

  const selectedCategory =
    categories.find((item) => item.value === category)?.label ??
    "All Dishes";

  const unavailableCount = dishes.filter(
    (dish) => dish.available === false
  ).length;

  return (
    <div className="w-full min-w-0 text-[var(--foreground)]">
      {/* Mobile category filters */}
      <div className="mb-5 lg:hidden">
        <CategoryBar
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
          mobile
        />
      </div>

      {/* Search */}
      <section className="mb-6 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm sm:p-6">
        <label
          htmlFor="menu-live-search"
          className="mb-2 block text-sm font-semibold text-[var(--secondary)]"
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
          className="min-h-12 w-full min-w-0 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
        />

        {term && (
          <button
            type="button"
            onClick={() => handleSearchChange("")}
            className="mt-2 text-xs font-semibold text-[var(--secondary)] hover:text-[var(--primary)]"
          >
            Clear search
          </button>
        )}
      </section>

      {/* Results heading */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-bold text-[var(--secondary)]">
          {selectedCategory}
        </h2>

        <p className="text-sm text-[var(--muted)]" aria-live="polite">
          {totalDishes} {totalDishes === 1 ? "dish" : "dishes"} found
        </p>
      </div>

      {unavailableCount > 0 && (
        <p className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-700 dark:bg-amber-950 dark:text-amber-200">
          Some dishes are currently unavailable. They cannot be added to your
          cart.
        </p>
      )}

      {/* Loading state */}
      {isLoading && (
        <p
          className="py-3 text-center text-sm text-[var(--muted)]"
          role="status"
        >
          Updating dishes...
        </p>
      )}

      {/* Error state */}
      {error && (
        <div
          className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
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
            {dishes.map((dish, index) => {
              const isUnavailable = dish.available === false;

              return (
                <article
                  key={dish.id}
                  className={`group min-w-0 overflow-hidden rounded-2xl border bg-[var(--surface)] shadow-sm transition duration-300 ${
                    isUnavailable
                      ? "border-red-300 dark:border-red-900"
                      : "border-[var(--border)] hover:shadow-lg hover:shadow-black/10 sm:hover:-translate-y-1"
                  }`}
                >
                  {/* Dish image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--surface-secondary)]">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      width={600}
                      height={400}
                      sizes="(max-width: 419px) calc(100vw - 32px), (max-width: 639px) 50vw, (max-width: 1023px) 50vw, (max-width: 1279px) 40vw, 33vw"
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      className={`h-full w-full object-cover transition duration-500 ${
                        isUnavailable ? "opacity-60" : "group-hover:scale-105"
                      }`}
                    />

                    {isUnavailable && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                        <span className="rounded-full bg-[var(--surface)] px-4 py-2 text-sm font-bold text-red-700 shadow dark:text-red-300">
                          Currently unavailable
                        </span>
                      </div>
                    )}

                    {!isUnavailable && dish.discountPer > 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-[var(--surface)]/95 px-2.5 py-1 text-xs font-bold text-[var(--primary)] shadow-sm sm:left-3 sm:top-3">
                        {dish.discountPer}% off
                      </span>
                    )}

                    {dish.isFasting && (
                      <span className="absolute bottom-2 left-2 rounded-full bg-[var(--surface)]/95 px-2.5 py-1 text-xs font-semibold text-[var(--secondary)] sm:bottom-3 sm:left-3">
                        Fasting friendly
                      </span>
                    )}
                  </div>

                  {/* Dish details */}
                  <div className="p-3 sm:p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="min-w-0 break-words text-base font-bold text-[var(--foreground)] sm:text-lg">
                        {dish.name}
                      </h3>

                      <span className="max-w-[48%] shrink-0 rounded-lg bg-[var(--surface-secondary)] px-2 py-1 text-[10px] leading-4 text-[var(--muted)] sm:text-xs">
                        {dish.spiceLevel}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-3 min-h-[60px] text-xs leading-5 text-[var(--muted)] sm:mt-3 sm:min-h-[72px] sm:text-sm sm:leading-6">
                      {dish.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3 sm:mt-4 sm:pt-4">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[var(--secondary)] sm:text-base">
                          {Number(dish.price).toLocaleString("en-US")} ETB
                        </p>

                        {!isUnavailable && dish.discountPer > 0 && (
                          <p className="mt-1 text-[10px] leading-4 text-[var(--primary)] sm:text-xs">
                            {dish.discountPer}% discount available
                          </p>
                        )}
                      </div>

                      <Link
                        href={`/menu/${dish.id}`}
                        className="inline-flex min-h-10 items-center rounded-lg text-xs font-semibold text-[var(--secondary)] transition hover:text-[var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] sm:text-sm"
                      >
                        View details →
                      </Link>
                    </div>

                    <div className="mt-3 sm:mt-4">
                      <AddToCartButton dish={dish} />
                    </div>
                  </div>
                </article>
              );
            })}
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
                className="min-h-11 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span
                className="text-sm text-[var(--muted)]"
                aria-live="polite"
              >
                Page {page} of {totalPages}
              </span>

              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => {
                  setPage((current) => Math.min(totalPages, current + 1));
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="min-h-11 rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--foreground)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </nav>
          )}
        </>
      )}

      {/* Empty state */}
      {!error && !isLoading && dishes.length === 0 && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-12 text-center">
          <p className="text-lg font-semibold text-[var(--secondary)]">
            No dishes found
          </p>

          <p className="mt-2 text-sm text-[var(--muted)]">
            Try another search or category.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-4 min-h-11 rounded-full bg-[var(--secondary)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}