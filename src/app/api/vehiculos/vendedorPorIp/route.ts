import { NextResponse } from "next/server";

const sesiones = new Map<string, string>(); // { ip: vendedorToken }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("vendedor");
  const ip = req.headers.get("x-forwarded-for") || "0.0.0.0";

  if (token) {
    sesiones.set(ip, token);
    return NextResponse.json({ ok: true, ip, vendedor: token });
  }

  const vendedorGuardado = sesiones.get(ip) || null;
  return NextResponse.json({ vendedor: vendedorGuardado });
}
