"use client";
import { useMemo, useState, useEffect } from "react";
import VehicleCard from "@/components/VehicleCard";
import { Vehicle } from "@/types/vehicle";
import Paginacion from "@/components/Paginacion";

type Props = { data: Vehicle[]; estado: "DISPONIBLE" | "PREVIA_CITA" };

export default function CatalogUsuarios({ data, estado }: Props) {
  // ============================
  // 🔸 FILTRAR POR ESTADO
  // ============================
  const base = useMemo(() => {
    return data.filter(
      (v) => (v.estado ?? "").trim().toUpperCase() === "DISPONIBLE"
    );
  }, [data]);

  // ============================
  // 🔸 LISTAS ÚNICAS
  // ============================
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
    () =>
      Array.from(new Set(base.map((v) => v.transmision).filter(Boolean))).sort(),
    [base]
  );
  const tracciones = useMemo(
    () =>
      Array.from(new Set(base.map((v) => v.traccion).filter(Boolean))).sort(),
    [base]
  );
  const carrocerias = useMemo(
    () =>
      Array.from(new Set(base.map((v) => v.carroseria).filter(Boolean))).sort(),
    [base]
  );
  const tapicerias = useMemo(
    () =>
      Array.from(new Set(base.map((v) => v.tapiceria).filter(Boolean))).sort(),
    [base]
  );

  const anios = useMemo(() => base.map((v) => v.anio).filter(Boolean), [base]);
  const minAnioBase = anios.length ? Math.min(...anios) : 1990;
  const maxAnioBase = anios.length
    ? Math.max(...anios)
    : new Date().getFullYear();

  // ============================
  // 🔸 ESTADOS DE FILTRO
  // ============================
  const [q, setQ] = useState("");
  const [marca, setMarca] = useState<string>("");
  const [modelo, setModelo] = useState<string>("");
  const [anioMin, setAnioMin] = useState<number>(minAnioBase);
  const [anioMax, setAnioMax] = useState<number>(maxAnioBase);
  const [precioMin, setPrecioMin] = useState<number | "">("");
  const [precioMax, setPrecioMax] = useState<number | "">("");
  const [carroseria, setCarroseria] = useState<string>("");
  const [transmision, setTransmision] = useState<string>("");
  const [traccion, setTraccion] = useState<string>("");
  const [tapiceria, setTapiceria] = useState<string>("");

  const modelos = useMemo(() => {
    if (!marca)
      return Array.from(new Set(base.map((v) => v.modelo).filter(Boolean))).sort();
    return Array.from(modelosByMarca.get(marca) ?? []).sort();
  }, [base, marca, modelosByMarca]);

  // ============================
  // 🔸 FILTRO PRINCIPAL
  // ============================
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

  // ============================
  // 🔸 PAGINACIÓN
  // ============================
  const VEHICULOS_POR_PAGINA = 30;
  const [paginaActual, setPaginaActual] = useState(1);
  const totalPaginas = Math.max(1, Math.ceil(items.length / VEHICULOS_POR_PAGINA));

  useEffect(() => {
    setPaginaActual(1);
  }, [items.length]);

  const indiceInicio = (paginaActual - 1) * VEHICULOS_POR_PAGINA;
  const itemsPaginados = items.slice(
    indiceInicio,
    indiceInicio + VEHICULOS_POR_PAGINA
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [paginaActual]);

  // ============================
  // 🔸 ESTILO INPUT
  // ============================
  const inputCls =
    "w-full border border-neutral-800 bg-neutral-900 text-neutral-100 placeholder-neutral-500 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500";

  // ============================
  // 🔸 RENDER
  // ============================
  return (
    <>
      <div className="col-span-4">
        <Paginacion
          paginaActual={paginaActual}
          totalPaginas={totalPaginas}
          cambiarPagina={setPaginaActual}
        />
      </div>
      {/* Buscador */}
      <div className="mb-4">
        <input
          placeholder="Buscar marca o modelo"
          className={`${inputCls} md:w-1/4`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* Filtros + Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <aside className="md:col-span-1 space-y-3">
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
                onChange={(e) =>
                  setAnioMin(Number(e.target.value || minAnioBase))
                }
              />
              <input
                type="number"
                className={inputCls}
                value={anioMax}
                onChange={(e) =>
                  setAnioMax(Number(e.target.value || maxAnioBase))
                }
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
                  setPrecioMin(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
              <input
                type="number"
                className={inputCls}
                placeholder="Máx"
                value={precioMax}
                onChange={(e) =>
                  setPrecioMax(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
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
                <option key={x} value={x}>
                  {x}
                </option>
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
                <option key={x} value={x}>
                  {x}
                </option>
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
                <option key={x} value={x}>
                  {x}
                </option>
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
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          {/* Limpiar */}
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
            className="w-full border border-neutral-800 rounded-md px-3 py-2 bg-neutral-900 text-neutral-100 hover:bg-neutral-800"
          >
            Limpiar filtros
          </button>
        </aside>

        {/* Grid de Vehículos */}
        <section className="md:col-span-3">
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {itemsPaginados.map((v) => (
              <VehicleCard key={v.vehiculo_id} v={v} />
            ))}
          </div>

          {items.length === 0 && (
            <p className="text-sm text-neutral-400 mt-4">
              No se encontraron vehículos.
            </p>
          )}
        </section>
        {/* 🔸 Contador de resultados */}
        <div className="text-center text-sm text-neutral-400 mb-2">
          {items.length > 0 ? (
            <>
              Mostrando{" "}
              <span className="text-orange-500 font-semibold">
                {indiceInicio + 1}–{Math.min(indiceInicio + VEHICULOS_POR_PAGINA, items.length)}
              </span>{" "}
              de{" "}
              <span className="text-orange-500 font-semibold">{items.length}</span>{" "}
              vehículos
            </>
          ) : (
            "No hay vehículos para mostrar."
          )}
        </div>
        {/* Controles de Paginación */}
        <div className="flex justify-center mt-6 col-span-4">
          <Paginacion
            paginaActual={paginaActual}
            totalPaginas={totalPaginas}
            cambiarPagina={setPaginaActual}
          />
        </div>
      </div>
    </>
  );
}
