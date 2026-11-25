import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import GalleryGrid from "@/components/GalleryGrid";
import ProjectMediaSlider from "@/components/ProjectMediaSlider";
import { getGalleryMedia, getSiteContent, selectGalleryMedia } from "@/content/site";

export const metadata = { title: "Referenzen", description: "Einblicke in Sanierungs- und Modernisierungsprojekte von Dein Bau Hub." };
export const dynamic = "force-dynamic";

export default async function GalleryPage() {
 const [media, content] = await Promise.all([getGalleryMedia(), getSiteContent()]);
 const projects = content.gallery.projects.map((project) => ({ project, media: selectGalleryMedia(media, project.mediaIds ?? []) })).filter(({ project, media: projectMedia }) => projectMedia.length > 0 || Boolean(project.beforeImage && project.afterImage));
 return <><SiteHeader /><main><section className="page-intro reference-intro"><div className="container"><p className="eyebrow">Referenzen &amp; Medien</p><h1>{content.pageCopy.gallery.heading}</h1><p>{content.gallery.intro}</p></div></section>{projects.length > 0 && <section className="section services-section reference-projects" id="projekte"><div className="container"><div className="section-heading"><div><p className="eyebrow">Unsere Projekte</p><h2>{content.pageCopy.gallery.projectsHeading}</h2></div><p className="section-intro">Von der Vorbereitung bis zur Fertigstellung: Einblicke in unterschiedliche Projekte und Gewerke.</p></div><div className="value-grid">{projects.map(({ project, media: projectMedia }, index) => <article className="value-card" key={index}><ProjectMediaSlider project={project} media={projectMedia} /><div className="reference-project-copy"><h3>{project.title}</h3><p>{project.text}</p></div></article>)}</div></div></section>}<section className="section reference-gallery" id="projektaufnahmen"><div className="container"><div className="section-heading"><div><p className="eyebrow">Projektaufnahmen</p><h2>{content.pageCopy.gallery.photosHeading}</h2></div></div><GalleryGrid media={selectGalleryMedia(media, content.gallery.mediaIds)} descriptions={content.gallery.mediaDescriptions} comparison /></div></section></main><SiteFooter /></>;
}
