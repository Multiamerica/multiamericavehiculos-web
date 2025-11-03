export function toBool(v: unknown): boolean {
  const s = String(v ?? "").trim().toLowerCase();
  return ["si", "sí", "true", "1", "on"].includes(s);
}

export function num(v: unknown): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

export function str(v: unknown): string | undefined {
  const s = String(v ?? "").trim();
  return s ? s : undefined;
}

export function splitMultilineLinks(raw: unknown): string[] {
  if (raw == null) return [];
  const text = String(raw).replace(/\r\n/g, "\n"); // normaliza saltos
  const parts = text.split("\n");
  const urls = parts
    .map(p => p.trim())
    .filter(Boolean)
    .map(normalizeImgurLike)
    .filter(isHttpUrl);
  // dedup
  return Array.from(new Set(urls));
}

export function isHttpUrl(s: string): boolean {
  try {
    const u = new URL(s);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch { return false; }
}

// Acepta diversos formatos de imgur: álbum, i.imgur, etc.
export function normalizeImgurLike(link: string): string {
  // limpia espacios y markdown (<...>, etc.)
  let s = link.trim().replace(/^<|>$/g, "");
  // si viene con texto tipo "Texto https://imgur.com/abc", toma la última URL
  const m = s.match(/https?:\/\/\S+/g);
  if (m?.length) s = m[m.length - 1];

  // fuerza i.imgur para direct link si ya es imagen conocida
  if (/^https?:\/\/imgur\.com\/\w+(\.\w+)?$/.test(s)) {
    // opcional: NO transformar álbumes automáticamente
    return s;
  }
  return s;
}
