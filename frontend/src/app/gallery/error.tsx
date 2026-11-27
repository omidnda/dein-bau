"use client";
import { useEffect } from "react";
export default function GalleryError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => { console.error("Gallery unavailable", error); }, [error]);
  return <main className="container portfolio-section"><h1>Referenzen sind momentan nicht verfügbar.</h1><p>Bitte versuchen Sie es später erneut.</p><button className="button button-primary" onClick={reset}>Erneut versuchen</button></main>;
}
