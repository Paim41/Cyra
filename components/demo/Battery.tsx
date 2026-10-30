"use client";
import { useEffect, useState } from "react";
// Geometry from the read-only Windows Theme.Battery renderer (22 × 11 DIP body).
export function Battery({ level = 93 }: { level?: number }) {
  return (
    <svg
      className="native-battery"
      width="26"
      height="14"
      viewBox="-1 -7 26 14"
      aria-hidden="true"
    >
      <rect
        x="0"
        y="-5.5"
        width="22"
        height="11"
        rx="3.2"
        fill="none"
        stroke="var(--product-muted)"
        strokeWidth="1.2"
      />
      <rect
        x="23.2"
        y="-2"
        width="1.8"
        height="4"
        rx=".9"
        fill="var(--product-muted)"
      />
      <rect
        x="2"
        y="-3.5"
        width={Math.max(1.5, (18 * Math.min(100, Math.max(0, level))) / 100)}
        height="7"
        rx="1.6"
        fill="currentColor"
      />
    </svg>
  );
}
// Match Windows' Segoe Fluent/MDL2 U+E945 glyph when the native font exists.
// The matching outlined SVG is used on systems without those local fonts.
export function PowerBolt() {
  const [native, setNative] = useState(false);
  useEffect(() => {
    let mounted = true;
    document.fonts
      .load('11px "Cyra Windows Icons"', "\ue945")
      .then((fonts) => {
        if (mounted) setNative(fonts.length > 0);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);
  return (
    <span
      className={`native-power ${native ? "has-native" : ""}`}
      aria-hidden="true"
    >
      <span className="windows-power-glyph">&#xE945;</span>
      <svg
        className="power-fallback"
        viewBox="0 0 16 18"
        width="11"
        height="13"
      >
        <path
          d="M6 1h7L9 7h5L4 17l2-8H2z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
