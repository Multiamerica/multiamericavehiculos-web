"use client";

import { useState, useEffect } from "react";
import { FaPen, FaSave } from "react-icons/fa";
import { Vehicle } from "@/types/vehicle";

/** 🔹 Formatear números (para precio y km) */
function fmtNum(n?: number): string {
  if (n == null || isNaN(n)) return "";
  try {
    return new Intl.NumberFormat("es-VE").format(n);
  } catch {
    return String(n);
  }
}

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

  /** 🧩 Permisos por rol */
  const permisosPorRol: Record<string, string[]> = {
    ADMIN: [
      "Publicar",
      "Vis. Precio",
      "Precio",
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
      "Gerente",
      "Asesor",
    ],
    "GERENTE DE GUARDIA": [
      "Publicar",
      "Vis. Precio",
      "Motor",
      "Dueños",
      "Vis. Dueños",
      "A/A",
      "Tapicería",
      "Kilometraje",
      "Llaves",
    ],
    GERENTE: [
      "Publicar",
      "Vis. Precio",
      "Vis. Dueños",
      "A/A",
      "Tapicería",
      "Llaves",
    ],
    SUPERVISOR: [
      "Publicar",
      "Vis. Precio",
      "Vis. Dueños",
    ],
    INVITADO: [],
  };

  const rolActual = rolUsuario.toUpperCase();
  const camposPermitidos = permisosPorRol[rolActual] || [];
  const puedeEditar = camposPermitidos.length > 0;

  /** 🔽 Cargar datos iniciales */
  useEffect(() => {
    setForm({
      "Publicar": vehiculo.estado || "",
      "Vis. Precio": vehiculo.vis_precio ? "Si" : "No",
      "Precio": Number(String(vehiculo.precio_num ?? vehiculo.precio ?? "0").replace(/[^\d.-]/g, "")),
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
      "Gerente": vehiculo.gerente ?? "",
      "Asesor": vehiculo.asesor ?? "",
    });
  }, [vehiculo]);

  /** 🔽 Carrocerías */
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
      } catch (err) {
        console.error("⚠️ Error cargando carrocerías:", err);
      }
    }
    cargarCarrocerias();
  }, []);

  /** 🔽 Listas de selección */
  const opciones: Record<string, string[]> = {
    Publicar: ["No Disponible", "Disponible", "Previa Cita", "Reservado"],
    "Vis. Precio": ["Si", "No"],
    Transmisión: ["Automático", "Sincrónico"],
    Tracción: ["4x4", "4x2"],
    "Vis. Dueños": ["Si", "No"],
    Carrocería: carrocerias,
  };

  /** ✏️ Alternar edición */
  const toggleEditar = (campo: string) => {
    if (!camposPermitidos.includes(campo)) {
      alert(`🚫 No puedes editar el campo "${campo}" con tu rol actual (${rolUsuario}).`);
      return;
    }
    setEditando((prev) => ({ ...prev, [campo]: !prev[campo] }));
  };

  /** ✏️ Cambiar valor */
  const handleChange = (campo: string, valor: string) => {
    if (campo === "Precio") {
      const soloNum = valor.replace(/[^\d]/g, ""); // quitar símbolos
      setForm((prev) => ({ ...prev, [campo]: Number(soloNum) || 0 }));
    } else {
      setForm((prev) => ({ ...prev, [campo]: valor }));
    }
  };

  /** 💾 Guardar cambios */
  const guardarCambios = async () => {
    if (!puedeEditar) {
      alert("🚫 No tienes permisos para modificar.");
      return;
    }

    setGuardando(true);

    // 🧠 Detectar cambios comparando con los valores originales del vehículo
    const cambios = Object.fromEntries(
      Object.entries(form).filter(([campo, valor]) => {
        const original = (() => {
          switch (campo) {
            case "Publicar": return vehiculo.estado || "";
            case "Vis. Precio": return vehiculo.vis_precio ? "Si" : "No";
            case "Precio": return Number(String(vehiculo.precio_num ?? vehiculo.precio ?? "0").replace(/[^\d.-]/g, ""));
            case "Carrocería": return vehiculo.carroceria ?? "";
            case "Marca": return vehiculo.marca ?? "";
            case "Modelo": return vehiculo.modelo ?? "";
            case "Versión": return vehiculo.version ?? "";
            case "Año": return vehiculo.anio ?? "";
            case "Kilometraje": return vehiculo.km_num ?? "";
            case "Transmisión": return vehiculo.transmision ?? "";
            case "Tracción": return vehiculo.traccion ?? "";
            case "Color": return vehiculo.color ?? "";
            case "Motor": return vehiculo.motor ?? "";
            case "Dueños": return vehiculo.duenos ?? "";
            case "Vis. Dueños": return vehiculo.vis_duenos ? "Si" : "No";
            case "A/A": return vehiculo.aa ?? "";
            case "Tapicería": return vehiculo.tapiceria ?? "";
            case "Llaves": return vehiculo.llaves ?? "";
            case "#Puertas": return vehiculo.puertas ?? "";
            case "Gerente": return vehiculo.gerente ?? "";
            case "Asesor": return vehiculo.asesor ?? "";
            default: return "";
          }
        })();

        return String(valor).trim() !== String(original).trim();
      })
    );


    // Si no hay cambios, salimos temprano
    if (Object.keys(cambios).length === 0) {
      setGuardando(false);
      return alert("No hay cambios por guardar.");
    }

    try {
      const idVehiculo =
        vehiculo.vehiculo_id || vehiculo.id || vehiculo.ID || vehiculo.Id || vehiculo["ID"];

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
          data: cambios,
          quien: nombreUsuario,
          rango: rolUsuario,
        }),
      });

      // Manejo robusto de respuesta
      let payload: any = null;
      try {
        payload = await res.json(); // puede fallar si el backend no devuelve JSON
      } catch {
        const txt = await res.text();
        throw new Error(`Respuesta no-JSON (${res.status}): ${txt}`);
      }

      if (!res.ok || !payload?.ok) {
        const msg = payload?.msg || `HTTP ${res.status}`;
        alert(`⚠️ No se pudieron guardar los cambios: ${msg}`);
        return;
      }

      // ✅ Éxito
      alert("✅ Cambios guardados correctamente.");
      setEditando({}); // salir de modo edición en todos los campos
    } catch (err) {
      console.error("⚠️ Error guardando vehículo:", err);
      alert("❌ Error al guardar cambios.");
    } finally {
      setGuardando(false);
    }
  };


  /** 📋 Campos (sin descripción) */
  const campos = Object.entries(form).filter(([label]) => label !== "Descripción");

  return (
    <div className="space-y-4 p-5 sm:p-6 rounded-lg border border-orange-700 bg-black/70">
      {/* 🧾 Encabezado */}
      <div className="flex items-center justify-between border-b border-orange-700 pb-2">
        <h2 className="text-xl sm:text-2xl font-semibold text-white">
          📄 Información del Vehículo
        </h2>
        {puedeEditar && (
          <button
            onClick={guardarCambios}
            disabled={guardando}
            className={`flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg shadow-md transition ${
              guardando ? "opacity-50 cursor-wait" : ""
            }`}
          >
            <FaSave size={14} /> {guardando ? "Guardando..." : "Guardar"}
          </button>
        )}
      </div>

      {/* 🧩 Campos en 2 columnas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm sm:text-base">
        {campos.map(([label, valor]) => {
          const lista = opciones[label];
          const editable = editando[label];
          const isPrecio = label === "Precio";

          return (
            <div
              key={label}
              className="flex items-start sm:items-center justify-between sm:justify-start gap-2"
            >
              {/* Etiqueta */}
              <b className="text-orange-300 whitespace-nowrap">{label}:</b>

              {/* Valor o campo editable */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {editable ? (
                  lista ? (
                    <select
                      value={valor ?? ""}
                      onChange={(e) => handleChange(label, e.target.value)}
                      className="bg-black border border-orange-600 rounded-md px-2 py-1 text-white w-full sm:w-40"
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
                      type={isPrecio ? "number" : "text"}
                      value={isPrecio ? String(valor) : valor ?? ""}
                      onChange={(e) => handleChange(label, e.target.value)}
                      className="bg-black border border-orange-600 rounded-md px-2 py-1 text-white w-full sm:w-44"
                    />
                  )
                ) : (
                  <span className="text-white truncate">
                    {isPrecio && valor
                      ? `${fmtNum(Number(valor))} $`
                      : valor || "—"}
                  </span>
                )}

                {puedeEditar && (
                  <button
                    onClick={() => toggleEditar(label)}
                    disabled={guardando}
                    className={`text-orange-400 hover:text-orange-300 transition ${
                      editable ? "animate-pulse text-orange-500" : ""
                    }`}
                    title={`Editar ${label}`}
                  >
                    <FaPen size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
