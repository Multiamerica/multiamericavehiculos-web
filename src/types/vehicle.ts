export type Vehicle = {
  /** Identificador único del vehículo */
  vehiculo_id: string;

  /** Estado actual del vehículo */
  estado: "DISPONIBLE" | "PREVIA_CITA" | "NO_DISPONIBLE";

  // ===========================
  // 📌 Datos básicos
  // ===========================
  marca: string;
  modelo: string;
  version?: string;
  anio: number;

  // ===========================
  // 👁️ Control de visibilidad
  // ===========================
  /** Mostrar o no el precio públicamente */
  vis_precio?: boolean;

  /** Mostrar o no cantidad de dueños públicamente */
  vis_duenos?: boolean;

  // ===========================
  // ⚙️ Detalles opcionales
  // ===========================
  precio_num?: number;
  moneda?: string;
  km_num?: number;
  color?: string;
  transmision?: string;
  traccion?: string;
  carroseria?: string;
  tapiceria?: string;
  motor?: string;
  aa?: boolean;
  llaves?: string;
  duenos?: string | number;
  puertas?: string;
  ubicacion?: string;
  gerente?: string;
  asesor?: string;
  descripcion?: string;

  // ===========================
  // 🖼️ Imágenes
  // ===========================
  /** URLs de las imágenes asociadas */
  imagenes: string[];

  // ===========================
  // 🧩 Campos adicionales
  // ===========================
  [key: string]: any;
};
