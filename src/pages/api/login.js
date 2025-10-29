// src/pages/api/login.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Método no permitido" });
  }

  try {
    // URL del Apps Script desplegado
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx0vrJhAg--Clu5iVu6JzksgqfrCHu4Rxl-Uhenw7tZRoelMN1oU5ETwQGHKRC-zAIy/exec";

    // Reenvía la solicitud al Apps Script
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
    });

    // Intenta parsear la respuesta como JSON
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error en proxy /api/login:", error);
    return res.status(500).json({
      success: false,
      message: "Error de conexión con el servidor remoto.",
    });
  }
}
