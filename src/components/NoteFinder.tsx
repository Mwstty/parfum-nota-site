"use client";

import { useMemo, useState } from "react";
import { FAMILY_LABELS, NOTES, NOTE_BY_ID } from "@/data/notes";
import { PERFUMES } from "@/data/perfumes";
import { LAYERS, LAYER_LABELS, type Layer, type NoteFamily, type Pyramid } from "@/data/types";
import { emptySelection, matchPerfumes, selectionSize } from "@/lib/matching";
import { normalize } from "@/lib/text";
import { MatchLegend, PerfumeCard } from "./PerfumeCard";
import { EmptyState, familyColor } from "./ui";

const FAMILIES = Object.keys(FAMILY_LABELS) as NoteFamily[];

export function NoteFinder() {
  const [selection, setSelection] = useState<Pyramid>(emptySelection);
  const [layer, setLayer] = useState<Layer>("top");
  const [query, setQuery] = useState("");

  const layerOf = (id: string) => LAYERS.find((l) => selection[l].includes(id));

  function toggle(id: string) {
    setSelection((s) => {
      const current = LAYERS.find((l) => s[l].includes(id));
      const next: Pyramid = { top: [...s.top], middle: [...s.middle], base: [...s.base] };
      if (current) next[current] = next[current].filter((x) => x !== id);
      if (current !== layer) next[layer] = [...next[layer], id];
      return next;
    });
  }

  function remove(l: Layer, id: string) {
    setSelection((s) => ({ ...s, [l]: s[l].filter((x) => x !== id) }));
  }

  const grouped = useMemo(() => {
    const q = normalize(query);
    const list = q ? NOTES.filter((n) => normalize(n.name).includes(q)) : NOTES;
    return FAMILIES.map((f) => ({ family: f, notes: list.filter((n) => n.family === f) })).filter(
      (g) => g.notes.length > 0,
    );
  }, [query]);

  const results = useMemo(() => matchPerfumes(selection, PERFUMES), [selection]);
  const count = selectionSize(selection);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      {/* Seçici */}
      <section aria-labelledby="picker-title" className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
        <h2 id="picker-title" className="sr-only">Nota seç</h2>

        <div role="tablist" aria-label="Nota katmanı" className="grid grid-cols-3 rounded-full border border-line bg-card p-1 text-sm">
          {LAYERS.map((l) => (
            <button
              key={l}
              role="tab"
              aria-selected={layer === l}
              onClick={() => setLayer(l)}
              className={`rounded-full px-2 py-2 transition ${layer === l ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
            >
              {LAYER_LABELS[l].split(" ")[0]}
              {selection[l].length > 0 && <span className="ml-1 opacity-70">({selection[l].length})</span>}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted">
          Seçtiğin notalar <strong className="text-ink">{LAYER_LABELS[layer].toLocaleLowerCase("tr")}</strong> katmanına eklenir.
          Bir notayı başka katmanda seçersen oraya taşınır.
        </p>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Nota ara (örn. vanilya, bergamot)"
          aria-label="Nota ara"
          className="rounded-xl border border-line bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
        />

        <div className="max-h-[50vh] overflow-y-auto rounded-2xl border border-line bg-card p-4">
          {grouped.length === 0 && <p className="text-sm text-muted">Bu isimde nota bulunamadı.</p>}
          {grouped.map((g) => (
            <div key={g.family} className="mb-4 last:mb-0">
              <p className="mb-2 flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted">
                <span className="h-2 w-2 rounded-full" style={{ background: familyColor(g.family) }} />
                {FAMILY_LABELS[g.family]}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {g.notes.map((n) => {
                  const inLayer = layerOf(n.id);
                  const here = inLayer === layer;
                  return (
                    <button
                      key={n.id}
                      onClick={() => toggle(n.id)}
                      aria-pressed={here}
                      className={`rounded-full border px-3 py-1 text-sm transition ${
                        here
                          ? "border-accent bg-accent text-white"
                          : inLayer
                            ? "border-accent/40 bg-accent-soft text-accent"
                            : "border-line hover:border-accent"
                      }`}
                      title={inLayer && !here ? `${LAYER_LABELS[inLayer]} katmanında seçili` : undefined}
                    >
                      {n.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Seçim özeti */}
        <div className="rounded-2xl border border-line bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium">Senin piramidin</p>
            {count > 0 && (
              <button onClick={() => setSelection(emptySelection())} className="text-xs text-muted hover:text-accent">
                Temizle
              </button>
            )}
          </div>
          {LAYERS.map((l) => (
            <div key={l} className="flex flex-wrap items-center gap-1.5 border-t border-line py-2 first-of-type:border-t-0">
              <span className="w-12 text-xs text-muted">{LAYER_LABELS[l].split(" ")[0]}</span>
              {selection[l].length === 0 ? (
                <span className="text-xs text-muted/60">—</span>
              ) : (
                selection[l].map((id) => (
                  <button
                    key={id}
                    onClick={() => remove(l, id)}
                    className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs text-accent hover:bg-accent hover:text-white"
                    aria-label={`${NOTE_BY_ID[id]?.name} notasını kaldır`}
                  >
                    {NOTE_BY_ID[id]?.name} ×
                  </button>
                ))
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Sonuçlar */}
      <section aria-labelledby="results-title" aria-live="polite">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <h2 id="results-title" className="font-display text-2xl">
            {count === 0 ? "Eşleşmeler" : `${results.length} eşleşme`}
          </h2>
          {results.length > 0 && <MatchLegend />}
        </div>
        {count === 0 ? (
          <EmptyState title="Notalarını seçmeye başla">
            Soldan üst, orta ve alt notalar seç; sana en çok benzeyen parfümler burada benzerlik yüzdesiyle sıralanır.
          </EmptyState>
        ) : results.length === 0 ? (
          <EmptyState title="Eşleşen parfüm bulunamadı">Farklı veya daha fazla nota seçmeyi dene.</EmptyState>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {results.map((r) => (
              <PerfumeCard key={r.perfume.slug} perfume={r.perfume} score={r.score} matches={r.matches} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
