import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import KitchenOrders from "./KitchenOrders";

export const metadata = {
  title: "Kitchen Dashboard | Addis Eats",
  description: "View and manage incoming Addis Eats orders.",
  alternates: {
    canonical: "/kitchen",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function KitchenPage() {
  const session = await getSession();

  if (!session) {
    redirect("/signin?next=/kitchen");
  }

  if (session.user?.role !== "staff") {
    return (
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-3xl font-bold">Kitchen</h1>

        <p className="mt-4 text-red-700">
          You are not allowed to access the kitchen.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-orange-700">
          Addis Eats
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Kitchen Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome, {session.user.name}. Manage incoming orders and update
          their preparation status.
        </p>
      </header>

      <KitchenOrders />
    </main>
  );
}