import { Vehicle } from "@/types/vehicle";
import { MOCK } from "@/data/mock";
import { buildDriveImageUrls } from "@/lib/images";

type Json = Record<string, unknown>;
type ApiResp = { items?: Json[] };

// --- Helpers básicos ---
function toBool(v: unknown): boolean {
  const s = String(v ?? "").trim().toLowerCase();
  return ["si", "sí", "true", "1"].includes(s);
}

function num(v: unknown): number | undefined {
  if (v == null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function str(v: unknown): string | undefined {
  const s = String(v ?? "").trim();
  return s || undefined;
}

function boolOrUndef(v: unknown): boolean | undefined {
  const s = String(v ?? "").trim().toLowerCase();
  if (!s) return undefined;
  return ["si", "sí", "true", "1"].includes(s);
}

/** 🔍 Normaliza URLs (Imgur o Drive) */
function normalizeImages(r: Json): string[] {
  const imgs =
    (Array.isArray(r["imagenes"]) && (r["imagenes"] as string[])) ||
    (Array.isArray(r["images"]) && (r["images"] as string[])) ||
    (Array.isArray(r["imagenes_ids"]) && (r["imagenes_ids"] as string[])) ||
    [];

  return imgs.map((url) => {
    if (typeof url !== "string") return "";

    const u = url.trim();

    // ✅ Caso: Imgur directo (i.imgur.com)
    if (u.includes("i.imgur.com")) return u;

    // ✅ Caso: Página de Imgur (imgur.com/<id>)
    const m = u.match(/^https?:\/\/imgur\.com\/([A-Za-z0-9]+)$/i);
    if (m && m[1]) {
      return `https://i.imgur.com/${m[1]}.jpg`;
    }

    // ✅ Caso: ID suelto de Imgur (sin URL)
    const n = u.match(/^([A-Za-z0-9]{5,8})$/);
    if (n && n[1]) {
      return `https://i.imgur.com/${n[1]}.jpg`;
    }

    // ✅ Caso: Google Drive
    const g = u.match(/https?:\/\/drive\.google\.com\/file\/d\/([^/]+)/i);
    if (g && g[1]) {
      return `https://drive.google.com/uc?export=view&id=${g[1]}`;
    }

    return u;
  });
}

/** 🧠 Normaliza el estado (Excel → interno) */
function normalizeEstado(r: Json): Vehicle["estado"] {
  const candidates = [
    r["estado"],
    r["Estado"],
    r["publicar"],
    r["Publicar"],
    r["etiqueta"],
    r["Etiqueta"],
  ];

  const raw = String(candidates.find((x) => x != null) ?? "")
    .trim()
    .toLowerCase();

  if (raw.includes("previa") && raw.includes("cita")) return "PREVIA_CITA";
  if (raw.includes("disponible")) return "DISPONIBLE";
  return "NO_DISPONIBLE";
}

/** 🌐 Fetch principal del inventario */
export async function fetchInventory(): Promise<Vehicle[]> {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return MOCK;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Google Apps Script a veces devuelve texto plano
    const text = await res.text();
    const data: ApiResp = JSON.parse(text);

    const items = (data.items ?? [])
      .map((r: Json) => {
        const v: Vehicle = {
          vehiculo_id: String(r["vehiculo_id"] ?? r["id"] ?? ""),
          estado: normalizeEstado(r),

          // básicos
          marca: String(r["marca"] ?? ""),
          modelo: String(r["modelo"] ?? ""),
          version: str(r["version"] ?? r["Versión"]) ?? "",
          anio: Number(r["anio"] ?? r["year"] ?? 0),

          // visibilidad
          vis_precio: toBool(r["vis_precio"] ?? r["Vis. Precio"]),
          vis_duenos: toBool(r["vis_duenos"] ?? r["Vis. Dueños"]),

          // opcionales
          precio_num: num(r["precio_num"] ?? r["Precio"]),
          moneda: str(r["moneda"]),
          km_num: num(r["km_num"] ?? r["Kilometraje"]),
          color: str(r["color"]),
          transmision: str(r["transmision"] ?? r["Transmisión"]),
          traccion: str(r["traccion"] ?? r["Tracción"]),
          carroseria: str(r["carroseria"] ?? r["Carrocería"]),
          tapiceria: str(r["tapiceria"] ?? r["Tapicería"]),
          motor: str(r["motor"]),
          aa: boolOrUndef(r["aa"] ?? r["A/A"]),
          llaves: str(r["llaves"]),
          duenos: (r["duenos"] ?? r["Dueños"]) as string | number | undefined,
          puertas: str(r["puertas"] ?? r["#Puertas"]),
          ubicacion: str(r["ubicacion"]),
          descripcion: str(r["descripcion"] ?? r["Descripción"]),
          imagenes: normalizeImages(r),
          //(limpieza extra para espacios)
          gerente: str((r["gerente"] ?? r["Gerente"] ?? "").toString().trim()),
          asesor: str((r["asesor"] ?? r["Asesor"] ?? "").toString().trim()),
        };

        return v;
      })
      // ✅ Filtra los que sí tienen ID e imágenes
      .filter((v) => v.vehiculo_id && (v.imagenes?.length ?? 0) > 0);

    if (process.env.NODE_ENV !== "production") {
      console.log(
        "📦 Inventario cargado:",
        items.map((i) => `${i.vehiculo_id} → ${i.estado}`).join(", ")
      );
    }

    return items;
  } catch (err) {
    console.error("❌ Error al cargar inventario:", err);
    return MOCK;
  }
}
