"use client";
import Image from "next/image";
import { useState, type PointerEvent } from "react";

export default function BeforeAfterSlider() {
  const [position, setPosition] = useState(52);
  function moveHandle(event: PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width) setPosition(Math.min(100, Math.max(0, ((event.clientX - bounds.left) / bounds.width) * 100)));
  }
  return <div className="before-after" onPointerDown={(event) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveHandle(event);
  }} onPointerMove={(event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) moveHandle(event);
  }}>
    <div className="after-image"><Image src="/images/generated/bathroom-renovation.png" alt="Visualisierung einer Badsanierung" fill sizes="(max-width: 900px) 100vw, 900px" /></div>
    <div className="before-image" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}><Image src="/images/generated/material-planning.png" alt="Visualisierung der Materialplanung" fill sizes="(max-width: 900px) 100vw, 900px" /></div>
    <div className="slider-line" style={{ left: `${position}%` }} aria-hidden="true"><span className="comparison-handle"><svg viewBox="0 0 32 32" fill="none"><path d="M5 16h22M10 11l-5 5 5 5M22 11l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span></div>
    <input className="comparison-range" type="range" min="0" max="100" value={position} onChange={(event) => setPosition(Number(event.target.value))} aria-label="Vergleich zwischen Planung und Ausführung verschieben" />
    <span className="compare-label before">Planung</span><span className="compare-label after">Ausführung</span>
  </div>;
}
