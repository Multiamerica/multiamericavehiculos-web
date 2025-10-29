export const dynamic = "force-dynamic";

import { fetchInventory } from "@/lib/api";
import Catalog from "@/components/Catalog";
import OfertasCarousel from "@/components/OfertasCarousel";

export default async function PreviaCitaPage() {
  const data = await fetchInventory();

  // Solo los vehículos con estado "PREVIA_CITA"
  const previaCita = data.filter(
    (v) => (v.estado ?? "").trim().toUpperCase() === "PREVIA_CITA"
  );

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 text-white">
      {/* 🔹 Bloque superior: título + carrusel lado a lado */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-1 mb-1">
        {/* 🟠 Título a la izquierda */}
        <div className="md:w-[1%] text-center md:text-left">
          <h1 className="text-5xl font-stockport text-orange-400 font-stockport leading-[1.05] tracking-wide">
            <span className="block">VEHÍCULOS</span>
            <span className="block">PREVIA CITA</span>
          </h1>
        </div>

        {/* 🧩 Carrusel a la derecha */}
        <div className="md:w-[73%] w-full md:translate-y-2">
          <OfertasCarousel />
        </div>
      </div>
      {/* 🔸 Catálogo de vehículos en previa cita */}
      <Catalog data={previaCita} estado="PREVIA_CITA" />
    </section>
  );
}
