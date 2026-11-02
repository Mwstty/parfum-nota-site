import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { Header } from "@/components/Header";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

// İkisi de değişken font; "latin-ext" Türkçe karakterleri (ğ, ş, ı, İ) kapsar.
const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope", display: "swap" });
// İtalik de yüklenir; başlıklardaki <em> vurguları sahte (sentetik) italik olmasın.
const playfair = Playfair_Display({
  subsets: ["latin", "latin-ext"],
  variable: "--font-playfair",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Notalar - Parfüm Nota Eşleştirme", template: "%s · Notalar" },
  description: "Sevdiğin notaları seç, onlara en çok benzeyen gerçek parfümleri bul.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${manrope.variable} ${playfair.variable}`}>
      <body className="min-h-screen font-sans">
        <StoreProvider>
          <Header />
          <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">{children}</main>
          <footer className="border-t border-line py-8 text-center text-xs text-muted">
            <p className="mx-auto max-w-2xl px-4">
              Deneme sürümü. Nota bilgileri kamuya açık listelerden derlenmiş demo verilerdir ve resmi kaynaklarla
              doğrulanmamıştır. Fiyat ve yorum verisi henüz yoktur. Marka adları sahiplerine aittir.
            </p>
          </footer>
        </StoreProvider>
      </body>
    </html>
  );
}
