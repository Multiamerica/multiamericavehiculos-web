"use client";

import { useState } from "react";
import { Vehicle } from "@/types/vehicle";
import { FaPen, FaSave } from "react-icons/fa";

type Props = {
  vehiculo: Vehicle;
  rol: string;
};

export default function EditorVehiculo({ vehiculo, rol }: Props) {
  const [editando, setEditando] = useState<Record<string, boolean>>({});
  const [form, setForm] = useState({ ...vehiculo });
  const [guardando, setGuardando] = useState(false);

  const camposMostrados = [
    "Publicar", "Vis. Precio", "Carrocería", "Marca", "Modelo", "Versión", "Año",
    "Kilometraje", "Transmisión", "Tracción", "Color", "Motor", "Dueños", "Vis. Dueños",
    "A/A", "Tapicería", "Llaves", "#Puertas", "Descripción"
  ];

  // 🔽 Listas de valores predefinidos
  const opciones: Record<string, string[]> = {
    "Publicar": ["No disponible", "Disponible", "Previa Cita", "Reservado"],
    "Vis. Precio": ["Sí", "No"],
    "Transmisión": ["Automático", "Sincrónico"],
    "Tracción": ["4x4", "4x2"],
    "Vis. Dueños": ["Sí", "No"],
  };

  const handleChange = (campo: string, valor: string) => {
    setForm((prev) => ({ ...prev, [campo]: valor }));
  };

  const toggleEditar = (campo: string) => {
    setEditando((prev) => ({ ...prev, [campo]: !prev[campo] }));
  };

  const guardarCambios = async () => {
    setGuardando(true);
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
      const nombre = usuario?.nombreEjecutivo || "Desconocido";

      const res = await fetch("/api/vehiculos_editar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accion: "actualizarVehiculo",
          id: vehiculo.ID,
          data: form,
          quien: nombre,
        }),
      });

      const data = await res.json();
      alert(data.msg || "Cambios guardados correctamente");
    } catch (err) {
      console.error("Error guardando:", err);
      alert("Error al guardar los cambios");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="bg-neutral-900/80 border border-orange-700 rounded-2xl p-6">
      <h2 className="text-2xl font-bold text-orange-400 mb-4">
        🧾 Información del Vehículo
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {camposMostrados.map((campo) => {
          const valor = form[campo] ?? "";
          const editable = editando[campo];
          const lista = opciones[campo];

          return (
            <div
              key={campo}
              className="flex flex-col bg-neutral-950/40 border border-neutral-800 rounded-lg p-3 relative group"
            >
              <label className="text-sm text-orange-300 font-semibold mb-1">
                {campo}
              </label>

              {editable ? (
                lista ? (
                  <select
                    value={valor}
                    onChange={(e) => handleChange(campo, e.target.value)}
                    className="bg-black border border-orange-600 rounded-lg px-2 py-1 text-white"
                  >
                    {lista.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={valor}
                    onChange={(e) => handleChange(campo, e.target.value)}
                    className="bg-black border border-orange-600 rounded-lg px-2 py-1 text-white"
                  />
                )
              ) : (
                <span className="text-neutral-100">{String(valor) || "—"}</span>
              )}

              {/* ✏️ Icono de editar */}
              <button
                type="button"
                onClick={() => toggleEditar(campo)}
                className="absolute top-2 right-3 text-orange-400 hover:text-orange-300 transition-opacity opacity-70 group-hover:opacity-100"
              >
                <FaPen size={14} />
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={guardarCambios}
          disabled={guardando}
          className="bg-orange-600 hover:bg-orange-500 text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <FaSave />
          {guardando ? "Guardando..." : "Guardar cambios"}
        </button>
      </div>
    </div>
  );
}
