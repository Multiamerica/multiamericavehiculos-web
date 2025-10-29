"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchInventory } from "@/lib/api";
import TwoPaneGallery from "@/components/TwoPaneGallery";
import HeaderUsuarios from "@/components/HeaderUsuarios";
import { Vehicle } from "@/types/vehicle";

/** 🔹 Formatear números (precio, km, etc.) */
function fmtNum(n?: number, suf: string = ""): string {
  if (n == null) return "";
  try {
    return `${new Intl.NumberFormat("es-VE").format(n)}${suf}`;
  } catch {
    return `${n}${suf}`;
  }
}

export default function VehicleDetailEmpleado() {
  const params = useParams();
  const vehiculo_id = params?.vehiculo_id as string; // ✅ tipado seguro
  const router = useRouter();

  const [vehiculo, setVehiculo] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  /** 🔐 Verificar sesión del usuario */
  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (!user) {
      router.push("/Login/login.html");
      return;
    }
  }, [router]);

  /** 🚗 Cargar vehículo específico */
  useEffect(() => {
    const loadVehiculo = async () => {
      try {
        const data = await fetchInventory();
        const v = data.find((x) => String(x.vehiculo_id) === String(vehiculo_id));
        if (!v) return;

        // Mostrar todo sin restricciones
        setVehiculo({
          ...v,
          vis_precio: true,
          vis_duenos: true,
        });
      } catch (err) {
        console.error("Error al cargar el vehículo:", err);
      } finally {
        setLoading(false);
      }
    };

    loadVehiculo();
  }, [vehiculo_id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-orange-300">
        Cargando información del vehículo...
      </main>
    );
  }

  if (!vehiculo) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-orange-300">
        Vehículo no encontrado.
      </main>
    );
  }

  const v = vehiculo;
  const estado = (v.estado ?? "").toLowerCase();
  const disponible = estado === "disponible";
  const estadoTexto = disponible ? "Disponible" : "Previa Cita";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-900 to-black pb-12">
      <HeaderUsuarios />

    {/* 🔙 Botón para volver al panel */}
    <div className="flex items-start max-w-7xl mx-auto px-4 pt-2">
      <button
        onClick={() => router.push("/Usuarios")}
        className="px-6 py-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition"
      >
        ← Volver
      </button>
    </div>


      <div className="grid gap-8 lg:grid-cols-2 items-start max-w-7xl mx-auto px-4 pt-2">
        {/* 📸 Galería */}
        <section className="relative">
          <div
            className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-lg border text-white font-semibold shadow-lg ${
              disponible
                ? "bg-orange-600 border-orange-400"
                : "bg-neutral-700 border-neutral-500"
            }`}
          >
            {estadoTexto}
          </div>
          <TwoPaneGallery images={v.imagenes} />
        </section>

        {/* 📋 Información completa */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-3xl font-extrabold text-white leading-tight">
              {v.marca} {v.modelo} {v.version ? `${v.version} ` : ""} {v.anio}
            </h1>

            {v.precio_num != null && (
              <p className="mt-1 text-orange-400 text-2xl font-semibold">
                {`${v.moneda ?? "USD"} ${fmtNum(v.precio_num!, "")}`.trim()}
              </p>
            )}
          </div>

          {/* Ficha técnica ampliada */}
          <div className="space-y-3 p-6 rounded-lg border border-orange-700 bg-black/70">
            <h2 className="text-2xl font-semibold text-white pb-2 border-b border-orange-700">
              FICHA TÉCNICA COMPLETA
            </h2>

            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-base">
              <Info label="Carrocería" value={v.carroseria} />
              <Info label="Marca" value={v.marca} />
              <Info label="Modelo" value={v.modelo} />
              <Info label="Versión" value={v.version} />
              <Info label="Año" value={v.anio} />
              <Info label="Kilometraje" value={fmtNum(v.km_num, " km")} />
              <Info label="Transmisión" value={v.transmision} />
              <Info label="Tracción" value={v.traccion} />
              <Info label="Color" value={v.color} />
              <Info label="Motor" value={v.motor} />
              <Info label="Dueños" value={v.duenos} />
              <Info label="A/A" value={v.aa ? "Sí" : "No"} />
              <Info label="Tapicería" value={v.tapiceria} />
              <Info label="Llaves" value={v.llaves} />
              <Info label="#Puertas" value={v.puertas} />
              <Info label="Gerente" value={v.gerente || (v as any).Gerente || "No asignado"} />
              <Info label="Asesor" value={v.asesor || (v as any).Asesor || "No asignado"} />
              <Info label="Ubicación" value={v.ubicacion} />
            </div>
          </div>
          {/* Descripción General */}
          {v.descripcion && (
            <div className="p-6 rounded-xl border border-orange-700 bg-gradient-to-br from-black/70 via-neutral-900/60 to-black/70 shadow-md">
              <h2 className="text-2xl font-bold text-orange-400 mb-3 border-b border-orange-700 pb-2">
                Descripción General
              </h2>
              <p className="text-base leading-relaxed text-neutral-100 whitespace-pre-line">
                {v.descripcion}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/** 🔹 Componente auxiliar */
function Info({ label, value }: { label: string; value?: string | number | boolean | null }) {
  if (!value && value !== 0) return null;
  return (
    <p>
      <b className="text-orange-300">{label}:</b>{" "}
      <span className="text-white">{String(value)}</span>
    </p>
  );
}
