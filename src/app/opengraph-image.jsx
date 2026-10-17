import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Addis Eats — Ethiopian food delivery in Addis Ababa";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff7ed",
          color: "#292524",
          fontFamily: "sans-serif",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#b45309",
            marginBottom: 30,
          }}
        >
          ADDIS EATS
        </div>

        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Ethiopian Food, Delivered
        </div>

        <div
          style={{
            fontSize: 30,
            textAlign: "center",
            color: "#57534e",
          }}
        >
          Discover delicious food in Addis Ababa
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}