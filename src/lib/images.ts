/**
 * 🔍 Normaliza una sola URL (Imgur o Google Drive)
 * Convierte a formato directo usable en <img>
 */
export function normalizeImageUrl(u: string): string {
  if (!u) return u;

  try {
    // 🔸 Limpieza básica
    let s = u.trim().split("#")[0].replace(/^<|>$/g, "");

    // ✅ Si ya es Imgur directo (i.imgur.com/xxxxx.jpg)
    if (/^https?:\/\/i\.imgur\.com\/[\w.-]+\.(jpg|jpeg|png|webp|gif)$/i.test(s)) {
      return s;
    }

    // ✅ Si es página de Imgur (imgur.com/xxxxx o imgur.com/gallery/xxxxx)
    const mImgur = s.match(/https?:\/\/imgur\.com\/(?!gallery|a\/)([\w.-]+)/i);
    if (mImgur && mImgur[1]) {
      return `https://i.imgur.com/${mImgur[1]}.jpg`;
    }

    // ✅ Google Drive: /file/d/ID/view...
    const m1 = s.match(/https?:\/\/drive\.google\.com\/file\/d\/([^/]+)/i);
    if (m1 && m1[1]) {
      return `https://drive.google.com/uc?export=view&id=${m1[1]}`;
    }

    // ✅ Google Drive: open?id=ID
    const m2 = s.match(/https?:\/\/drive\.google\.com\/open\?id=([^&]+)/i);
    if (m2 && m2[1]) {
      return `https://drive.google.com/uc?export=view&id=${m2[1]}`;
    }

    // ✅ Google Drive: uc?export=view&id=ID → ya sirve
    return s;
  } catch {
    return u;
  }
}

/**
 * 🔹 Normaliza listas mixtas (Imgur + Drive + saltos de línea)
 * Soporta texto largo con varios links por salto
 */
export function normalizeAll(input: string[] | string): string[] {
  if (!input) return [];

  const rawArray = Array.isArray(input) ? input : [input];
  const urls: string[] = [];

  for (const item of rawArray) {
    if (!item) continue;

    // 🔸 Separa por saltos de línea o espacios
    const parts = String(item)
      .replace(/\r\n/g, "\n")
      .split(/\n|,|\s+/)
      .map((x) => x.trim())
      .filter((x) => x.startsWith("http"));

    for (const p of parts) {
      const clean = normalizeImageUrl(p);
      if (clean && !urls.includes(clean)) urls.push(clean);
    }
  }

  return urls;
}

/**
 * 🔸 Mueve al frente la imagen cuyo nombre empiece por “principal”
 * (por ejemplo: principal1.jpg o portada.webp)
 */
export function orderImages(urls: string[]) {
  const list = [...(urls || [])];
  if (list.length <= 1) return list;

  const base = (u: string) =>
    (u.split("?")[0].split(/[\/\\]/).pop() || "").toLowerCase();

  const idx = list.findIndex((u) =>
    /^(principal|portada)/.test(base(u))
  );

  if (idx > 0) {
    const [main] = list.splice(idx, 1);
    list.unshift(main);
  }

  return list;
}

/**
 * 🧩 Construye URLs directas de Drive a partir de IDs
 */
export function buildDriveImageUrls(ids: string[]) {
  return ids
    .filter(Boolean)
    .map((id) => `https://drive.google.com/uc?export=view&id=${id}`);
}
