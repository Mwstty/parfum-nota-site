import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="font-display text-5xl">Bulunamadı</p>
      <p className="mt-3 text-muted">Aradığın sayfa ya da parfüm mevcut değil.</p>
      <Link href="/" className="mt-6 inline-block text-accent hover:underline">Ana sayfaya dön</Link>
    </div>
  );
}
