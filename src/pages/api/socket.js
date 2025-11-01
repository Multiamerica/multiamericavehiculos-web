import { Server } from "socket.io";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("🟢 Iniciando servidor Socket.IO...");

    const io = new Server(res.socket.server, {
      path: "/socket.io",
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
      console.log("🔗 Cliente conectado:", socket.id);

      socket.on("disconnect", () => {
        console.log("❌ Cliente desconectado:", socket.id);
      });
    });

    res.socket.server.io = io;
  } else {
    console.log("⚪ Servidor Socket.IO ya estaba activo.");
  }

  res.end();
}
