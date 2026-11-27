"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Project } from "./data";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [category, setCategory] = useState("");
  const categories = [...new Set(projects.map((p) => p.category.trim()).filter(Boolean))];
  const visible = projects.filter((p) => !category || p.category.trim() === category);
  return <>{categories.length > 0 && <div className="portfolio-filters" aria-label="Projekte filtern">{["", ...categories].map((item) => <button key={item} type="button" aria-pressed={item === category} onClick={() => setCategory(item)}>{item || "Alle Projekte"}</button>)}</div>}<div className="portfolio-grid">{visible.map((project) => {
    const cover = project.cover || project.media.find((item) => item.mediaType === "image");
    const count = project.media.filter((item) => item.mediaType === "image").length;
    return <Link className="portfolio-card" href={`/gallery/${project.slug}`} key={project.slug}><div className="portfolio-cover">{cover ? <Image src={cover.url} alt={cover.alt || project.title} fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" /> : <span>Projekt ansehen</span>}</div><div className="portfolio-card-copy">{project.category && <p className="eyebrow">{project.category}</p>}<h2>{project.title}</h2>{project.location && <p>{project.location}</p>}{project.description && <p className="portfolio-excerpt">{project.description}</p>}<p className="portfolio-count">{count > 0 && `${count} ${count === 1 ? "Bild" : "Bilder"}`}{count > 0 && project.media.some((item) => item.mediaType === "video") && " · "}{project.media.some((item) => item.mediaType === "video") && "Video"}</p><span className="portfolio-link">Projekt ansehen →</span></div></Link>;
  })}</div></>;
}
