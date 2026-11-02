import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PerfumeActions } from "@/components/PerfumeActions";
import { PerfumeCard } from "@/components/PerfumeCard";
import { PyramidView } from "@/components/PyramidView";
import { BrandMark, EmptyState, FamilyTag, PerfumeVisual } from "@/components/ui";
import { BRAND_BY_SLUG, PERFUMES, getPerfume } from "@/data/perfumes";
import { matchPerfumes } from "@/lib/matching";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PERFUMES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getPerfume((await params).slug);
  if (!p) return {};
  return { title: `${BRAND_BY_SLUG[p.brand]?.name} ${p.name}` };
}

export default async function PerfumePage({ params }: Props) {
  const perfume = getPerfume((await params).slug);
  if (!perfume) notFound();
  const brand = BRAND_BY_SLUG[perfume.brand];
  const similar = matchPerfumes(perfume.notes, PERFUMES, { exclude: perfume.slug }).slice(0, 3);

  const facts = [
    ["Marka", brand?.name],
    ["Çıkış yılı", perfume.year],
    ["Konsantrasyon", perfume.concentration ?? "Belirtilmemiş"],
    ["Cinsiyet", perfume.gender.charAt(0).toLocaleUpperCase("tr") + perfume.gender.slice(1)],
  ] as const;

  return (
    <div className="flex flex-col gap-12 pt-10">
      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div className="flex flex-col gap-4">
          <PerfumeVisual perfume={perfume} size="lg" />
          <dl className="grid grid-cols-2 gap-3 rounded-2xl border border-line bg-card p-4 text-sm">
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-muted">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <Link href={`/marka/${perfume.brand}`} className="inline-block text-xs uppercase tracking-wider text-muted hover:text-accent">
              {brand?.logo ? <BrandMark brand={brand} /> : brand?.name}
            </Link>
            <h1 className="font-display text-4xl sm:text-5xl">{perfume.name}</h1>
            <div className="mt-2"><FamilyTag family={perfume.family} /></div>
          </div>
          <PerfumeActions slug={perfume.slug} />
          <PyramidView notes={perfume.notes} />
          {perfume.source && (
            <p className="text-xs text-muted">
              Nota kaynağı:{" "}
              <a href={perfume.source.url} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                {new URL(perfume.source.url).hostname}
              </a>{" "}
              · {perfume.source.checkedAt} tarihinde kontrol edildi
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section>
          <h2 className="mb-3 font-display text-2xl">Fiyatlar</h2>
          <EmptyState title="Henüz fiyat bilgisi yok">
            Fiyat karşılaştırma, yasal fiyat sağlayıcı entegrasyonları eklendiğinde burada görünecek.
          </EmptyState>
        </section>
        <section>
          <h2 className="mb-3 font-display text-2xl">Kullanıcı yorumları</h2>
          <EmptyState title="Henüz yorum yok">
            Henüz bir yorum kaynağı veya yorum yazma özelliği yok. Gerçek kullanıcı yorumları, izinli bir kaynak ya da
            kullanıcı hesapları eklendiğinde burada görünecek.
          </EmptyState>
        </section>
      </div>

      {similar.length > 0 && (
        <section>
          <h2 className="mb-4 font-display text-2xl">Nota olarak benzer parfümler</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((r) => (
              <PerfumeCard key={r.perfume.slug} perfume={r.perfume} score={r.score} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
