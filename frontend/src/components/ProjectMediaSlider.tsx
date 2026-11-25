"use client";

import Image from "next/image";
import { useState } from "react";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import type { MediaAsset, ReferenceProject } from "@/content/site";

export default function ProjectMediaSlider({ project, media }: { project: ReferenceProject; media: MediaAsset[] }) {
  const [index, setIndex] = useState(0);
  const hasComparison = Boolean(project.beforeImage && project.afterImage);
  const count = media.length + (hasComparison ? 1 : 0);
  if (!count) return null;
  const current = Math.min(index, count - 1);
  const item = media[current - (hasComparison ? 1 : 0)];

  return <div className="project-slider" role="region" aria-label={`Aufnahmen: ${project.title}`}>
    <div className="project-slider-frame">
      {hasComparison && current === 0 ? <BeforeAfterSlider before={{ url: project.beforeImage!, alt: `${project.title}: vorher` }} after={{ url: project.afterImage!, alt: `${project.title}: nachher` }} /> : item.mediaType === "video" ? <video key={item.url} src={item.url} controls playsInline preload="metadata" aria-label={item.alt || item.title || `Video: ${project.title}`} /> : <Image src={item.url} alt={item.alt || item.title || `Projektaufnahme: ${project.title}`} fill sizes="(max-width: 540px) 100vw, (max-width: 900px) 50vw, 33vw" />}
    </div>
    {count > 1 && <div className="project-slider-controls"><button type="button" onClick={() => setIndex((current - 1 + count) % count)} aria-label={`Vorherige Aufnahme: ${project.title}`}>←</button><span aria-live="polite">{current + 1} / {count}</span><button type="button" onClick={() => setIndex((current + 1) % count)} aria-label={`Nächste Aufnahme: ${project.title}`}>→</button></div>}
  </div>;
}
