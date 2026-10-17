import Image from "next/image";
import Link from "next/link";
import { getDishes } from "@/lib/dishes";

export const metadata = {
  title: "Addis Eats | Authentic Ethiopian Food",
  description:
    "Discover authentic Ethiopian dishes, explore the menu, and order your favorite meals across Addis Ababa.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Addis Eats | Authentic Ethiopian Food",
    description:
      "Discover traditional Ethiopian cuisine and order your favorite dishes across Addis Ababa.",
    url: "/",
    type: "website",
  },
};

const features = [
  {
    icon: "✳",
    title: "Fresh Ingredients",
    description: "Quality ingredients, thoughtfully selected.",
  },
  {
    icon: "★",
    title: "Authentic Taste",
    description: "Traditional recipes prepared with care.",
  },
  {
    icon: "↗",
    title: "Easy Ordering",
    description: "Find your favorites and order with ease.",
  },
  {
    icon: "♥",
    title: "Made with Love",
    description: "Delicious food made for sharing.",
  },
];

export default async function Home() {
  const allDishes = await getDishes();

  const featuredIds = ["doro-wat", "tibs", "kitfo", "misir-wot"];

  const featuredDishes = featuredIds
    .map((id) => allDishes.find((dish) => dish.id === id))
    .filter(Boolean);

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#f1eade]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf8f3] via-[#f4ede1] to-[#e8dece]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 sm:px-10 sm:py-20 lg:grid-cols-2 lg:px-12 lg:py-24">
          <div className="max-w-xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a07137] sm:text-sm">
              A taste of Ethiopian tradition
            </p>

            <h1 className="mt-5 text-5xl font-bold leading-[1.08] tracking-tight text-[#29443a] sm:text-6xl lg:text-7xl">
              Discover the
              <br />
              <span className="text-[#a86f2b]">taste of home.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-7 text-[#65675f] sm:text-lg sm:leading-8">
              From comforting traditional stews to beloved Ethiopian
              specialties, discover delicious food prepared with care and
              served with warmth.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/menu"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#29443a] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#1d332a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
              >
                Explore the Menu <span className="ml-2">→</span>
              </Link>

              <Link
                href="/menu"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#c8bba8] bg-white/60 px-7 py-3 text-sm font-semibold text-[#29443a] transition hover:bg-white"
              >
                Discover Our Dishes
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#65675f]">
              <span>✓ Ethiopian favorites</span>
              <span>✓ Clear pricing in ETB</span>
              <span>✓ Easy ordering</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-[#d9c8ad]/40 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/80 bg-white/70 p-3 shadow-xl shadow-[#51412b]/10">
              <Image
                src="/images/doro.jpg"
                alt="Doro Wat, a traditional Ethiopian chicken stew"
                width={872}
                height={720}
                priority
                fetchPriority="high"
                sizes="(max-width: 1023px) calc(100vw - 48px), 42vw"
                className="h-[280px] w-full rounded-[1.5rem] object-cover sm:h-[360px]"
              />

              <div className="flex items-center justify-between gap-4 px-3 py-4 sm:px-5">
                <div>
                  <p className="text-lg font-bold text-[#29443a]">
                    Made for sharing
                  </p>
                  <p className="mt-1 text-sm text-[#777970]">
                    Celebrate the flavors of Ethiopia.
                  </p>
                </div>

                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e8eee8] text-xl text-[#365c49]"
                  aria-hidden="true"
                >
                  ✳
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service highlights */}
      <section
        aria-label="Why choose Addis Eats"
        className="border-y border-[#e9e2d7] bg-[#fffdf9]"
      >
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 sm:grid-cols-2 sm:px-10 lg:grid-cols-4 lg:px-12 lg:py-10">
          {features.map((feature, index) => (
            <div key={feature.title} className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${
                  index % 2 === 0
                    ? "bg-[#e8eee8] text-[#365c49]"
                    : "bg-[#f4eadb] text-[#a86f2b]"
                }`}
                aria-hidden="true"
              >
                {feature.icon}
              </div>

              <div>
                <h2 className="font-semibold text-[#29332c]">
                  {feature.title}
                </h2>
                <p className="mt-1 max-w-[220px] text-sm leading-6 text-[#777970]">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured dishes */}
      <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10 sm:py-20 lg:px-12">
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#a86f2b]">
              Selected for you
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#29443a] sm:text-4xl">
              Featured Dishes
            </h2>

            <p className="mt-4 text-base leading-7 text-[#777970] sm:text-lg">
              Explore the dishes our menu has to offer, from traditional
              favorites to comforting everyday meals.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex w-fit items-center font-semibold text-[#365c49] transition hover:text-[#a86f2b]"
          >
            View Full Menu <span className="ml-2">→</span>
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredDishes.map((dish, index) => (
            <article
              key={dish.id}
              className="group overflow-hidden rounded-2xl border border-[#eee7dc] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#5c4b32]/10"
            >
              <Link
                href="/menu"
                className="block"
                aria-label={`Explore ${dish.name} on the menu`}
              >
                <div className="relative h-52 overflow-hidden bg-[#eee7dc]">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    width={600}
                    height={400}
                    sizes="(max-width: 639px) calc(100vw - 48px), (max-width: 1023px) calc(50vw - 48px), 25vw"
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <span className="absolute left-3 top-3 rounded-full bg-[#fffdf9]/95 px-3 py-1.5 text-xs font-medium text-[#526052]">
                    {dish.isFasting
                      ? "Fasting friendly"
                      : "Traditional favorite"}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-[#29332c]">
                      {dish.name}
                    </h3>

                    {dish.discountPer > 0 && (
                      <span className="shrink-0 rounded-full bg-[#f4eadb] px-2 py-1 text-xs font-semibold text-[#946326]">
                        {dish.discountPer}% off
                      </span>
                    )}
                  </div>

                  <p className="mt-2 min-h-[72px] text-sm leading-6 text-[#777970]">
                    {dish.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#eee7dc] pt-4">
                    <p className="text-lg font-bold text-[#9a6428]">
                      {dish.price.toLocaleString("en-US")} ETB
                    </p>

                    <span className="text-sm font-semibold text-[#365c49] transition group-hover:text-[#a86f2b]">
                      View dish →
                    </span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center justify-center rounded-full border border-[#cfc3b0] px-7 py-3 font-semibold text-[#29443a] transition hover:border-[#a86f2b] hover:bg-[#f3ede3]"
          >
            Explore All Dishes <span className="ml-2">→</span>
          </Link>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="px-6 pb-16 sm:px-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-[#29443a] px-7 py-10 sm:px-10 lg:flex-row lg:items-center lg:px-14 lg:py-12">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#d9c39d]">
              Your next favorite meal awaits
            </p>

            <h2 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
              Bring the taste of Ethiopia to your table.
            </h2>

            <p className="mt-3 leading-7 text-white/75">
              Browse the menu and discover something delicious to enjoy today.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#f6f0e5] px-7 py-3.5 font-semibold text-[#29443a] transition hover:bg-white"
          >
            Browse the Menu <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}