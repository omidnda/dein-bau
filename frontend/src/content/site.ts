import { fetchBackend } from "@/lib/backend-api";

export type Service = { slug: string; title: string; summary: string; details: string; image: string };
export type MediaAsset = { id: number | string; name: string; contentType: string; mediaType: "image" | "video"; title: string; alt: string; category: string; isFeatured: boolean; url: string };

export type SiteContent = {
  company: { name: string; owner: string; phone: string; email: string; address: string; tagline: string };
  nav: { label: string; href: string }[];
  hero: { eyebrow: string; title: string; text: string; image: string };
  services: Service[];
  about: { intro: string; points: { title: string; text: string }[] };
  contact: { title: string; text: string; button: string };
};

export const defaultContent: SiteContent = {
  company: { name: "Dein Bau Hub e.K.", owner: "Seyedeh Razieh Ahmadi", phone: "Telefon nach Bestätigung", email: "E-Mail nach Bestätigung", address: "Hamburg und Umgebung", tagline: "Innenausbau · Bausanierung · Modernisierung" },
  nav: [{ label: "Startseite", href: "/" }, { label: "Leistungen", href: "/leistungen" }, { label: "Über uns", href: "/ueber-uns" }, { label: "Referenzen", href: "/gallery" }, { label: "Kontakt", href: "/kontakt" }],
  hero: { eyebrow: "Innenausbau · Bausanierung · Modernisierung", title: "Räume, die bleiben.", text: "Dein Bau Hub begleitet Sanierungs- und Ausbauprojekte in Hamburg – klar geplant, sauber koordiniert und fachgerecht umgesetzt.", image: "/images/generated/hero-renovation.png" },
  services: [
    { slug: "innenausbau", title: "Innenausbau & Trockenbau", summary: "Räume neu denken und präzise ausbauen.", details: "Trennwände, Decken, Installationsverkleidungen, Vorsatzschalen und Oberflächenvorbereitung.", image: "/images/generated/interior-renovation.png" },
    { slug: "bad", title: "Badsanierung", summary: "Funktionale Bäder mit sauberer Koordination.", details: "Rückbau, Vorbereitung, Abdichtung im zulässigen Umfang und Koordination qualifizierter Fachbetriebe.", image: "/images/generated/bathroom-renovation.png" },
    { slug: "boden", title: "Bodenarbeiten", summary: "Ein starker Untergrund für den Alltag.", details: "Untergrundvorbereitung, Ausgleich, Klick-Vinyl, Laminat, Designbeläge und Sockelleisten.", image: "/images/generated/interior-renovation.png" },
    { slug: "umbau", title: "Maurer- & Umbauarbeiten", summary: "Veränderungen mit technischer Sorgfalt.", details: "Öffnungen, Laibungen, Installationsschächte und kleinere Ausbesserungsarbeiten. Statische Eingriffe nur nach Prüfung.", image: "/images/generated/facade-renovation.png" },
    { slug: "fenster", title: "Fenster & Türen", summary: "Montage und Anschlüsse, die präzise sitzen.", details: "Demontage, Montage, Öffnungsvorbereitung, Zargen sowie Anschlussnachbearbeitung.", image: "/images/generated/hero-renovation.png" },
    { slug: "oberflaechen", title: "Maler & Oberflächen", summary: "Der letzte Millimeter macht den Unterschied.", details: "Spachteln, Schleifen, Grundieren, Tapezieren und Innenanstriche.", image: "/images/generated/material-planning.png" },
    { slug: "fassade", title: "Fassade & Außenarbeiten", summary: "Koordinierte Lösungen für die Gebäudehülle.", details: "Projektbezogene Koordination von Instandsetzung, Dämmung, Bekleidungen und Verfugung.", image: "/images/generated/facade-renovation.png" },
  ],
  about: { intro: "Sanierung ist eine Folge guter Entscheidungen. Wir machen diese Entscheidungen verständlich und den Ablauf nachvollziehbar.", points: [{ title: "Verantwortung", text: "Klare Absprachen und eine realistische Einschätzung des Projekts." }, { title: "Koordination", text: "Eigene Ausbauarbeiten ergänzt durch qualifizierte Fach- und Meisterbetriebe." }, { title: "Transparenz", text: "Nachvollziehbare Leistungsbeschreibungen, Mengen und Einheitspreise." }] },
  contact: { title: "Ihr Projekt beginnt mit einem Gespräch.", text: "Beschreiben Sie uns Ihr Vorhaben. Fotos, Zeichnungen oder Grundrisse können Sie später ergänzen.", button: "Projekt anfragen" },
};

function mergeContent(value: unknown): SiteContent {
  if (!value || typeof value !== "object") return defaultContent;
  const stored = value as Partial<SiteContent>;
  return { ...defaultContent, ...stored, company: { ...defaultContent.company, ...(stored.company ?? {}) }, hero: { ...defaultContent.hero, ...(stored.hero ?? {}) }, contact: { ...defaultContent.contact, ...(stored.contact ?? {}) }, about: { ...defaultContent.about, ...(stored.about ?? {}) }, nav: stored.nav?.length ? stored.nav : defaultContent.nav, services: stored.services?.length ? stored.services : defaultContent.services };
}

export async function getSiteContent() {
  try {
    const response = await fetchBackend("/content/site/", { cache: "no-store" });
    if (!response.ok) return defaultContent;
    const payload = (await response.json()) as { content?: { site?: unknown } };
    return mergeContent(payload.content?.site);
  } catch {
    return defaultContent;
  }
}

export async function getGalleryMedia(): Promise<MediaAsset[]> {
  try {
    const response = await fetchBackend("/media/public/", { cache: "no-store" });
    if (!response.ok) return [];
    const items = ((await response.json()) as { results?: MediaAsset[] }).results ?? [];
    return items.map((item) => ({ ...item, url: item.url.startsWith("/media/") ? `/api/media/${item.url.replace(/^\/media\//, "")}` : item.url }));
  } catch {
    return [];
  }
}
