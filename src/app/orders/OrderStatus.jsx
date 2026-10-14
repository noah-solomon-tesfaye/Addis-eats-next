"use client";

import { useEffect, useState } from "react";
import { etb, when } from "../../lib/format";

const TERMINAL_STATUSES = new Set(["delivered", "cancelled"]);

function formatStatus(status) {
  if (!status) return "Pending";

  return String(status)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function getStatusStyles(status) {
  switch (String(status || "").toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "out_for_delivery":
      return "bg-blue-100 text-blue-800";
    case "ready":
      return "bg-amber-100 text-amber-900";
    case "preparing":
      return "bg-orange-100 text-orange-900";
    default:
      return "bg-stone-100 text-stone-800";
  }
}

export default function OrderStatus({ id, initial }) {
  const [order, setOrder] = useState(initial);
  const [connectionState, setConnectionState] = useState("connecting");
  const [streamError, setStreamError] = useState("");

  const currentStatus = order?.status;

  useEffect(() => {
    if (!id || TERMINAL_STATUSES.has(initial?.status)) {
      return;
    }

    const source = new EventSource(
      `/api/orders/${encodeURIComponent(id)}/stream`
    );

    function handleOrder(event) {
      try {
        const updatedOrder = JSON.parse(event.data);

        setOrder(updatedOrder);
        setStreamError("");

        if (TERMINAL_STATUSES.has(updatedOrder.status)) {
          source.close();
          setConnectionState("closed");
        } else {
          setConnectionState("connected");
        }
      } catch {
        setStreamError("Received an invalid order update.");
      }
    }

    function handleServerError(event) {
      try {
        const payload = JSON.parse(event.data);

        setStreamError(
          payload.message || "Unable to receive order updates."
        );
      } catch {
        setStreamError("Connection interrupted. Reconnecting...");
      }
    }

    function handleConnectionError() {
      setConnectionState("connecting");
    }

    source.addEventListener("order", handleOrder);
    source.addEventListener("error", handleServerError);
    source.onerror = handleConnectionError;

    return () => {
      source.removeEventListener("order", handleOrder);
      source.removeEventListener("error", handleServerError);
      source.close();
    };
  }, [id, initial?.status]);

  const isTerminal = TERMINAL_STATUSES.has(currentStatus);

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-stone-500">Order ID</p>

      <p className="mt-1 break-all font-semibold text-stone-900">
        {order.id}
      </p>

      <div className="mt-6">
        <p className="text-sm text-stone-500">Current status</p>

        <span
          className={`mt-2 inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusStyles(currentStatus)}`}
          aria-live="polite"
        >
          {formatStatus(currentStatus)}
        </span>
      </div>

      {order.createdAt && (
        <div className="mt-5">
          <p className="text-sm text-stone-500">Order placed</p>

          <p className="mt-1 text-sm text-stone-800">
            {when.format(new Date(order.createdAt))}
          </p>
        </div>
      )}

      <div className="mt-5 border-t border-stone-100 pt-4">
        <p className="text-sm text-stone-500">Order total</p>

        <p className="mt-1 text-lg font-bold text-stone-900">
          {etb.format(Number(order.total || 0))}
        </p>
      </div>

      <p
        className="mt-5 text-sm text-stone-500"
        role="status"
        aria-live="polite"
      >
        {isTerminal || connectionState === "closed"
          ? "Live updates have ended for this order."
          : connectionState === "connected"
            ? "Live order updates connected."
            : "Connecting to live order updates..."}
      </p>

      {streamError && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {streamError}
        </p>
      )}
    </section>
  );
}