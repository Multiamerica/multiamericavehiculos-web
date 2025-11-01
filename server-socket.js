import { Server } from "socket.io";

const io = new Server(4001, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://multiamericavehiculos.com",
      "https://multiamerica.vercel.app",
      "http://192.168.1.4:3000",
    ],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Cliente conectado:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Cliente desconectado:", socket.id);
  });
});

console.log("✅ Servidor Socket.IO corriendo en puerto 4001");
