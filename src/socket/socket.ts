import { io, Socket } from "socket.io-client";

export const socket: Socket & { registered?: boolean } = io(
  "https://clientes.higueraescalante.com",
  {
    autoConnect: true,
    transports: ["websocket"],
  }
);
