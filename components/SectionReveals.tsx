"use client";
import { useEffect } from "react";
export function SectionReveals() {
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;
    const nodes = document.querySelectorAll(
      ".section-heading,.feature-cards,.download-inner,.faq-heading",
    );
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("has-entered");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.12 },
    );
    nodes.forEach((n) => {
      n.classList.add("reveal-ready");
      observer.observe(n);
    });
    return () => {
      observer.disconnect();
      nodes.forEach((n) => n.classList.remove("reveal-ready", "has-entered"));
    };
  }, []);
  return null;
}
