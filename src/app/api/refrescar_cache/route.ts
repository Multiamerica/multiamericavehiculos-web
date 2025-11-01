import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// 📦 Lee la URL desde tu .env.local
const SCRIPT_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📢 Refrescando cache por:", body?.quien || "desconocido");

    if (!SCRIPT_URL) {
      console.error("❌ ERROR: Falta NEXT_PUBLIC_API_URL en .env.local");
      return NextResponse.json(
        { ok: false, msg: "Falta NEXT_PUBLIC_API_URL en configuración" },
        { status: 500 }
      );
    }

    // 🔹 Llama a tu Apps Script para obtener el inventario actualizado
    const res = await fetch(SCRIPT_URL, { cache: "no-store" });
    const data = await res.json();

    // 📂 Guarda el inventario actualizado en la carpeta public/
    const filePath = path.join(process.cwd(), "public", "inventory.json");
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");

    console.log("✅ Cache actualizado correctamente");
    return NextResponse.json({ ok: true, msg: "Cache actualizado" });
  } catch (err: any) {
    console.error("⚠️ Error al refrescar cache:", err);
    return NextResponse.json(
      { ok: false, msg: "Error actualizando cache", error: String(err) },
      { status: 500 }
    );
  }
}
