import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import FilterShell from "./FilterShell";
import AddToCartButton from "./AddToCartButton";
import SearchBox from "./SearchBox";
import Pagination from "./Pagination";
import { getDishes } from "@/lib/dishes";

export const revalidate = 3600;

export const metadata = {
  title: "Menu | Addis Eats",
  description:
    "Explore Doro Wat, Tibs, Kitfo, Shiro, and other Ethiopian favorites at Addis Eats. Discover delicious dishes and order across Addis Ababa.",
  alternates: {
    canonical: "/menu",
  },
  openGraph: {
    title: "Menu | Addis Eats",
    description:
      "Discover Ethiopian favorites and delicious meals at Addis Eats.",
    url: "/menu",
    type: "website",
  },
};

export default async function MenuPage() {
  const dishes = await getDishes();

  return (
    <main className="min-h-screen bg-[#faf8f3]">
      {/* Menu introduction */}
      <section className="border-b border-[#e9e2d7] bg-[#f3ede3]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-12 lg:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#a07137] sm:tracking-[0.28em]">
            Made with care, served with warmth
          </p>

          <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-3xl font-bold tracking-tight text-[#29443a] sm:text-4xl lg:text-5xl">
                Explore Our Menu
              </h1>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#65675f] sm:mt-4 sm:text-base sm:leading-7 lg:text-lg">
                From traditional Ethiopian favorites to refreshing drinks,
                discover something delicious for every craving.
              </p>
            </div>

            <div className="flex w-fit items-center gap-3 rounded-2xl border border-[#e5dac9] bg-white/80 px-4 py-3 sm:px-5 sm:py-4">
              <span
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8eee8] text-xl text-[#365c49] sm:h-11 sm:w-11"
                aria-hidden="true"
              >
                ✳
              </span>

              <div>
                <p className="text-xl font-bold text-[#29443a] sm:text-2xl">
                  {dishes.length}
                </p>
                <p className="text-xs text-[#777970] sm:text-sm">
                  Dishes to explore
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-12">
        <div className="rounded-2xl border border-[#e9e2d7] bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#29443a]">
              Find your favorite
            </h2>

            <p className="mt-1 text-sm leading-5 text-[#777970]">
              Search our menu and explore the available dishes.
            </p>
          </div>

          <SearchBox />
        </div>
      </section>

      {/* Dish listing */}
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-12 lg:py-12">
        <FilterShell>
          <Suspense
            fallback={
              <p className="py-10 text-center text-[#777970]">
                Loading dishes...
              </p>
            }
          >
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
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
                      sizes="(max-width: 419px) 100vw, (max-width: 639px) 50vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 25vw"
                      priority={index === 0}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {dish.discountPer > 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-[#fffdf9]/95 px-2.5 py-1 text-xs font-bold text-[#946326] shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:py-1.5">
                        {dish.discountPer}% off
                      </span>
                    )}

                    {dish.isFasting && (
                      <span className="absolute bottom-2 left-2 rounded-full bg-[#e8eee8]/95 px-2.5 py-1 text-xs font-semibold text-[#365c49] sm:bottom-3 sm:left-3 sm:px-3 sm:py-1.5">
                        Fasting friendly
                      </span>
                    )}
                  </div>

                  <div className="p-3 sm:p-4 lg:p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="min-w-0 break-words text-base font-bold text-[#29332c] sm:text-lg lg:text-xl">
                        {dish.name}
                      </h2>

                      <span className="max-w-[48%] shrink-0 rounded-lg bg-[#f4f0e8] px-2 py-1 text-[10px] leading-4 text-[#65675f] sm:text-xs">
                        {dish.spiceLevel}
                      </span>
                    </div>

                    <p className="mt-2 line-clamp-3 min-h-[60px] text-xs leading-5 text-[#777970] sm:mt-3 sm:min-h-[72px] sm:text-sm sm:leading-6">
                      {dish.description}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#eee7dc] pt-3 sm:mt-4 sm:pt-4">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#29443a] sm:text-base lg:text-lg">
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
          </Suspense>
        </FilterShell>

        <div className="mt-7 sm:mt-10">
          <Pagination />
        </div>

        {/* Cart and checkout links */}
        <div className="mt-7 flex flex-col gap-4 rounded-2xl border border-[#e9e2d7] bg-white p-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-lg font-semibold text-[#29443a]">
              Ready to order?
            </h2>

            <p className="mt-1 text-sm leading-5 text-[#777970]">
              Review your selections or continue to checkout.
            </p>
          </div>

          <div className="flex flex-col gap-3 min-[380px]:flex-row">
            <Link
              href="/cart"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#cfc3b0] px-5 py-2.5 text-sm font-semibold text-[#29443a] transition hover:bg-[#f3ede3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
            >
              View Cart
            </Link>

            <Link
              href="/checkout"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#29443a] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1d332a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
            >
              Go to Checkout →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}