import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import GalleryCTA from "../GalleryCTA";
import { getProjects } from "../data";
import ProjectImages from "../ProjectImages";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = (await getProjects()).find((item) => item.slug === slug);
  return project ? { title: project.title, description: project.description.slice(0, 160) || `Ein Projekt von Dein Bau Hub: ${project.title}.`, alternates: { canonical: `/gallery/${project.slug}` } } : { title: "Projekt nicht gefunden" };
}
export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = (await getProjects()).find((item) => item.slug === slug);
  if (!project) notFound();
  const images = project.media.filter((item) => item.mediaType === "image");
  const videos = project.media.filter((item) => item.mediaType === "video");
  const cover = project.cover || images[0];
  return <main><div className="container portfolio-detail"><nav className="portfolio-breadcrumb" aria-label="Brotkrumennavigation"><Link href="/">Startseite</Link> / <Link href="/gallery">Referenzen</Link> / <span aria-current="page">{project.title}</span></nav><header><p className="eyebrow">{[project.category, project.location].filter(Boolean).join(" · ")}</p><h1>{project.title}</h1></header>{cover && <div className="portfolio-hero-image"><Image src={cover.url} alt={cover.alt || project.title} fill priority sizes="100vw" /></div>}{project.description && <p className="portfolio-description">{project.description}</p>}{images.length > 0 && <section><h2>Einblicke in das Projekt</h2><ProjectImages images={images} title={project.title} /></section>}{videos.length > 0 && <section><h2>Videos</h2><div className="portfolio-media-grid">{videos.map((video) => <video key={video.id} controls playsInline preload="none" poster={video.poster?.url} aria-label={video.alt || video.title || `Video: ${project.title}`}><source src={video.url} type={video.contentType} /></video>)}</div></section>}<Link className="portfolio-back" href="/gallery">← Zurück zu den Referenzen</Link></div><GalleryCTA /></main>;
}
