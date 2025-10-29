"use client";
import { useEffect, useState } from "react";
import ContactarBoton from "@/components/ContactarBoton";
import BotonCompartir from "@/components/BotonCompartir"; // usa el nuevo nombre
import { getVendedores } from "@/lib/sheets";

const STORAGE_KEY = "vendedorGlobalFijo";

export default function BotonesVehiculo({ v }: { v: any }) {
  const [vendedor, setVendedor] = useState<any>(null);

  useEffect(() => {
    async function cargarVendedor() {
      try {
        const params = new URLSearchParams(window.location.search);
        const asesorURL = params.get("asesor");

        // 🧠 1️⃣ Si la URL trae un asesor → lo priorizamos
        if (asesorURL) {
          const lista = await getVendedores();
          const match = lista.find(
            (ven) =>
              ven.ejecutivo.trim().toLowerCase() ===
              asesorURL.trim().toLowerCase()
          );

          if (match) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
            setVendedor(match);
            return;
          }
        }

        // 🧠 2️⃣ Si hay un vendedor guardado en localStorage → usarlo
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && saved !== "null") {
          const parsed = JSON.parse(saved);
          if (parsed?.telefono && parsed?.ejecutivo) {
            setVendedor(parsed);
            return;
          }
        }

        // 🧠 3️⃣ Si no hay ninguno → elegir uno aleatorio desde Sheets
        const lista = await getVendedores();
        if (!lista || lista.length === 0) {
          console.warn("⚠️ No hay vendedores disponibles");
          return;
        }

        const elegido = lista[Math.floor(Math.random() * lista.length)];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(elegido));
        setVendedor(elegido);
      } catch (err) {
        console.error("❌ Error cargando vendedor:", err);
      }
    }

    if (typeof window !== "undefined") cargarVendedor();
  }, []);

  // 🔓 Botón para desvincular y reiniciar
  const handleDesvincular = () => {
    if (!vendedor) return;
    localStorage.removeItem(STORAGE_KEY);
    alert(`🔓 Te has desvinculado del vendedor ${vendedor.ejecutivo}.`);
    setTimeout(() => window.location.reload(), 400);
  };

  if (!vendedor) return null;

  return (
    <div className="p-6 mt-2 bg-black/70 border border-orange-700 rounded-lg flex flex-wrap gap-3 justify-center">
      <ContactarBoton
        telefono={vendedor.telefono}
        ejecutivo={vendedor.ejecutivo}
        vehiculo={v}
      />
      <BotonCompartir
        titulo={`${v.marca} ${v.modelo} ${v.anio}`}
        id={String(v.vehiculo_id)}
        vendedor={vendedor.ejecutivo}
      />
      <button
        onClick={handleDesvincular}
        className="px-4 py-2 text-sm font-bold text-orange-400 border border-orange-600 rounded-lg hover:bg-orange-700/20 transition"
      >
        🔓 Desvincular
      </button>
    </div>
  );
}
