import { useEffect } from "react";
import socket from "../socket";
import Header from "./Header";

export default function Multiplayer() {
    
    useEffect(() => {
        // socket.on('multiplayer', (arg, callback) => {
        //     console.log('you\'re connected')

        // })
        function show() {
            console.log('connected to multiplayer')
        }
        socket.connect()
        socket.emit('multiplayer', 'connect')
        // socket.
        socket.on('connect', show)

        return () => {
            socket.off('connect', show)
            socket.disconnect()
        }
        // socket.connect()
    }, [])

    return (
        <>
            <Header />
            <h1>you're connected on multiplayer</h1>
        </>
    )
}