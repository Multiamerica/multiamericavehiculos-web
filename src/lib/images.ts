/** 🔍 Normaliza URL de Google Drive o Imgur para que sea usable directamente */
export function normalizeImageUrl(u: string): string {
  if (!u) return u;

  try {
    const noHash = u.split("#")[0].trim();

    // ✅ Si ya es Imgur directo (i.imgur.com/xxxxx.jpg)
    if (/^https?:\/\/i\.imgur\.com\/[\w.-]+\.(jpg|jpeg|png|webp|gif)$/i.test(noHash)) {
      return noHash;
    }

    // ✅ Si es página de Imgur (imgur.com/xxxxx)
    const mImgur = noHash.match(/https?:\/\/imgur\.com\/([^/]+)$/i);
    if (mImgur && mImgur[1]) {
      return `https://i.imgur.com/${mImgur[1]}.jpg`;
    }

    // ✅ Google Drive: /file/d/ID/view...
    const m1 = noHash.match(/https?:\/\/drive\.google\.com\/file\/d\/([^/]+)/i);
    if (m1 && m1[1]) {
      return `https://drive.google.com/uc?export=view&id=${m1[1]}`;
    }

    // ✅ Google Drive: open?id=ID
    const m2 = noHash.match(/https?:\/\/drive\.google\.com\/open\?id=([^&]+)/i);
    if (m2 && m2[1]) {
      return `https://drive.google.com/uc?export=view&id=${m2[1]}`;
    }

    // ✅ Ya está en formato uc?export=view&id=...
    return noHash;
  } catch {
    return u;
  }
}

/** Normaliza una lista completa (Drive + Imgur mixto) */
export function normalizeAll(urls: string[]): string[] {
  return (urls || []).map(normalizeImageUrl);
}

/** Mueve al frente la primera cuyo nombre empiece por "principal" */
export function orderImages(urls: string[]) {
  const list = [...(urls || [])];
  if (list.length <= 1) return list;

  const base = (u: string) =>
    (u.split("?")[0].split(/[\/\\]/).pop() || "").toLowerCase();
  const idx = list.findIndex((u) => base(u).startsWith("principal"));
  if (idx > 0) {
    const [main] = list.splice(idx, 1);
    list.unshift(main);
  }
  return list;
}

/** Construye URLs de Drive a partir de IDs */
export function buildDriveImageUrls(ids: string[]) {
  return ids.map((id) => `https://drive.google.com/uc?export=view&id=${id}`);
}
