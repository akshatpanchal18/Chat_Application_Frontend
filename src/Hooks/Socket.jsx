import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET;
const socket = io(SOCKET_URL, {
  transports: ["polling"],
  withCredentials: true,
  // autoConnect: false,
});

export default socket;
