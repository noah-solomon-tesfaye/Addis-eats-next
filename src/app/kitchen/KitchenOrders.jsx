"use client";

import { useState } from "react";
import useSWR from "swr";

const fetcher = async (url) => {
  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to load kitchen orders.");
  }

  return data;
};

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const statusStyles = {
  pending: "bg-amber-100 text-amber-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  out_for_delivery: "bg-purple-100 text-purple-800",
  delivered: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

const formatETB = (amount) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-ET", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));

export default function KitchenOrders() {
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [actionError, setActionError] = useState("");

  const {
    data,
    error,
    isLoading,
    mutate,
  } = useSWR("/api/kitchen/orders", fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: true,
  });

  async function updateStatus(orderId, status) {
    setUpdatingOrderId(orderId);
    setActionError("");

    try {
      const response = await fetch("/api/kitchen/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, status }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Unable to update order status.");
      }

      await mutate();
    } catch (err) {
      setActionError(err.message || "Something went wrong.");
    } finally {
      setUpdatingOrderId(null);
    }
  }

  if (isLoading) {
    return (
      <p className="py-10 text-center" role="status">
        Loading kitchen orders…
      </p>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-red-200 bg-red-50 p-5">
        <p className="text-red-800" role="alert">
          {error.message}
        </p>

        <button
          type="button"
          onClick={() => mutate()}
          className="mt-3 rounded-lg bg-red-700 px-4 py-2 font-medium text-white"
        >
          Try again
        </button>
      </section>
    );
  }

  const orders = data?.orders ?? [];

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          Orders refresh automatically every five seconds.
        </p>

        <button
          type="button"
          onClick={() => mutate()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Refresh orders
        </button>
      </div>

      {actionError && (
        <p
          className="rounded-lg bg-red-50 p-3 text-sm text-red-800"
          role="alert"
        >
          {actionError}
        </p>
      )}

      {orders.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 p-10 text-center">
          <h2 className="text-lg font-semibold">No orders yet</h2>
          <p className="mt-2 text-sm text-gray-600">
            New customer orders will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">
                    Order {order.id}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    statusStyles[order.status] ??
                    "bg-gray-100 text-gray-800"
                  }`}
                >
                  {statusOptions.find(
                    (item) => item.value === order.status
                  )?.label ?? order.status}
                </span>
              </div>

              <div className="mt-4 border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold">Items</h3>

                {order.items.length === 0 ? (
                  <p className="mt-2 text-sm text-gray-500">
                    No items recorded for this order.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {order.items.map((item, index) => (
                      <li
                        key={`${item.id}-${index}`}
                        className="flex justify-between gap-3 text-sm"
                      >
                        <span>
                          {item.name} × {item.quantity}
                        </span>

                        <span className="font-medium">
                          {formatETB(item.price * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-gray-600">Neighbourhood</dt>
                  <dd className="font-medium">
                    {order.neighbourhood || "Not provided"}
                  </dd>
                </div>

                <div className="flex justify-between gap-3">
                  <dt className="text-gray-600">Order total</dt>
                  <dd className="font-semibold">
                    {formatETB(order.total)}
                  </dd>
                </div>
              </dl>

              <div className="mt-5">
                <label
                  htmlFor={`status-${order.id}`}
                  className="mb-2 block text-sm font-medium"
                >
                  Update order status
                </label>

                <select
                  id={`status-${order.id}`}
                  value={order.status}
                  disabled={updatingOrderId === order.id}
                  onChange={(event) =>
                    updateStatus(order.id, event.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-60"
                >
                  {statusOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>

                {updatingOrderId === order.id && (
                  <p className="mt-2 text-sm text-gray-500" role="status">
                    Updating order…
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}