import { NextRequest, NextResponse } from "next/server";

// ⚠️ Demo en memoria (cámbialo por tu DB o KV/Redis/Firebase)
let settings = { syncEnabled: false };

export async function GET() {
  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  if (typeof body.syncEnabled === "boolean") {
    settings.syncEnabled = body.syncEnabled;
  }
  return NextResponse.json(settings);
}
