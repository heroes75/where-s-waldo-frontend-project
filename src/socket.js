import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
    autoConnect: false,
});

export const socketMultiplayer = io(
    import.meta.env.VITE_API_URL + "/multiplayer",
    {
        autoConnect: false,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
    },
);

export default socket;
