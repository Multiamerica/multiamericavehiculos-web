export const dynamic = "force-dynamic";

import { fetchInventory } from "@/lib/api";
import Catalog from "@/components/Catalog";
import OfertasCarousel from "@/components/OfertasCarousel";

/**
 * 🚗 Página de Vehículos en Previa Cita
 * Muestra los vehículos con estado "PREVIA_CITA"
 */
export default async function PreviaCitaPage() {
  const data = await fetchInventory();

  // Filtrar solo los vehículos en Previa Cita
  const previaCita = data.filter(
    (v) => (v.estado ?? "").trim().toUpperCase() === "PREVIA CITA"
  );

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 text-white">
      {/* 🔹 Bloque superior: título + carrusel */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 mb-10">
        <div className="text-center md:text-left w-full md:w-[30%] flex justify-center md:justify-start">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-stockport text-orange-400 tracking-wide leading-tight drop-shadow-[0_0_6px_rgba(0,0,0,0.6)]">
            VEHÍCULOS<br className="block md:hidden" /> PREVIA CITA
          </h1>
        </div>

        {/* Carrusel igual que en “Disponibles” */}
        <div className="w-full md:w-[70%] flex justify-center md:justify-end">
          <OfertasCarousel />
        </div>
      </div>

      {/* Catálogo */}
      <div className="w-full">
        <Catalog data={previaCita} estado="PREVIA_CITA" />
      </div>
    </section>
  );
}
