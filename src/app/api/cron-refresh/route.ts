import { NextResponse } from "next/server";
// import { refreshLocalCacheFromDB } from "@/lib/cache"; // implementa tu fetch a DB y cache

export async function GET() {
  // const count = await refreshLocalCacheFromDB();
  const count = 1; // demo
  return NextResponse.json({ ok: true, refreshed: count, at: new Date().toISOString() });
}
