import type { Metadata } from "next";
import { Catalog } from "@/components/Catalog";

export const metadata: Metadata = { title: "Parfümler" };

export default async function PerfumesPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q } = await searchParams;
  const initial = typeof q === "string" ? q.slice(0, 100) : "";
  return (
    <div className="pt-10">
      <h1 className="mb-6 font-display text-4xl">Parfümler</h1>
      {/* key: başlıktaki arama ile gelindiğinde yeni sorguyla yeniden başlatılır */}
      <Catalog key={initial} initialQuery={initial} />
    </div>
  );
}
