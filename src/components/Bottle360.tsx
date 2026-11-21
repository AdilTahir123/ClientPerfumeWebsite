"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/lib/lang-client";

/**
 * A real 360° viewer: the shop uploads photos taken around the bottle and dragging (or the arrow keys) steps through them.
 * It turns slowly by itself until the visitor touches it.
 */
export default function Bottle360({ frames, alt }: { frames: string[]; alt: string }) {
  const t = useT();
  const [i, setI] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; i: number } | null>(null);
  const touched = useRef(false);
  const n = frames.length;
  const wrap = (k: number) => ((k % n) + n) % n;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (!touched.current) setI((k) => (k + 1) % n);
    }, 900);
    return () => window.clearInterval(id);
  }, [n]);

  return (
    <div
      ref={box}
      role="group"
      aria-roledescription="360 degree viewer"
      aria-label={alt}
      tabIndex={0}
      data-testid="bottle360"
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { touched.current = true; setI((k) => wrap(k + 1)); }
        if (e.key === "ArrowLeft") { touched.current = true; setI((k) => wrap(k - 1)); }
      }}
      onPointerDown={(e) => { touched.current = true; drag.current = { x: e.clientX, i }; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); }}
      onPointerMove={(e) => {
        if (!drag.current || !box.current) return;
        const w = box.current.getBoundingClientRect().width;
        setI(wrap(drag.current.i + Math.round(((e.clientX - drag.current.x) / w) * n * 1.2)));
      }}
      onPointerUp={() => { drag.current = null; }}
      onPointerCancel={() => { drag.current = null; }}
      className="relative h-[360px] min-w-0 flex-[1_1_380px] cursor-grab touch-pan-y select-none overflow-hidden rounded border border-line active:cursor-grabbing md:h-[540px]"
      style={{ background: "radial-gradient(ellipse at 50% 55%, var(--hero1) 0%, var(--hero2) 55%, var(--bg) 100%)" }}
    >
      {frames.map((src, k) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt={k === i ? alt : ""} aria-hidden={k !== i} draggable={false} loading={k === 0 ? "eager" : "lazy"} data-frame={k} className={`absolute inset-5 h-[calc(100%-40px)] w-[calc(100%-40px)] rounded object-cover md:inset-9 md:h-[calc(100%-72px)] md:w-[calc(100%-72px)] ${k === i ? "opacity-100" : "pointer-events-none opacity-0"}`} />
      ))}
      <div className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-line2 bg-bg/90 px-4 py-2 text-xs text-muted md:text-[13px]">
        <span aria-hidden="true">⟲</span> {t("Drag to spin the bottle 360°")} <span data-testid="frame-no" className="tabular-nums">{i + 1}/{n}</span>
      </div>
    </div>
  );
}
