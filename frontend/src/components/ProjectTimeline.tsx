"use client";

import { useState } from "react";

const steps = [
  ["Anfrage", "Sie schildern uns Ihr Vorhaben und Ihre ersten Vorstellungen."],
  ["Beratung & Besichtigung", "Wir besprechen Ihre Wünsche und erfassen die Ausgangssituation vor Ort."],
  ["Individuelles Angebot", "Sie erhalten eine nachvollziehbare Beschreibung der vereinbarten Leistungen."],
  ["Vorbereitung & Planung", "Wir stimmen Termine, Materialien und beteiligte Fachbetriebe aufeinander ab."],
  ["Fachgerechte Ausführung", "Eigene Fachkräfte und projektbezogene Partner setzen die vereinbarten Arbeiten um."],
  ["Fertigstellung & Übergabe", "Zum Abschluss prüfen wir gemeinsam die vereinbarten Leistungen."],
];

export default function ProjectTimeline() {
  const [active, setActive] = useState(0);
  return <div className="timeline-layout"><div className="timeline-detail" aria-live="polite"><span>0{active + 1} / 06</span><h3>{steps[active][0]}</h3><p>{steps[active][1]}</p></div><div className="timeline-list" aria-label="Projektablauf">{steps.map(([title, description], index) => <button type="button" key={title} className={active === index ? "timeline-item is-active" : "timeline-item"} onClick={() => setActive(index)} aria-pressed={active === index}><span>0{index + 1}</span><span><strong>{title}</strong><small>{description}</small></span><span aria-hidden="true">↗</span></button>)}</div></div>;
}
