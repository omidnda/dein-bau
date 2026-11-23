import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import GalleryGrid from "@/components/GalleryGrid";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { getGalleryMedia, getSiteContent } from "@/content/site";

export const metadata = { title: "Referenzen", description: "Einblicke in Sanierungs- und Modernisierungsprojekte von Dein Bau Hub." };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
 const [media, content] = await Promise.all([getGalleryMedia(), getSiteContent()]);
 return <><SiteHeader /><main><section className="page-intro"><div className="container"><p className="eyebrow">Referenzen &amp; Medien</p><h1>{content.pageCopy.gallery.heading}</h1><p>{content.gallery.intro}</p></div></section><section className="section services-section"><div className="container"><div className="section-heading"><div><p className="eyebrow">Unsere Projekte</p><h2>{content.pageCopy.gallery.projectsHeading}</h2></div><p className="section-intro">Von der Vorbereitung bis zur Fertigstellung: Einblicke in unterschiedliche Projekte und Gewerke.</p></div><div className="value-grid">{content.gallery.projects.map((project, index) => <article className="value-card" key={index}><h3>{project.title}</h3><p>{project.text}</p>{project.beforeImage && project.afterImage && <BeforeAfterSlider before={{ url: project.beforeImage, alt: `${project.title}: vorher` }} after={{ url: project.afterImage, alt: `${project.title}: nachher` }} />}</article>)}</div></div></section><section className="section reference-gallery"><div className="container"><div className="section-heading"><div><p className="eyebrow">Projektaufnahmen</p><h2>{content.pageCopy.gallery.photosHeading}</h2></div></div><GalleryGrid media={media} comparison /></div></section></main><SiteFooter /></>;
}
