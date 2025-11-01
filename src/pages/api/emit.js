export default function handler(req, res) {
  if (!res.socket?.server?.io) {
    return res.status(500).json({ error: "Socket.IO no está inicializado" });
  }

  const { event, data } = req.body || {};

  if (!event) {
    return res.status(400).json({ error: "Falta el nombre del evento" });
  }

  // 🔊 Emitir evento a todos los clientes conectados
  res.socket.server.io.emit(event, data || {});
  console.log("📢 Emitido evento:", event);

  res.status(200).json({ ok: true, event });
}
