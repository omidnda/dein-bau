"use client";

import Image from "next/image";
import { useState } from "react";

export default function HeroSlideshow({ image }: { image: string }) {
  const [paused, setPaused] = useState(false);
  const images = image === "/images/generated/hero-renovation.png"
    ? [image, "/images/generated/interior-renovation.png", "/images/generated/bathroom-renovation.png"]
    : [image];

  return <div className="hero-visual" data-paused={paused} data-slideshow={images.length > 1}>
    {images.map((src, index) => <div className={`hero-slide hero-slide-${index}`} key={src} aria-hidden={index !== 0}>
      <Image className="hero-image" src={src} alt={index === 0 ? "Visualisierung eines modernisierten Innenraums" : ""} fill priority={index === 0} sizes="(max-width: 900px) 100vw, 55vw" />
    </div>)}
    <div className="hero-visual-label">Innenausbau &amp; Modernisierung</div>
    <div className="hero-visual-note">Visualisierung · keine reale Projektaufnahme</div>
    {images.length > 1 && <button type="button" className="hero-motion-toggle" onClick={() => setPaused(!paused)} aria-label={paused ? "Bildwechsel fortsetzen" : "Bildwechsel pausieren"} title={paused ? "Bildwechsel fortsetzen" : "Bildwechsel pausieren"}>{paused ? "▶" : "Ⅱ"}</button>}
  </div>;
}
