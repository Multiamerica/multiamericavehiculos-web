import { NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import { registrarRecorrido } from "@/lib/recorridoLogger";

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
// 🧾 PDF — VEHÍCULOS EN PREVIA CITA (autoadaptativo y legible)
// ======================================================
export async function GET() {
  try {
    // 🌐 Obtener datos desde tu Apps Script remoto
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Error al obtener datos (${res.status})`);

    const data = await res.json();
    const vehiculos: Row[] = Array.isArray(data?.items) ? data.items : [];

    // 🔹 Filtrar "Previa Cita"
    const previaCita = vehiculos.filter((v) => {
      const estado = String(v?.estado ?? v?.publicar ?? "").trim().toLowerCase();
      return estado.includes("previa") || estado.includes("cita");
    });

    if (!previaCita.length)
      throw new Error("No hay vehículos en previa cita para mostrar.");

    // 👨‍💼 Agrupar por gerente
    const porGerente: Record<string, Row[]> = {};
    previaCita.forEach((v) => {
      const gerente = (v.gerente ?? "Sin Gerente").trim();
      if (!porGerente[gerente]) porGerente[gerente] = [];
      porGerente[gerente].push(v);
    });
    const gerentes = Object.keys(porGerente).sort((a, b) => a.localeCompare(b));

    // ======================================================
    // 📄 Crear PDF en hoja carta horizontal
    // ======================================================
    const pdf = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // === Encabezado ===
    const drawHeader = () => {
      pdf.setFillColor(20, 20, 20);
      pdf.rect(0, 0, pageWidth, 50, "F");
      pdf.setFillColor(230, 126, 34);
      pdf.rect(0, 47, pageWidth, 3, "F");
      pdf.setTextColor("#e67e22");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text("MULTIAMERICAVEHICULOS, C.A.", 80, 30);
      pdf.setTextColor("#ffffff");
      pdf.setFontSize(11);
      pdf.text(`Recorrido — Vehículos en Previa Cita (${previaCita.length})`, 80, 42);
    };
    drawHeader();

    // ======================================================
    // 🗂️ Configuración de diseño dinámico
    // ======================================================
    const marginX = 30;
    const marginY = 70;
    const colWidth = 130; // ancho fijo por bloque
    const headerHeight = 16;
    const textSpacing = 9;
    const maxColsPerPage = Math.floor((pageWidth - marginX * 2) / colWidth);

    let x = marginX;
    let y = marginY;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.5);

    // ======================================================
    // 🧩 Dibujo adaptativo
    // ======================================================
    for (const g of gerentes) {
      const lista = porGerente[g] || [];
      const alturaNecesaria = headerHeight + lista.length * textSpacing + 15;

      // Si no cabe en la página actual, pasar a la siguiente columna o nueva página
      if (y + alturaNecesaria > pageHeight - 60) {
        x += colWidth;
        y = marginY;

        if (x + colWidth > pageWidth - marginX) {
          pdf.addPage();
          drawHeader();
          x = marginX;
          y = marginY;
        }
      }

      // 🧱 Título del gerente
      pdf.setDrawColor(230, 126, 34);
      pdf.rect(x, y, colWidth, headerHeight);
      pdf.setTextColor("#e67e22");
      pdf.text(g.toUpperCase(), x + 3, y + 11);

      // 🚗 Lista de vehículos
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6.8);
      pdf.setTextColor("#000");

      let yVeh = y + headerHeight + 7;
      for (const v of lista) {
        const texto = `${v.marca ?? ""} ${v.modelo ?? ""} ${v.anio ?? ""}`.trim();
        pdf.text(texto, x + 3, yVeh);
        yVeh += textSpacing;
      }

      // Actualizar posición
      y = Math.max(y, yVeh + 10);

      // Si llegamos al límite vertical → mover a siguiente columna
      if (y > pageHeight - 80) {
        y = marginY;
        x += colWidth;
        if (x + colWidth > pageWidth - marginX) {
          pdf.addPage();
          drawHeader();
          x = marginX;
          y = marginY;
        }
      }
    }

    // ======================================================
    // 🕒 Pie de página
    // ======================================================
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString("es-VE", {
      dateStyle: "short",
      timeStyle: "short",
      hour12: true,
    });

    pdf.setFontSize(8);
    pdf.setTextColor("#999");
    pdf.text(`Imp. ${fechaHora}`, 30, pageHeight - 12);
    pdf.text("© Multiamericavehiculos-webapp", pageWidth - 180, pageHeight - 12);

    // ======================================================
    // 🧾 Registrar uso del recorrido (con confirmación)
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
      console.warn("⚠️ No se pudo leer el usuario:", e);
    }

    await registrarRecorrido("Previa Cita", nombreUsuario);
    console.log(`📤 Confirmado: ${nombreUsuario} generó el recorrido adaptativo de Previa Cita`);

    // ======================================================
    // 📤 Enviar PDF
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
