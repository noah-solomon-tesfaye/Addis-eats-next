"use client";

import dynamic from "next/dynamic";

const DeliveryMap = dynamic(() => import("./DeliveryMap"), {
  ssr: false,
  loading: () => (
    <section className="mt-6 rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-stone-900">
        Delivery map
      </h2>

      <div
        className="mt-4 flex h-80 items-center justify-center rounded-xl bg-stone-100 text-sm text-stone-600"
        role="status"
      >
        Loading delivery map...
      </div>
    </section>
  ),
});

export default function DeliveryMapLoader() {
  return <DeliveryMap />;
}