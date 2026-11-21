"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useT } from "@/lib/lang-client";
import { formatPrice } from "@/lib/format";

type P = { slug: string; name: string; tag: string; moods: string[]; image: string; imageAlt: string; price: number; stock: number };

const chip = "min-h-11 cursor-pointer rounded-full border px-5 text-sm transition-colors";

/** "Find your scent": pick who it is for and the occasion, and only perfumes the shop has marked for that are shown. */
export default function ScentPicker({ products, moods }: { products: P[]; moods: string[] }) {
  const t = useT();
  const [who, setWho] = useState<string>("any");
  const [mood, setMood] = useState<string>("any");
  const list = useMemo(
    () => products.filter((p) => (who === "any" || p.tag === who || p.tag === "Unisex") && (mood === "any" || p.moods.includes(mood))),
    [products, who, mood],
  );
  const on = "border-accent bg-accent/15 text-accent";
  const off = "border-line2 text-ink hover:border-accent";
  return (
    <div className="flex flex-col gap-6" data-testid="picker">
      <div className="flex flex-col gap-3">
        <div className="text-xs uppercase tracking-[0.18em] text-muted">{t("Who is it for?")}</div>
        <div className="flex flex-wrap gap-2" role="group" aria-label={t("Who is it for?")}>
          {[["any", "Anyone"], ["For him", "For him"], ["For her", "For her"]].map(([v, l]) => (
            <button key={v} type="button" aria-pressed={who === v} onClick={() => setWho(v)} className={`${chip} ${who === v ? on : off}`}>{t(l)}</button>
          ))}
        </div>
      </div>
      {moods.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="text-xs uppercase tracking-[0.18em] text-muted">{t("What is the occasion?")}</div>
          <div className="flex flex-wrap gap-2" role="group" aria-label={t("What is the occasion?")}>
            {["any", ...moods].map((m) => (
              <button key={m} type="button" aria-pressed={mood === m} onClick={() => setMood(m)} className={`${chip} ${mood === m ? on : off}`}>{m === "any" ? t("Any occasion") : t(m)}</button>
            ))}
          </div>
        </div>
      )}
      <div aria-live="polite" className="flex flex-wrap gap-4" data-testid="picker-results">
        {list.length === 0 && <p className="m-0 text-muted">{t("No perfume matches that yet. Try another occasion.")}</p>}
        {list.map((p) => (
          <Link key={p.slug} href={`/product/${p.slug}`} className="flex min-w-0 flex-[1_1_260px] items-center gap-4 rounded border border-line bg-surface p-3 hover:border-accent">
            <span className="relative h-24 w-20 shrink-0 overflow-hidden rounded"><Image src={p.image} alt={p.imageAlt} fill sizes="80px" className="object-cover" /></span>
            <span className="flex min-w-0 flex-col gap-1">
              <span className="font-display text-[22px] leading-tight">{p.name}</span>
              <span className="text-sm text-muted">{t(p.tag)} · {formatPrice(p.price)}</span>
              <span className="text-sm text-accent">{t("View perfume")} →</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
