"use client";

import Image from "next/image";
import { useState } from "react";

export default function HeroSlideshow({ image, label, secondImage, thirdImage }: { image: string; label: string; secondImage: string; thirdImage: string }) {
  const [paused, setPaused] = useState(false);
  const images = [image, secondImage, thirdImage].filter(Boolean);

  return <div className="hero-visual" data-paused={paused} data-slideshow={images.length > 1}>
    {images.map((src, index) => <div className={`hero-slide hero-slide-${index}`} key={`${index}-${src}`} aria-hidden={index !== 0}>
      <Image className="hero-image" src={src} alt={index === 0 ? (image.startsWith("/images/generated/") ? "Visualisierung eines modernisierten Innenraums" : "Innenausbau und Modernisierung") : ""} fill priority={index === 0} sizes="(max-width: 900px) 100vw, 55vw" />
    </div>)}
    <div className="hero-visual-label">{label}</div>
    {images.some((src) => src.startsWith("/images/generated/")) && <div className="hero-visual-note">Bildauswahl enthält Visualisierungen</div>}
    {images.length > 1 && <button type="button" className="hero-motion-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? "Bildwechsel fortsetzen" : "Bildwechsel pausieren"} title={paused ? "Bildwechsel fortsetzen" : "Bildwechsel pausieren"}>{paused ? "▶" : "Ⅱ"}</button>}
  </div>;
}
