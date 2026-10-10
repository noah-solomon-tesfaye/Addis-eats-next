import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";

export const metadata = {
  title: "Kitchen Dashboard",
  description:
    "The Addis Eats kitchen dashboard for authorized staff.",
  alternates: {
    canonical: "/kitchen",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function KitchenPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/kitchen");
  }

  if (session.user?.role !== "staff") {
    return (
      <main className="mx-auto max-w-2xl py-12">
        <h1 className="text-3xl font-bold">Kitchen</h1>

        <p className="mt-4 text-red-600">
          You are not allowed to access the kitchen.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl py-12">
      <h1 className="text-3xl font-bold">Kitchen</h1>

      <p className="mt-4 text-gray-600">
        Staff kitchen dashboard.
      </p>
    </main>
  );
}