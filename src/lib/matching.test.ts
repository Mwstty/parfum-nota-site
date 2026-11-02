import { describe, expect, it } from "vitest";
import { PERFUMES, getPerfume } from "@/data/perfumes";
import { emptySelection, matchPerfumes, scorePerfume } from "./matching";

describe("matching", () => {
  it("boş seçim sonuç döndürmez", () => {
    expect(matchPerfumes(emptySelection(), PERFUMES)).toEqual([]);
  });

  it("bir parfümün kendi piramidi ona 100 verir ve en üstte çıkar", () => {
    const sauvage = getPerfume("dior-sauvage-edt")!;
    expect(scorePerfume(sauvage.notes, sauvage).score).toBe(100);
    expect(matchPerfumes(sauvage.notes, PERFUMES)[0].perfume.slug).toBe(sauvage.slug);
  });

  it("aynı katmanda eşleşme, farklı katmandakinden yüksek puan alır", () => {
    const p = getPerfume("ysl-black-opium-edp")!; // vanilla altta
    const same = scorePerfume({ top: [], middle: [], base: ["vanilla"] }, p);
    const other = scorePerfume({ top: ["vanilla"], middle: [], base: [] }, p);
    expect(same.score).toBeGreaterThan(other.score);
  });

  it("aynı aileden nota kısmi puan alır, hiç ilgisiz nota sıfır alır", () => {
    const p = getPerfume("tom-ford-tobacco-vanille-edp")!;
    const family = scorePerfume({ top: [], middle: ["caramel"], base: [] }, p);
    const none = scorePerfume({ top: ["sea-notes"], middle: [], base: [] }, p);
    expect(family.score).toBeGreaterThan(0);
    expect(family.score).toBeLessThan(50);
    expect(none.score).toBe(0);
  });

  it("skorlar 0-100 aralığında", () => {
    const sel = { top: ["bergamot", "lemon"], middle: ["jasmine"], base: ["musk", "cedar"] };
    for (const r of matchPerfumes(sel, PERFUMES, { minScore: 0 })) {
      expect(r.score).toBeGreaterThanOrEqual(0);
      expect(r.score).toBeLessThanOrEqual(100);
    }
  });
});
