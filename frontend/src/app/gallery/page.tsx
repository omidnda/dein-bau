import GalleryCTA from "./GalleryCTA";
import ProjectGrid from "./ProjectGrid";
import { getProjects } from "./data";

export const metadata = { title: "Referenzen", description: "Entdecken Sie realisierte Projekte von Dein Bau Hub." };
export const dynamic = "force-dynamic";
export default async function GalleryPage() {
  const projects = await getProjects();
  return <main><section className="page-intro portfolio-intro"><div className="container"><p className="eyebrow">Unsere Referenzen</p><h1>Qualität, die sichtbar wird.</h1><p>Entdecken Sie unsere realisierten Projekte und überzeugen Sie sich von der Qualität unserer Arbeit – vom Innenausbau bis zur umfassenden Modernisierung.</p></div></section><section className="portfolio-section"><div className="container">{projects.length ? <ProjectGrid projects={projects} /> : <p>Zurzeit sind noch keine Projekte veröffentlicht. Schauen Sie gerne später wieder vorbei.</p>}</div></section><GalleryCTA /></main>;
}
