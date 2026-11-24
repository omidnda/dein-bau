import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl || "http://localhost:3000";
  return ["", "/leistungen", "/ueber-uns", "/gallery", "/kontakt", "/faq", "/impressum", "/datenschutz"].map((path) => ({ url: `${base}${path || "/"}` }));
}
