export type Vendedor = {
  ejecutivo: string; // Nombre Ejecutivo
  telefono: string;  // Teléfono limpio
  token: string;     // Token = nombre
};

const SHEETS_URL =
  "https://script.google.com/macros/s/AKfycbx0vrJhAg--Clu5iVu6JzksgqfrCHu4Rxl-Uhenw7tZRoelMN1oU5ETwQGHKRC-zAIy/exec?action=vendedores";

/**
 * 🔹 Obtiene la lista de vendedores desde Google Sheets.
 * Ahora adaptado al formato real que devuelve tu Apps Script.
 */
export async function getVendedores(): Promise<Vendedor[]> {
  try {
    const res = await fetch(SHEETS_URL, { cache: "no-store" });
    const data = await res.json();

    // ✅ En tu caso, el array llega directo, no dentro de "data.vendedores"
    const raw = Array.isArray(data) ? data : [];

    const vendedores = raw
      .filter((r: any) => {
        const nombre = String(r.ejecutivo || "").trim();
        const tel = String(r.telefono || "").trim();
        return nombre && tel && tel.length >= 6;
      })
      .map((r: any) => ({
        ejecutivo: String(r.ejecutivo).trim(),
        telefono: String(r.telefono).replace(/\D/g, "").trim(),
        token: String(r.ejecutivo).trim(),
      }));

    if (vendedores.length === 0)
      console.warn("⚠️ No se encontraron vendedores válidos en Sheets");

    console.log("✅ Vendedores cargados:", vendedores);
    return vendedores;
  } catch (err) {
    console.error("❌ Error cargando vendedores:", err);
    return [];
  }
}
