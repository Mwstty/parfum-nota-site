export type Layer = "top" | "middle" | "base";

export const LAYERS: Layer[] = ["top", "middle", "base"];

export const LAYER_LABELS: Record<Layer, string> = {
  top: "Üst Notalar",
  middle: "Orta Notalar",
  base: "Alt Notalar",
};

export type NoteFamily =
  | "citrus"
  | "floral"
  | "fruity"
  | "gourmand"
  | "spicy"
  | "aromatic"
  | "woody"
  | "amber"
  | "musky"
  | "leather"
  | "aquatic";

export interface Note {
  id: string;
  name: string;
  family: NoteFamily;
}

export type Pyramid = Record<Layer, string[]>;

export type Gender = "erkek" | "kadın" | "unisex";

/**
 * Logo veya ürün görseli. Yalnızca kaynağı ve kullanım izni belli görseller eklenir
 *; izinsiz kopyalanmış görsel kullanılmaz.
 */
export interface MediaAsset {
  /** "/images/..." altında yerel dosya ya da next.config.ts'de izin verilmiş https adresi */
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Görselin alındığı yer (örn. marka basın kiti, Wikimedia Commons sayfası) */
  source: string;
  /** Lisans ya da kullanım izni (örn. "CC BY-SA 4.0", "Marka izniyle") */
  license: string;
  /** Author attribution required by the license. */
  author?: string;
  licenseUrl?: string;
}

export interface Brand {
  slug: string;
  name: string;
  country: string;
  logo?: MediaAsset;
}

/** Bir kaydın bilgilerinin (notalar, yıl vb.) doğrulandığı kaynak. */
export interface DataSource {
  url: string;
  /** Kaynağın kontrol edildiği tarih (YYYY-MM-DD) */
  checkedAt: string;
}

export interface Perfume {
  slug: string;
  name: string;
  brand: string; // Brand.slug
  year: number;
  gender: Gender;
  /** Kaynakta belirtilmemişse boş bırakılır (örn. "EDT", "EDP"). */
  concentration?: string;
  family: NoteFamily;
  notes: Pyramid;
  image?: MediaAsset;
  source?: DataSource;
}
