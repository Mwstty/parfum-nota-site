"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/", label: "Nota Eşleştir" },
  { href: "/parfumler", label: "Parfümler" },
  { href: "/markalar", label: "Markalar" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { favorites, compare } = useStore();
  const [q, setQ] = useState("");

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-2xl font-semibold tracking-wide">
          Notalar
        </Link>

        <nav className="order-3 flex w-full gap-5 text-sm sm:order-none sm:w-auto">
          {NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={isActive(n.href) ? "text-ink" : "text-muted hover:text-ink"}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <form
          role="search"
          className="ml-auto flex-1 sm:max-w-xs"
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/parfumler?q=${encodeURIComponent(q.trim())}`);
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Parfüm, marka veya nota ara"
            aria-label="Ara"
            className="w-full rounded-full border border-line bg-card px-4 py-2 text-sm outline-none focus:border-accent"
          />
        </form>

        <div className="flex gap-4 text-sm">
          <Link href="/favoriler" className="text-muted hover:text-ink">
            Favoriler{favorites.length > 0 && <span className="ml-1 text-accent">{favorites.length}</span>}
          </Link>
          <Link href="/karsilastir" className="text-muted hover:text-ink">
            Karşılaştır{compare.length > 0 && <span className="ml-1 text-accent">{compare.length}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
