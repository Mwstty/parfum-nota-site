import { NOTE_BY_ID } from "@/data/notes";
import { LAYERS, LAYER_LABELS, type Pyramid } from "@/data/types";
import { familyColor } from "./ui";

export function PyramidView({ notes }: { notes: Pyramid }) {
  return (
    <div className="flex flex-col gap-4">
      {LAYERS.map((layer, i) => (
        <section key={layer} className="rounded-2xl border border-line bg-card p-4">
          <h3 className="mb-3 flex items-baseline gap-2 text-sm font-medium">
            <span className="font-display text-lg text-accent">{["I", "II", "III"][i]}</span>
            {LAYER_LABELS[layer]}
          </h3>
          {notes[layer].length === 0 ? (
            <p className="text-sm text-muted">Bilgi yok</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {notes[layer].map((id) => {
                const n = NOTE_BY_ID[id];
                return (
                  <li key={id} className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1 text-sm">
                    {n && <span className="h-2 w-2 rounded-full" style={{ background: familyColor(n.family) }} />}
                    {n?.name ?? id}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
