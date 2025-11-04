import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import inventory from "@/../public/inventory.json";
import { registrarRecorrido } from "@/lib/recorridoLogger";

type Row = {
  publicar?: string;
  gerente?: string;
  marca?: string;
  modelo?: string;
  anio?: string | number;
  [k: string]: any;
};

// ======================================================
// 🧾 PDF — VEHÍCULOS DISPONIBLES (OPTIMIZADO PARA VERCEL)
// ======================================================
export async function GET() {
  try {
    let vehiculos: Row[] = [];

    // ======================================================
    // ⚡ 1️⃣ Intentar usar inventario local (instantáneo)
    // ======================================================
    try {
      vehiculos = Array.isArray(inventory?.items)
        ? inventory.items
        : Array.isArray(inventory)
        ? inventory
        : [];

      if (!vehiculos.length) throw new Error("Inventario vacío");
      console.log("✅ Inventario cargado desde import local (sin red)");
    } catch (err) {
      console.warn("⚠️ Inventario local no disponible, intentando fetch...");

      // ======================================================
      // 🌐 2️⃣ Fallback: intentar cargar desde /inventory.json o API
      // ======================================================
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL ||
          "https://multiamerica.vercel.app";
        const res = await fetch(`${baseUrl}/inventory.json`, {
          cache: "force-cache",
          next: { revalidate: 60 },
        });

        if (res.ok) {
          const data = await res.json();
          vehiculos = Array.isArray(data?.items)
            ? data.items
            : Array.isArray(data)
            ? data
            : [];
          console.log("✅ Inventario cargado desde /inventory.json público");
        } else {
          throw new Error("inventory.json no disponible");
        }
      } catch {
        console.warn("⚠️ Usando API remota como último recurso...");
        const resApi = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
          cache: "no-store",
        });
        if (resApi.ok) {
          const data = await resApi.json();
          vehiculos = Array.isArray(data?.items) ? data.items : [];
        }
      }
    }

    // ======================================================
    // 🚗 3️⃣ Filtrar vehículos "DISPONIBLES" o "RESERVADOS"
    // ======================================================
    const disponibles = vehiculos.filter((v) => {
      const estado = String(v?.publicar ?? "").trim().toLowerCase();
      return estado.includes("disponible") || estado.includes("reservado");
    });

    if (!disponibles.length)
      throw new Error("No hay vehículos disponibles para mostrar.");

    // ======================================================
    // 🧩 4️⃣ Agrupar por gerente
    // ======================================================
    const porGerente: Record<string, Row[]> = {};
    disponibles.forEach((v) => {
      const gerente = (v.gerente ?? "Sin Gerente").trim();
      if (!porGerente[gerente]) porGerente[gerente] = [];
      porGerente[gerente].push(v);
    });
    const gerentes = Object.keys(porGerente).sort((a, b) => a.localeCompare(b));

    // ======================================================
    // 🧾 5️⃣ Crear PDF optimizado (formato A4 para menor peso)
    // ======================================================
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // === Encabezado corporativo ===
    pdf.setFillColor(20, 20, 20);
    pdf.rect(0, 0, pageWidth, 60, "F");
    pdf.setFillColor(230, 126, 34);
    pdf.rect(0, 55, pageWidth, 5, "F");

    pdf.setTextColor("#e67e22");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("MULTIAMERICAVEHICULOS, C.A.", 90, 35);

    pdf.setTextColor("#ffffff");
    pdf.setFontSize(13);
    const totalVehiculos = disponibles.length;
    pdf.text(`Recorrido — Vehículos Disponibles (${totalVehiculos})`, 90, 50);

    // ======================================================
    // 🗂️ 6️⃣ Columnas de gerentes
    // ======================================================
    const marginX = 40;
    const marginY = 90;
    const colsPorFila = 6; // menos columnas → menos carga visual
    const colWidth = (pageWidth - marginX * 2) / colsPorFila;
    const headerHeight = 22;
    const textSpacing = 12;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);

    let x = marginX;
    let y = marginY;

    gerentes.forEach((g, idx) => {
      if (idx > 0 && idx % colsPorFila === 0) {
        x = marginX;
        y += 200;
      }

      pdf.setDrawColor(230, 126, 34);
      pdf.rect(x, y, colWidth, headerHeight);
      pdf.setTextColor("#e67e22");
      pdf.text(g.toUpperCase(), x + 5, y + 15);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor("#000");

      const lista = porGerente[g] || [];
      let yVeh = y + headerHeight + 12;

      lista.slice(0, 8).forEach((v) => {
        const texto = `${v.marca ?? ""} ${v.modelo ?? ""} ${v.anio ?? ""}`.trim();
        pdf.text(texto, x + 5, yVeh);
        yVeh += textSpacing;
      });

      x += colWidth;
    });

    // ======================================================
    // 🕒 7️⃣ Fecha y hora de impresión
    // ======================================================
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString("es-VE", {
      dateStyle: "short",
      timeStyle: "short",
      hour12: true,
    });

    // Pie de página
    pdf.setFontSize(9);
    pdf.setTextColor("#999");
    pdf.text(`Imp. ${fechaHora}`, 40, pageHeight - 15);
    pdf.text(
      "© Multiamericavehiculos-webapp — Generado automáticamente",
      pageWidth - 300,
      pageHeight - 15
    );

    // ======================================================
    // 🧾 8️⃣ Registrar uso del recorrido
    // ======================================================
    let nombreUsuario = "Invitado";
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("usuario");
        if (stored) {
          const u = JSON.parse(stored);
          nombreUsuario =
            u?.nombreEjecutivo ||
            u?.ejecutivo ||
            u?.nombre ||
            u?.nombreCompleto ||
            u?.displayName ||
            "Invitado";
        }
      }
    } catch (e) {
      console.warn("⚠️ No se pudo leer el nombre del usuario:", e);
    }

    await registrarRecorrido("Disponibles", nombreUsuario);

    // ======================================================
    // 📤 9️⃣ Enviar PDF
    // ======================================================
    const pdfOutput = pdf.output("arraybuffer");
    return new NextResponse(pdfOutput, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=recorrido_disponibles.pdf",
      },
    });
  } catch (err) {
    console.error("❌ Error generando PDF:", err);
    return NextResponse.json(
      { error: "Error generando PDF", details: String(err) },
      { status: 500 }
    );
  }
}
