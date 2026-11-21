"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/lang-client";

type Props = { image: string; alt: string; name: string; slug: string; notes: { label: string; text: string }[] };

/**
 * Scroll story: the page holds still while you scroll and the bottle turns and grows,
 * and the scent is revealed note by note (top, heart, base). With reduced motion it is a plain list.
 */
export default function ScentStory({ image, alt, name, slug, notes }: Props) {
  const t = useT();
  const root = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [still, setStill] = useState(false);
  const n = notes.length;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setStill(true); return; }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = root.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      el.style.setProperty("--p", p.toFixed(3));
      setStep(Math.min(n - 1, Math.floor(p * n * 0.999)));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); if (raf) cancelAnimationFrame(raf); };
  }, [n]);

  const bottle = (
    <div className="story-bottle relative aspect-[4/5] w-[min(62vw,340px)] overflow-hidden rounded border border-line2 shadow-[0_30px_80px_rgba(0,0,0,0.55)] md:w-[min(30vw,380px)]">
      <Image src={image} alt={alt} fill sizes="(min-width: 768px) 380px, 62vw" className="object-cover object-[center_40%]" />
    </div>
  );

  if (still) {
    return (
      <section id="scent-story" data-no-reveal className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-10 px-5 py-14 md:px-10">
        {bottle}
        <ol className="m-0 flex min-w-0 flex-[1_1_320px] list-none flex-col gap-6 p-0">
          {notes.map((k) => (<li key={k.label}><div className="font-brand text-[11px] uppercase tracking-[0.22em] text-accent">{k.label}</div><div className="font-display text-[34px] leading-tight">{k.text}</div></li>))}
        </ol>
      </section>
    );
  }

  return (
    <section id="scent-story" ref={root} data-no-reveal aria-label={t("Scent story")} className="oud-pattern relative" style={{ height: `${Math.max(220, n * 100 + 40)}vh`, ["--p" as string]: 0 }}>
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center gap-6 overflow-hidden px-5 pt-16 md:flex-row md:gap-16 md:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 30%, var(--bg) 100%)" }} />
        <div className="relative [perspective:1100px]">
          <div className="story-bottle-wrap" style={{ transform: "translateY(calc((0.5 - var(--p)) * 44px)) rotateY(calc((var(--p) - 0.5) * 46deg)) scale(calc(0.86 + var(--p) * 0.2))", transformStyle: "preserve-3d" }}>
            {bottle}
          </div>
        </div>
        <div className="relative flex min-w-0 max-w-[460px] flex-col gap-4 md:gap-6">
          <div className="font-brand text-[10px] uppercase tracking-[0.22em] text-accent md:text-[11px]">{t("Scent story")}</div>
          <h2 className="font-display text-[30px] font-medium leading-[1.05] md:text-[48px]">{name}</h2>
          <div className="flex flex-col gap-3" aria-live="polite">
            {notes.map((k, i) => (
              <div key={k.label} data-active={i === step} className={`border-s-2 ps-4 transition-all duration-700 ${i === step ? "translate-x-0 border-[var(--gold-hi,#F2C27A)] opacity-100" : "border-line opacity-25 ltr:-translate-x-2 rtl:translate-x-2"}`}>
                <div className="text-xs uppercase tracking-[0.18em] text-muted">{k.label}</div>
                <div className="font-display text-[26px] leading-tight md:text-[34px]">{k.text}</div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2" aria-hidden="true">
            {notes.map((k, i) => (<span key={k.label} className={`h-1 flex-1 rounded transition-colors duration-500 ${i <= step ? "bg-accent" : "bg-line2"}`} />))}
          </div>
          <Link href={`/product/${slug}`} className="w-fit text-sm uppercase tracking-[0.08em] text-accent underline">{t("View perfume")}</Link>
        </div>
      </div>
    </section>
  );
}
