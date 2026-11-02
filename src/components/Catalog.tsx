"use client";

import { useMemo, useState } from "react";
import { FAMILY_LABELS, noteName } from "@/data/notes";
import { BRANDS, PERFUMES, brandName } from "@/data/perfumes";
import { LAYERS, type Gender, type NoteFamily } from "@/data/types";
import { normalize } from "@/lib/text";
import { PerfumeCard } from "./PerfumeCard";
import { EmptyState } from "./ui";

type Sort = "name" | "year-desc" | "year-asc";

const selectCls = "rounded-xl border border-line bg-card px-3 py-2 text-sm outline-none focus:border-accent";

export function Catalog({ initialQuery = "" }: { initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [family, setFamily] = useState<NoteFamily | "">("");
  const [sort, setSort] = useState<Sort>("name");

  const results = useMemo(() => {
    const nq = normalize(q);
    const list = PERFUMES.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (gender && p.gender !== gender) return false;
      if (family && p.family !== family) return false;
      if (!nq) return true;
      const haystack = [p.name, brandName(p.brand), ...LAYERS.flatMap((l) => p.notes[l].map(noteName))];
      return haystack.some((h) => normalize(h).includes(nq));
    });
    return list.sort((a, b) =>
      sort === "year-desc" ? b.year - a.year : sort === "year-asc" ? a.year - b.year : a.name.localeCompare(b.name, "tr"),
    );
  }, [q, brand, gender, family, sort]);

  const filtered = q || brand || gender || family;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Parfüm, marka veya nota ara"
          aria-label="Ara"
          className={`${selectCls} sm:col-span-2 lg:col-span-1`}
        />
        <select aria-label="Marka" value={brand} onChange={(e) => setBrand(e.target.value)} className={selectCls}>
          <option value="">Tüm markalar</option>
          {BRANDS.map((b) => (
            <option key={b.slug} value={b.slug}>{b.name}</option>
          ))}
        </select>
        <select aria-label="Cinsiyet" value={gender} onChange={(e) => setGender(e.target.value as Gender | "")} className={selectCls}>
          <option value="">Tüm cinsiyetler</option>
          <option value="kadın">Kadın</option>
          <option value="erkek">Erkek</option>
          <option value="unisex">Unisex</option>
        </select>
        <select aria-label="Koku ailesi" value={family} onChange={(e) => setFamily(e.target.value as NoteFamily | "")} className={selectCls}>
          <option value="">Tüm koku aileleri</option>
          {(Object.keys(FAMILY_LABELS) as NoteFamily[]).map((f) => (
            <option key={f} value={f}>{FAMILY_LABELS[f]}</option>
          ))}
        </select>
        <select aria-label="Sırala" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectCls}>
          <option value="name">İsme göre</option>
          <option value="year-desc">En yeni</option>
          <option value="year-asc">En eski</option>
        </select>
      </div>

      <div className="flex items-center justify-between text-sm text-muted">
        <span>{results.length} parfüm</span>
        {filtered && (
          <button
            onClick={() => { setQ(""); setBrand(""); setGender(""); setFamily(""); }}
            className="hover:text-accent"
          >
            Filtreleri temizle
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <EmptyState title="Sonuç bulunamadı">Aramanı veya filtreleri değiştirmeyi dene.</EmptyState>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <PerfumeCard key={p.slug} perfume={p} />
          ))}
        </div>
      )}
    </div>
  );
}
