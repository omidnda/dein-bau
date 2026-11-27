"use client";
import { useEffect, useState } from "react";
import { Stars, type Review } from "@/components/Reviews";

type AdminReview = Review & { status: "pending" | "approved" | "rejected" };
const statusLabels = {
  pending: "Ausstehend",
  approved: "Freigegeben",
  rejected: "Abgelehnt",
};
export default function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [notice, setNotice] = useState("Bewertungen werden geladen …");
  const [busy, setBusy] = useState<number | null>(null);
  async function load() {
    try {
      const response = await fetch("/api/admin/reviews", { cache: "no-store" });
      if (!response.ok) throw new Error();
      setReviews((await response.json()).results);
      setNotice("");
    } catch {
      setNotice("Bewertungen konnten nicht geladen werden.");
    }
  }
  useEffect(() => {
    void Promise.resolve().then(load);
  }, []);
  async function change(review: AdminReview, status?: AdminReview["status"]) {
    if (!status && !window.confirm("Diese Bewertung endgültig löschen?"))
      return;
    setBusy(review.id);
    try {
      const response = await fetch(`/api/admin/reviews?id=${review.id}`, {
        method: status ? "PATCH" : "DELETE",
        ...(status
          ? {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status }),
            }
          : {}),
      });
      if (!response.ok) throw new Error();
      await load();
      setNotice(status ? "Status gespeichert." : "Bewertung gelöscht.");
    } catch {
      setNotice("Änderung fehlgeschlagen.");
    } finally {
      setBusy(null);
    }
  }
  return (
    <section className="admin-card">
      <h2>Bewertungen</h2>
      <p>
        Neue Bewertungen erscheinen erst nach Ihrer Freigabe. Bewertungen sind
        nicht automatisch als Kunden verifiziert.
      </p>
      <p role="status">{notice}</p>
      {reviews.length === 0 && !notice && <p>Keine Bewertungen vorhanden.</p>}
      {reviews.map((review) => (
        <article className="admin-submission" key={review.id}>
          <strong>{review.name}</strong> · <Stars rating={review.rating} />
          <p>{review.message}</p>
          <p>
            <small>
              {new Date(review.createdAt).toLocaleString("de-DE")} ·{" "}
              {statusLabels[review.status]}
            </small>
          </p>
          <div className="review-actions">
            <button
              className="filter"
              disabled={busy !== null || review.status === "approved"}
              onClick={() => change(review, "approved")}
            >
              Freigeben
            </button>
            <button
              className="filter"
              disabled={busy !== null || review.status === "rejected"}
              onClick={() => change(review, "rejected")}
            >
              Ablehnen
            </button>
            <button
              className="filter"
              disabled={busy !== null || review.status === "pending"}
              onClick={() => change(review, "pending")}
            >
              Zurückstellen
            </button>
            <button
              className="filter"
              disabled={busy !== null}
              onClick={() => change(review)}
            >
              Löschen
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
