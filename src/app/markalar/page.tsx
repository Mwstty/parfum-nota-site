import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/ui";
import { BRANDS, PERFUMES } from "@/data/perfumes";

export const metadata: Metadata = { title: "Markalar" };

export default function BrandsPage() {
  const brands = [...BRANDS].sort((a, b) => a.name.localeCompare(b.name, "tr"));
  return (
    <div className="pt-10">
      <h1 className="mb-6 font-display text-4xl">Markalar</h1>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => {
          const count = PERFUMES.filter((p) => p.brand === b.slug).length;
          return (
            <li key={b.slug}>
              <Link
                href={`/marka/${b.slug}`}
                className="flex items-center justify-between rounded-2xl border border-line bg-card px-5 py-4 transition hover:border-accent"
              >
                <span>
                  <span className="block text-xl">
                    <BrandMark brand={b} />
                  </span>
                  <span className="text-xs text-muted">{b.country}</span>
                </span>
                <span className="text-sm text-muted">{count} parfüm</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
