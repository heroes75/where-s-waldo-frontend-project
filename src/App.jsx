import { useEffect, useState } from "react";
import styles from "./App.module.css";
import Header from "./Components/Header";
import socket from "./socket";
import { Link, useNavigate } from "react-router";

function App() {
	const [games, setGames] = useState([])
	const navigate = useNavigate()

	useEffect(() => {
		fetch(`http://localhost:3000/game`,)
			.then(res => res.json())
			.then(res => {
				setGames(res.games)
			})
		// return () => socket.disconnect()
	}, [])
    return (
		<>
			<Header />
			<main  className={styles.main}>
				<div className={styles.gameContainer}>
					<h2>Games:</h2>
					<ul className={styles.ul}>
						{games.map(game => <Link className={styles.a} key={game.id} to={`/game/${game.id}`}><img className={styles.img} src={game.url} alt="game-level" /></Link>)}
					</ul>
				</div>
				<div className={styles.multiplayerBox}>
					<button className={styles.button} onClick={() => navigate('/multiplayer')}>Multiplayer</button>
				</div>
			</main>
		</>
	);
}

export default App;