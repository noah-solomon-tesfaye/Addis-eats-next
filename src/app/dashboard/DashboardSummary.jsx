"use client";

import useSWR from "swr";
import { etb } from "../../lib/format";

const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load dashboard analytics.");
  }

  return response.json();
};

export default function DashboardSummary() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/analytics",
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  const cards = [
    {
      label: "Total Orders",
      value: data
        ? data.summary.totalOrders.toLocaleString("en-ET")
        : "—",
      description: "Recorded orders",
    },
    {
      label: "Total Revenue",
      value: data
        ? etb.format(data.summary.totalRevenue)
        : "—",
      description: "Revenue from recorded orders",
    },
    {
      label: "Average Order",
      value: data
        ? etb.format(data.summary.averageOrderValue)
        : "—",
      description: "Average recorded order value",
    },
  ];

  return (
    <section aria-label="Order summary">
      {isLoading && (
        <p
          className="mb-4 text-sm text-[#73766b]"
          role="status"
        >
          Loading dashboard statistics...
        </p>
      )}

      {error && (
        <div
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          role="alert"
        >
          <p>We could not load the dashboard statistics.</p>

          <button
            type="button"
            onClick={() => mutate()}
            className="mt-2 rounded-lg border border-red-300 px-3 py-2 font-semibold hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.label}
            className="rounded-2xl border border-[#e8e4d9] bg-white p-6 shadow-sm"
          >
            <p className="text-sm font-medium text-[#73766b]">
              {card.label}
            </p>

            <p className="mt-4 text-2xl font-bold text-[#315b40] sm:text-3xl">
              {isLoading && !data ? "Loading..." : card.value}
            </p>

            <p className="mt-2 text-xs text-[#85877d]">
              {card.description}
            </p>
          </article>
        ))}
      </div>

      {data && data.summary.totalOrders === 0 && (
        <p className="mt-4 rounded-xl bg-[#edf2e9] p-4 text-sm text-[#315b40]">
          No orders have been recorded yet. Statistics will appear
          when orders become available.
        </p>
      )}
    </section>
  );
}