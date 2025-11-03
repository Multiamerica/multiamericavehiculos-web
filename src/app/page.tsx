export const dynamic = "force-dynamic";

import { fetchInventory } from "@/lib/api";
import Catalog from "@/components/Catalog";
import OfertasCarousel from "@/components/OfertasCarousel";

/**
 * 🏠 Página pública del catálogo (vista clientes)
 * Muestra los vehículos con estado "DISPONIBLE" o "RESERVADO" como si fueran todos disponibles.
 */
export default async function HomePage() {
  // 🔹 Obtener inventario completo desde la API
  const data = await fetchInventory();

  // 🔸 Filtrar solo los visibles para clientes
  const visibles = data.filter((v) => {
    const estado = (v.estado ?? "").trim().toUpperCase();
    return estado === "DISPONIBLE" || estado === "RESERVADO";
  });

  // 🔸 Renderizar carrusel + catálogo unificado
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 py-6 text-white">
      {/* 🔹 Bloque superior: Título + Carrusel */}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 mb-10">
        {/* 🔸 Título principal */}
        <div className="text-center md:text-left w-full md:w-[30%] flex justify-center md:justify-start">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-stockport text-orange-400 tracking-wide leading-tight drop-shadow-[0_0_6px_rgba(0,0,0,0.6)]">
            VEHÍCULOS<br className="block md:hidden" /> DISPONIBLES
          </h1>
        </div>

        {/* 🧩 Carrusel de ofertas */}
        <div className="w-full md:w-[70%] flex justify-center md:justify-end">
          <OfertasCarousel />
        </div>
      </div>

      {/* 🔸 Catálogo de vehículos (DISPONIBLES + RESERVADOS) */}
      <div className="w-full">
        <Catalog data={visibles} estado="DISPONIBLE" />
      </div>
    </section>
  );
}
