"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";

export function PerfumeActions({ slug, compact = false }: { slug: string; compact?: boolean }) {
  const { favorites, compare, toggleFavorite, toggleCompare, maxCompare } = useStore();
  const [warn, setWarn] = useState(false);
  const fav = favorites.includes(slug);
  const cmp = compare.includes(slug);

  const base = compact
    ? "rounded-full border px-3 py-1 text-xs transition"
    : "rounded-full border px-4 py-2 text-sm transition";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        aria-pressed={fav}
        onClick={() => toggleFavorite(slug)}
        className={`${base} ${fav ? "border-accent bg-accent text-white" : "border-line bg-card hover:border-accent"}`}
      >
        {fav ? "♥ Favoride" : "♡ Favori"}
      </button>
      <button
        type="button"
        aria-pressed={cmp}
        onClick={() => setWarn(!toggleCompare(slug))}
        className={`${base} ${cmp ? "border-ink bg-ink text-white" : "border-line bg-card hover:border-ink"}`}
      >
        {cmp ? "✓ Karşılaştırmada" : "+ Karşılaştır"}
      </button>
      {warn && <span className="text-xs text-accent">En fazla {maxCompare} parfüm karşılaştırılabilir.</span>}
    </div>
  );
}
