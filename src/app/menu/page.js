import MenuLayoutClient from "./MenuLayoutClient";
import { getDishes } from "@/lib/dishes";

export const revalidate = 3600;

export const metadata = {
  title: "Menu | Addis Eats",
  description:
    "Explore the Addis Eats menu, discover authentic Ethiopian dishes, search your favorites, and order fresh meals online.",
  alternates: {
    canonical: "/menu",
  },
  openGraph: {
    title: "Our Menu | Addis Eats",
    description:
      "Discover authentic Ethiopian food and find your next favorite dish.",
    url: "/menu",
    siteName: "Addis Eats",
    type: "website",
  },
};

export default async function MenuPage() {
  const dishes = await getDishes();
  const initialDishes = dishes.slice(0, 6);

  return (
    <main className="min-h-screen bg-[#faf8f3]">
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-12 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-[#a86f2b]">
            Made with tradition
          </p>

          <h1 className="text-3xl font-extrabold tracking-tight text-[#29443a] sm:text-4xl md:text-5xl">
            Explore Our Menu
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#73766f] sm:text-base">
            Discover the rich flavors of Ethiopia, from traditional favorites
            to freshly prepared meals. Search for a dish, browse categories,
            and find something delicious.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 sm:pb-16 lg:px-8">
        <MenuLayoutClient initialDishes={initialDishes} />
      </section>
    </main>
  );
}