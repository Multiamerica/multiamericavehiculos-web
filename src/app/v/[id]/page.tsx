import { redirect } from "next/navigation";
import { fetchInventory } from "@/lib/api";
import TwoPaneGallery from "@/components/TwoPaneGallery";
import BotonesVehiculo from "@/components/BotonesVehiculo";

// Función segura para formatear números (kilometraje, precios, etc.)
function fmtNum(n?: number, suf: string = ""): string {
  if (n == null) return "";
  try {
    return `${new Intl.NumberFormat("es-VE").format(n)}${suf}`;
  } catch {
    return `${n}${suf}`;
  }
}

export default async function VehicleDetail({ params }: any) {
  const { id } = params;
  const data = await fetchInventory();
  const v = data.find((x) => String(x.vehiculo_id) === String(id));

  // 🚫 Si no existe el vehículo, redirigir
  if (!v) {
    redirect("/");
  }

  // 🧩 Normalizar estado / publicar
  const estado = String(v.publicar || v.estado || "")
    .normalize("NFD")
    .replace(/_/g, " ")
    .trim()
    .toLowerCase();

  // 🚫 Bloquear vehículos no disponibles o sin estado
  const bloqueado =
    !estado ||
    estado.includes("no disponible") ||
    estado.includes("nodisponible") ||
    estado.includes("no_disponible") ||
    estado.includes("sin publicar") ||
    estado === "";

  if (bloqueado) {
    redirect("/");
  }

  const showPrecio = Boolean(v.vis_precio && v.precio_num != null);
  const showDuenos = Boolean(v.vis_duenos && (v.duenos ?? "") !== "");

  // Estado visible
  const disponible = estado.includes("disponible");
  const previaCita = estado.includes("previa");
  const reservado = estado.includes("reservado");

  // 🟢 Mostrar "Reservado" como "Disponible" en página pública
  const estadoTexto =
    previaCita
      ? "Previa Cita"
      : (disponible || reservado)
      ? "Disponible"
      : "No Disponible";

  const colorEstado =
    previaCita
      ? "bg-orange-600 border-orange-400"
      : (disponible || reservado)
      ? "bg-green-700 border-green-400"
      : "bg-red-700 border-red-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-900 to-black py-8">
      <div className="grid gap-8 lg:grid-cols-2 items-start max-w-7xl mx-auto px-4">
        {/* Columna Izquierda: Galería */}
        <section className="relative">
          <div
            className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-lg border text-white font-semibold shadow-lg ${colorEstado}`}
          >
            {estadoTexto}
          </div>
          <TwoPaneGallery images={v.imagenes} />
        </section>

        {/* Columna Derecha: Información */}
        <div className="space-y-6">
          {/* Título y Precio */}
          <div>
            <h1 className="text-4xl md:text-3xl font-extrabold text-white leading-tight">
              {v.marca} {v.modelo} {v.version ? `${v.version} ` : ""} {v.anio}
            </h1>
            {showPrecio && (
              <p className="mt-1 text-orange-400 text-2xl font-semibold">
                {`${v.moneda ?? ""} ${fmtNum(Number(v.precio_num ?? v.precio) || 0, "")}`.trim()}
              </p>
            )}
          </div>

          {/* Ficha Técnica */}
          <div className="space-y-3 p-6 rounded-lg border border-orange-700 bg-black/70">
            <h2 className="text-2xl font-semibold text-white pb-2 border-b border-orange-700">
              Especificaciones
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-base">
              <p>
                <b className="text-orange-300">Marca:</b>{" "}
                <span className="text-white">{v.marca}</span>
              </p>
              <p>
                <b className="text-orange-300">Modelo:</b>{" "}
                <span className="text-white">{v.modelo}</span>
              </p>
              {v.version && (
                <p>
                  <b className="text-orange-300">Versión:</b>{" "}
                  <span className="text-white">{v.version}</span>
                </p>
              )}
              <p>
                <b className="text-orange-300">Año:</b>{" "}
                <span className="text-white">{v.anio}</span>
              </p>
              {v.km_num != null && (
                <p>
                  <b className="text-orange-300">Kilometraje:</b>{" "}
                  <span className="text-white">{fmtNum(v.km_num, " km")}</span>
                </p>
              )}
              {v.transmision && (
                <p>
                  <b className="text-orange-300">Transmisión:</b>{" "}
                  <span className="text-white">{v.transmision}</span>
                </p>
              )}
              {v.traccion && (
                <p>
                  <b className="text-orange-300">Tracción:</b>{" "}
                  <span className="text-white">{v.traccion}</span>
                </p>
              )}
              {v.color && (
                <p>
                  <b className="text-orange-300">Color:</b>{" "}
                  <span className="text-white">{v.color}</span>
                </p>
              )}
              {v.motor && (
                <p>
                  <b className="text-orange-300">Motor:</b>{" "}
                  <span className="text-white">{v.motor}</span>
                </p>
              )}
              {v.aa !== undefined && (
                <p>
                  <b className="text-orange-300">A/A:</b>{" "}
                  <span className="text-white">
                    {(typeof v.aa === "boolean"
                      ? v.aa
                      : ["si", "sí", "true", "1"].includes(
                          String(v.aa).toLowerCase()
                        ))
                      ? "Sí"
                      : "No"}
                  </span>
                </p>
              )}
              {v.tapiceria && (
                <p>
                  <b className="text-orange-300">Tapicería:</b>{" "}
                  <span className="text-white">{v.tapiceria}</span>
                </p>
              )}
              {v.llaves && (
                <p>
                  <b className="text-orange-300">Llaves:</b>{" "}
                  <span className="text-white">{v.llaves}</span>
                </p>
              )}
              {showDuenos && (
                <p>
                  <b className="text-orange-300">Dueños:</b>{" "}
                  <span className="text-white">{v.duenos}</span>
                </p>
              )}
              {v.ubicacion && (
                <p>
                  <b className="text-orange-300">Ubicación:</b>{" "}
                  <span className="text-white">{v.ubicacion}</span>
                </p>
              )}
            </div>
          </div>

          {/* Descripción */}
          {v.descripcion && (
            <div className="p-6 rounded-lg border border-orange-700 bg-black/70">
              <h2 className="text-2xl font-semibold text-white mb-2">
                Descripción General
              </h2>
              <p className="text-base leading-7 text-white">{v.descripcion}</p>
            </div>
          )}

          <BotonesVehiculo v={v} />
        </div>
      </div>
    </div>
  );
}
