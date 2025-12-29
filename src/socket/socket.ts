import { io, Socket } from "socket.io-client";

export const socket: Socket & { registered?: boolean } = io(
  "http://172.16.2.20:3000",
  {
    autoConnect: true,
    transports: ["websocket"],
  }
);
