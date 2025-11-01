"use client";

import { useState, useEffect } from "react";
import { FaPen, FaSave } from "react-icons/fa";
import { Vehicle } from "@/types/vehicle";

export default function EditableFichaTecnica({
  vehiculo,
  rolUsuario = "Invitado",
  nombreUsuario = "Sin nombre",
}: {
  vehiculo: Vehicle;
  rolUsuario?: string;
  nombreUsuario?: string;
}) {
  const [editando, setEditando] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState<Record<string, any>>({});
  const [guardando, setGuardando] = useState(false);
  const [carrocerias, setCarrocerias] = useState<string[]>([]);

  /** 🧩 Permisos específicos por rol */
  const permisosPorRol: Record<string, string[]> = {
    ADMIN: [
      "Publicar",
      "Vis. Precio",
      "Carrocería",
      "Marca",
      "Modelo",
      "Versión",
      "Año",
      "Kilometraje",
      "Transmisión",
      "Tracción",
      "Color",
      "Motor",
      "Dueños",
      "Vis. Dueños",
      "A/A",
      "Tapicería",
      "Llaves",
      "#Puertas",
      "Descripción",
      "Gerente",
      "Asesor",
    ],
    "GERENTE DE GUARDIA": [
      "Publicar",
      "Vis. Precio",
      "Motor",
      "Dueños",
      "Vis. Dueños",
      "Descripción",
      "A/A",
      "Tapicería",
      "Kilometraje",
      "Llaves",
    ],
    GERENTE: [
      "Publicar",
      "Vis. Precio",
      "Vis. Dueños",
      "Descripción",
      "A/A",
      "Tapicería",
      "Llaves",
    ],
    SUPERVISOR: [
      "Publicar",
      "Descripción",
      "Vis. Precio",
      "Vis. Dueños",
    ],
    INVITADO: [], // solo lectura
  };


  // 🛡️ Solo estos roles pueden modificar datos
  const rolActual = rolUsuario.toUpperCase();
  const camposPermitidos = permisosPorRol[rolActual] || [];
  const puedeEditar = camposPermitidos.length > 0;

  /** 🔽 Cargar datos iniciales correctamente */
  useEffect(() => {
    setForm({
      "Publicar": vehiculo.estado === "DISPONIBLE" ? "Disponible" :
                  vehiculo.estado === "PREVIA_CITA" ? "Previa Cita" :
                  vehiculo.estado === "NO_DISPONIBLE" ? "No Disponible" :
                  vehiculo.estado === "RESERVADO" ? "Reservado" : "",
      "Vis. Precio": vehiculo.vis_precio ? "Si" : "No",
      "Carrocería": vehiculo.carroceria ?? "",
      "Marca": vehiculo.marca ?? "",
      "Modelo": vehiculo.modelo ?? "",
      "Versión": vehiculo.version ?? "",
      "Año": vehiculo.anio ?? "",
      "Kilometraje": vehiculo.km_num ?? "",
      "Transmisión": vehiculo.transmision ?? "",
      "Tracción": vehiculo.traccion ?? "",
      "Color": vehiculo.color ?? "",
      "Motor": vehiculo.motor ?? "",
      "Dueños": vehiculo.duenos ?? "",
      "Vis. Dueños": vehiculo.vis_duenos ? "Si" : "No",
      "A/A": vehiculo.aa ?? "",
      "Tapicería": vehiculo.tapiceria ?? "",
      "Llaves": vehiculo.llaves ?? "",
      "#Puertas": vehiculo.puertas ?? "",
      "Descripción": vehiculo.descripcion ?? "",
      "Gerente": vehiculo.gerente ?? "",
      "Asesor": vehiculo.asesor ?? "",
    });
  }, [vehiculo]);

  /** 🔽 Cargar lista de carrocerías disponibles */
  useEffect(() => {
    async function cargarCarrocerias() {
      try {
        const res = await fetch("/api/vehiculos", { cache: "no-store" });
        const raw = await res.json();
        const data: any[] = Array.isArray(raw) ? raw : raw.items || [];

        const lista: string[] = Array.from(
          new Set(
            data
              .map((v) => String(v.carroceria || v.Carrocería || "").trim())
              .filter(Boolean)
          )
        ).sort();

        setCarrocerias(lista);
        console.log("✅ Carrocerías cargadas:", lista);
      } catch (err) {
        console.error("⚠️ Error cargando carrocerías:", err);
      }
    }

    cargarCarrocerias();
  }, []);

  /** 🔽 Listas de valores permitidos */
  const opciones: Record<string, string[]> = {
    Publicar: ["No Disponible", "Disponible", "Previa Cita", "Reservado"],
    "Vis. Precio": ["Si", "No"],
    Transmisión: ["Automático", "Sincrónico"],
    Tracción: ["4x4", "4x2"],
    "Vis. Dueños": ["Si", "No"],
    Carrocería: carrocerias,
  };

  const toggleEditar = (campo: string) => {
    if (!camposPermitidos.includes(campo)) {
      alert(`🚫 No puedes editar el campo "${campo}" con tu rol actual (${rolUsuario}).`);
      return;
    }
    setEditando((prev) => ({ ...prev, [campo]: !prev[campo] }));
  };


  const handleChange = (campo: string, valor: string) =>
    setForm((prev) => ({ ...prev, [campo]: valor }));

  /** 💾 Guardar cambios */
  const guardarCambios = async () => {
    if (!puedeEditar) {
      alert("🚫 No tienes permisos para modificar esta información.");
      return;
    }

    setGuardando(true);
    try {
      const idVehiculo =
        vehiculo.vehiculo_id ||
        vehiculo.id ||
        vehiculo.ID ||
        vehiculo.Id ||
        vehiculo["ID"];

      if (!idVehiculo) {
        alert("❌ No se encontró el ID del vehículo.");
        return;
      }

      const res = await fetch("/api/vehiculos_editar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "actualizarVehiculo",
          id: String(idVehiculo),
          data: form,
          quien: nombreUsuario,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        alert(`⚠️ No se pudieron guardar los cambios: ${data.msg || "Error desconocido"}`);
      } else {
        alert(`✅ Cambios guardados correctamente por ${nombreUsuario}`);
      }
    } catch (err) {
      alert("❌ Error al guardar cambios.");
      console.error("⚠️ Error guardando vehículo:", err);
    } finally {
      setGuardando(false);
      setEditando({});
    }
  };

  /** 📋 Campos según hoja */
  const campos = Object.entries(form);

  return (
    <div className="space-y-3 p-6 rounded-lg border border-orange-700 bg-black/70">
      <div className="flex items-center justify-between border-b border-orange-700 pb-2">
        <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
          📄 Información del Vehículo
          {!puedeEditar && (
            <span className="text-sm text-orange-400 ml-2">🔒 Solo lectura</span>
          )}
        </h2>

        {puedeEditar && (
          <button
            onClick={guardarCambios}
            disabled={guardando}
            className={`flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg shadow-md transition ${
              guardando ? "opacity-50 cursor-wait" : ""
            }`}
          >
            <FaSave /> {guardando ? "Guardando..." : "Guardar cambios"}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-base">
        {campos.map(([label, valor]) => {
          const lista = opciones[label];
          const editable = editando[label];

          return (
            <p key={label} className="flex items-center gap-2">
              <b className="text-orange-300">{label}:</b>{" "}
              {editable ? (
                lista ? (
                  <select
                    value={valor ?? ""}
                    onChange={(e) => handleChange(label, e.target.value)}
                    className="bg-black border border-orange-600 rounded-md px-2 py-1 text-white w-40"
                  >
                    <option value="">Seleccionar...</option>
                    {lista.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={valor ?? ""}
                    onChange={(e) => handleChange(label, e.target.value)}
                    className="bg-black border border-orange-600 rounded-md px-2 py-1 text-white w-40"
                  />
                )
              ) : (
                <span className="text-white">{valor || "—"}</span>
              )}

              {puedeEditar && (
                <button
                  onClick={() => toggleEditar(label)}
                  disabled={guardando}
                  className={`text-orange-400 hover:text-orange-300 opacity-70 hover:opacity-100 transition ${
                    editable ? "animate-pulse text-orange-500" : ""
                  }`}
                  title={`Editar ${label}`}
                >
                  <FaPen size={12} />
                </button>
              )}
              {!camposPermitidos.includes(label) && (
                <span className="text-xs text-neutral-500">🔒</span>
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
}
