"use client";

import useSWR from "swr";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { etb } from "../../lib/format";

const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load neighbourhood revenue.");
  }

  return response.json();
};

const compactETB = new Intl.NumberFormat("en-ET", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function RevenueByNeighbourhood() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/admin/analytics",
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
    }
  );

  const revenueByNeighbourhood = data?.revenueByNeighbourhood ?? [];

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-stone-900">
          Revenue by Neighbourhood
        </h2>

        <p className="mt-1 text-sm text-stone-500">
          Revenue grouped by neighbourhood, in Ethiopian birr (ETB).
        </p>
      </div>

      {isLoading ? (
        <div
          className="h-72 animate-pulse rounded-xl bg-stone-100"
          aria-label="Loading neighbourhood revenue"
          role="status"
        >
          <span className="sr-only">
            Loading neighbourhood revenue...
          </span>
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-5 text-sm text-red-800">
          <p>We couldn&apos;t load neighbourhood revenue.</p>

          <button
            type="button"
            onClick={() => mutate()}
            className="mt-3 rounded-lg border border-red-200 px-3 py-2 font-medium hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      ) : revenueByNeighbourhood.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-stone-50 px-5 py-8 text-center">
          <p className="font-medium text-stone-800">
            No neighbourhood revenue data yet
          </p>

          <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
            Orders do not currently contain neighbourhood information.
            Once that information is recorded, this chart can compare revenue
            across neighbourhoods.
          </p>
        </div>
      ) : (
        <>
          <div
            className="h-72 w-full"
            role="img"
            aria-label="Bar chart comparing revenue by neighbourhood in Ethiopian birr"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueByNeighbourhood}
                margin={{ top: 10, right: 12, left: 12, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="neighbourhood"
                  tick={{ fontSize: 12 }}
                  interval={0}
                />

                <YAxis
                  domain={[0, "auto"]}
                  tickFormatter={(value) => compactETB.format(value)}
                  tick={{ fontSize: 12 }}
                  width={65}
                />

                <Tooltip
                  formatter={(value) => [
                    etb.format(Number(value)),
                    "Revenue",
                  ]}
                  labelFormatter={(label) => `Neighbourhood: ${label}`}
                />

                <Bar
                  dataKey="revenue"
                  name="Revenue"
                  fill="#356859"
                  radius={[5, 5, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <caption className="mb-2 text-left text-sm text-stone-600">
                Revenue by neighbourhood, in Ethiopian birr (ETB)
              </caption>

              <thead className="border-b border-stone-200 text-stone-600">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">
                    Neighbourhood
                  </th>

                  <th
                    scope="col"
                    className="px-3 py-2 text-right font-medium"
                  >
                    Revenue (ETB)
                  </th>
                </tr>
              </thead>

              <tbody>
                {revenueByNeighbourhood.map((item) => (
                  <tr
                    key={item.neighbourhood}
                    className="border-b border-stone-100 last:border-0"
                  >
                    <th
                      scope="row"
                      className="px-3 py-3 font-medium text-stone-800"
                    >
                      {item.neighbourhood}
                    </th>

                    <td className="px-3 py-3 text-right tabular-nums text-stone-700">
                      {etb.format(Number(item.revenue))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}