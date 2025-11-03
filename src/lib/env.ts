/**
 * 🌍 Configuración de variables de entorno
 * Centraliza las URLs del backend (Apps Script / Firebase)
 */

export const ENV = {
  /** API principal (Apps Script desplegado con doGet) */
  API_URL: process.env.NEXT_PUBLIC_API_URL || "",

  /** Firebase Realtime Database (ruta base) */
  FIREBASE_URL: process.env.NEXT_PUBLIC_FIREBASE_URL || "",

  /** Tamaño de caché local (en segundos, opcional) */
  CACHE_SEC: Number(process.env.NEXT_PUBLIC_CACHE_SEC || 300),
};
