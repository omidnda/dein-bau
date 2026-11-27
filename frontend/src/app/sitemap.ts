import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { getProjects } from "@/app/gallery/data";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl || "http://localhost:3000";
  const pages = [
    "",
    "/leistungen",
    "/ueber-uns",
    "/gallery",
    "/kontakt",
    "/faq",
    "/impressum",
    "/datenschutz",
  ].map((path) => ({ url: `${base}${path || "/"}` }));
  try {
    return [
      ...pages,
      ...(await getProjects()).map((project) => ({
        url: `${base}/gallery/${project.slug}`,
      })),
    ];
  } catch (error) {
    console.error("Unable to load gallery sitemap", error);
    return pages;
  }
}
