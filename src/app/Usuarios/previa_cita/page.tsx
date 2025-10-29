"use client";

import { useEffect, useState } from "react";
import HeaderUsuarios from "@/components/HeaderUsuarios";
import CatalogUsuariosPrevia from "@/components/CatalogUsuariosPrevia";
import { Vehicle } from "@/types/vehicle";

export default function PreviaCitaPage() {
  const [vehiculos, setVehiculos] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const res = await fetch("/api/vehiculos");
        const data: Vehicle[] = await res.json();

        // 🔸 Solo mostrar los de Previa Cita
        const previaCita = data.filter(
          (v) => (v.estado ?? "").toUpperCase() === "PREVIA_CITA"
        );

        // 🔸 Forzar visibilidad completa
        const conPreciosVisibles = previaCita.map((v) => ({
          ...v,
          vis_precio: true,
        }));

        setVehiculos(conPreciosVisibles);
      } catch (err) {
        console.error("Error al obtener los vehículos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehiculos();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black">
      <HeaderUsuarios />

      <section className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-extrabold text-orange-400 mb-8 text-center">
          Vehículos — Previa Cita (Vista Empleados)
        </h1>

        {loading ? (
          <p className="text-center text-orange-200">Cargando vehículos...</p>
        ) : vehiculos.length === 0 ? (
          <p className="text-center text-orange-200">
            No hay vehículos en previa cita.
          </p>
        ) : (
          <CatalogUsuariosPrevia data={vehiculos} estado="PREVIA_CITA" />
        )}
      </section>
    </main>
  );
}
