import { io } from "socket.io-client";

const socket = io('http://localhost:3000', {
    autoConnect: false
})

export const socketMultiplayer = io('http://localhost:3000/multiplayer', {
    autoConnect: false
})

export default socket