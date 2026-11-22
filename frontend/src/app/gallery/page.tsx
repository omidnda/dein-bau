import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import GalleryGrid from "@/components/GalleryGrid";
import { getGalleryMedia } from "@/content/site";

export const metadata = { title: "Referenzen", description: "Galerie für echte, freigegebene Projekte und Medien von Dein Bau Hub." };
export default async function GalleryPage() { const media = await getGalleryMedia(); return <><SiteHeader /><main><section className="page-intro"><div className="container"><p className="eyebrow">Referenzen & Medien</p><h1>Einblicke,<br />die man sieht.</h1><p>Hier erscheinen ausschließlich freigegebene Projektfotos und Videos. Bis echte Aufnahmen vorliegen, zeigen wir klar markierte Visualisierungen.</p></div></section><section className="section gallery-preview"><div className="container"><div className="gallery-notice"><strong>Hinweis zur Transparenz</strong><span>Die derzeit sichtbaren Bilder sind generierte Platzhalter und keine Dokumentation ausgeführter Projekte.</span></div><GalleryGrid media={media} /></div></section></main><SiteFooter /></>; }
