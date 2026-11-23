"use client";
import { ArrowLeft, ArrowRight, Pause, Play, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ReviewModal from "@/components/ReviewModal";
import type { HomeContent } from "@/content/site";

export type Review = { id: number; name: string; rating: number; message: string; createdAt: string };
export type ReviewSummary = { results: Review[]; count: number; average: number | null };

export function Stars({ rating }: { rating: number }) {
  return <span className="review-stars" aria-label={`${rating} von 5 Sternen`} role="img">{[1, 2, 3, 4, 5].map((value) => <Star key={value} aria-hidden="true" size={18} fill={value <= rating ? "currentColor" : "none"} />)}</span>;
}

export default function Reviews({ data, copy }: { data: ReviewSummary | null; copy: HomeContent }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [interacting, setInteracting] = useState(false);
  const reviewCount = data?.results.length ?? 0;

  useEffect(() => {
    if (!playing || interacting || modalOpen || reviewCount < 2) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const timer = window.setInterval(() => {
      const track = trackRef.current;
      const card = track?.querySelector<HTMLElement>(".review-card");
      if (motion.matches || document.hidden || !track || !card || track.scrollWidth <= track.clientWidth + 1) return;
      const end = track.scrollWidth - track.clientWidth;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.scrollTo({ left: track.scrollLeft >= end - 2 ? 0 : Math.min(end, track.scrollLeft + card.offsetWidth + gap), behavior: "smooth" });
    }, 5000);
    return () => window.clearInterval(timer);
  }, [playing, interacting, modalOpen, reviewCount]);
  function scrollReviews(direction: number) {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>(".review-card");
    if (!track || !card) return;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (card.offsetWidth + gap), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  return <section className="section reviews-section" id="bewertungen"><div className="container">
    <div className="section-heading"><div><p className="eyebrow">{copy.reviewsEyebrow}</p><h2>{copy.reviewsHeading}</h2></div><p className="section-intro">{copy.reviewsText}</p></div>
    <div className="reviews-toolbar"><div><h3>{copy.reviewsListHeading}</h3>{data && data.count > 0 && <p className="reviews-summary"><strong>{data.average?.toLocaleString("de-DE", { maximumFractionDigits: 1 })} / 5</strong> · {data.count} {data.count === 1 ? "Bewertung" : "Bewertungen"}</p>}</div><button type="button" className="button button-primary" onClick={() => setModalOpen(true)}>{copy.reviewsButton} <span>↗</span></button></div>
    {data === null ? <p>Bewertungen sind derzeit nicht verfügbar.</p> : data.count === 0 ? <p>Noch keine veröffentlichten Bewertungen vorhanden.</p> : <><div className="reviews-carousel" onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)} onFocus={() => setInteracting(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}><div className="reviews-list" ref={trackRef} tabIndex={0} aria-label="Bewertungen, horizontal scrollbar">{data.results.map((review) => <article className="review-card" key={review.id}><Stars rating={review.rating} /><p>{review.message}</p><strong>{review.name}</strong><time dateTime={review.createdAt}>{new Date(review.createdAt).toLocaleDateString("de-DE", { timeZone: "Europe/Berlin" })}</time></article>)}</div><div className="reviews-controls">{data.count > data.results.length && <p>Die neuesten {data.results.length} Bewertungen werden angezeigt.</p>}{data.results.length > 1 && <div><button type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Automatischen Bildwechsel pausieren" : "Automatischen Bildwechsel fortsetzen"} title={playing ? "Automatischen Bildwechsel pausieren" : "Automatischen Bildwechsel fortsetzen"}>{playing ? <Pause size={20} aria-hidden="true" /> : <Play size={20} aria-hidden="true" />}</button><button type="button" onClick={() => scrollReviews(-1)} aria-label="Vorherige Bewertung"><ArrowLeft size={20} aria-hidden="true" /></button><button type="button" onClick={() => scrollReviews(1)} aria-label="Nächste Bewertung"><ArrowRight size={20} aria-hidden="true" /></button></div>}</div></div></>}
    {modalOpen && <ReviewModal onClose={() => setModalOpen(false)} />}
  </div></section>;
}
