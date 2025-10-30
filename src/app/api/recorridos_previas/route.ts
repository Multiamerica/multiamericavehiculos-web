import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";

type Row = {
  publicar?: string;
  estado?: string;
  gerente?: string;
  marca?: string;
  modelo?: string;
  anio?: string | number;
  [k: string]: any;
};

// ======================================================
// 🧾 PDF — VEHÍCULOS EN PREVIA CITA
// ======================================================
export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Error al obtener datos (${res.status})`);
    const data = await res.json();
    const vehiculos: Row[] = Array.isArray(data?.items) ? data.items : [];

    // 🔹 Filtrar los de "Previa Cita"
    const previaCita = vehiculos.filter((v) => {
      const estado = String(v?.estado ?? v?.publicar ?? "").trim().toLowerCase();
      return estado.includes("previa") || estado.includes("cita");
    });

    if (!previaCita.length) throw new Error("No hay vehículos en previa cita para mostrar.");

    // 🔹 Agrupar por gerente
    const porGerente: Record<string, Row[]> = {};
    previaCita.forEach((v) => {
      const gerente = (v.gerente ?? "Sin Gerente").trim();
      if (!porGerente[gerente]) porGerente[gerente] = [];
      porGerente[gerente].push(v);
    });
    const gerentes = Object.keys(porGerente).sort((a, b) => a.localeCompare(b));

    // ======================================================
    // 📄 Crear PDF estilo hoja manual
    // ======================================================
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "a3" });
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
    pdf.text("Recorrido — Vehículos en Previa Cita", 90, 50);

    // ======================================================
    // 🧩 Dibujar las columnas de gerentes
    // ======================================================
    const marginX = 40;
    const marginY = 90;
    const colsPorFila = 8; // máximo 8 columnas por fila
    const colWidth = (pageWidth - marginX * 2) / colsPorFila;
    const headerHeight = 22;
    const textSpacing = 12;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);

    let x = marginX;
    let y = marginY;

    gerentes.forEach((g, idx) => {
      // Nueva fila cada 8 columnas
      if (idx > 0 && idx % colsPorFila === 0) {
        x = marginX;
        y += 200; // espacio entre bloques de gerentes
      }

      // Nombre del gerente
      pdf.setDrawColor(230, 126, 34);
      pdf.rect(x, y, colWidth, headerHeight);
      pdf.setTextColor("#e67e22");
      pdf.text(g.toUpperCase(), x + 5, y + 15);

      // Vehículos debajo
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor("#000");

      const lista = porGerente[g] || [];
      let yVeh = y + headerHeight + 12;

      lista.slice(0, 10).forEach((v) => {
        const texto = `${v.marca ?? ""} ${v.modelo ?? ""} ${v.anio ?? ""}`.trim();
        pdf.text(texto, x + 5, yVeh);
        yVeh += textSpacing;
      });

      x += colWidth;
    });

    // ======================================================
    // 📎 Pie de página
    // ======================================================
    pdf.setFontSize(9);
    pdf.setTextColor("#999");
    pdf.text(
      "© Multiamericavehiculos-webapp — Generado automáticamente",
      pageWidth - 300,
      pageHeight - 15
    );

    // ======================================================
    // 📤 Descargar PDF
    // ======================================================
    const pdfOutput = pdf.output("arraybuffer");
    return new NextResponse(pdfOutput, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=recorrido_previa_cita.pdf",
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
