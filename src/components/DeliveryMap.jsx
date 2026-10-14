"use client";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const courierIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #29443a;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      font-size: 20px;
    " aria-hidden="true">🛵</div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

const destinationIcon = L.divIcon({
  className: "",
  html: `
    <div style="
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #a86f2b;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      font-size: 20px;
    " aria-hidden="true">📍</div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

// Illustrative coordinates in Addis Ababa, not live GPS positions.
const courierPosition = [9.0192, 38.7525];
const deliveryPosition = [9.0054, 38.7636];

export default function DeliveryMap() {
  return (
    <section className="mt-6 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="p-5">
        <h2 className="text-lg font-semibold text-stone-900">
          Delivery map
        </h2>

        <p className="mt-1 text-sm text-stone-600">
          Demonstration locations in Addis Ababa. The markers do not represent
          live courier GPS data.
        </p>
      </div>

      <div
        className="h-80 w-full"
        role="region"
        aria-label="Delivery map showing illustrative courier and destination markers"
      >
        <MapContainer
          center={[9.0105, 38.758]}
          zoom={14}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={courierPosition} icon={courierIcon}>
            <Popup>Illustrative courier location</Popup>
          </Marker>

          <Marker position={deliveryPosition} icon={destinationIcon}>
            <Popup>Illustrative delivery destination</Popup>
          </Marker>
        </MapContainer>
      </div>

      <div className="grid gap-3 p-5 text-sm sm:grid-cols-2">
        <p className="text-stone-700">
          <span aria-hidden="true">🛵 </span>
          Courier: demonstration location
        </p>

        <p className="text-stone-700">
          <span aria-hidden="true">📍 </span>
          Destination: demonstration location
        </p>
      </div>
    </section>
  );
}