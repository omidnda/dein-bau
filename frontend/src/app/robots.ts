import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/custom-admin", "/api/"] },
    sitemap: `${siteUrl || "http://localhost:3000"}/sitemap.xml`,
  };
}
