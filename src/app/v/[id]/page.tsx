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

  if (!v) {
    return <div className="text-white">Vehículo no encontrado.</div>;
  }

  const showPrecio = Boolean(v.vis_precio && v.precio_num != null);
  const showDuenos = Boolean(v.vis_duenos && (v.duenos ?? "") !== "");

  // Estado / Disponibilidad
  const estado = (v.estado ?? "").toLowerCase();
  const disponible = estado === "disponible";
  const estadoTexto = disponible ? "Disponible" : "Previa Cita";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-900 to-black py-8">
      <div className="grid gap-8 lg:grid-cols-2 items-start max-w-7xl mx-auto px-4">
        {/* Columna Izquierda: Galería */}
        <section className="relative">
          <div
            className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-lg border text-white font-semibold shadow-lg ${
              disponible
                ? "bg-orange-600 border-orange-400"
                : "bg-neutral-700 border-neutral-500"
            }`}
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
                {`${v.moneda ?? ""} ${fmtNum(v.precio_num!, "")}`.trim()}
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
              {v.traccion?.toLowerCase() === "4x4" && (
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
