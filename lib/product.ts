export type Theme = "dark" | "light";
export type Mode = "notch" | "floating";
export type Size = "s" | "m" | "l";
export const widths = { s: 440, m: 480, l: 560 };
export const compactWidths = { s: 220, m: 360, l: 440 };
export const tabs = [
  "Music",
  "Pomodoro",
  "Prayer Times",
  "System Monitor",
  "Notifications",
  "Clipboard",
  "Education",
  "Settings",
] as const;
export const fileTools = [
  "Create ZIP",
  "Extract ZIP",
  "Word to PDF",
  "PDF to Word",
  "Merge PDFs",
  "Split PDF",
  "Compress PDF",
  "Protect PDF",
];
export function countdown(seconds: number) {
  const n = Math.max(0, Math.ceil(seconds));
  return n >= 3600
    ? `${Math.floor(n / 3600)}h ${String(Math.floor(n / 60) % 60).padStart(2, "0")}m`
    : n >= 60
      ? `${Math.floor(n / 60)}m ${String(n % 60).padStart(2, "0")}s`
      : `${n}s`;
}
export function safeUrl(raw: string) {
  try {
    const u = new URL(raw);
    return (
      ["https:", "http:"].includes(u.protocol) &&
      !u.username &&
      !u.password &&
      !/[\x00-\x20\\]/.test(raw)
    );
  } catch {
    return false;
  }
}
export const tracks = [
  {
    title: "After the rain",
    artist: "Cyra Sessions · silent demo",
    duration: 224,
    color: "copper",
  },
  {
    title: "Soft focus",
    artist: "Cyra Sessions · silent demo",
    duration: 196,
    color: "blue",
  },
  {
    title: "A little space",
    artist: "Cyra Sessions · silent demo",
    duration: 242,
    color: "sage",
  },
];
export const sampleNotifications = [
  {
    id: 1,
    app: "WhatsApp",
    letter: "W",
    color: "#178951",
    body: "Study group · See you at the library 👋",
    time: "now",
  },
  {
    id: 2,
    app: "Telegram",
    letter: "➤",
    color: "#1685b6",
    body: "Your next chapter starts here ✨",
    time: "2m",
  },
];
