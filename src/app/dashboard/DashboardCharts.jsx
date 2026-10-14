"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import useSWR from "swr";

const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load order analytics.");
  }

  return response.json();
};

const formatDate = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString("en-ET", {
    month: "short",
    day: "numeric",
  });

export default function DashboardCharts() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/analytics",
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  if (isLoading && !data) {
    return (
      <section
        aria-labelledby="orders-chart-heading"
        className="rounded-2xl border border-[#e8e4d9] bg-white p-6 shadow-sm"
      >
        <h2 id="orders-chart-heading" className="text-xl font-bold">
          Daily orders
        </h2>

        <div
          className="mt-6 h-72 animate-pulse rounded-xl bg-[#edf2e9]"
          role="status"
          aria-label="Loading daily orders chart"
        />
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-white p-6">
        <h2 className="text-xl font-bold">Daily orders</h2>

        <p className="mt-3 text-sm text-red-700" role="alert">
          We could not load the daily orders chart.
        </p>

        <button
          type="button"
          onClick={() => mutate()}
          className="mt-4 rounded-lg border border-[#d9d8cb] px-4 py-2 text-sm font-semibold hover:bg-[#faf8f3]"
        >
          Try again
        </button>
      </section>
    );
  }

  const dailyOrders = data?.dailyOrders ?? [];

  return (
    <section
      aria-labelledby="orders-chart-heading"
      className="rounded-2xl border border-[#e8e4d9] bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2
          id="orders-chart-heading"
          className="text-xl font-bold text-[#292b22]"
        >
          Daily orders
        </h2>

        <p className="mt-2 text-sm text-[#73766b]">
          Number of recorded orders by date.
        </p>
      </div>

      {dailyOrders.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl bg-[#faf8f3] px-6 text-center">
          <p className="font-semibold text-[#315b40]">
            No order activity yet
          </p>

          <p className="mt-2 max-w-md text-sm leading-6 text-[#73766b]">
            Daily order trends will appear here when valid order
            records are available.
          </p>
        </div>
      ) : (
        <>
          <div
            className="h-72 w-full"
            role="img"
            aria-label="Line chart showing recorded orders by date"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyOrders}
                margin={{
                  top: 10,
                  right: 16,
                  left: 0,
                  bottom: 8,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 12 }}
                  minTickGap={20}
                />

                <YAxis
                  allowDecimals={false}
                  domain={[0, "auto"]}
                  tick={{ fontSize: 12 }}
                  width={36}
                />

                <Tooltip
                  labelFormatter={(label) => formatDate(label)}
                  formatter={(value) => [value, "Orders"]}
                />

                <Line
                  type="monotone"
                  dataKey="count"
                  name="Orders"
                  stroke="#315b40"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Expanded by default so the accessible data table is visible. */}
          <details
            open
            className="mt-5 border-t border-[#e8e4d9] pt-4"
          >
            <summary className="cursor-pointer text-sm font-semibold text-[#315b40]">
              View chart data as a table
            </summary>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="mb-3 text-left text-[#73766b]">
                  Recorded order counts by date
                </caption>

                <thead className="border-b border-[#e8e4d9] text-[#73766b]">
                  <tr>
                    <th scope="col" className="px-3 py-3">
                      Date
                    </th>

                    <th scope="col" className="px-3 py-3 text-right">
                      Orders
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {dailyOrders.map((item) => (
                    <tr
                      key={item.date}
                      className="border-b border-[#f0ede5]"
                    >
                      <td className="px-3 py-3">
                        {formatDate(item.date)}
                      </td>

                      <td className="px-3 py-3 text-right tabular-nums">
                        {item.count}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      )}
    </section>
  );
}