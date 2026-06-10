import { useEffect, useState } from "react";
import styles from "./App.module.css";
import Header from "./Components/Header";
import { Link, useNavigate } from "react-router";

function App() {
	const [games, setGames] = useState([])
	const navigate = useNavigate()

	useEffect(() => {
		fetch(import.meta.env.VITE_API_URL +  `/game`,)
			.then(res => res.json())
			.then(res => {
				setGames(res.games)
			})
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
					<div className={styles.instruction}>
						<h2>Multiplayer Working:</h2>
						<ul>
							<li className={styles.li}>You and your opponent receive the same Image</li>
							<li className={styles.li}>Each action made by one will be see by the other</li>
							<li className={styles.li}>Each players will see the state targets of others</li>
						</ul>
						
					</div>
				</div>
			</main>
		</>
	);
}

export default App;