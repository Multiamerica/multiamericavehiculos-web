// 📄 src/lib/recorridoLogger.ts
export const RECORRIDO_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxzPHjBdascXoTJ8bqkMMjXCxTf01CT5vbsJ1noi-0sLMUk97SdRTMZZCNVQkzCleE_8w/exec"; // ← tu URL del Apps Script

/**
 * Registra un recorrido en Google Sheets.
 * @param formato - "Disponibles y Reservados" | "Previa Cita"
 * @param ejecutivo - Nombre del usuario o "Invitado"
 */
export async function registrarRecorrido(formato: string, ejecutivo: string) {
  try {
    const res = await fetch(RECORRIDO_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ formato, ejecutivo }),
    });

    const data = await res.json();
    if (!data.ok) console.warn("⚠️ Error registrando recorrido:", data);
    else console.log("✅ Recorrido registrado:", formato, ejecutivo);
  } catch (err) {
    console.error("❌ Error de conexión al registrar recorrido:", err);
  }
}
