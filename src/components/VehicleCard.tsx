"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useCallback } from "react";
import { Vehicle } from "@/types/vehicle";
import { pickPortada } from "@/lib/portada";

function formatMoney(n?: number, cur?: string) {
  if (n == null) return "";
  return `${cur ?? ""} ${new Intl.NumberFormat("es-VE").format(n)}`.trim();
}

function formatKm(n?: number) {
  if (n == null) return "";
  return `${new Intl.NumberFormat("es-VE").format(n)} km`;
}

export default function VehicleCard({ v }: { v: Vehicle }) {
  const [isError, setIsError] = useState(false);
  const portada = pickPortada(v);
  const pathname = usePathname();

  // 🔹 Detectar si estamos dentro del panel de usuarios
  const esVistaUsuarios = (pathname ?? "").startsWith("/Usuarios");

  const handleError = useCallback(() => {
    setIsError(true);
  }, []);

  // 🔹 Enlace correcto según el contexto
  const linkHref = esVistaUsuarios
    ? `/Usuarios/v/${v.vehiculo_id}` // versión interna
    : `/v/${v.vehiculo_id}`; // versión pública

  return (
    <Link
      href={linkHref}
      className="
        block border border-orange-900 rounded-xl overflow-hidden 
        bg-black/70 shadow-sm hover:shadow-lg hover:border-orange-600 
        transition-all duration-300 focus:outline-none focus:ring-2 
        focus:ring-orange-500
      "
    >
      {/* Imagen del vehículo */}
      <div className="aspect-[4/3] bg-black/50 relative">
        {!isError ? (
          <img
            src={portada}
            alt={`${v.marca} ${v.modelo} ${v.anio}`}
            className="w-full h-full object-cover"
            onError={handleError}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm bg-neutral-800">
            Imagen no disponible
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4 space-y-1">
        <h3 className="font-semibold text-white text-lg leading-tight">
          {v.marca} {v.modelo} {v.anio}
        </h3>

        <p className="text-sm text-orange-300">
          {v.vis_precio && v.precio_num != null ? (
            <span className="text-orange-400 font-medium">
              {formatMoney(v.precio_num, v.moneda)}
            </span>
          ) : null}

          {v.km_num != null ? (
            <span className="text-neutral-300"> • {formatKm(v.km_num)}</span>
          ) : null}
        </p>

        <p className="mt-3 text-orange-400 font-medium text-sm">
          Ver detalles →
        </p>
      </div>
    </Link>
  );
}
