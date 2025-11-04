// 📄 src/lib/recorridoLogger.ts
export const RECORRIDO_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbywKWUSQ4MxNCvBspZwF_897MqjaPSzhR7v95mWCYzU-13LKbbRXPwlqKe9r7j3GjxiVA/exec"; // ← tu URL del Apps Script

/**
 * Registra un recorrido en Google Sheets.
 * @param formato - "Disponibles y Reservados" | "Previa Cita"
 * @param ejecutivo - Nombre del usuario o "Invitado"
 */
export async function registrarRecorrido(formato: string, ejecutivo: string) {
  try {
    const res = await fetch(RECORRIDO_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors", // 🔹 <--- AGREGA ESTA LÍNEA
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
