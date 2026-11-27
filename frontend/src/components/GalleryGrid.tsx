"use client";
import Image from "next/image";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import { useEffect, useMemo, useRef, useState } from "react";
import type { MediaAsset } from "@/content/site";

export default function GalleryGrid({
  media,
  comparison = false,
  descriptions = {},
}: {
  media: MediaAsset[];
  comparison?: boolean;
  descriptions?: Record<string, string>;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  function scrollGallery(direction: number) {
    const track = trackRef.current;
    const first = track?.querySelector<HTMLElement>(".gallery-item");
    if (!track || !first) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: direction * (first.offsetWidth + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }
  const categories = [
    "Alle",
    ...Array.from(new Set(media.map((item) => item.category || "Weitere"))),
  ];
  const [before, setBefore] = useState<MediaAsset | null>(null);
  const [after, setAfter] = useState<MediaAsset | null>(null);
  const [category, setCategory] = useState("Alle");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const visible = useMemo(
    () =>
      category === "Alle"
        ? media
        : media.filter((item) => (item.category || "Weitere") === category),
    [category, media],
  );
  const selected = selectedIndex === null ? null : visible[selectedIndex];

  useEffect(() => {
    if (selectedIndex === null) return;
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedIndex(null);
      if (event.key === "ArrowLeft")
        setSelectedIndex((index) =>
          index === null ? null : (index - 1 + visible.length) % visible.length,
        );
      if (event.key === "ArrowRight")
        setSelectedIndex((index) =>
          index === null ? null : (index + 1) % visible.length,
        );
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedIndex, visible.length]);

  return (
    <>
      {comparison && (
        <div className="gallery-comparison">
          <h3>Vorher &amp; Nachher vergleichen</h3>

          {before && after && (
            <BeforeAfterSlider before={before} after={after} />
          )}
          <div className="comparison-selection">
            <span>
              Vorher: {before ? "ausgewählt" : "noch auswählen"} · Nachher:{" "}
              {after ? "ausgewählt" : "noch auswählen"}
            </span>
            <button
              type="button"
              onClick={() => {
                setBefore(null);
                setAfter(null);
              }}
            >
              Auswahl zurücksetzen
            </button>
          </div>
        </div>
      )}
      <div className="filter-row">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "filter active" : "filter"}
            onClick={() => {
              setCategory(item);
              setSelectedIndex(null);
              trackRef.current?.scrollTo({ left: 0 });
            }}
          >
            {item}
          </button>
        ))}
      </div>
      {comparison && visible.length > 1 && (
        <div
          className="gallery-slider-controls"
          aria-label="Galerie-Navigation"
        >
          <button
            type="button"
            onClick={() => scrollGallery(-1)}
            aria-label="Vorherige Aufnahmen"
          >
            ←
          </button>
          <span>Weitere Aufnahmen ansehen</span>
          <button
            type="button"
            onClick={() => scrollGallery(1)}
            aria-label="Nächste Aufnahmen"
          >
            →
          </button>
        </div>
      )}
      {visible.length === 0 && <p>Derzeit sind keine Aufnahmen verfügbar.</p>}
      <div
        ref={trackRef}
        className={comparison ? "gallery-grid gallery-slider" : "gallery-grid"}
        aria-label={
          comparison ? "Projektaufnahmen, horizontal scrollbar" : undefined
        }
        tabIndex={comparison ? 0 : undefined}
      >
        {visible.map((item, index) => (
          <div className="gallery-item" key={item.id}>
            <button
              className="gallery-card"
              onClick={() => setSelectedIndex(index)}
            >
              <div className="gallery-media">
                {item.mediaType === "video" ? (
                  <video src={item.url} muted playsInline preload="metadata" />
                ) : (
                  <Image
                    src={item.url}
                    alt={item.alt || item.title || item.name}
                    fill
                    sizes="(max-width: 700px) 100vw, 33vw"
                  />
                )}
                {item.mediaType === "video" && (
                  <span className="video-badge">Video</span>
                )}
              </div>
              <span className="gallery-caption">
                {descriptions[String(item.id)]?.trim() && (
                  <span className="gallery-description">
                    {descriptions[String(item.id)]}
                  </span>
                )}
                <small>{item.category || "Projektansicht"}</small>
              </span>
            </button>
            {comparison && item.mediaType === "image" && (
              <div className="comparison-pick">
                <button type="button" onClick={() => setBefore(item)}>
                  Als Vorher wählen
                </button>
                <button type="button" onClick={() => setAfter(item)}>
                  Als Nachher wählen
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {selected && selectedIndex !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Projektaufnahme"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="lightbox-inner"
            onClick={(event) => event.stopPropagation()}
          >
            {selected.mediaType === "video" ? (
              <video key={selected.url} src={selected.url} controls autoPlay />
            ) : (
              <Image
                src={selected.url}
                alt={selected.alt || selected.title || selected.name}
                fill
                sizes="90vw"
              />
            )}
          </div>
          <button
            className="lightbox-close"
            onClick={() => setSelectedIndex(null)}
          >
            Schließen
          </button>
          {visible.length > 1 && (
            <div
              className="lightbox-navigation"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                onClick={() =>
                  setSelectedIndex(
                    (selectedIndex - 1 + visible.length) % visible.length,
                  )
                }
                aria-label="Vorheriges Bild"
              >
                ←
              </button>
              <span>
                {selectedIndex + 1} / {visible.length}
              </span>
              <button
                onClick={() =>
                  setSelectedIndex((selectedIndex + 1) % visible.length)
                }
                aria-label="Nächstes Bild"
              >
                →
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
