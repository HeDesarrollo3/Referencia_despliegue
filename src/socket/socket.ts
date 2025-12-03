import { io } from "socket.io-client";

export const socket = io("http://172.16.2.20:3000", {
  transports: ["websocket"],
});
