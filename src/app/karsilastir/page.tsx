"use client";

import Link from "next/link";
import { EmptyState, FamilyTag, familyColor } from "@/components/ui";
import { NOTE_BY_ID } from "@/data/notes";
import { brandName, getPerfume } from "@/data/perfumes";
import { LAYERS, LAYER_LABELS } from "@/data/types";
import { useStore } from "@/lib/store";

export default function ComparePage() {
  const { compare, toggleCompare, clearCompare } = useStore();
  const perfumes = compare.map(getPerfume).filter((p) => p !== undefined);

  // Birden fazla parfümde ortak olan notalar vurgulanır
  const counts = new Map<string, number>();
  for (const p of perfumes) for (const id of new Set(LAYERS.flatMap((l) => p.notes[l]))) counts.set(id, (counts.get(id) ?? 0) + 1);

  return (
    <div className="pt-10">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-2">
        <h1 className="font-display text-4xl">Karşılaştır</h1>
        {perfumes.length > 0 && (
          <button onClick={clearCompare} className="text-sm text-muted hover:text-accent">Listeyi temizle</button>
        )}
      </div>

      {perfumes.length === 0 ? (
        <EmptyState title="Karşılaştırma listen boş">
          <Link href="/parfumler" className="text-accent hover:underline">Parfümlerden</Link> en fazla 4 tanesini “+ Karşılaştır” ile ekle.
        </EmptyState>
      ) : (
        <>
          {perfumes.length > 1 && (
            <p className="mb-4 text-xs text-muted">
              <span className="rounded-full bg-accent px-2 py-0.5 text-white">Vurgulu</span> notalar birden fazla parfümde ortaktır.
            </p>
          )}
          <div className="overflow-x-auto rounded-2xl border border-line bg-card">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-32 p-4" />
                  {perfumes.map((p) => (
                    <th key={p.slug} className="p-4 text-left align-top font-normal">
                      <p className="text-xs uppercase tracking-wider text-muted">{brandName(p.brand)}</p>
                      <Link href={`/parfum/${p.slug}`} className="font-display text-xl hover:text-accent">{p.name}</Link>
                      <button onClick={() => toggleCompare(p.slug)} className="mt-1 block text-xs text-muted hover:text-accent">
                        Kaldır
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <Row label="Koku ailesi">{perfumes.map((p) => <FamilyTag key={p.slug} family={p.family} />)}</Row>
                <Row label="Yıl">{perfumes.map((p) => p.year)}</Row>
                <Row label="Konsantrasyon">{perfumes.map((p) => p.concentration ?? "Belirtilmemiş")}</Row>
                <Row label="Cinsiyet">{perfumes.map((p) => p.gender)}</Row>
                {LAYERS.map((l) => (
                  <Row key={l} label={LAYER_LABELS[l]}>
                    {perfumes.map((p) => (
                      <ul key={p.slug} className="flex flex-wrap gap-1">
                        {p.notes[l].map((id) => {
                          const shared = perfumes.length > 1 && (counts.get(id) ?? 0) > 1;
                          return (
                            <li
                              key={id}
                              className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${shared ? "bg-accent text-white" : "border border-line"}`}
                            >
                              {!shared && NOTE_BY_ID[id] && <span className="h-1.5 w-1.5 rounded-full" style={{ background: familyColor(NOTE_BY_ID[id].family) }} />}
                              {NOTE_BY_ID[id]?.name ?? id}
                            </li>
                          );
                        })}
                      </ul>
                    ))}
                  </Row>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode[] }) {
  return (
    <tr className="border-t border-line">
      <th scope="row" className="p-4 text-left align-top text-xs font-medium text-muted">{label}</th>
      {children.map((c, i) => (
        <td key={i} className="p-4 align-top">{c}</td>
      ))}
    </tr>
  );
}
