"use client";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function SocketRefresher() {
  useEffect(() => {
    // ✅ Conectarse al servidor socket externo
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4001",
      { transports: ["polling"] }
    );

    // 📡 Escuchar el evento de actualización
    socket.on("actualizarPagina", () => {
      console.log("♻️ Página actualizada automáticamente");
      window.location.reload();
    });

    // 🧹 Cerrar conexión al desmontar
    return () => {
      socket.disconnect();
    };
  }, []);

  return null;
}
