"use client";
import { useMemo, useState, useEffect } from "react";
import { Filter } from "lucide-react";
import VehicleCard from "@/components/VehicleCard";
import Paginacion from "@/components/Paginacion";
import { Vehicle } from "@/types/vehicle";

type Props = { data: Vehicle[]; estado: "PREVIA_CITA" | "DISPONIBLE" };

export default function CatalogUsuariosPrevia({ data, estado }: Props) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // =========================
  // 🔹 Filtrar por estado
  // =========================
  const base = useMemo(() => {
    return data.filter(
      (v) => (v.estado ?? "").trim().toUpperCase() === estado
    );
  }, [data, estado]);

  // =========================
  // 🔹 Listas únicas
  // =========================
  const marcas = useMemo(
    () => Array.from(new Set(base.map((v) => v.marca).filter(Boolean))).sort(),
    [base]
  );
  const modelosByMarca = useMemo(() => {
    const map = new Map<string, Set<string>>();
    base.forEach((v) => {
      if (!map.has(v.marca)) map.set(v.marca, new Set());
      if (v.modelo) map.get(v.marca)!.add(v.modelo);
    });
    return map;
  }, [base]);

  const transmisiones = useMemo(
    () => Array.from(new Set(base.map((v) => v.transmision).filter(Boolean))).sort(),
    [base]
  );
  const tracciones = useMemo(
    () => Array.from(new Set(base.map((v) => v.traccion).filter(Boolean))).sort(),
    [base]
  );
  const carrocerias = useMemo(
    () => Array.from(new Set(base.map((v) => v.carroseria).filter(Boolean))).sort(),
    [base]
  );
  const tapicerias = useMemo(
    () => Array.from(new Set(base.map((v) => v.tapiceria).filter(Boolean))).sort(),
    [base]
  );

  // 🔸 Años
  const anios = useMemo(() => base.map((v) => v.anio).filter(Boolean), [base]);
  const minAnioBase = anios.length ? Math.min(...anios) : 1990;
  const maxAnioBase = anios.length ? Math.max(...anios) : new Date().getFullYear();

  // =========================
  // 🔹 Estados de filtros
  // =========================
  const [q, setQ] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [anioMin, setAnioMin] = useState(minAnioBase);
  const [anioMax, setAnioMax] = useState(maxAnioBase);
  const [precioMin, setPrecioMin] = useState<number | "">("");
  const [precioMax, setPrecioMax] = useState<number | "">("");
  const [carroseria, setCarroseria] = useState("");
  const [transmision, setTransmision] = useState("");
  const [traccion, setTraccion] = useState("");
  const [tapiceria, setTapiceria] = useState("");

  const modelos = useMemo(() => {
    if (!marca)
      return Array.from(new Set(base.map((v) => v.modelo).filter(Boolean))).sort();
    return Array.from(modelosByMarca.get(marca) ?? []).sort();
  }, [base, marca, modelosByMarca]);

  // =========================
  // 🔹 Filtrado principal
  // =========================
  const items = useMemo(() => {
    return base.filter((v) => {
      if (q && !(v.marca + " " + v.modelo).toLowerCase().includes(q.toLowerCase()))
        return false;
      if (marca && v.marca !== marca) return false;
      if (modelo && v.modelo !== modelo) return false;
      if (v.anio < anioMin || v.anio > anioMax) return false;
      if (precioMin !== "" && (v.precio_num ?? Infinity) < Number(precioMin))
        return false;
      if (precioMax !== "" && (v.precio_num ?? 0) > Number(precioMax))
        return false;
      if (carroseria && v.carroseria !== carroseria) return false;
      if (transmision && v.transmision !== transmision) return false;
      if (traccion && v.traccion !== traccion) return false;
      if (tapiceria && v.tapiceria !== tapiceria) return false;
      return true;
    });
  }, [
    base,
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
  const totalPaginas = Math.max(1, Math.ceil(items.length / VEHICULOS_POR_PAGINA));

  useEffect(() => setPaginaActual(1), [items.length]);
  useEffect(() => window.scrollTo({ top: 0, behavior: "smooth" }), [paginaActual]);

  const indiceInicio = (paginaActual - 1) * VEHICULOS_POR_PAGINA;
  const itemsPaginados = items.slice(
    indiceInicio,
    indiceInicio + VEHICULOS_POR_PAGINA
  );

  const inputCls =
    "w-full border border-neutral-800 bg-neutral-900 text-neutral-100 placeholder-neutral-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500";

  // =========================
  // 🔹 Render principal
  // =========================
  return (
    <section className="text-white">
      <div className="col-span-4">
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          cambiarPagina={setPaginaActual}
        />
      </div>

      {/* 🔍 Búsqueda + botón de filtros */}
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

      {/* 🔹 Contenedor principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Filtros */}
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
                  onChange={(e) => setAnioMin(Number(e.target.value || minAnioBase))}
                />
                <input
                  type="number"
                  className={`${inputCls} w-1/2`}
                  value={anioMax}
                  onChange={(e) => setAnioMax(Number(e.target.value || maxAnioBase))}
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

            {/* Limpiar filtros */}
            <button
              onClick={() => {
                setQ("");
                setMarca("");
                setModelo("");
                setAnioMin(minAnioBase);
                setAnioMax(maxAnioBase);
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

        {/* 🔸 Catálogo */}
        <section className="md:col-span-3">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {itemsPaginados.map((v) => (
              <VehicleCard key={v.vehiculo_id} v={v} />
            ))}
          </div>
          {items.length === 0 && (
            <p className="text-sm text-neutral-400 mt-4 text-center">
              No se encontraron vehículos en Previa Cita.
            </p>
          )}
        </section>
      </div>

      {/* 🔻 Paginación inferior */}
      <div className="flex justify-center mt-6 col-span-4">
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          cambiarPagina={setPaginaActual}
        />
      </div>

      <p className="text-center text-sm text-neutral-400 mt-2">
        Mostrando{" "}
        <span className="text-orange-500">
          {items.length ? indiceInicio + 1 : 0}
        </span>
        –<span className="text-orange-500">
          {Math.min(indiceInicio + itemsPaginados.length, items.length)}
        </span>{" "}
        de <span className="text-orange-500">{items.length}</span> vehículos
      </p>
    </section>
  );
}
