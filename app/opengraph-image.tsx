import { ImageResponse } from "next/og";
export const alt = "Cyra — Your desktop, reimagined.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#101114",
        color: "#f5f5f7",
        padding: "70px 90px",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 28,
          color: "#dc5269",
          letterSpacing: 6,
        }}
      >
        CYRA · FOR WINDOWS
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          fontSize: 88,
          letterSpacing: -4,
        }}
      >
        <span>Your desktop,</span>
        <span style={{ color: "#dc5269" }}>reimagined.</span>
      </div>
      <div style={{ display: "flex", fontSize: 23, color: "#a8abb5" }}>
        A little space. A better flow.
      </div>
    </div>,
    size,
  );
}
