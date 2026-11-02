import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { NOTE_BY_ID } from "./notes";
import { BRANDS, BRAND_BY_SLUG, PERFUMES } from "./perfumes";
import { LAYERS } from "./types";

const PUBLIC = join(process.cwd(), "public");

describe("demo veri bütünlüğü", () => {
  it("her parfümün markası ve notaları tanımlı", () => {
    for (const p of PERFUMES) {
      expect(BRAND_BY_SLUG[p.brand], p.slug).toBeDefined();
      for (const l of LAYERS) for (const n of p.notes[l]) expect(NOTE_BY_ID[n], `${p.slug}:${n}`).toBeDefined();
    }
  });

  it("slug'lar benzersiz", () => {
    expect(new Set(PERFUMES.map((p) => p.slug)).size).toBe(PERFUMES.length);
    expect(new Set(BRANDS.map((b) => b.slug)).size).toBe(BRANDS.length);
  });

  it("her görselin kaynağı, lisansı ve geçerli bir yolu var", () => {
    const assets = [
      ...BRANDS.flatMap((b) => (b.logo ? [[b.slug, b.logo] as const] : [])),
      ...PERFUMES.flatMap((p) => (p.image ? [[p.slug, p.image] as const] : [])),
    ];
    for (const [owner, a] of assets) {
      expect(a.source.trim(), `${owner}: source`).not.toBe("");
      expect(a.license.trim(), `${owner}: license`).not.toBe("");
      expect(a.alt.trim(), `${owner}: alt`).not.toBe("");
      expect(a.width > 0 && a.height > 0, `${owner}: boyut`).toBe(true);
      expect(/^(\/images\/|https:\/\/)/.test(a.src), `${owner}: src`).toBe(true);
      if (a.src.startsWith("/images/")) expect(existsSync(join(PUBLIC, a.src)), `${owner}: dosya yok`).toBe(true);
    }
  });

  it("public/images altındaki her görsel bir kayda bağlı (sahipsiz dosya yok)", () => {
    const used = new Set([...BRANDS.map((b) => b.logo?.src), ...PERFUMES.map((p) => p.image?.src)]);
    for (const dir of ["brands", "perfumes"]) {
      for (const file of readdirSync(join(PUBLIC, "images", dir))) {
        if (file.startsWith(".")) continue;
        expect(used.has(`/images/${dir}/${file}`), `${dir}/${file}`).toBe(true);
      }
    }
  });

  it("kaynak bilgisi olan kayıtlarda geçerli URL ve tarih var", () => {
    for (const p of PERFUMES) {
      if (!p.source) continue;
      expect(p.source.url.startsWith("https://"), `${p.slug}: url`).toBe(true);
      expect(/^\d{4}-\d{2}-\d{2}$/.test(p.source.checkedAt), `${p.slug}: tarih`).toBe(true);
    }
  });
});
