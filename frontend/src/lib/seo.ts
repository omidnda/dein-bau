import type { Metadata } from "next";

const configuredUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.NODE_ENV === "production" ? "https://dein-bau-hub.de" : null);

export const siteUrl = configuredUrl?.replace(/\/$/, "") ?? "";
export const siteName = "";
export const defaultDescription =
  "";
export const socialImage = "/images/service-slider.jpg";

type PageMetadata = {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  noIndex = false,
}: PageMetadata): Metadata {
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;
  return {
    title,
    description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: "website",
      locale: "de_DE",
      url: canonicalPath,
      siteName,
      title,
      description,
      images: [{ url: socialImage, alt: `${siteName} Hotelservice` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
  };
}
