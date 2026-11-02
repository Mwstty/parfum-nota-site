import Image from "next/image";
import { FAMILY_LABELS } from "@/data/notes";
import type { Brand, MediaAsset, NoteFamily, Perfume } from "@/data/types";

export function familyColor(f: NoteFamily) {
  return `var(--color-fam-${f})`;
}

/** Kaynağı ve lisansı doğrulanmış şişe görseli yoksa koku ailesine göre renklenen yer tutucu. */
export function Monogram({ perfume, size = "md" }: { perfume: Perfume; size?: "md" | "lg" }) {
  const c = familyColor(perfume.family);
  const dims = size === "lg" ? "h-40 w-full sm:h-56 text-6xl" : "h-28 w-full text-4xl";
  return (
    <div
      role="img"
      aria-label={`${perfume.name} için görsel yok`}
      className={`${dims} relative flex items-center justify-center rounded-xl font-display text-white/90`}
      style={{ background: `linear-gradient(135deg, ${c}, color-mix(in srgb, ${c} 55%, #1c1917))` }}
    >
      {perfume.name.charAt(0)}
      <span aria-hidden className="absolute bottom-2 right-3 font-sans text-[0.65rem] text-white/70">Görsel yok</span>
    </div>
  );
}

/** Parfümün kaynağı belli bir görseli varsa onu, yoksa monogramı gösterir. */
export function PerfumeVisual({ perfume, size = "md" }: { perfume: Perfume; size?: "md" | "lg" }) {
  const img = perfume.image;
  if (!img) return <Monogram perfume={perfume} size={size} />;
  const dims = size === "lg" ? "h-64 sm:h-80" : "h-28";
  return (
    <div>
      <div className={`${dims} relative w-full overflow-hidden rounded-xl bg-sand`}>
        <Image
          src={img.src}
          alt={img.alt}
          fill
          sizes={size === "lg" ? "(min-width: 768px) 40vw, 100vw" : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"}
          className="object-contain p-3"
        />
      </div>
      <ImageCredit asset={img} />
    </div>
  );
}

/** Markanın kaynağı belli bir logosu varsa onu, yoksa adını tipografik olarak gösterir. */
export function BrandMark({ brand, className = "" }: { brand: Brand; className?: string }) {
  const logo = brand.logo;
  if (!logo) return <span className={`font-display ${className}`}>{brand.name}</span>;
  return (
    <Image
      src={logo.src}
      alt={logo.alt || brand.name}
      width={logo.width}
      height={logo.height}
      className="h-8 w-auto max-w-[10rem] object-contain"
    />
  );
}

export function ImageCredit({ asset }: { asset?: MediaAsset }) {
  if (!asset) return null;
  return (
    <p className="text-[0.7rem] text-muted">
      Görsel: <a href={asset.source} target="_blank" rel="noreferrer" className="underline underline-offset-2">{asset.author ?? "Kaynak"}</a>
      {" · "}{asset.licenseUrl ? <a href={asset.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">{asset.license}</a> : asset.license}
    </p>
  );
}

export function FamilyTag({ family }: { family: NoteFamily }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className="h-2 w-2 rounded-full" style={{ background: familyColor(family) }} />
      {FAMILY_LABELS[family]}
    </span>
  );
}

export function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} title={`%${score} benzerlik`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line)" strokeWidth={4} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - score / 100)}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-semibold">%{score}</span>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-line px-6 py-12 text-center">
      <p className="font-display text-xl">{title}</p>
      {children && <div className="mt-2 text-sm text-muted">{children}</div>}
    </div>
  );
}
