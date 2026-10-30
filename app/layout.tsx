import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import { siteUrl } from "@/data/release";
import "./globals.css";
import "./cyra-parity.css";
const lato = localFont({
  src: [
    { path: "../public/assets/fonts/Lato-Regular-latin.woff2", weight: "400" },
    { path: "../public/assets/fonts/Lato-Bold-latin.woff2", weight: "700" },
  ],
  variable: "--font-lato",
  display: "swap",
});
export const metadata: Metadata = {
  ...(siteUrl
    ? { metadataBase: new URL(siteUrl), alternates: { canonical: siteUrl } }
    : {}),
  twitter: {
    card: "summary_large_image",
    title: "Cyra — Your desktop, reimagined.",
  },
  title: "Cyra — A little space. A better flow.",
  description:
    "Meet Cyra, a considered companion for your Windows desktop. Explore the interactive demo.",
  openGraph: {
    title: "Cyra — A little space. A better flow.",
    description: "Your everyday essentials. One quiet little space.",
    type: "website",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={lato.variable}>
        {children}
        {process.env.NODE_ENV === "development" &&
          process.env.NEXT_PUBLIC_FIGMA_CAPTURE === "1" && (
            <Script
              src="https://mcp.figma.com/mcp/html-to-design/capture.js"
              strategy="afterInteractive"
            />
          )}
      </body>
    </html>
  );
}
