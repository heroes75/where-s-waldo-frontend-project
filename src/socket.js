import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL, {
    autoConnect: false
})

export const socketMultiplayer = io(import.meta.env.VITE_API_URL + '/multiplayer', {
    autoConnect: false
})

export default socket