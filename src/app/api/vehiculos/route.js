import { NextResponse } from "next/server";
import { fetchInventory } from "@/lib/api";

/**
 * API interna de vehículos
 * Devuelve TODO el inventario sin filtrar, incluyendo
 * los campos administrativos (Gerente, Asesor, etc.)
 */
export async function GET() {
  try {
    const vehiculos = await fetchInventory(); // 🔹 Devuelve todos los registros
    return NextResponse.json(vehiculos, { status: 200 });
  } catch (error) {
    console.error("❌ Error en /api/vehiculos:", error);
    return NextResponse.json(
      { error: "Error al obtener los vehículos" },
      { status: 500 }
    );
  }
}
