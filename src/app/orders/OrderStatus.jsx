"use client";

import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";

export default function OrderStatus({ id, initial }) {
  const { data, error } = useSWR(
    `/api/orders/${id}`,
    fetcher,
    {
      fallbackData: initial,
      refreshInterval: 5000,
    }
  );

  if (error) {
    return (
      <p className="text-red-600">
        Could not load the order.
      </p>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <p className="text-sm text-gray-500">
        Order ID
      </p>

      <p className="mt-1 font-semibold">
        {data.id}
      </p>

      <p className="mt-4 text-sm text-gray-500">
        Status
      </p>

      <p className="mt-1 text-xl font-bold">
        {data.status}
      </p>
    </div>
  );
}