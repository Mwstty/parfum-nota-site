import Link from "next/link";
import { noteName } from "@/data/notes";
import { brandName } from "@/data/perfumes";
import type { Perfume } from "@/data/types";
import type { NoteMatch } from "@/lib/matching";
import { PerfumeActions } from "./PerfumeActions";
import { FamilyTag, PerfumeVisual, ScoreRing } from "./ui";

const KIND_STYLE: Record<string, string> = {
  exactSameLayer: "bg-accent text-white",
  exactOtherLayer: "bg-accent-soft text-accent",
  familySameLayer: "border border-accent/40 text-accent",
  familyOtherLayer: "border border-line text-muted",
};

export function PerfumeCard({
  perfume,
  score,
  matches,
}: {
  perfume: Perfume;
  score?: number;
  matches?: NoteMatch[];
}) {
  const hits = matches?.filter((m) => m.kind !== "none") ?? [];
  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-line bg-card p-4 transition hover:shadow-sm">
      <Link href={`/parfum/${perfume.slug}`} className="group flex flex-col gap-3">
        <PerfumeVisual perfume={perfume} />
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-muted">{brandName(perfume.brand)}</p>
            <h3 className="font-display text-xl leading-tight group-hover:text-accent">{perfume.name}</h3>
            <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-muted">
              <span>
                {perfume.concentration ? `${perfume.concentration} · ` : ""}{perfume.year}
              </span>
              <FamilyTag family={perfume.family} />
            </p>
          </div>
          {score !== undefined && <ScoreRing score={score} />}
        </div>
      </Link>

      {hits.length > 0 && (
        <ul className="flex flex-wrap gap-1.5" aria-label="Eşleşen notalar">
          {hits.map((m) => (
            <li
              key={`${m.selectedLayer}-${m.noteId}`}
              className={`rounded-full px-2 py-0.5 text-[11px] ${KIND_STYLE[m.kind]}`}
              title={
                m.kind.startsWith("family")
                  ? `${noteName(m.noteId)} yerine aynı aileden: ${noteName(m.matchedNoteId!)}`
                  : undefined
              }
            >
              {m.kind.startsWith("family") ? `≈ ${noteName(m.matchedNoteId!)}` : noteName(m.noteId)}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-auto">
        <PerfumeActions slug={perfume.slug} compact />
      </div>
    </article>
  );
}

export function MatchLegend() {
  return (
    <div className="flex flex-wrap gap-3 text-[11px] text-muted">
      <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-accent" /> Aynı katmanda</span>
      <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full bg-accent-soft" /> Farklı katmanda</span>
      <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-full border border-accent/40" /> ≈ Aynı aileden</span>
    </div>
  );
}
