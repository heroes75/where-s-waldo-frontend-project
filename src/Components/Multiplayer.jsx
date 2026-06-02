import { useEffect, useState } from "react";
import socket from "../socket";
import Header from "./Header";
import { useNavigate } from "react-router";

export default function Multiplayer() {
    const [isWaiting, setIsWaiting] = useState()
    const [nextGame, setNextGame] = useState()
    const navigate = useNavigate()
    
    useEffect(() => {
        // socket.on('multiplayer', (arg, callback) => {
        const falseId = Math.floor(Math.random() * 10000)
            console.log('falseId:', falseId)
            console.log('you\'re connected');

        // })
        function show(obj) {
            console.log('obj.msg:', obj.msg)
            console.log('obj.id:', obj.id)
            setIsWaiting(obj.msg)
            console.log('obj.nextGame:', obj.nextGame)
            if (obj.nextGame) {
                setNextGame(obj.nextGame)
            }
        }

        socket.connect()
        // socket.emit('multiplayer', falseId)
        // socket.on('connect', show)
        socket.on('lobby', show)
        
        return () => {
            socket.off('lobby', show)
            socket.disconnect()
        }
        // socket.connect()
    }, [nextGame])

    useEffect(() => {
        console.log('nextGame:', nextGame)
        if (nextGame) {
            navigate(nextGame)
        }
    }, [nextGame, navigate])

    return (
        <>
            <Header />
            <h1>you're connected on multiplayer</h1>
            <h2>{isWaiting}</h2>
            <button onClick={() => socket.disconnect()}>disconnect</button>
        </>
    )
}