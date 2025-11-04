"use client";

import HeaderUsuarios from "@/components/HeaderUsuarios";
import { registrarRecorrido } from "@/lib/recorridoLogger";
import { FaCarSide, FaCalendarCheck } from "react-icons/fa";

export default function RecorridosPage() {
  // 🧠 Función para obtener el nombre del usuario logueado
  const obtenerEjecutivo = (): string => {
    const storedUser = localStorage.getItem("usuario");
    if (!storedUser) return "Invitado";
    try {
      const user = JSON.parse(storedUser);
      return (
        user.nombreEjecutivo ||
        user.nombre ||
        user.displayName ||
        user.ejecutivo ||
        "Invitado"
      );
    } catch {
      return "Invitado";
    }
  };

  return (
    <>
      <HeaderUsuarios />
      <main className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white pt-24 px-6 sm:px-10">
        {/* 🔸 Encabezado */}
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-orange-500 drop-shadow-[0_0_10px_rgba(255,110,0,0.5)] mb-4">
            Sistema de Recorridos
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Selecciona el tipo de recorrido que deseas visualizar.  
            Cada sección se actualiza automáticamente con los vehículos más recientes
            y su asignación según el gerente correspondiente.
          </p>
        </div>

        {/* 🔹 Tarjetas de opciones */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 🚗 Vehículos Disponibles */}
          <button
            onClick={async () => {
              const nombreEjecutivo = obtenerEjecutivo();
              await registrarRecorrido("Disponibles y Reservados", nombreEjecutivo);
              window.location.href = "/Usuarios/Base/Recorridos/Disponibles";
            }}
            className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-orange-700/60 p-8 shadow-lg hover:shadow-orange-900/40 transition-all duration-300 text-left"
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-orange-500 to-orange-700 opacity-70 group-hover:opacity-100 transition-all" />
            <div className="relative flex flex-col items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl shadow-inner">
                  <FaCarSide className="text-white text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-orange-400">
                  Vehículos Disponibles
                </h2>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Visualiza todos los vehículos disponibles organizados por gerente
                y asesores a su cargo.  
                Permite descargar e imprimir el listado actualizado en tiempo real.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all rounded-2xl" />
          </button>

          {/* 📅 Vehículos en Previa Cita */}
          <button
            onClick={async () => {
              const nombreEjecutivo = obtenerEjecutivo();
              await registrarRecorrido("Previa Cita", nombreEjecutivo);
              window.location.href = "/Usuarios/Base/Recorridos/Previa_Cita";
            }}
            className="group relative overflow-hidden rounded-2xl bg-neutral-900 border border-orange-700/60 p-8 shadow-lg hover:shadow-orange-900/40 transition-all duration-300 text-left"
          >
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-orange-500 to-orange-700 opacity-70 group-hover:opacity-100 transition-all" />
            <div className="relative flex flex-col items-start gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-orange-600 to-orange-500 rounded-xl shadow-inner">
                  <FaCalendarCheck className="text-white text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-orange-400">
                  Vehículos en Previa Cita
                </h2>
              </div>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                Consulta los vehículos asignados a cada gerente que se encuentran
                bajo la modalidad de previa cita.  
                Actualizado constantemente con la base de datos principal.
              </p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-all rounded-2xl" />
          </button>
        </div>

        {/* Espaciado inferior */}
        <div className="h-16" />
      </main>
    </>
  );
}
