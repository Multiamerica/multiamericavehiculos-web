"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchInventory } from "@/lib/api";
import TwoPaneGallery from "@/components/TwoPaneGallery";
import HeaderUsuarios from "@/components/HeaderUsuarios";
import { Vehicle } from "@/types/vehicle";
import EditableFichaTecnica from "@/components/EditableFichaTecnica";

/** 🔹 Formatear números (precio, km, etc.) */
function fmtNum(n?: number, suf: string = ""): string {
  if (n == null) return "";
  try {
    return `${new Intl.NumberFormat("es-VE").format(n)}${suf}`;
  } catch {
    return `${n}${suf}`;
  }
}

/** 🔸 Página de Detalle del Vehículo (Interna para empleados) */
export default function VehicleDetailEmpleado() {
  const params = useParams();
  const vehiculo_id = params?.vehiculo_id as string;
  const router = useRouter();

  const [vehiculo, setVehiculo] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>(null);
  const [rol, setRol] = useState("Invitado");
  const [verificandoSesion, setVerificandoSesion] = useState(true);

  /** 🔐 Verificar sesión y rol */
  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const saved = localStorage.getItem("usuario");
        if (!saved) {
          router.push("/Login/login.html");
          return;
        }

        const parsed = JSON.parse(saved);
        setUsuario(parsed);

        const rolDetectado =
          parsed.rol || parsed.rango || parsed.Rango || "Invitado";
        setRol(rolDetectado);

        localStorage.setItem(
          "usuario",
          JSON.stringify({ ...parsed, rol: rolDetectado })
        );
      } catch (err) {
        console.error("⚠️ Error verificando sesión:", err);
        setRol("Invitado");
      } finally {
        setVerificandoSesion(false);
      }
    };

    verificarSesion();
  }, [router]);

  /** 🚗 Cargar vehículo desde el inventario */
  useEffect(() => {
    const loadVehiculo = async () => {
      try {
        const data = await fetchInventory();
        const v =
          data.find(
            (x) =>
              String(x.vehiculo_id) === String(vehiculo_id) ||
              String(x.ID) === String(vehiculo_id) ||
              String(x.id) === String(vehiculo_id)
          ) || null;

        if (!v) {
          console.warn("❌ Vehículo no encontrado en inventario.");
          router.push("/Usuarios");
          return;
        }

        // 🧠 Normalizar campos
        const normalizado: Vehicle = {
          ...v,
          vehiculo_id: v.vehiculo_id || v.ID || v.id || vehiculo_id,
          estado: v.publicar || v.estado || "",
        };

        // 🚫 Bloquear visualización de "No Disponible"
        const estado = String(normalizado.estado ?? "")
          .normalize("NFD")
          .replace(/_/g, " ")
          .toLowerCase()
          .trim();

        const bloqueado =
          !estado ||
          estado.includes("no disponible") ||
          estado.includes("nodisponible") ||
          estado.includes("no_disponible") ||
          estado.includes("sin publicar") ||
          estado === "";

        if (bloqueado) {
          alert("🚫 Este vehículo no está disponible para visualización.");
          router.push("/");
          return;
        }

        setVehiculo(normalizado);
      } catch (err) {
        console.error("⚠️ Error cargando vehículo:", err);
      } finally {
        setLoading(false);
      }
    };

    loadVehiculo();
  }, [vehiculo_id, router]);

  /** 🕓 Cargando */
  if (verificandoSesion || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-orange-300">
        Cargando información del vehículo...
      </main>
    );
  }

  /** 🚫 Si no hay vehículo */
  if (!vehiculo) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-orange-300">
        Vehículo no encontrado.
      </main>
    );
  }

  /** 🧩 Estado del vehículo */
  const v = vehiculo;
  const estado = (v.estado || v.publicar || "").toString().toLowerCase().trim();

  const disponible = estado.includes("disponible");
  const estadoTexto = estado.includes("reservado")
    ? "Reservado"
    : estado.includes("disponible")
    ? "Disponible"
    : estado.includes("previa")
    ? "Previa Cita"
    : "No Disponible";

  /** 🎨 Color del recuadro según estado */
  const colorEstado =
    estado.includes("reservado")
      ? "bg-yellow-600 border-yellow-400"
      : estado.includes("disponible")
      ? "bg-green-700 border-green-400"
      : estado.includes("previa")
      ? "bg-orange-600 border-orange-400"
      : "bg-red-700 border-red-400";

  /** 🧾 Render principal */
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-900 to-black pb-12">
      <HeaderUsuarios />

      {/* 🔙 Botón volver */}
      <div className="flex items-start max-w-7xl mx-auto px-4 pt-4">
        <button
          onClick={() => router.push("/Usuarios")}
          className="px-6 py-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-md transition"
        >
          ← Volver
        </button>
      </div>

      {/* 🧩 Contenido principal */}
      <div className="grid gap-8 lg:grid-cols-2 items-start max-w-7xl mx-auto px-4 pt-2">
        {/* 📸 Galería */}
        <section className="relative">
          <div
            className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-lg border text-white font-semibold shadow-lg ${colorEstado}`}
          >
            {estadoTexto}
          </div>
          <TwoPaneGallery images={v.imagenes} />
        </section>

        {/* 📋 Información */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-3xl font-extrabold text-white leading-tight">
            {v.marca} {v.modelo} {v.version ? `${v.version} ` : ""} {v.anio}
          </h1>

          {/* 🧾 Ficha técnica editable */}
          <EditableFichaTecnica
            vehiculo={v}
            rolUsuario={rol}
            nombreUsuario={
              usuario?.nombreEjecutivo || usuario?.nombre || "Desconocido"
            }
          />
        </div>
      </div>
    </div>
  );
}
