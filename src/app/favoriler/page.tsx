"use client";

import Link from "next/link";
import { PerfumeCard } from "@/components/PerfumeCard";
import { EmptyState } from "@/components/ui";
import { getPerfume } from "@/data/perfumes";
import { useStore } from "@/lib/store";

export default function FavoritesPage() {
  const { favorites } = useStore();
  const perfumes = favorites.map(getPerfume).filter((p) => p !== undefined);

  return (
    <div className="pt-10">
      <h1 className="mb-2 font-display text-4xl">Favoriler</h1>
      <p className="mb-6 text-sm text-muted">Deneme sürümünde favoriler yalnızca bu tarayıcıda saklanır.</p>
      {perfumes.length === 0 ? (
        <EmptyState title="Henüz favorin yok">
          <Link href="/parfumler" className="text-accent hover:underline">Parfümlere göz at</Link> ve beğendiklerini ♡ ile ekle.
        </EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {perfumes.map((p) => (
            <PerfumeCard key={p.slug} perfume={p} />
          ))}
        </div>
      )}
    </div>
  );
}
