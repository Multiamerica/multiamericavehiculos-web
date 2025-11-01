"use client";

import Catalog from "@/components/Catalog";
import { Vehicle } from "@/types/vehicle";

/**
 * 🚗 Catálogo para mostrar únicamente los vehículos RESERVADOS
 * (Versión interna de usuarios)
 */
export default function CatalogUsuariosReservados({ data }: { data: Vehicle[] }) {
  // 🔸 Filtrar los vehículos con estado "RESERVADO"
  const reservados = data.filter(
    (v) => (v.estado ?? "").trim().toUpperCase() === "RESERVADO"
  );

  return (
    <section className="w-full">
      {reservados.length > 0 ? (
        <Catalog data={reservados} estado="RESERVADO" />
      ) : (
        <p className="text-neutral-400 text-sm">
          No hay vehículos reservados actualmente.
        </p>
      )}
    </section>
  );
}
