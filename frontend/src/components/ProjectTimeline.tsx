"use client";

import { useState } from "react";

export default function ProjectTimeline({
  steps,
}: {
  steps: { title: string; text: string }[];
}) {
  const [active, setActive] = useState(0);
  if (!steps.length) return null;
  const current = Math.min(active, steps.length - 1);
  return (
    <div className="timeline-layout">
      <div className="timeline-detail" aria-live="polite">
        <span>
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(steps.length).padStart(2, "0")}
        </span>
        <h3>{steps[current].title}</h3>
        <p>{steps[current].text}</p>
      </div>
      <div className="timeline-list" aria-label="Projektablauf">
        {steps.map(({ title, text }, index) => (
          <button
            type="button"
            key={index}
            className={
              current === index ? "timeline-item is-active" : "timeline-item"
            }
            onClick={() => setActive(index)}
            aria-pressed={current === index}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span>
              <strong>{title}</strong>
              <small>{text}</small>
            </span>
            <span aria-hidden="true">↗</span>
          </button>
        ))}
      </div>
    </div>
  );
}
