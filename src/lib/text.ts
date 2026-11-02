/** Türkçe karakterlere duyarsız arama için metni sadeleştirir ("Çiçek" → "cicek"). */
export function normalize(s: string): string {
  return s
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}
