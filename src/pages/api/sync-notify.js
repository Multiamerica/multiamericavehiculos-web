import { Server } from "socket.io";

let io;

export const config = {
  api: { bodyParser: true },
};

export default function handler(req, res) {
  if (req.method === "POST") {
    console.log("📢 Catálogo actualizado (notificación Apps Script):", req.body);

    // Emite a los clientes conectados (si Socket.IO está activo)
    if (io) io.emit("actualizarPagina");

    return res.status(200).json({ ok: true });
  }

  if (!io && res.socket?.server) {
    io = new Server(res.socket.server, {
      path: "/api/socket",
      cors: {
        origin: [
          "http://localhost:3000",
          "https://multiamericavehiculos.com",
          "https://multiamerica.vercel.app",
        ],
        methods: ["GET", "POST"],
      },
    });

    io.on("connection", (socket) => {
      console.log("🟢 Cliente conectado (Next API):", socket.id);
    });

    console.log("✅ Socket.IO inicializado dentro de Next.js");
  }

  res.end();
}
