import { Server } from "socket.io";

export const config = {
  api: { bodyParser: false },
};

export default function SocketHandler(req, res) {
  if (!res.socket.server.io) {
    console.log("🟢 Iniciando servidor Socket.IO...");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
  } else {
    console.log("⚙️ Socket.IO ya iniciado");
  }

  res.end();
}
