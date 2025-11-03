import { NextRequest, NextResponse } from "next/server";
import { parseRow, VehiclePayload } from "@/lib/parseSheets";
// import { db } from "@/lib/db"; // tu cliente a la DB

type Incoming = { items: Record<string, unknown>[] };

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as Incoming | null;
  if (!body?.items || !Array.isArray(body.items)) {
    return NextResponse.json({ ok: false, error: "Payload inválido" }, { status: 400 });
  }

  // ⚙️ settings: no procesar si la sync está apagada
  const settingsRes = await fetch(new URL("/api/settings", req.nextUrl).toString(), { cache: "no-store" });
  const settings = await settingsRes.json().catch(()=>({syncEnabled:false}));
  if (!settings?.syncEnabled) {
    return NextResponse.json({ ok: false, skipped: true, reason: "sync disabled" }, { status: 200 });
  }

  const results: { id: string; ok: boolean; error?: string }[] = [];

  for (const raw of body.items) {
    try {
      const v = parseRow(raw); // ✅ tiene fotos: string[]
      // ====== UPSERT VEHICLE ======
      // await db.vehicle.upsert({
      //   where: { id: v.id },
      //   update: { ...v, fotos: undefined }, // fotos se maneja aparte
      //   create: { ...v, fotos: undefined },
      // });

      // ====== UPSERT PHOTOS 1-N ======
      // Borra las antiguas y re-crea ordenadas (simple y seguro)
      // await db.photo.deleteMany({ where: { vehicleId: v.id } });
      // await Promise.all(
      //   v.fotos.map((url, idx) =>
      //     db.photo.create({ data: { vehicleId: v.id, url, position: idx } })
      //   )
      // );

      results.push({ id: v.id, ok: true });
    } catch (e: any) {
      results.push({ id: String(raw?.id ?? "?"), ok: false, error: e?.message || "error" });
    }
  }

  return NextResponse.json({ ok: true, results });
}
