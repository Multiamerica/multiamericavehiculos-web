"use client";

import { Vehicle } from "@/types/vehicle";
import { useEffect, useState } from "react";
import HeaderUsuarios from "@/components/HeaderUsuarios";
import { FaCarSide, FaPrint } from "react-icons/fa";

export default function RecorridosDisponibles() {
  const [vehiculos, setVehiculos] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const res = await fetch("/api/vehiculos", { cache: "no-store" });
        const data = await res.json();

        const vehiculosArray = Array.isArray(data) ? data : data.items || [];

        // 🔹 Filtrar "DISPONIBLES"
        const disponibles = vehiculosArray.filter(
          (v: Vehicle) =>
            String(v.estado ?? "").trim().toUpperCase() === "DISPONIBLE"
        );

        setVehiculos(disponibles);
      } catch (err) {
        console.error("Error cargando vehículos:", err);
      } finally {
        setLoading(false);
      }
    }

    cargarDatos();
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  // 🔸 Agrupar por gerente
  const vehiculosPorGerente = vehiculos.reduce((acc, v) => {
    const gerente = (v.gerente ?? "Sin Gerente").toString().trim();
    if (!acc[gerente]) acc[gerente] = [];
    acc[gerente].push(v);
    return acc;
  }, {} as Record<string, Vehicle[]>);

  // 🔹 Ordenar alfabéticamente
  const gerentesOrdenados = Object.keys(vehiculosPorGerente).sort(
    (a, b) => a.localeCompare(b)
  );

  return (
    <>
      <HeaderUsuarios />

      <main className="min-h-screen bg-black text-white pt-24 px-3 sm:px-8">
        {/* 🔹 Encabezado */}
        <div className="flex items-center justify-between mb-8 no-print">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-orange-500 flex items-center gap-3">
            <FaCarSide className="text-orange-400" /> Recorridos — Disponibles
          </h1>

          <button
            onClick={() => window.open("/api/recorridos_pdf", "_blank")}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg font-semibold text-sm sm:text-base transition"
          >
            <FaPrint /> Imprimir / Descargar
          </button>
        </div>

        {/* 🔹 Cuerpo */}
        {loading ? (
          <p className="text-gray-400">Cargando datos...</p>
        ) : (
          <div
            className="
              grid 
              grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6
              gap-4 sm:gap-6 print:grid-cols-6
            "
          >
            {gerentesOrdenados.map((gerente) => (
              <div
                key={gerente}
                className="
                  print-card bg-neutral-900/70 border border-orange-700/60 
                  rounded-xl shadow-md p-3 sm:p-4
                  text-sm sm:text-base
                  print:bg-white print:border-orange-500 print:shadow-none
                "
              >
                <h2 className="text-orange-400 font-bold text-center border-b border-orange-600 pb-1 mb-2 print:text-orange-700 print:border-orange-700 text-sm sm:text-base">
                  {gerente.toUpperCase()}
                </h2>

                {/* 🔗 Lista clicable */}
                <ul className="space-y-1 text-gray-300 print:text-black leading-tight text-xs sm:text-sm">
                  {vehiculosPorGerente[gerente]?.map((v, i) => (
                    <li
                      key={i}
                      onClick={() =>
                        window.open(`/Usuarios/v/${v.vehiculo_id}`, "_blank")
                      }
                      className="flex justify-between border-b border-gray-700/40 print:border-gray-300/60 pb-0.5 cursor-pointer hover:text-orange-400 transition-colors"
                      title="Ver publicación"
                    >
                      <span>
                        {v.marca ?? ""} {v.modelo ?? ""}{" "}
                        <span className="text-gray-500 text-xs print:text-gray-700">
                          {v.anio ?? ""}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

/* 💅 Estilos de impresión */
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @media print {
      @page {
        size: A4 landscape;
        margin: 10mm;
      }

      body {
        background: white !important;
        color: black !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        margin: 0;
        padding: 0;
      }

      header, nav, button, .no-print {
        display: none !important;
      }

      main {
        padding: 10px !important;
        background: white !important;
        color: #111 !important;
      }

      .print-card {
        background: #fff !important;
        border: 1px solid #e67e22 !important;
        page-break-inside: avoid;
        padding: 4px !important;
      }

      h2 {
        color: #d35400 !important;
      }

      .grid {
        display: grid;
        grid-template-columns: repeat(6, 1fr);
        gap: 6px !important;
      }

      body::after {
        content: "multiamericavehiculos-webapp";
        position: fixed;
        bottom: 10px;
        right: 20px;
        font-size: 10px;
        color: rgba(200, 120, 0, 0.3);
        font-weight: bold;
        letter-spacing: 1px;
      }
    }
  `;
  document.head.appendChild(style);
}
