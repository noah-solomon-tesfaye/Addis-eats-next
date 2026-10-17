"use client";

import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Illustrative locations in Addis Ababa.
// These are demo coordinates, not live GPS locations.
const restaurantPosition = [9.0192, 38.7525];
const deliveryPosition = [9.0054, 38.7636];

const STATUS_LABELS = {
  pending: "Order received",
  preparing: "Preparing your food",
  ready: "Ready for pickup",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered successfully",
  cancelled: "Order cancelled",
};

// Restaurant marker
const restaurantIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:42px;
      height:42px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#29443a;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 3px 10px #0003;
      font-size:21px;
    ">🍽️</div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

// Customer destination marker
const destinationIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:42px;
      height:42px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#a86f2b;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 3px 10px #0003;
      font-size:21px;
    ">📍</div>
  `,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

// Courier marker
const courierIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width:44px;
      height:44px;
      display:flex;
      align-items:center;
      justify-content:center;
      background:#e9f2ec;
      border:3px solid #29443a;
      border-radius:50%;
      box-shadow:0 3px 12px #0004;
      font-size:23px;
    ">🛵</div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

// Fit the map to the route.
function FitRoute({ courierPosition }) {
  const map = useMap();

  useEffect(() => {
    const bounds = L.latLngBounds([
      restaurantPosition,
      deliveryPosition,
      courierPosition,
    ]);

    map.fitBounds(bounds, {
      padding: [35, 35],
      maxZoom: 15,
      animate: true,
    });
  }, [map, courierPosition]);

  return null;
}

export default function DeliveryMap({ status = "pending" }) {
  const [progress, setProgress] = useState(0);

  const isCancelled = status === "cancelled";
  const isDelivered = status === "delivered";
  const isOutForDelivery = status === "out_for_delivery";

  // Animate the courier during delivery.
  useEffect(() => {
    if (!isOutForDelivery) {
      return;
    }

    const timer = setInterval(() => {
      setProgress((current) => {
        if (current >= 0.98) {
          return 0.98;
        }

        return current + 0.006;
      });
    }, 500);

    return () => clearInterval(timer);
  }, [isOutForDelivery]);

  // Derive position from the current order status.
  const effectiveProgress = isDelivered
    ? 1
    : isOutForDelivery
      ? progress
      : 0;

  const courierPosition = useMemo(() => {
    const [startLat, startLng] = restaurantPosition;
    const [endLat, endLng] = deliveryPosition;

    return [
      startLat + (endLat - startLat) * effectiveProgress,
      startLng + (endLng - startLng) * effectiveProgress,
    ];
  }, [effectiveProgress]);

  const statusLabel =
    STATUS_LABELS[status] || "Tracking your order";

  const courierIsVisible =
    !isCancelled && (isOutForDelivery || isDelivered);

  // Draw the travelled portion of the route.
  const travelledRoute = useMemo(() => {
    if (isDelivered) {
      return [restaurantPosition, deliveryPosition];
    }

    if (isOutForDelivery) {
      return [restaurantPosition, courierPosition];
    }

    return [];
  }, [courierPosition, isDelivered, isOutForDelivery]);

  return (
    <section className="relative z-0 mt-6 w-full min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      {/* Heading */}
      <div className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-stone-900">
              Delivery tracking
            </h2>

            <p className="mt-1 text-sm text-stone-600">
              Follow your Addis Eats order journey.
            </p>
          </div>

          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${
              isCancelled
                ? "bg-red-100 text-red-700"
                : isDelivered
                  ? "bg-green-100 text-green-700"
                  : isOutForDelivery
                    ? "bg-amber-100 text-amber-800"
                    : "bg-stone-100 text-stone-700"
            }`}
            aria-live="polite"
          >
            {!isCancelled && !isDelivered && (
              <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
            )}

            {statusLabel}
          </span>
        </div>

        <p className="mt-3 text-xs leading-5 text-stone-500">
          Demonstration route in Addis Ababa. Courier movement is simulated;
          this map does not use live GPS or a verified delivery address.
        </p>
      </div>

      {/* Map viewport: isolated so Leaflet cannot cover the site navigation. */}
      <div
        className="relative isolate z-0 h-72 w-full overflow-hidden sm:h-80 lg:h-96"
        role="region"
        aria-label="Illustrative Addis Eats delivery route"
        style={{ zIndex: 0 }}
      >
        <MapContainer
          center={[9.012, 38.758]}
          zoom={14}
          scrollWheelZoom={false}
          className="h-full w-full"
          style={{
            height: "100%",
            width: "100%",
            position: "relative",
            zIndex: 0,
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FitRoute courierPosition={courierPosition} />

          {/* Base route */}
          <Polyline
            positions={[restaurantPosition, deliveryPosition]}
            pathOptions={{
              color: "#d6d3d1",
              weight: 6,
              opacity: 0.9,
              lineCap: "round",
            }}
          />

          {/* Travelled route */}
          {travelledRoute.length > 1 && (
            <Polyline
              positions={travelledRoute}
              pathOptions={{
                color: "#29443a",
                weight: 6,
                opacity: 1,
                lineCap: "round",
              }}
            />
          )}

          {/* Restaurant */}
          <Marker
            position={restaurantPosition}
            icon={restaurantIcon}
          >
            <Popup>
              <strong>Addis Eats restaurant</strong>
              <br />
              Demonstration location
            </Popup>
          </Marker>

          {/* Delivery destination */}
          <Marker
            position={deliveryPosition}
            icon={destinationIcon}
          >
            <Popup>
              <strong>Delivery destination</strong>
              <br />
              Demonstration location
            </Popup>
          </Marker>

          {/* Courier */}
          {courierIsVisible && (
            <Marker
              position={courierPosition}
              icon={courierIcon}
            >
              <Popup>
                <strong>
                  {isDelivered
                    ? "Delivery completed"
                    : "Courier on the way"}
                </strong>
                <br />
                Simulated courier position
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Delivery information */}
      <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-3 sm:p-5">
        <div className="min-w-0 rounded-xl bg-stone-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Restaurant
          </p>

          <p className="mt-1 text-sm font-semibold text-stone-800">
            🍽️ Addis Eats
          </p>

          <p className="mt-1 text-xs leading-5 text-stone-500">
            {status === "pending" || status === "preparing"
              ? "Preparing your order"
              : "Pickup location"}
          </p>
        </div>

        <div className="min-w-0 rounded-xl bg-stone-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Courier
          </p>

          <p className="mt-1 text-sm font-semibold text-stone-800">
            🛵{" "}
            {isCancelled
              ? "Journey stopped"
              : isDelivered
                ? "Arrived"
                : isOutForDelivery
                  ? "On the way"
                  : "Awaiting pickup"}
          </p>

          <p className="mt-1 text-xs leading-5 text-stone-500">
            {isOutForDelivery
              ? "Simulated movement active"
              : "Status-based tracking"}
          </p>
        </div>

        <div className="min-w-0 rounded-xl bg-stone-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Destination
          </p>

          <p className="mt-1 text-sm font-semibold text-stone-800">
            📍 Delivery address
          </p>

          <p className="mt-1 text-xs leading-5 text-stone-500">
            {isDelivered
              ? "Order delivered"
              : isCancelled
                ? "Delivery cancelled"
                : "Demonstration location"}
          </p>
        </div>
      </div>
    </section>
  );
}