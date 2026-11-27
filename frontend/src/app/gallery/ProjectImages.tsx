"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ProjectMedia } from "./data";

export default function ProjectImages({ images, title }: { images: ProjectMedia[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const start = useRef<number | null>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (index !== null && !node.open) node.showModal();
    if (index === null && node.open) { node.close(); opener.current?.focus(); }
  }, [index]);
  function move(direction: number) { setIndex((current) => current === null ? null : (current + direction + images.length) % images.length); }
  return <><div className="portfolio-media-grid">{images.map((image, i) => <button className="portfolio-image-button" key={image.id} onClick={(event) => { opener.current = event.currentTarget; setIndex(i); }} aria-label={`Bild ${i + 1} von ${images.length} vergrößern`}><Image src={image.url} alt={image.alt || image.title || title} fill sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" /></button>)}</div><dialog ref={dialog} className="portfolio-lightbox" aria-label="Bildansicht" onCancel={(event) => { event.preventDefault(); setIndex(null); }} onKeyDown={(event) => { if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); }} onTouchStart={(event) => { start.current = event.touches[0].clientX; }} onTouchEnd={(event) => { if (start.current !== null) { const delta = event.changedTouches[0].clientX - start.current; if (Math.abs(delta) > 50) move(delta < 0 ? 1 : -1); start.current = null; } }}><button className="portfolio-close" onClick={() => setIndex(null)} aria-label="Bildansicht schließen">✕</button>{index !== null && <><div className="portfolio-lightbox-image"><Image src={images[index].url} alt={images[index].alt || images[index].title || title} fill sizes="100vw" /></div><div className="portfolio-lightbox-controls"><button onClick={() => move(-1)} aria-label="Vorheriges Bild">←</button><span aria-live="polite">{index + 1} / {images.length}</span><button onClick={() => move(1)} aria-label="Nächstes Bild">→</button></div></>}</dialog></>;
}
