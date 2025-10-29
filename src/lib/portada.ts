import { Vehicle } from "@/types/vehicle";
import { orderImages, normalizeAll } from "@/lib/images";

const PLACEHOLDER = "/placeholder.png";

/**
 * Selecciona la imagen principal ("portada") del vehículo.
 * - Normaliza URLs (Drive + Imgur)
 * - Ordena priorizando las que empiecen por "principal"
 * - Devuelve un placeholder si no hay imágenes válidas
 */
export function pickPortada(v: Vehicle): string {
  const normalized = normalizeAll(v.imagenes || []);
  const imgs = orderImages(normalized);
  return imgs[0] || PLACEHOLDER;
}
