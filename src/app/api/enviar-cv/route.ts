import { NextResponse } from "next/server";

/**
 * 🔁 Proxy interno para enviar los CVs al Apps Script
 * Evita el error CORS desde localhost o Vercel.
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();

    // 🚀 Enviar los datos al Apps Script
    const res = await fetch(
      "https://script.google.com/macros/s/AKfycbwQpN376qf8GPmGqnchVZvhhkduOyqQICYwHHV3Dfknum-K96q4GozlEDoQaeKg5UxO4g/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const text = await res.text();
    return NextResponse.json({ success: true, data: text });
  } catch (err: any) {
    console.error("❌ Error en proxy:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
