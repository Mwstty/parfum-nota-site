import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PerfumeCard } from "@/components/PerfumeCard";
import { BrandMark, ImageCredit } from "@/components/ui";
import { BRANDS, BRAND_BY_SLUG, PERFUMES } from "@/data/perfumes";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BRANDS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = BRAND_BY_SLUG[(await params).slug];
  return b ? { title: b.name } : {};
}

export default async function BrandPage({ params }: Props) {
  const brand = BRAND_BY_SLUG[(await params).slug];
  if (!brand) notFound();
  const perfumes = PERFUMES.filter((p) => p.brand === brand.slug).sort((a, b) => b.year - a.year);

  return (
    <div className="pt-10">
      <p className="text-xs uppercase tracking-wider text-muted">{brand.country}</p>
      <h1 className="mb-2 text-5xl">
        <BrandMark brand={brand} />
      </h1>
      <ImageCredit asset={brand.logo} />
      <p className="mb-8 text-sm text-muted">{perfumes.length} parfüm</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {perfumes.map((p) => (
          <PerfumeCard key={p.slug} perfume={p} />
        ))}
      </div>
    </div>
  );
}
