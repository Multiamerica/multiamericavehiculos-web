export const dynamic = "force-dynamic";

import HeaderUsuarios from "@/components/HeaderUsuarios";
import { fetchInventory } from "@/lib/api";
import CatalogUsuariosReservados from "@/components/CatalogUsuariosReservados";

/**
 * 🚗 Página interna — Vehículos Reservados
 * Solo visible para usuarios internos.
 */
export default async function Page() {
  // 🔹 Cargar inventario desde la API
  const data = await fetchInventory();

  return (
    <section className="min-h-screen bg-black text-white px-4 sm:px-6 py-10">
      {/* 🧭 Encabezado de usuarios */}
      <HeaderUsuarios />

      {/* 🔸 Título */}
      <div className="text-center md:text-left mb-10">
        <h1 className="text-4xl sm:text-5xl font-stockport text-orange-400 font-stockport tracking-wide drop-shadow-[0_0_6px_rgba(0,0,0,0.6)]">
          VEHÍCULOS RESERVADOS
        </h1>
        <p className="text-neutral-400 mt-2">
          Aquí puedes ver los vehículos actualmente reservados.
        </p>
      </div>

      {/* 🧩 Catálogo de Reservados */}
      <div className="w-full max-w-7xl mx-auto">
        <CatalogUsuariosReservados data={data} />
      </div>
    </section>
  );
}
