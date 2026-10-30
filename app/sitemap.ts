import type { MetadataRoute } from "next";
import { siteUrl } from "@/data/release";
export default function sitemap(): MetadataRoute.Sitemap {
  return siteUrl
    ? [{ url: siteUrl, changeFrequency: "monthly", priority: 1 }]
    : [];
}
