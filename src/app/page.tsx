import Link from "next/link";
import { NoteFinder } from "@/components/NoteFinder";
import { NOTES } from "@/data/notes";
import { BRANDS, PERFUMES } from "@/data/perfumes";

const STEPS = [
  { number: "01", title: "Notalarını seç", detail: "Üst, orta ve alt katmanlardan kendi koku piramidini kur." },
  { number: "02", title: "Eşleşmeni gör", detail: "Gerçek parfümler 0–100 benzerlik skoruyla sıralansın." },
  { number: "03", title: "Karşılaştır, sakla", detail: "Beğendiklerini favorile, en fazla dördünü yan yana koy." },
];

// Sayılar doğrudan katalogdan hesaplanır; elle yazılmış rakam yok.
const STATS = [
  { value: PERFUMES.length, label: "parfüm" },
  { value: BRANDS.length, label: "marka" },
  { value: NOTES.length, label: "nota" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-accent">
      <span aria-hidden className="h-px w-6 bg-current" />
      {children}
    </p>
  );
}

/** Dekoratif nota piramidi: şişe + üç katman etiketi. Ürün görseli değildir. */
function HeroArt() {
  const layers = [
    { label: "Üst", note: "Bergamot", pos: "left-[10%] top-[18%]" },
    { label: "Orta", note: "Yasemin", pos: "right-[8%] top-[46%]" },
    { label: "Alt", note: "Sandal Ağacı", pos: "left-[8%] bottom-[18%]" },
  ];
  return (
    <div
      aria-hidden
      className="relative grid min-h-[340px] place-items-center overflow-hidden rounded-[2rem] bg-sand sm:min-h-[460px]"
    >
      <div className="absolute inset-4 rounded-[1.5rem] border border-ink/10" />
      <div className="absolute h-56 w-56 rotate-[-28deg] scale-x-[1.45] rounded-full border border-accent/25 sm:h-72 sm:w-72" />
      <div className="absolute h-56 w-56 rotate-[28deg] scale-x-[1.45] rounded-full border border-accent/25 sm:h-72 sm:w-72" />
      <div className="absolute right-[18%] top-[13%] h-16 w-16 rounded-full bg-[#d4b58f]/70" />

      <div className="relative z-10 mt-4 flex flex-col items-center drop-shadow-[14px_22px_18px_rgb(67_47_29/0.18)]">
        <div className="h-9 w-9 border border-[#ab8966] bg-[linear-gradient(90deg,#907052,#d0b08a,#9f7b58)] sm:h-11" />
        <div className="h-3 w-11 bg-[#ba9a75]" />
        <div className="flex h-44 w-32 flex-col items-center justify-center border border-white/75 bg-[linear-gradient(100deg,rgb(255_255_255/0.66),rgb(242_224_195/0.5)_48%,rgb(255_255_255/0.8))] text-center text-[#80674f] backdrop-blur-[3px] sm:h-52 sm:w-40">
          <span className="text-[0.6rem] tracking-[0.27em]">NOTALAR</span>
          <span className="mt-4 font-display text-lg italic leading-tight">koku<br />piramidi</span>
          <span className="mt-5 text-[0.55rem] tracking-[0.18em]">Nº 01</span>
        </div>
      </div>

      {layers.map((l) => (
        <span
          key={l.label}
          className={`absolute z-20 flex items-center gap-2 rounded-full bg-paper/80 px-3 py-1.5 text-[0.65rem] text-[#806f5d] backdrop-blur ${l.pos}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          <span className="uppercase tracking-[0.15em]">{l.label}</span>
          <span className="font-display text-xs italic text-ink">{l.note}</span>
        </span>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* Karşılama */}
      <section aria-labelledby="hero-title" className="grid items-center gap-10 py-10 sm:py-14 md:grid-cols-[1.1fr_0.9fr] md:gap-14 lg:py-20">
        <div>
          <Eyebrow>Nota bazlı parfüm keşfi</Eyebrow>
          <h1
            id="hero-title"
            className="mt-6 font-display text-[clamp(2.75rem,8vw,5.25rem)] font-medium leading-[1.04] tracking-[-0.04em]"
          >
            Bir nota ile başlar. <em className="text-accent">Sana ait</em> bir kokuya dönüşür.
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Sevdiğin notaları seç; üst, orta ve alt katmanlarına göre sana en yakın gerçek parfümleri benzerlik
            yüzdesiyle keşfet.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#nota-kesfi"
              className="inline-flex items-center gap-4 rounded-full bg-ink px-7 py-4 text-sm font-semibold text-card transition hover:bg-accent"
            >
              Notalarını seç
              <span aria-hidden className="text-lg leading-none">↓</span>
            </a>
            <Link
              href="/parfumler"
              className="rounded-full border border-line px-6 py-4 text-sm text-ink transition hover:border-ink"
            >
              Parfümlere göz at
            </Link>
          </div>

          <dl className="mt-10 flex gap-8 border-t border-line pt-6">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col-reverse">
                <dt className="text-xs uppercase tracking-[0.15em] text-muted">{s.label}</dt>
                <dd className="font-display text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[0.7rem] text-muted">Deneme kataloğu; veriler genişletilecek.</p>
        </div>

        <HeroArt />
      </section>

      {/* Nasıl çalışır */}
      <section aria-labelledby="steps-title" className="border-y border-line">
        <h2 id="steps-title" className="sr-only">Nasıl çalışır</h2>
        <ol className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {STEPS.map((s) => (
            <li key={s.number} className="flex gap-4 px-1 py-6 sm:px-6">
              <span className="font-display text-xl italic text-accent">{s.number}</span>
              <div>
                <p className="text-sm font-semibold">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Nota eşleştirme */}
      <section id="nota-kesfi" aria-labelledby="discovery-title" className="scroll-mt-28 pt-16 sm:pt-24">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Kendi koku haritan</Eyebrow>
            <h2
              id="discovery-title"
              className="mt-4 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-medium leading-[1.1] tracking-[-0.03em]"
            >
              Sende iz bırakan <em className="text-accent">notaları</em> seç.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            Önce katmanı seç, sonra notaları ekle. Sonuçlar seçim yaptıkça anında güncellenir.
          </p>
        </div>
        <NoteFinder />
      </section>
    </>
  );
}
