"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";

const PAGE_SIZE = 5;

const VALID_SORT_COLUMNS = [
  "id",
  "createdAt",
  "status",
  "itemCount",
  "total",
];

const fetcher = async (url) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Unable to load order history.");
  }

  return response.json();
};

const formatETB = (amount) =>
  new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    maximumFractionDigits: 2,
  }).format(amount);

const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString("en-ET", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatStatus = (status) => {
  if (!status) {
    return "Unknown";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
};

function SortHeader({ label, column, sort, direction }) {
  const searchParams = useSearchParams();
  const active = sort === column;

  const nextDirection =
    active && direction === "asc" ? "desc" : "asc";

  const params = new URLSearchParams(searchParams.toString());

  params.set("sort", column);
  params.set("direction", nextDirection);
  params.delete("page");

  const ariaSort = active
    ? direction === "asc"
      ? "ascending"
      : "descending"
    : "none";

  return (
    <th
      scope="col"
      aria-sort={ariaSort}
      className="whitespace-nowrap px-4 py-3 text-left font-semibold"
    >
      <Link
        href={`/dashboard?${params.toString()}`}
        scroll={false}
        className="inline-flex items-center gap-2 rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#315b40]"
      >
        {label}

        <span aria-hidden="true">
          {active ? (direction === "asc" ? "↑" : "↓") : "↕"}
        </span>
      </Link>
    </th>
  );
}

export default function OrdersTable() {
  const searchParams = useSearchParams();

  const requestedSort = searchParams.get("sort");

  const sort = VALID_SORT_COLUMNS.includes(requestedSort)
    ? requestedSort
    : "createdAt";

  const requestedDirection = searchParams.get("direction");

  const direction =
    requestedDirection === "asc" ? "asc" : "desc";

  const requestedPage = Number(searchParams.get("page"));

  const page =
    Number.isInteger(requestedPage) && requestedPage > 0
      ? requestedPage
      : 1;

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
      <section className="rounded-2xl border border-[#e8e4d9] bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#292b22]">
          Order history
        </h2>

        <div
          role="status"
          aria-label="Loading order history"
          className="mt-6 space-y-3"
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-12 animate-pulse rounded-lg bg-[#edf2e9]"
            />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#292b22]">
          Order history
        </h2>

        <p role="alert" className="mt-3 text-sm text-red-700">
          We could not load the order history.
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

  const orders = [...(data?.orderHistory ?? [])];

  orders.sort((a, b) => {
    let comparison = 0;

    if (sort === "createdAt") {
      comparison =
        new Date(a.createdAt).getTime() -
        new Date(b.createdAt).getTime();
    } else if (sort === "total" || sort === "itemCount") {
      comparison = a[sort] - b[sort];
    } else {
      comparison = String(a[sort] ?? "").localeCompare(
        String(b[sort] ?? "")
      );
    }

    return direction === "asc" ? comparison : -comparison;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(orders.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  const visibleOrders = orders.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const createPageHref = (targetPage) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", String(targetPage));

    return `/dashboard?${params.toString()}`;
  };

  return (
    <section className="rounded-2xl border border-[#e8e4d9] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#292b22]">
            Order history
          </h2>

          <p className="mt-2 text-sm text-[#73766b]">
            Select a column heading to sort the orders.
          </p>
        </div>

        <p className="text-sm text-[#73766b]">
          {orders.length}{" "}
          {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-xl bg-[#faf8f3] px-6 py-12 text-center">
          <h3 className="font-semibold text-[#315b40]">
            No orders yet
          </h3>

          <p className="mt-2 text-sm leading-6 text-[#73766b]">
            Customer orders will appear here when they are recorded.
          </p>

          <Link
            href="/menu"
            className="mt-5 inline-flex rounded-lg bg-[#315b40] px-4 py-2 text-sm font-semibold text-white hover:bg-[#264832]"
          >
            Explore the menu
          </Link>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-sm">
              <caption className="sr-only">
                Admin order history. Select a column heading to sort.
              </caption>

              <thead className="border-b border-[#e8e4d9] bg-[#faf8f3] text-[#73766b]">
                <tr>
                  <SortHeader
                    label="Order ID"
                    column="id"
                    sort={sort}
                    direction={direction}
                  />

                  <SortHeader
                    label="Date"
                    column="createdAt"
                    sort={sort}
                    direction={direction}
                  />

                  <SortHeader
                    label="Status"
                    column="status"
                    sort={sort}
                    direction={direction}
                  />

                  <SortHeader
                    label="Items"
                    column="itemCount"
                    sort={sort}
                    direction={direction}
                  />

                  <SortHeader
                    label="Total"
                    column="total"
                    sort={sort}
                    direction={direction}
                  />
                </tr>
              </thead>

              <tbody>
                {visibleOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#f0ede5] last:border-0"
                  >
                    <td className="px-4 py-4 font-medium text-[#315b40]">
                      {order.id}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-[#73766b]">
                      {formatDate(order.createdAt)}
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-flex rounded-full bg-[#edf2e9] px-3 py-1 text-xs font-semibold text-[#315b40]">
                        {formatStatus(order.status)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right tabular-nums">
                      {order.itemCount}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-right font-semibold tabular-nums">
                      {formatETB(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <nav
            aria-label="Order history pagination"
            className="mt-6 flex flex-col gap-4 border-t border-[#e8e4d9] pt-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-sm text-[#73766b]">
              Showing {startIndex + 1}–
              {Math.min(startIndex + PAGE_SIZE, orders.length)} of{" "}
              {orders.length}
            </p>

            <div className="flex items-center gap-2">
              {currentPage > 1 ? (
                <Link
                  href={createPageHref(currentPage - 1)}
                  scroll={false}
                  className="rounded-lg border border-[#d9d8cb] px-4 py-2 text-sm font-semibold text-[#315b40] hover:bg-[#faf8f3]"
                >
                  Previous
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="rounded-lg border border-[#e8e4d9] px-4 py-2 text-sm text-[#85877d]"
                >
                  Previous
                </span>
              )}

              <span className="px-3 text-sm text-[#73766b]">
                Page {currentPage} of {totalPages}
              </span>

              {currentPage < totalPages ? (
                <Link
                  href={createPageHref(currentPage + 1)}
                  scroll={false}
                  className="rounded-lg border border-[#d9d8cb] px-4 py-2 text-sm font-semibold text-[#315b40] hover:bg-[#faf8f3]"
                >
                  Next
                </Link>
              ) : (
                <span
                  aria-disabled="true"
                  className="rounded-lg border border-[#e8e4d9] px-4 py-2 text-sm text-[#85877d]"
                >
                  Next
                </span>
              )}
            </div>
          </nav>
        </>
      )}
    </section>
  );
}