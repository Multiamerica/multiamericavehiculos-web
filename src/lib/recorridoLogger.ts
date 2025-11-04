export async function registrarRecorrido(formato: string, ejecutivo: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_RECORRIDO_SHEET_URL}?formato=${encodeURIComponent(
      formato
    )}&ejecutivo=${encodeURIComponent(ejecutivo)}`;

    const res = await fetch(url, { method: "GET", cache: "no-store" });

    // 🔹 Verifica si la respuesta está vacía o no es JSON
    const text = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      console.warn("⚠️ La respuesta no es JSON. Texto recibido:", text);
    }

    if (!res.ok) {
      console.warn("⚠️ Error registrando recorrido:", data || text);
    } else {
      console.log("✅ Recorrido registrado:", formato, ejecutivo);
    }
  } catch (err) {
    console.error("❌ Error en registrarRecorrido:", err);
  }
}
