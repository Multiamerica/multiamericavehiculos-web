import { Vehicle } from "@/types/vehicle";
import { MOCK } from "@/data/mock";

const FIREBASE_URL = process.env.NEXT_PUBLIC_FIREBASE_URL;
const LOCAL_FILE = "public/inventory.json";

/** ===================== Utilidades ===================== **/
function toBool(v: unknown): boolean {
  const s = String(v ?? "").trim().toLowerCase();
  return ["si", "sí", "true", "1"].includes(s);
}

function num(v: unknown): number {
  const n = Number(String(v || "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function str(v: unknown): string {
  return String(v ?? "").trim();
}

function normalizeEstado(v: any): Vehicle["estado"] {
  const s = str(v).toLowerCase();
  if (s.includes("disponible")) return "DISPONIBLE";
  if (s.includes("previa")) return "PREVIA_CITA";
  if (s.includes("reservado")) return "RESERVADO";
  return "NO_DISPONIBLE";
}

function normalizeImages(registro: any): string[] {
  const imgs = Array.isArray(registro.imagenes)
    ? registro.imagenes
    : typeof registro.imagenes === "string"
    ? registro.imagenes.split(/\r?\n/).map((x: string) => x.trim()).filter(Boolean)
    : [];

  return imgs.map((u: string) => {
    if (!u) return "";
    if (u.includes("i.imgur.com")) return u;
    const m = u.match(/^https?:\/\/imgur\.com\/([A-Za-z0-9]+)$/i);
    if (m && m[1]) return `https://i.imgur.com/${m[1]}.jpg`;
    return u;
  });
}

/** ===========================================================
 * ⚡ Fetch híbrido — Local (principal) + Firebase (solo desarrollo)
 * =========================================================== */
export async function fetchInventory(): Promise<Vehicle[]> {
  let vehiculos: Vehicle[] = [];

  try {
    /** 1️⃣ Leer inventario local (desde public/inventory.json) **/
    try {
      const localUrl =
        typeof window === "undefined"
          ? `${process.env.NEXT_PUBLIC_BASE_URL || "https://multiamerica.vercel.app"}/inventory.json`
          : "/inventory.json";

      const localRes = await fetch(localUrl, { cache: "no-store" });

      if (localRes.ok) {
        const text = await localRes.text();
        if (text.trim().length > 0) {
          const localData = JSON.parse(text);
          const items = Array.isArray(localData.items)
            ? localData.items
            : localData?.inventario?.items || [];

          if (items.length) {
            vehiculos = items.map((v: any) => ({
              vehiculo_id: str(v.vehiculo_id || v.id),
              estado: normalizeEstado(v.publicar || v.estado),
              etiqueta: str(v.etiqueta),
              marca: str(v.marca),
              modelo: str(v.modelo),
              version: str(v.version),
              anio: str(v.anio),
              kilometraje: str(v.kilometraje),
              transmision: str(v.transmision),
              traccion: str(v.traccion),
              color: str(v.color),
              motor: str(v.motor),
              duenos: str(v.duenos),
              vis_duenos: toBool(v.vis_duenos),
              aa: str(v.aa),
              tapiceria: str(v.tapiceria),
              llaves: str(v.llaves),
              puertas: str(v.puertas),
              descripcion: str(v.descripcion),
              gerente: str(v.gerente),
              asesor: str(v.asesor),
              vis_precio: toBool(v.vis_precio),
              moneda: str(v.moneda) || "USD",
              precio_num: num(v.precio_num),
              imagen: str(v.imagen),
              imagenes: normalizeImages(v),
              fecha_publicado: str(v.fecha_publicado),
              carroceria: str(v.carroceria || v.carrocería || v.Carrocería),
              km_num: num(v.kilometraje || v.km || v.km_num),
            }));
            console.log(`⚡ Inventario local cargado (${vehiculos.length} vehículos)`);
          } else {
            console.warn("⚠️ El archivo local está vacío.");
          }
        }
      } else {
        console.warn(`⚠️ No se pudo leer ${localUrl} (${localRes.status})`);
      }
    } catch (err) {
      console.warn("⚠️ Error leyendo inventario local:", err);
    }

    /** 2️⃣ Intentar actualizar desde Firebase (solo en desarrollo) **/
    try {
      if (!FIREBASE_URL) throw new Error("❌ Falta NEXT_PUBLIC_FIREBASE_URL");

      const remoteUrl = `${FIREBASE_URL}inventario.json`;
      const res = await fetch(remoteUrl, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const items = Array.isArray(data.items)
        ? data.items
        : data?.inventario?.items || [];

      if (!items.length) throw new Error("Inventario remoto vacío");

      const nuevos: Vehicle[] = items.map((v: any) => ({
        vehiculo_id: str(v.vehiculo_id || v.id),
        estado: normalizeEstado(v.publicar || v.estado),
        etiqueta: str(v.etiqueta),
        marca: str(v.marca),
        modelo: str(v.modelo),
        version: str(v.version),
        anio: str(v.anio),
        kilometraje: str(v.kilometraje),
        transmision: str(v.transmision),
        traccion: str(v.traccion),
        color: str(v.color),
        motor: str(v.motor),
        duenos: str(v.duenos),
        vis_duenos: toBool(v.vis_duenos),
        aa: str(v.aa),
        tapiceria: str(v.tapiceria),
        llaves: str(v.llaves),
        puertas: str(v.puertas),
        descripcion: str(v.descripcion),
        gerente: str(v.gerente),
        asesor: str(v.asesor),
        vis_precio: toBool(v.vis_precio),
        moneda: str(v.moneda) || "USD",
        precio_num: num(v.precio_num),
        imagen: str(v.imagen),
        imagenes: normalizeImages(v),
        fecha_publicado: str(v.fecha_publicado),
        carroceria: str(v.carroceria || v.carrocería || v.Carrocería),
        km_num: num(v.kilometraje || v.km || v.km_num),
      }));

      // 💾 Guardar localmente solo si estás en desarrollo
      if (process.env.NODE_ENV === "development") {
        const fs = require("fs");
        const tempFile = `${LOCAL_FILE}.tmp`;
        fs.writeFileSync(tempFile, JSON.stringify({ items: nuevos }, null, 2), "utf-8");
        fs.renameSync(tempFile, LOCAL_FILE);
        console.log(`✅ Archivo ${LOCAL_FILE} actualizado (${nuevos.length} vehículos)`);
      }

      console.log(`☁️ Inventario remoto actualizado (${nuevos.length} vehículos)`);
      return nuevos;
    } catch (err) {
      console.warn("⚠️ Error cargando inventario remoto:", err);
      return vehiculos.length ? vehiculos : MOCK;
    }
  } catch (err) {
    console.error("❌ Error general al cargar inventario:", err);
    return MOCK;
  }
}
