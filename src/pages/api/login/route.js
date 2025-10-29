// src/app/api/login/route.js

export async function POST(req) {
  try {
    const body = await req.json();

    // URL del Apps Script desplegado
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx0vrJhAg--Clu5iVu6JzksgqfrCHu4Rxl-Uhenw7tZRoelMN1oU5ETwQGHKRC-zAIy/exec";

    // Enviar la solicitud al Apps Script
    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
s
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error en /api/login:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error de conexión con el servidor remoto.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function GET() {
  return new Response(
    JSON.stringify({
      success: true,
      message: "✅ API de login activa (usa POST para autenticar).",
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}