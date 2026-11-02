import { NOTE_BY_ID } from "@/data/notes";
import { LAYERS, type Layer, type Perfume, type Pyramid } from "@/data/types";

/** Ağırlıklar koda dağılmasın diye tek yerde tutulur. */
export const MATCH_CONFIG = {
  layerWeights: { top: 0.25, middle: 0.35, base: 0.4 } as Record<Layer, number>,
  credit: {
    exactSameLayer: 1,
    exactOtherLayer: 0.6,
    familySameLayer: 0.35,
    familyOtherLayer: 0.2,
  },
  /** Seçime ne kadar uyulduğu (recall) ile parfümün ne kadarının seçimle örtüştüğü (coverage) arasındaki pay. */
  recallShare: 0.85,
};

export type MatchKind = keyof typeof MATCH_CONFIG.credit;

export interface NoteMatch {
  noteId: string;
  selectedLayer: Layer;
  kind: MatchKind | "none";
  /** Parfümde eşleşen nota (aile eşleşmesinde farklı olabilir). */
  matchedNoteId?: string;
  matchedLayer?: Layer;
}

export interface MatchResult {
  perfume: Perfume;
  score: number; // 0-100
  matches: NoteMatch[];
}

export function emptySelection(): Pyramid {
  return { top: [], middle: [], base: [] };
}

export function selectionSize(sel: Pyramid): number {
  return sel.top.length + sel.middle.length + sel.base.length;
}

function family(id: string) {
  return NOTE_BY_ID[id]?.family;
}

function bestMatch(noteId: string, layer: Layer, perfume: Perfume): NoteMatch {
  const { credit } = MATCH_CONFIG;
  const candidates: NoteMatch[] = [];

  for (const pl of LAYERS) {
    for (const pid of perfume.notes[pl]) {
      const same = pl === layer;
      if (pid === noteId) {
        candidates.push({ noteId, selectedLayer: layer, kind: same ? "exactSameLayer" : "exactOtherLayer", matchedNoteId: pid, matchedLayer: pl });
      } else if (family(pid) && family(pid) === family(noteId)) {
        candidates.push({ noteId, selectedLayer: layer, kind: same ? "familySameLayer" : "familyOtherLayer", matchedNoteId: pid, matchedLayer: pl });
      }
    }
  }

  if (candidates.length === 0) return { noteId, selectedLayer: layer, kind: "none" };
  return candidates.reduce((a, b) =>
    credit[b.kind as MatchKind] > credit[a.kind as MatchKind] ? b : a,
  );
}

/** Kullanıcının seçimine göre tek bir parfüm için 0-100 arası benzerlik skoru. */
export function scorePerfume(selection: Pyramid, perfume: Perfume): MatchResult {
  const { layerWeights, credit, recallShare } = MATCH_CONFIG;
  const matches: NoteMatch[] = [];

  let weightedRecall = 0;
  let weightSum = 0;
  for (const layer of LAYERS) {
    const selected = selection[layer];
    if (selected.length === 0) continue;
    let layerCredit = 0;
    for (const noteId of selected) {
      const m = bestMatch(noteId, layer, perfume);
      matches.push(m);
      if (m.kind !== "none") layerCredit += credit[m.kind];
    }
    weightedRecall += layerWeights[layer] * (layerCredit / selected.length);
    weightSum += layerWeights[layer];
  }

  if (weightSum === 0) return { perfume, score: 0, matches };

  const recall = weightedRecall / weightSum;

  // Çok notalı parfümlerin avantaj kazanmaması için: parfüm notalarının ne kadarı seçimde birebir var?
  const selectedIds = new Set(LAYERS.flatMap((l) => selection[l]));
  const perfumeIds = new Set(LAYERS.flatMap((l) => perfume.notes[l]));
  let overlap = 0;
  for (const id of perfumeIds) if (selectedIds.has(id)) overlap++;
  const coverage = perfumeIds.size ? overlap / perfumeIds.size : 0;

  const raw = recallShare * recall + (1 - recallShare) * coverage;
  return { perfume, score: Math.round(Math.min(1, raw) * 100), matches };
}

export function matchPerfumes(
  selection: Pyramid,
  perfumes: Perfume[],
  { minScore = 1, exclude }: { minScore?: number; exclude?: string } = {},
): MatchResult[] {
  if (selectionSize(selection) === 0) return [];
  return perfumes
    .filter((p) => p.slug !== exclude)
    .map((p) => scorePerfume(selection, p))
    .filter((r) => r.score >= minScore)
    .sort((a, b) => b.score - a.score || a.perfume.name.localeCompare(b.perfume.name, "tr"));
}
