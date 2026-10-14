import Link from "next/link";
import { auth } from "../../../auth";
import { redirect } from "next/navigation";
import DashboardSummary from "./DashboardSummary";
import DashboardCharts from "./DashboardCharts";
import RevenueByNeighbourhood from "./RevenueByNeighbourhood";
import OrdersTable from "./OrdersTable";

export const metadata = {
  title: "Admin Dashboard | Addis Eats",
  description:
    "Manage Addis Eats analytics, revenue summaries, and order history.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin?next=/dashboard");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <main className="min-h-screen bg-[#faf8f3] px-4 py-10 text-[#292b22] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#9b7440]">
            Addis Eats · Administration
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Admin Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#73766b] sm:text-base">
                Monitor orders and revenue through clear charts,
                useful summaries, and accessible order tables.
              </p>
            </div>

            <Link
              href="/kitchen"
              className="inline-flex w-fit items-center justify-center rounded-xl border border-[#d9d8cb] bg-white px-5 py-3 text-sm font-semibold text-[#315b40] transition hover:border-[#315b40]"
            >
              Kitchen
            </Link>
          </div>
        </header>

        {/* Summary cards */}
        <DashboardSummary />

        {/* Revenue by neighbourhood */}
        <section className="mt-8">
          <RevenueByNeighbourhood />
        </section>

        {/* Daily orders chart */}
        <section className="mt-8">
          <DashboardCharts />
        </section>

        {/* Admin order history */}
        <section className="mt-8">
          <OrdersTable />
        </section>

        <footer className="mt-8 text-center text-xs leading-5 text-[#85877d]">
          Addis Eats · Administration
        </footer>
      </div>
    </main>
  );
}