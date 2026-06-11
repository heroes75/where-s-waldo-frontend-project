import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Image from "./Image";
import ReiDance from '../assets/Rei Dance Back GIF.gif'
import GiselleDance from '../assets/Dance Giselle GIF.gif'
import help from '../assets/help_24dp.svg'
import styles from "../Styles/GameOnline.module.css";
import { useNavigate, useParams } from "react-router";
import socket, { socketMultiplayer } from "../socket";

export default function GameOnline() {
    const [targets, setTargets] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isOpponentConnected, setIsOpponentConnected] = useState(false);
    const [opponentTargets, setOpponentTargets] = useState([]);
    const [opponentOutput, setOpponentOutput] = useState("");
    const [output, setOutput] = useState("");
    const [time, setTime] = useState(0);
    const [imgUrl, setImageUrl] = useState(null);
    const outputElement = useRef(null)
    const opponentOutputElement = useRef(null)
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
    const colorPoint = isOpponentConnected ? 'green' : 'red'
    const { id, roomId } = useParams();
    const navigate = useNavigate();


     function showOpponentOutput(action) {
        opponentOutputElement.current.style.transform = 'translateX(-5px)'
        opponentOutputElement.current.style.opacity = 1

        setOpponentOutput(action)

        setTimeout(() => {
            opponentOutputElement.current.style.transform = 'translateX(30px)'
            opponentOutputElement.current.style.opacity = 0
        }, 3000);
    }

    useEffect(() => {
        socketMultiplayer.connect();
        // const peer = new Peer()

        function joinRoom(roomId) {
            socketMultiplayer.emit("join-room", roomId);
        }

        function listenRoomId(targets, isFound, name) {
            setOpponentTargets(targets);
            showOpponentOutput(
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
            joinRoom(roomId)
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
            socketMultiplayer.off("join-room");
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
            fetch(`${import.meta.env.VITE_API_URL}/game/${id}`)
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
    }, [isOpponentConnected, roomId, isConnected])

    

    function sendToRoom(targets, isFound, name) {
        socketMultiplayer.emit(roomId, targets, isFound, name);
    }

    function showOutput(action) {
        outputElement.current.style.transform = 'translateX(30px)'
        outputElement.current.style.opacity = 1

        console.log('outputElement.current:', outputElement.current)
        setOutput(action)

        setTimeout(() => {
            outputElement.current.style.transform = 'translateX(-100px)'
            outputElement.current.style.opacity = 0
        }, 3000);
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
                        <>
                            <h2>👍👍👍Congratulation👍👍👍</h2>
                            <p>
                                <strong>you won in {timeFormat}</strong>
                            </p>

                            <img style={{width: '300px'}} src={ReiDance} alt="Rei dance" />
                        </>
                    ) : isAllOpponentTargetFound ? (
                        <>
                            <h2>👎😂🤣SHAME ON YOU👎😂🤣</h2>
                            <p><strong>you loose</strong>, your opponent win in {timeFormat}</p>
                            <img src={GiselleDance} alt="Giselle Dance" style={{width: '300px'}} />
                        </>
                    ) : (
                        <p>your opponent is disconnected</p>
                    )}
                    <p>
                        <button className={styles.home} onClick={GoHome}>Go to home</button>
                    </p>
                </dialog>
                <output className={styles.output} ref={outputElement}>{output}</output>
                <div className={styles.targets}>
                    <span>Your targets</span>
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
                </div>
                <div className={styles.opponentTargets}>
                    <span>Opponent's targets</span>
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
                    </ul>
                    <p className={styles.opponentConnection}><div style={{backgroundColor: colorPoint, boxShadow: `0 0 10px ${colorPoint}, 0 0 20px ${colorPoint}, 0 0 40px ${colorPoint}, 0 0 80px ${colorPoint}, 0 0 160px ${colorPoint}`}} className={styles.point}></div> {isOpponentConnected ? 'your opponent is connected' : 'your opponent is disconnected'}</p>
                </div>
                <output ref={opponentOutputElement} className={styles.opponentOutput}>{opponentOutput}</output>
                <div className={styles.timeSection}><img src={help} alt="help" className={styles.help} /><span>{timeInSecond}</span></div>
                <Image
                    imgUrl={imgUrl}
                    targets={targets}
                    setTargets={setTargets}
                    gameId={id}
                    roomId={roomId}
                    sendToRoom={sendToRoom}
                    opponentOutput={opponentOutput}
                    showOutput={showOutput}
                />
            </main>
        </>
    );
}
