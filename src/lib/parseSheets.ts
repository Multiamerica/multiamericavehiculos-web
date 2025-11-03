import { num, str, toBool, splitMultilineLinks } from "./normalize";

export type VehiclePayload = {
  id: string;                      // id único del vehículo (de Sheets)
  etiqueta?: string;
  publicar?: boolean;
  fecha_publicado?: string;
  precio?: number;
  vis_precio?: boolean;
  carroceria?: string;
  marca?: string;
  modelo?: string;
  version?: string;
  anio?: number;
  kilometraje?: number;
  transmision?: string;
  traccion?: string;
  color?: string;
  motor?: string;
  duenos?: number;
  vis_duenos?: boolean;
  aa?: boolean;
  tapiceria?: string;
  llaves?: string;
  puertas?: number;
  descripcion?: string;
  gerente?: string;
  asesor?: string;
  estado?: string;
  fotos: string[];                 // <- array con TODOS los links
};

export function parseRow(r: Record<string, unknown>): VehiclePayload {
  const id = String(r.id ?? r.ID ?? r.Id ?? "").trim();
  if (!id) throw new Error("Fila sin 'id'");

  return {
    id,
    etiqueta: str(r["Etiqueta"]),
    publicar: toBool(r["Publicar"]),
    fecha_publicado: str(r["Fecha Publicado"]),
    precio: num(r["Precio"]),
    vis_precio: toBool(r["Vis. Precio"]),
    carroceria: str(r["Carrocería"]),
    marca: str(r["Marca"]),
    modelo: str(r["Modelo"]),
    version: str(r["Versión"]),
    anio: num(r["Año"]),
    kilometraje: num(r["Kilometraje"]),
    transmision: str(r["Transmisión"]),
    traccion: str(r["Tracción"]),
    color: str(r["Color"]),
    motor: str(r["Motor"]),
    duenos: num(r["Dueños"]),
    vis_duenos: toBool(r["Vis. Dueños"]),
    aa: toBool(r["A/A"]),
    tapiceria: str(r["Tapicería"]),
    llaves: str(r["Llaves"]),
    puertas: num(r["#Puertas"]),
    descripcion: str(r["Descripción"]),
    gerente: str(r["Gerente"]),
    asesor: str(r["Asesor"]),
    estado: str(r["Estado"]),
    fotos: splitMultilineLinks(r["Fotos"]), // 👈 clave: varios links por saltos
  };
}
