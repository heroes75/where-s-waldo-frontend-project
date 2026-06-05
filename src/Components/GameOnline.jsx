import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Image from "./Image";
import styles from "../Styles/Game.module.css";
import { useNavigate, useParams } from "react-router";
import socket, { socketMultiplayer } from "../socket";
import Peer from "peerjs";

export default function GameOnline() {
    const [targets, setTargets] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isOpponentConnected, setIsOpponentConnected] = useState(false);
    const [opponentTargets, setOpponentTargets] = useState([]);
    const [opponentOutput, setOpponentOutput] = useState("");
    const [time, setTime] = useState(0);
    const [imgUrl, setImageUrl] = useState(null);
    const dialog = useRef(null);
    const isAllFound =
        targets.length !== 0 &&
        targets.every((target) => target.found === true);
    const isAllOpponentTargetFound =
        opponentTargets.length !== 0 &&
        opponentTargets.every((target) => target.found === true);
    const timeDividedByTen = time / 10;
    const timeInSecond = Math.round(timeDividedByTen * 10) / 10;
    const timeFormat =
        Math.floor(timeInSecond / 60 ** 2) +
        ":" +
        Math.floor((timeInSecond / 60) % 60) +
        ":" +
        Math.round((timeInSecond % 60) * 10) / 10 +
        "s";
    const { id, roomId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        socketMultiplayer.connect();
        // const peer = new Peer()

        function joinRoom(roomId, id) {
            socketMultiplayer.emit("join-room", roomId, id);
        }

        function listenRoomId(targets, isFound, name) {
            setOpponentTargets(targets);
            setOpponentOutput(
                isFound
                    ? `Your opponent found ${name}`
                    : `Your opponent missed ${name}`,
            );
            console.log("msg in roomId:", targets, isFound, name);
        }

        function initializeOpponentTargets(targets) {
            console.log(" received opponent targets:", targets);
            setOpponentTargets(targets);
        }

        function onConnect() {
            console.log('send status connection:', true)
            setIsConnected(true)
            socketMultiplayer.emit(roomId + '-connect', true)
        }

        function onDisconnect() {
            setIsConnected(false)
        }

        function onOpponentConnect(isConnected) {
            console.log('received status disconnection of opponent')
            setIsOpponentConnected(isConnected)
        }

        socketMultiplayer.on(roomId, listenRoomId);
        socketMultiplayer.on('disconnect', onDisconnect);
        socketMultiplayer.on('connect', onConnect);
        socketMultiplayer.on(roomId + "-target", initializeOpponentTargets);
        socketMultiplayer.on(roomId + "-connect", onOpponentConnect);

        return () => {
            socketMultiplayer.off("join-room", joinRoom(roomId, id));
            socketMultiplayer.off(roomId, listenRoomId);
            socketMultiplayer.off('disconnect', onDisconnect);
            socketMultiplayer.off('connect', onConnect);
            socketMultiplayer.off(roomId + "-connect", onOpponentConnect);
            socketMultiplayer.off(
                roomId + "-target",
                initializeOpponentTargets,
            );
            socketMultiplayer.disconnect();
        };
    }, [id, roomId]);

    useEffect(() => {
            const initialTime = Date.now();
        const intervalId = setInterval(() => {
            const timeNow = (Date.now() - initialTime) / 100;
            setTime(timeNow);
        }, 100);

        console.log('isAllOpponentTargetFound:', isAllOpponentTargetFound)
        console.log('!isOpponentConnected:', !isOpponentConnected)
        if (isAllFound || isAllOpponentTargetFound) {
            console.log(`All characters found`);
            clearInterval(intervalId);
            dialog.current.showModal();
        }

        return () => clearInterval(intervalId);
        
    }, [isAllFound, isAllOpponentTargetFound, isOpponentConnected]);

    useEffect(() => {
            fetch(`http://localhost:3000/game/${id}`)
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                console.log("res:", res);
                const targets = res.game.names.map((name) => {
                    name.found = false;
                    return name;
                });
                setImageUrl(res.game.url);
                socketMultiplayer.emit(roomId + "-target", targets);
                setTargets(targets);
            });
        console.log("roomId:", roomId);

        return () => {
            socket.off(roomId);
        };
        
    }, [id, roomId]);

    useEffect(() => {
        socketMultiplayer.emit(roomId + '-target', targets)
        socketMultiplayer.emit(roomId + '-connect', isConnected)
    }, [isOpponentConnected, roomId])

    

    function sendToRoom(targets, isFound, name) {
        console.log("socketMultiplayer.emit:");
        // socketMultiplayer.emit('multiplayer', 'const x = 1')
        socketMultiplayer.emit(roomId, targets, isFound, name);
    }

    function GoHome() {
        navigate("/");
    }


    return (
        <>
            <Header />
            <main className={styles.main}>
                <dialog className={styles.dialog} ref={dialog} id="dialog">
                    {isAllFound ? (
                        <p>
                            Congratulation you win you have beaten your opponent
                            in {timeFormat}
                        </p>
                    ) : isAllOpponentTargetFound ? (
                        <p>you loose your opponent win in {timeFormat}</p>
                    ) : (
                        <p>your opponent is disconnected</p>
                    )}
                    <p>
                        <button onClick={GoHome}>Go to home</button>
                    </p>
                </dialog>
                <ul className={styles.ul}>
                    {targets.map((target) => (
                        <li
                            key={target.name}
                            style={{
                                outline: target.found
                                    ? "4px solid green"
                                    : "4px solid black",
                            }}
                            className={styles.li}
                        >
                            <img
                                className={styles.img}
                                src={target.url}
                                alt={target.name}
                                style={{
                                    filter: target.found
                                        ? "grayscale(95%) brightness(.6)"
                                        : "blur(0px)",
                                }}
                            />
                        </li>
                    ))}
                </ul>
                <ul className={styles.ul}>
                    {opponentTargets.map((target) => (
                        <li
                            key={target.name}
                            style={{
                                outline: target.found
                                    ? "4px solid green"
                                    : "4px solid black",
                            }}
                            className={styles.li}
                        >
                            <img
                                className={styles.img}
                                src={target.url}
                                alt={target.name}
                                style={{
                                    filter: target.found
                                        ? "grayscale(95%) brightness(.6)"
                                        : "blur(0px)",
                                }}
                            />
                        </li>
                    ))}
                    {isOpponentConnected ? 'blue your opponent is connected' : 'red your opponent is disconnected'}
                </ul>
                <div>{timeInSecond}</div>
                <Image
                    imgUrl={imgUrl}
                    targets={targets}
                    setTargets={setTargets}
                    gameId={id}
                    roomId={roomId}
                    sendToRoom={sendToRoom}
                    opponentOutput={opponentOutput}
                />
            </main>
        </>
    );
}
