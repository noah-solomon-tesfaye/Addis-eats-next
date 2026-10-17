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
    <main className="min-h-screen px-4 py-8 text-[#292b22] sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#9b7440]">
            Addis Eats · Administration
          </p>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Admin Dashboard
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#73766b] sm:text-base">
            Monitor orders and revenue through clear charts,
            useful summaries, and accessible order tables.
          </p>
        </header>

        <DashboardSummary />

        <section className="mt-8">
          <RevenueByNeighbourhood />
        </section>

        <section className="mt-8">
          <DashboardCharts />
        </section>

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