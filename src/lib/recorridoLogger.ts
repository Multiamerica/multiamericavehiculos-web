export async function registrarRecorrido(formato: string, ejecutivo: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_RECORRIDO_SHEET_URL}?formato=${encodeURIComponent(
      formato
    )}&ejecutivo=${encodeURIComponent(ejecutivo)}`;

    const res = await fetch(url, { method: "GET", cache: "no-store" });

    // 🔹 Leer respuesta como texto para manejar cualquier formato
    const text = await res.text();
    let data: any = {};

    try {
      data = JSON.parse(text);
    } catch {
      console.warn("⚠️ Respuesta no JSON, texto recibido:", text);
    }

    // 🔹 Validar si la petición fue correcta
    if (!res.ok) {
      console.warn("⚠️ Error registrando recorrido:", data || text);
    } else if (data?.status === "ok" || data?.result === "success") {
      console.log(`✅ Recorrido registrado en hoja:`, formato, "por", ejecutivo);
    } else {
      console.log("✅ Registro completado (sin JSON estándar).");
    }
  } catch (err) {
    console.error("❌ Error en registrarRecorrido:", err);
  }
}
