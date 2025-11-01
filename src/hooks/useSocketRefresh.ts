"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";

export function useSocketRefresh() {
  useEffect(() => {
    // 👇 Conectar al servidor Socket.IO
    const socket = io({
      path: "/api/socket_io",
    });

    socket.on("connect", () => {
      console.log("📡 Conectado al servidor Socket.IO");
    });

    // 🟠 Escuchar evento global de actualización
    socket.on("actualizarPagina", () => {
      console.log("🔁 Cambio detectado, recargando página...");
      window.location.reload();
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}
