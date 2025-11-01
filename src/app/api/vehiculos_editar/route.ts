import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { accion, id, data, quien } = body; // 🟢 incluir 'quien'

    if (!id || !data) {
      return NextResponse.json(
        { ok: false, msg: "Faltan parámetros (id o data)" },
        { status: 400 }
      );
    }

    // ⚙️ Tu URL del Apps Script
    const scriptUrl =
      "https://script.google.com/macros/s/AKfycbyfyrV6-fjg__PE7iZLOYeVz6VOHEGjMU70ky8BMvgZA9_aAOO9Ptu0ikBNwQOP74Mwag/exec";

    // 🧠 Reenviar todo, incluyendo 'quien'
    const res = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accion,
        id,
        data,
        quien, // ✅ ahora viaja al Apps Script
      }),
    });

    const result = await res.json();
    return NextResponse.json(result);
  } catch (err: any) {
    console.error("⚠️ Error en vehiculos_editar:", err);
    return NextResponse.json(
      { ok: false, msg: "Error interno del servidor", error: String(err) },
      { status: 500 }
    );
  }
}
