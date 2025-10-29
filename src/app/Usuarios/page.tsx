"use client";

import { useEffect, useState } from "react";
import HeaderUsuarios from "@/components/HeaderUsuarios";
import VehicleCard from "@/components/VehicleCard";
import { Vehicle } from "@/types/vehicle";
import Paginacion from "@/components/Paginacion";

export default function UsuariosPage() {
  const [vehiculos, setVehiculos] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [q, setQ] = useState("");
  const [anioMin, setAnioMin] = useState(1990);
  const [anioMax, setAnioMax] = useState(new Date().getFullYear());
  const [precioMin, setPrecioMin] = useState<number | "">("");
  const [precioMax, setPrecioMax] = useState<number | "">("");
  const [carroseria, setCarroseria] = useState("");
  const [transmision, setTransmision] = useState("");
  const [traccion, setTraccion] = useState("");
  const [tapiceria, setTapiceria] = useState("");


  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const res = await fetch("/api/vehiculos");
        const data: Vehicle[] = await res.json();

        // 🔹 Mostrar SOLO los "DISPONIBLE"
        const disponibles = data.filter(
          (v) => v.estado?.toString().toLowerCase() === "disponible"
        );

        // 🔹 Forzar visibilidad total
        const visibles = disponibles.map((v) => ({
          ...v,
          vis_precio: true,
          vis_duenos: true,
        }));

        setVehiculos(visibles);
      } catch (err) {
        console.error("Error al obtener los vehículos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehiculos();
  }, []);

  // 🔸 Generar listas únicas
  const marcas = Array.from(new Set(vehiculos.map((v) => v.marca).filter(Boolean))).sort();
  const modelos = marca
    ? Array.from(new Set(vehiculos.filter((v) => v.marca === marca).map((v) => v.modelo).filter(Boolean))).sort()
    : Array.from(new Set(vehiculos.map((v) => v.modelo).filter(Boolean))).sort();
  const carrocerias = Array.from(new Set(vehiculos.map(v => v.carroseria).filter(Boolean))).sort();
  const transmisiones = Array.from(new Set(vehiculos.map(v => v.transmision).filter(Boolean))).sort();
  const tracciones = Array.from(new Set(vehiculos.map(v => v.traccion).filter(Boolean))).sort();
  const tapicerias = Array.from(new Set(vehiculos.map(v => v.tapiceria).filter(Boolean))).sort();
  const anios = vehiculos.map((v) => v.anio).filter(Boolean);
  const minAnio = anios.length ? Math.min(...anios) : 1990;
  const maxAnio = anios.length ? Math.max(...anios) : new Date().getFullYear();

  // 🔸 Aplicar filtros activos
  const filtrados = vehiculos.filter((v) => {
    if (q && !(v.marca + " " + v.modelo).toLowerCase().includes(q.toLowerCase())) return false;
    if (marca && v.marca !== marca) return false;
    if (modelo && v.modelo !== modelo) return false;
    if (v.anio < anioMin || v.anio > anioMax) return false;
    if (precioMin !== "" && (v.precio_num ?? Infinity) < Number(precioMin)) return false;
    if (precioMax !== "" && (v.precio_num ?? 0) > Number(precioMax)) return false;
    if (carroseria && v.carroseria !== carroseria) return false;
    if (transmision && v.transmision !== transmision) return false;
    if (traccion && v.traccion !== traccion) return false;
    if (tapiceria && v.tapiceria !== tapiceria) return false;
    return true;
  });
  // ============================
  // 🔸 PAGINACIÓN
  // ============================
  const VEHICULOS_POR_PAGINA = 30;
  const [paginaActual, setPaginaActual] = useState(1);
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / VEHICULOS_POR_PAGINA));

  useEffect(() => {
    setPaginaActual(1); // Reinicia cuando cambian los filtros
  }, [filtrados.length]);

  const indiceInicio = (paginaActual - 1) * VEHICULOS_POR_PAGINA;
  const filtradosPaginados = filtrados.slice(
    indiceInicio,
    indiceInicio + VEHICULOS_POR_PAGINA
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [paginaActual]);


  const inputCls =
    "w-full border border-neutral-800 bg-neutral-900 text-neutral-100 placeholder-neutral-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500";

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black">
      <HeaderUsuarios />

      <section className="max-w-7xl mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-extrabold text-orange-400 mb-8 text-center">
          Panel de Vehículos — Empleados
        </h1>
        <div className="col-span-4">
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            cambiarPagina={setPaginaActual}
          />
        </div>
        {loading ? (
          <p className="text-center text-orange-200">Cargando vehículos...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Sidebar de filtros */}
            <aside className="md:col-span-1 space-y-3">
              {/* 🔍 Buscador */}
              <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                <label className="block text-xs text-neutral-400 mb-1">Buscar</label>
                <input
                  placeholder="Marca o modelo..."
                  className={inputCls}
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
              </div>

              {/* Marca */}
              <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                <label className="block text-xs text-neutral-400 mb-1">Marca</label>
                <select
                  className={inputCls}
                  value={marca}
                  onChange={(e) => {
                    setMarca(e.target.value);
                    setModelo("");
                  }}
                >
                  <option value="">Todas</option>
                  {marcas.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Modelo */}
              <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                <label className="block text-xs text-neutral-400 mb-1">Modelo</label>
                <select
                  className={inputCls}
                  value={modelo}
                  onChange={(e) => setModelo(e.target.value)}
                >
                  <option value="">Todos</option>
                  {modelos.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Año */}
              <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                <label className="block text-xs text-neutral-400 mb-1">Año (mín – máx)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className={inputCls}
                    value={anioMin}
                    onChange={(e) => setAnioMin(Number(e.target.value || minAnio))}
                  />
                  <input
                    type="number"
                    className={inputCls}
                    value={anioMax}
                    onChange={(e) => setAnioMax(Number(e.target.value || maxAnio))}
                  />
                </div>
              </div>

              {/* Precio */}
              <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                <label className="block text-xs text-neutral-400 mb-1">Precio (mín – máx)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className={inputCls}
                    placeholder="Mín"
                    value={precioMin}
                    onChange={(e) =>
                      setPrecioMin(e.target.value === "" ? "" : Number(e.target.value))
                    }
                  />
                  <input
                    type="number"
                    className={inputCls}
                    placeholder="Máx"
                    value={precioMax}
                    onChange={(e) =>
                      setPrecioMax(e.target.value === "" ? "" : Number(e.target.value))
                    }
                  />
                </div>
              </div>
              {/* Carrocería */}
              <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                <label className="block text-xs text-neutral-400 mb-1">Carrocería</label>
                <select
                  className={inputCls}
                  value={carroseria}
                  onChange={(e) => setCarroseria(e.target.value)}
                >
                  <option value="">Todas</option>
                  {carrocerias.map((x) => (
                    <option key={x} value={x}>{x}</option>
                  ))}
                </select>
              </div>

              {/* Transmisión */}
              <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                <label className="block text-xs text-neutral-400 mb-1">Transmisión</label>
                <select
                  className={inputCls}
                  value={transmision}
                  onChange={(e) => setTransmision(e.target.value)}
                >
                  <option value="">Todas</option>
                  {transmisiones.map((x) => (
                    <option key={x} value={x}>{x}</option>
                  ))}
                </select>
              </div>

              {/* Tracción */}
              <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                <label className="block text-xs text-neutral-400 mb-1">Tracción</label>
                <select
                  className={inputCls}
                  value={traccion}
                  onChange={(e) => setTraccion(e.target.value)}
                >
                  <option value="">Todas</option>
                  {tracciones.map((x) => (
                    <option key={x} value={x}>{x}</option>
                  ))}
                </select>
              </div>

              {/* Tapicería */}
              <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                <label className="block text-xs text-neutral-400 mb-1">Tapicería</label>
                <select
                  className={inputCls}
                  value={tapiceria}
                  onChange={(e) => setTapiceria(e.target.value)}
                >
                  <option value="">Todas</option>
                  {tapicerias.map((x) => (
                    <option key={x} value={x}>{x}</option>
                  ))}
                </select>
              </div>

              {/* Botón limpiar */}
              <button
                onClick={() => {
                  setQ("");
                  setMarca("");
                  setModelo("");
                  setAnioMin(minAnio);
                  setAnioMax(maxAnio);
                  setPrecioMin("");
                  setPrecioMax("");
                  setCarroseria("");
                  setTransmision("");
                  setTraccion("");
                  setTapiceria("");
                }}
                className="w-full border border-neutral-800 rounded-md px-3 py-2 bg-neutral-900 text-neutral-100 hover:bg-neutral-800"
              >
                Limpiar filtros
              </button>
            </aside>

            {/* Grid de vehículos */}
            <section className="md:col-span-3">
              {filtrados.length === 0 ? (
                <p className="text-center text-orange-200">
                  No se encontraron vehículos disponibles.
                </p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtradosPaginados.map((v) => (
                    <VehicleCard key={v.vehiculo_id} v={v} />
                  ))}
                </div>
              )}
              {/* 🔸 Contador de resultados */}
              <div className="text-center text-sm text-neutral-400 mt-6">
                {filtrados.length > 0 ? (
                  <>
                    Mostrando{" "}
                    <span className="text-orange-500 font-semibold">
                      {indiceInicio + 1}–{Math.min(indiceInicio + VEHICULOS_POR_PAGINA, filtrados.length)}
                    </span>{" "}
                    de{" "}
                    <span className="text-orange-500 font-semibold">{filtrados.length}</span>{" "}
                    vehículos
                  </>
                ) : (
                  "No hay vehículos para mostrar."
                )}
              </div>

              {/* 🔸 Paginación */}
              <div className="flex justify-center mt-4">
                <Paginacion
                  paginaActual={paginaActual}
                  totalPaginas={totalPaginas}
                  cambiarPagina={setPaginaActual}
                />
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
