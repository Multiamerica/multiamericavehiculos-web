import { NextResponse } from "next/server";

const BASE_URLS = [
  "https://multiamericavehiculos.com",
  "https://multiamerica.vercel.app",
  "http://localhost:3000",
  "http://192.168.1.4:3000",
];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { accion, id, data, quien, rango } = body;

    if (!id || !data) {
      return NextResponse.json(
        { ok: false, msg: "Faltan parámetros (id o data)" },
        { status: 400 }
      );
    }

    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbydfY-OgHF0gd8U0Q2VZjqqdbIqQAUtEKyZ7jEKPN3Qsze4FfN-Nw05tMUyLoMKmFQoow/exec";

    const gsRes = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion, id, data, quien, rango }),
    });

    const result = await gsRes.json();

    // 🧭 Detectar dominio base activo automáticamente
    const baseUrl =
      BASE_URLS.find((url) =>
        typeof window === "undefined"
          ? process.env.NEXT_PUBLIC_BASE_URL?.includes(url)
          : window.location.origin.includes(url)
      ) ||
      process.env.NEXT_PUBLIC_BASE_URL ||
      "http://localhost:3000";

    // ✅ Emitir evento global
    await fetch(`${baseUrl}/api/emit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "actualizarPagina" }),
    });

    console.log(`📡 Evento emitido desde: ${baseUrl}`);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("⚠️ Error en vehiculos_editar:", err);
    return NextResponse.json(
      { ok: false, msg: "Error interno del servidor", error: String(err) },
      { status: 500 }
    );
  }
}
