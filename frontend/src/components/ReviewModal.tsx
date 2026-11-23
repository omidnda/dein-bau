"use client";
import { Star, X } from "lucide-react";
import { createPortal } from "react-dom";
import { useState, type FormEvent } from "react";
import styles from "./ReviewModal.module.css";

export default function ReviewModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error" | "limited">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!rating) return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    try {
      const response = await fetch("/api/reviews", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...values, rating }) });
      if (!response.ok) { setState(response.status === 429 ? "limited" : "error"); return; }
      form.reset(); setRating(0); setState("sent");
    } catch { setState("error"); }
  }
  return createPortal(<dialog ref={(dialog) => { if (dialog && !dialog.open) dialog.showModal(); }} className={styles.dialog} aria-labelledby="review-dialog-title" onClose={onClose}>
    <div className={styles.heading}><div><p className="eyebrow">Ihre Meinung</p><h3 id="review-dialog-title">Bewertung abgeben</h3></div><button type="button" className={styles.close} aria-label="Schließen" onClick={onClose}><X size={22} aria-hidden="true" /></button></div>
    {state === "sent" ? <div role="status"><p>Vielen Dank. Ihre Bewertung wird vor der Veröffentlichung geprüft.</p><button type="button" className="button button-primary" onClick={onClose}>Schließen</button></div> : <form className={styles.form} onSubmit={submit}>
      <p>Ihr Name, Ihre Bewertung und Ihr Text werden nach der Freigabe öffentlich angezeigt. Bitte geben Sie keine vertraulichen Daten an.</p>
      <label className={styles.field}>Name<input name="name" required maxLength={100} autoComplete="name" /></label>
      <fieldset className={styles.rating} onMouseLeave={() => setHoverRating(0)}><legend>Ihre Bewertung</legend><div className={styles.stars}>{[1, 2, 3, 4, 5].map((value) => <label key={value} onMouseEnter={() => setHoverRating(value)}><input type="radio" name="ratingChoice" value={value} checked={rating === value} onChange={() => setRating(value)} required aria-label={`${value} ${value === 1 ? "Stern" : "Sterne"}`} /><Star aria-hidden="true" size={32} fill={value <= (hoverRating || rating) ? "currentColor" : "none"} /></label>)}</div><span className={styles.caption}>{rating ? `${rating} von 5 Sternen` : "Bitte Sterne auswählen"}</span></fieldset>
      <label className={styles.field}>Ihre Erfahrung<textarea name="message" required maxLength={2000} rows={5} /></label><input className="honeypot" name="website" tabIndex={-1} autoComplete="off" /><button className="button button-primary" disabled={state === "sending"}>{state === "sending" ? "Wird gesendet …" : "Bewertung senden"}</button>{state === "error" && <p className="form-error" role="alert">Ihre Bewertung konnte nicht gesendet werden. Bitte versuchen Sie es erneut.</p>}{state === "limited" && <p className="form-error" role="alert">Zu viele Anfragen. Bitte versuchen Sie es später erneut.</p>}
    </form>}
  </dialog>, document.body);
}
