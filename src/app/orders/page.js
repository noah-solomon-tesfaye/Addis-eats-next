import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "../../lib/session";
import { getOrdersForUser } from "../../lib/orders";

export const metadata = {
  title: "My Orders",
  description: "View your Addis Eats orders and track their status.",
};

export const dynamic = "force-dynamic";

function formatPrice(amount) {
  return `${Number(amount || 0).toLocaleString("en-ET", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ETB`;
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString("en-ET", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getStatusStyles(status) {
  const normalizedStatus = String(status || "").toLowerCase();

  if (["delivered", "completed"].includes(normalizedStatus)) {
    return "bg-green-100 text-green-800";
  }

  if (["cancelled", "canceled", "failed"].includes(normalizedStatus)) {
    return "bg-red-100 text-red-800";
  }

  if (["preparing", "ready", "out_for_delivery"].includes(normalizedStatus)) {
    return "bg-amber-100 text-amber-900";
  }

  return "bg-[#e8eee9] text-[#29443a]";
}

function formatStatus(status) {
  if (!status) return "Pending";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default async function OrdersPage() {
  const session = await getSession();

  if (!session?.user?.id) {
    redirect("/signin?next=%2Forders");
  }

  const orders = getOrdersForUser(session.user.id);

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();

    return dateB - dateA;
  });

  return (
    <main className="min-h-[70vh]">
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#a86f2b]">
              Your Addis Eats account
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-[#29443a] sm:text-4xl">
              My orders
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-[#73766f] sm:text-base">
              Check your past orders and follow their progress.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#29443a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#20372e] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
          >
            Browse menu
          </Link>
        </div>

        {sortedOrders.length === 0 ? (
          <div className="rounded-3xl border border-[#e9e2d7] bg-white px-5 py-12 text-center shadow-sm sm:px-10">
            <div
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f3ede3] text-3xl"
              aria-hidden="true"
            >
              🧾
            </div>

            <h2 className="text-xl font-bold text-[#29443a]">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#73766f]">
              Your orders will appear here after you place your first order.
              Explore the menu and find something delicious.
            </p>

            <Link
              href="/menu"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#a86f2b] px-6 py-3 font-semibold text-white transition hover:bg-[#8e5b22] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#29443a]"
            >
              Explore the menu
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <p className="text-sm text-[#73766f]" aria-live="polite">
              {sortedOrders.length}{" "}
              {sortedOrders.length === 1 ? "order" : "orders"} found
            </p>

            {sortedOrders.map((order) => {
              const orderId = order.id;
              const status = order.status || "pending";
              const items = Array.isArray(order.items) ? order.items : [];

              return (
                <article
                  key={orderId}
                  className="overflow-hidden rounded-2xl border border-[#e9e2d7] bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="flex flex-col gap-4 border-b border-[#e9e2d7] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#73766f]">
                        Order number
                      </p>

                      <h2 className="mt-1 break-all text-lg font-bold text-[#29443a]">
                        {orderId || "Order"}
                      </h2>

                      <p className="mt-1 text-sm text-[#73766f]">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`inline-flex min-h-8 w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyles(status)}`}
                    >
                      {formatStatus(status)}
                    </span>
                  </div>

                  <div className="space-y-3 p-5 sm:px-6">
                    <h3 className="text-sm font-semibold text-[#242923]">
                      Order summary
                    </h3>

                    {items.length > 0 ? (
                      <ul className="space-y-2">
                        {items.map((item, index) => (
                          <li
                            key={item.id || `${item.name || "item"}-${index}`}
                            className="flex items-start justify-between gap-4 text-sm"
                          >
                            <span className="min-w-0 text-[#73766f]">
                              {item.name || "Menu item"} ×{" "}
                              {item.quantity || 1}
                            </span>

                            <span className="shrink-0 font-medium text-[#242923]">
                              {formatPrice(
                                Number(item.price || 0) *
                                  Number(item.quantity || 1)
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-[#73766f]">
                        Item details are unavailable.
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 bg-[#faf8f3] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                      <p className="text-xs text-[#73766f]">Order total</p>
                      <p className="mt-1 text-lg font-bold text-[#29443a]">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    <Link
                      href={`/orders/${encodeURIComponent(orderId)}`}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#29443a] px-5 py-3 text-sm font-semibold text-[#29443a] transition hover:bg-[#29443a] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b]"
                    >
                      View order status
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}