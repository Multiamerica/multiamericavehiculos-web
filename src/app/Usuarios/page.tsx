"use client";

import { useEffect, useState, useMemo } from "react";
import { Filter } from "lucide-react";
import HeaderUsuarios from "@/components/HeaderUsuarios";
import VehicleCard from "@/components/VehicleCard";
import { Vehicle } from "@/types/vehicle";
import Paginacion from "@/components/Paginacion";

export default function UsuariosPage() {
  const [vehiculos, setVehiculos] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // =========================
  // 🔹 Cargar vehículos
  // =========================
  useEffect(() => {
    const fetchVehiculos = async () => {
      try {
        const res = await fetch("/api/vehiculos");
        const data: Vehicle[] = await res.json();

        if (!Array.isArray(data)) {
          console.error("⚠️ La respuesta del API no es un array:", data);
          setVehiculos([]);
          setLoading(false);
          return;
        }

        const disponibles = data.filter(
          (v) => v.estado?.toString().toLowerCase() === "disponible"
        );

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

  // =========================
  // 🔹 Filtros
  // =========================
  const [q, setQ] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anioMin, setAnioMin] = useState(1990);
  const [anioMax, setAnioMax] = useState(new Date().getFullYear());
  const [precioMin, setPrecioMin] = useState<number | "">("");
  const [precioMax, setPrecioMax] = useState<number | "">("");
  const [carroseria, setCarroseria] = useState("");
  const [transmision, setTransmision] = useState("");
  const [traccion, setTraccion] = useState("");
  const [tapiceria, setTapiceria] = useState("");

  // 🔹 Listas únicas
  const marcas = useMemo(
    () => Array.from(new Set(vehiculos.map((v) => v.marca).filter(Boolean))).sort(),
    [vehiculos]
  );
  const modelos = useMemo(() => {
    if (!marca)
      return Array.from(new Set(vehiculos.map((v) => v.modelo).filter(Boolean))).sort();
    return Array.from(
      new Set(vehiculos.filter((v) => v.marca === marca).map((v) => v.modelo).filter(Boolean))
    ).sort();
  }, [vehiculos, marca]);
  const carrocerias = Array.from(new Set(vehiculos.map((v) => v.carroseria).filter(Boolean))).sort();
  const transmisiones = Array.from(new Set(vehiculos.map((v) => v.transmision).filter(Boolean))).sort();
  const tracciones = Array.from(new Set(vehiculos.map((v) => v.traccion).filter(Boolean))).sort();
  const tapicerias = Array.from(new Set(vehiculos.map((v) => v.tapiceria).filter(Boolean))).sort();
  const anios = vehiculos.map((v) => v.anio).filter(Boolean);
  const minAnio = anios.length ? Math.min(...anios) : 1990;
  const maxAnio = anios.length ? Math.max(...anios) : new Date().getFullYear();

  // =========================
  // 🔹 Aplicar filtros
  // =========================
  const filtrados = useMemo(() => {
    return vehiculos.filter((v) => {
      if (q && !(v.marca + " " + v.modelo).toLowerCase().includes(q.toLowerCase())) return false;
      if (marca && v.marca !== marca) return false;
      if (modelo && v.modelo !== modelo) return false;
      if (v.anio < anioMin || v.anio > anioMax) return false;
      if (precioMin !== "" && Number(v.precio_num ?? 0) < Number(precioMin)) return false;
      if (precioMax !== "" && Number(v.precio_num ?? 0) > Number(precioMax)) return false;
      if (carroseria && v.carroseria !== carroseria) return false;
      if (transmision && v.transmision !== transmision) return false;
      if (traccion && v.traccion !== traccion) return false;
      if (tapiceria && v.tapiceria !== tapiceria) return false;
      return true;
    });
  }, [
    vehiculos,
    q,
    marca,
    modelo,
    anioMin,
    anioMax,
    precioMin,
    precioMax,
    carroseria,
    transmision,
    traccion,
    tapiceria,
  ]);

  // =========================
  // 🔹 Paginación
  // =========================
  const VEHICULOS_POR_PAGINA = 30;
  const [paginaActual, setPaginaActual] = useState(1);
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / VEHICULOS_POR_PAGINA));

  useEffect(() => setPaginaActual(1), [filtrados.length]);
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [paginaActual]);

  const indiceInicio = (paginaActual - 1) * VEHICULOS_POR_PAGINA;
  const filtradosPaginados = filtrados.slice(
    indiceInicio,
    indiceInicio + VEHICULOS_POR_PAGINA
  );

  // =========================
  // 🔹 Estilos base
  // =========================
  const inputCls =
    "w-full border border-neutral-800 bg-neutral-900 text-neutral-100 placeholder-neutral-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500";

  // =========================
  // 🔹 Render principal
  // =========================
  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-neutral-900 to-black">
      <HeaderUsuarios />

      <section className="max-w-7xl mx-auto px-4 pt-24 pb-12 text-white">
        <h1 className="text-6xl font-stockport text-orange-400 mb-8 text-center">
          Panel Interno — Disponibles
        </h1>

        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          cambiarPagina={setPaginaActual}
        />

        {loading ? (
          <p className="text-center text-orange-200 mt-10">Cargando vehículos...</p>
        ) : (
          <>
            {/* 🔍 Buscador + Botón Mostrar Filtros */}
            <div className="mb-4 flex flex-col gap-3">
              <input
                placeholder="Buscar marca o modelo"
                className={`${inputCls} bg-neutral-900 text-neutral-200`}
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />

              <button
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="flex items-center justify-center gap-2 
                           w-full py-3 rounded-lg 
                           bg-orange-600 hover:bg-orange-700 
                           text-white font-semibold text-base 
                           transition-all duration-200 shadow-md md:hidden"
              >
                <Filter className="w-5 h-5" />
                {mostrarFiltros ? "Ocultar filtros" : "Mostrar filtros"}
              </button>
            </div>

            {/* 🔹 Filtros + Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {(mostrarFiltros || isDesktop) && (
                <aside
                  className={`flex flex-col gap-4 w-full md:col-span-1 bg-neutral-900/90 border border-neutral-800 rounded-lg p-4 transition-all duration-300 ease-in-out ${
                    mostrarFiltros
                      ? "opacity-100 max-h-[1500px]"
                      : "opacity-0 max-h-0 md:opacity-100 md:max-h-none overflow-hidden"
                  }`}
                >
                  {/* Marca */}
                  <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                    <label className="block text-sm text-neutral-400 mb-2">Marca</label>
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
                    <label className="block text-sm text-neutral-400 mb-2">Modelo</label>
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
                    <label className="block text-sm text-neutral-400 mb-2">
                      Año (mín – máx)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        className={`${inputCls} w-1/2`}
                        value={anioMin}
                        onChange={(e) => setAnioMin(Number(e.target.value || minAnio))}
                      />
                      <input
                        type="number"
                        className={`${inputCls} w-1/2`}
                        value={anioMax}
                        onChange={(e) => setAnioMax(Number(e.target.value || maxAnio))}
                      />
                    </div>
                  </div>

                  {/* Precio */}
                  <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                    <label className="block text-sm text-neutral-400 mb-2">
                      Precio (mín – máx)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        className={`${inputCls} w-1/2`}
                        placeholder="Mín"
                        value={precioMin}
                        onChange={(e) =>
                          setPrecioMin(e.target.value === "" ? "" : Number(e.target.value))
                        }
                      />
                      <input
                        type="number"
                        className={`${inputCls} w-1/2`}
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
                    <label className="block text-sm text-neutral-400 mb-2">Carrocería</label>
                    <select
                      className={inputCls}
                      value={carroseria}
                      onChange={(e) => setCarroseria(e.target.value)}
                    >
                      <option value="">Todas</option>
                      {carrocerias.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Transmisión */}
                  <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                    <label className="block text-sm text-neutral-400 mb-2">Transmisión</label>
                    <select
                      className={inputCls}
                      value={transmision}
                      onChange={(e) => setTransmision(e.target.value)}
                    >
                      <option value="">Todas</option>
                      {transmisiones.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tracción */}
                  <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                    <label className="block text-sm text-neutral-400 mb-2">Tracción</label>
                    <select
                      className={inputCls}
                      value={traccion}
                      onChange={(e) => setTraccion(e.target.value)}
                    >
                      <option value="">Todas</option>
                      {tracciones.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Tapicería */}
                  <div className="p-3 border border-neutral-800 rounded-lg bg-neutral-900">
                    <label className="block text-sm text-neutral-400 mb-2">Tapicería</label>
                    <select
                      className={inputCls}
                      value={tapiceria}
                      onChange={(e) => setTapiceria(e.target.value)}
                    >
                      <option value="">Todas</option>
                      {tapicerias.map((x) => (
                        <option key={x} value={x}>
                          {x}
                        </option>
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
                    className="w-full border border-neutral-700 rounded-md px-3 py-2 bg-neutral-800 text-neutral-100 hover:bg-neutral-700 transition"
                  >
                    Limpiar filtros
                  </button>
                </aside>
              )}

              {/* Grid de vehículos */}
              <section className="md:col-span-3">
                {filtrados.length === 0 ? (
                  <p className="text-center text-orange-200 mt-4">
                    No se encontraron vehículos disponibles.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtradosPaginados.map((v) => (
                      <VehicleCard key={v.vehiculo_id} v={v} />
                    ))}
                  </div>
                )}

                {/* Contador de resultados */}
                <div className="text-center text-sm text-neutral-400 mt-6">
                  {filtrados.length > 0 ? (
                    <>
                      Mostrando{" "}
                      <span className="text-orange-500 font-semibold">
                        {indiceInicio + 1}–
                        {Math.min(indiceInicio + VEHICULOS_POR_PAGINA, filtrados.length)}
                      </span>{" "}
                      de{" "}
                      <span className="text-orange-500 font-semibold">{filtrados.length}</span>{" "}
                      vehículos
                    </>
                  ) : (
                    "No hay vehículos para mostrar."
                  )}
                </div>

                {/* Paginación inferior */}
                <div className="flex justify-center mt-4">
                  <Paginacion
                    paginaActual={paginaActual}
                    totalPaginas={totalPaginas}
                    cambiarPagina={setPaginaActual}
                  />
                </div>
              </section>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
