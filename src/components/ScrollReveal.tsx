"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Sections below the fold fade and rise into place as they scroll into view. Skipped for reduced-motion users.
// Anything the visitor has already scrolled past (even by jumping) is shown, so nothing stays hidden.
export default function ScrollReveal() {
  const path = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const all = Array.from(document.querySelectorAll<HTMLElement>("main section, main article")).filter((e) => !e.closest("[data-no-reveal]"));
    const pending = all.filter((e) => e.getBoundingClientRect().top > window.innerHeight * 0.9);
    pending.forEach((e, i) => {
      e.classList.add("reveal");
      e.style.setProperty("--reveal-delay", `${(i % 3) * 70}ms`);
    });
    let left = pending;
    let raf = 0;
    const check = () => {
      raf = 0;
      const limit = window.innerHeight * 0.92;
      left = left.filter((e) => {
        if (e.getBoundingClientRect().top < limit) {
          e.classList.add("reveal-in");
          return false;
        }
        return true;
      });
      if (left.length === 0) { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(check); };
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
      pending.forEach((e) => e.classList.remove("reveal", "reveal-in"));
    };
  }, [path]);
  return null;
}
