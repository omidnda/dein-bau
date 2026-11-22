"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const elements = document.querySelectorAll<HTMLElement>(
      "main .section-heading, main .trust-heading, main .process-header, main .company-feature-image, main .company-feature-grid > div:last-child, main .contact-layout > div:first-child, main .contact-form, main .gallery-card, main .editorial-service, main .trust-grid article, main .timeline-layout, main .before-after",
    );
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("scroll-reveal-visible");
          observer.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08, rootMargin: "0px 0px -30px 0px" });

    elements.forEach((element) => {
      if (element.getBoundingClientRect().top >= window.innerHeight) {
        element.classList.add("scroll-reveal-pending");
        observer.observe(element);
      }
    });
    return () => {
      observer.disconnect();
      elements.forEach((element) => element.classList.remove("scroll-reveal-pending", "scroll-reveal-visible"));
    };
  }, []);
  return null;
}
