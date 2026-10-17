import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDishes } from "@/lib/dishes";

export async function generateStaticParams() {
  const dishes = await getDishes();

  return dishes.map((dish) => ({
    id: dish.id,
  }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const dishes = await getDishes();
  const dish = dishes.find((item) => item.id === id);

  if (!dish) {
    return {
      title: "Dish Not Found",
      description: "The requested dish could not be found on Addis Eats.",
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  return {
    title: dish.name,
    description: dish.description,

    alternates: {
      canonical: `/menu/${dish.id}`,
    },

    openGraph: {
      title: `${dish.name} · Addis Eats`,
      description: dish.description,
      url: `/menu/${dish.id}`,
      type: "website",
      images: [
        {
          url: dish.image,
          alt: dish.name,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${dish.name} · Addis Eats`,
      description: dish.description,
      images: [dish.image],
    },
  };
}

export default async function DishPage({ params }) {
  const { id } = await params;
  const dishes = await getDishes();
  const dish = dishes.find((item) => item.id === id);

  if (!dish) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: dish.name,
    description: dish.description,
    image: new URL(
      dish.image,
      "https://addiseats.et"
    ).toString(),
    offers: {
      "@type": "Offer",
      price: dish.price,
      priceCurrency: "ETB",
    },
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Link
        href="/menu"
        className="mb-6 inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium"
      >
        ← Back to Menu
      </Link>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <Image
          src={dish.image}
          alt={dish.name}
          width={1200}
          height={800}
          sizes="(max-width: 768px) 100vw, 896px"
          className="h-80 w-full object-cover"
        />

        <div className="p-6">
          <h1 className="text-4xl font-bold">{dish.name}</h1>

          <p className="mt-4 text-gray-600">{dish.description}</p>

          <p className="mt-6 text-2xl font-bold">
            {dish.price} ETB
          </p>

          <p className="mt-2 text-gray-600">
            Spice level: {dish.spiceLevel}
          </p>

          <p className="mt-2 text-gray-600">
            Category: {dish.category}
          </p>

          <p className="mt-2 text-gray-600">
            Fasting: {dish.isFasting ? "Yes" : "No"}
          </p>

          <div className="mt-6">
            <h2 className="text-xl font-semibold">Ingredients</h2>

            <ul className="mt-3 list-disc space-y-1 pl-5 text-gray-600">
              {dish.ingredients.map((ingredient) => (
                <li key={ingredient}>{ingredient}</li>
              ))}
            </ul>
          </div>

          {dish.discountPer > 0 && (
            <p className="mt-6 font-semibold">
              Discount: {dish.discountPer}%
            </p>
          )}
        </div>
      </div>
    </main>
  );
}