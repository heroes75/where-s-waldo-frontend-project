import { useEffect, useState } from "react";
import socket from "../socket";
import Header from "./Header";
import { useNavigate } from "react-router";
import styles from "../Styles/Multiplayer.module.css";

export default function Multiplayer() {
    const [isWaiting, setIsWaiting] = useState();
    const [numbersOfPlayer, setNumbersOfPlayer] = useState(0);
    const [nextGame, setNextGame] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        function show(obj) {
            setIsWaiting(obj.msg);
            if (obj.nextGame) {
                setNextGame(obj.nextGame);
            }
        }

        function displayPlayer(msg) {
            setNumbersOfPlayer(msg);
        }

        socket.connect();
        socket.on("lobby", show);
        socket.on("players", displayPlayer);

        return () => {
            socket.off("lobby", show);
            socket.off("players", displayPlayer);
            socket.disconnect();
        };
    }, [nextGame]);

    useEffect(() => {
        if (nextGame) {
            navigate(nextGame);
        }
    }, [nextGame, navigate]);

    return (
        <>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>Welcome to multiplayer lobby</h1>
                <div className={styles.description}>
                    <span>
                        <strong>- you will be connected to new player.</strong>
                    </span>
                    <span>
                        <strong>
                            - with more than 33 whole different levels.
                        </strong>
                    </span>
                </div>
                <h2>you're connected online with {numbersOfPlayer} players</h2>
                <div className={styles.animation}>
                    <section>
                        <div className={styles.one}></div>
                        <div className={styles.two}></div>
                        <div className={styles.three}></div>
                    </section>
                </div>
                <h2 className={styles.h2}>{isWaiting}</h2>
                <div className="indication">
                    <p>
                        if you are reading it that's mean you're not connected
                        to a player but if you're feeling alone you can always
                        duplicate this tab to play against yourself.
                    </p>
                </div>
            </main>
        </>
    );
}
