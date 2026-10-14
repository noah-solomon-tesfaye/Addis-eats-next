"use client";

function escapeCsv(value) {
  let text = String(value ?? "");

  // Prevent spreadsheet applications from interpreting user-controlled
  // text as a formula.
  if (/^[\s]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  // Escape quotation marks and wrap fields containing special characters.
  return `"${text.replace(/"/g, '""')}"`;
}

function formatDate(value) {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-ET", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Addis_Ababa",
  }).format(date);
}

function formatItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "Item details unavailable";
  }

  return items
    .map((item) => {
      const name = item.name || "Menu item";
      const quantity = Number(item.quantity || 1);

      return `${name} x ${quantity}`;
    })
    .join("; ");
}

export default function ExportOrdersButton({ orders }) {
  function handleExport() {
    if (!Array.isArray(orders) || orders.length === 0) {
      return;
    }

    const headers = [
      "Order ID",
      "Order Date",
      "Status",
      "Items",
      "Total (ETB)",
    ];

    const rows = orders.map((order) => [
      order.id || "",
      formatDate(order.createdAt),
      order.status || "pending",
      formatItems(order.items),
      Number(order.total || 0).toFixed(2),
    ]);

    const csvContent = [
      headers.map(escapeCsv).join(","),
      ...rows.map((row) => row.map(escapeCsv).join(",")),
    ].join("\r\n");

    // Add a UTF-8 BOM to improve compatibility with spreadsheet software.
    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `addis-eats-orders-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={!Array.isArray(orders) || orders.length === 0}
      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#29443a] px-5 py-3 text-sm font-semibold text-[#29443a] transition hover:bg-[#29443a] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a86f2b] disabled:cursor-not-allowed disabled:opacity-50"
    >
      Export orders to CSV
    </button>
  );
}