import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Image from "./Image";
import styles from '../Styles/Game.module.css'
import { useNavigate, useParams } from "react-router";
import socket, { socketMultiplayer } from "../socket";
import Peer from "peerjs";


export default function GameOnline() {
    const [targets, setTargets] = useState([]);
    const [time, setTime] = useState(0)
    const [imgUrl, setImageUrl] = useState(null)
    const [name, setName] = useState('')
    const dialog = useRef(null)
    const isAllFound = targets.length !==0 && targets.every(target => target.found === true)
    const timeDividedByTen = time /10
    const timeInSecond = Math.round(timeDividedByTen * 10) / 10
    const timeFormat = Math.floor(timeInSecond/60**2) + ':' + Math.floor((timeInSecond/60)%60) + ':' + Math.round((timeInSecond%60) * 10) / 10 + 's';
    const {id, roomId} = useParams()
    const navigate = useNavigate()


    useEffect(() => {
        socketMultiplayer.connect()
        const peer = new Peer()

        function joinRoom(roomId, id) {
            socketMultiplayer.emit('join-room', roomId, id)
        }

        function listenMultiplayer(msg) {
            console.log('msg in multiplayer:', msg)
        }

        function listenRoomId(msg) {
            console.log('msg in roomId:', msg)
        }

        peer.on('open', id => {
            console.log('my peer id:', id);
            socketMultiplayer.emit('multiplayer', id)
            socketMultiplayer.emit(roomId, id)
            socketMultiplayer.on('join-room', joinRoom(roomId, id))
        })
        socketMultiplayer.on(roomId, listenRoomId)
        socketMultiplayer.on('multiplayer', listenMultiplayer)

        return () => {
            socketMultiplayer.off('join-room', joinRoom(roomId, id))
            socketMultiplayer.off(roomId, listenMultiplayer)
            socketMultiplayer.off('multiplayer', listenMultiplayer)
            socketMultiplayer.disconnect()
        }
    }, [])
 
    useEffect(() => {
        const initialTime = Date.now()
        const intervalId = setInterval(() => {
            const timeNow = (Date.now() - initialTime) / 100;
            setTime(timeNow);
        }, 100);

        if(isAllFound) {
            console.log(`All characters found`)
            clearInterval(intervalId)
            dialog.current.showModal()
        }

        return () => clearInterval(intervalId)
    }, [isAllFound])

    useEffect(() => {
        fetch(`http://localhost:3000/game/${id}`)
            .then(res => {
                return res.json()
            })
            .then(res => {
                console.log('res:', res)
                setImageUrl(res.game.url)
                setTargets(res.game.names.map(name => {
                    name.found = false
                    return name
                }))
            })
        console.log('roomId:', roomId)
        socketMultiplayer.on(roomId, msg => console.log(msg))

        return () => {
            socket.off(roomId)
        }
    }, [])

    function sendToRoom() {
        console.log('socketMultiplayer.emit:')
        socketMultiplayer.emit('multiplayer', 'const x = 1')
        socketMultiplayer.emit(roomId, 'const rommId = 111')
    }

    function handleCancel() {
        setTargets(targets.map(target => {
            target.found = false;
            return target
        }))
        setTime(0)
    }

    function GoHome() {
        navigate('/')
    }

    function handleAddRecord() {
        fetch(`http://localhost:3000/leadboard/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({time: timeInSecond, name: name ? name : 'Anonymous'})
        })
        navigate('/')
    }

    
    return (
        <>
            <Header />
            <main className={styles.main}>
                <dialog className={styles.dialog} ref={dialog} id="dialog" >
                    <p>
                        {timeFormat} and {timeInSecond}
                    </p>
                    <form>
                        <p>
                            <label htmlFor="username">Enter your username:</label>
                            <input value={name} onChange={e => setName(e.target.value)} type="text" name="username" id="username" />
                        </p>
                        <p>
                            <button onClick={handleCancel} value='cancel' formmethod="dialog">Replay</button>
                            <button onClick={GoHome}>Go to home</button>
                            <button onClick={handleAddRecord} value='default'>Enter</button>
                        </p>
                    </form>
                </dialog>
                <ul className={styles.ul}>
                    {targets.map(target => <li key={target.name} style={{outline: target.found ? '4px solid green' : '4px solid black'}} className={styles.li}><img className={styles.img} src={target.url} alt={target.name} style={{filter: target.found ? 'grayscale(95%) brightness(.6)' : 'blur(0px)'}} /></li>)}
                </ul>
                <div>{timeInSecond}</div>
                <Image imgUrl={imgUrl} targets={targets} setTargets={setTargets} gameId={id} roomId={roomId} sendToRoom={sendToRoom} />
            </main>
        </>
    )
}