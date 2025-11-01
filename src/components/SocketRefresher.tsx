"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";

/**
 * 🔁 Escucha el evento "actualizarPagina" y recarga el sitio completo.
 * Esto permite que todos los usuarios vean los cambios en tiempo real.
 */
export default function SocketRefresher() {
  useEffect(() => {
    // Conexión al servidor de Socket.IO
    const socket = io();

    // Escuchar evento enviado desde /api/emit
    socket.on("actualizarPagina", () => {
      console.log("♻️ Recargando página por actualización remota...");
      window.location.reload();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
