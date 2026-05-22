import { useEffect } from "react";
import socket from "../socket";

export default function Multiplayer() {
    
    useEffect(() => {
        // socket.on('multiplayer', (arg, callback) => {
        //     console.log('you\'re connected')

        // })
        // socket.emit('multiplayer','connect' )
        socket.connect()
    }, [])

    return (
        <>
            <h1>you're connected on multiplayer</h1>
        </>
    )
}