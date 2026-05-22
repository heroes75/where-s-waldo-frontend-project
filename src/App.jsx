import { useEffect, useState } from "react";
import "./App.css";
import Header from "./Components/Header";
import socket from "./socket";
import { Link } from "react-router";

function App() {
	const [games, setGames] = useState([])

	useEffect(() => {
		// socket.connect()
		socket.on('connect', () => console.log('succeeded test'))
		// socket.emit('test', 'something', () => console.log('succeeded test'))

		fetch(`http://localhost:3000/game`,)
			.then(res => res.json())
			.then(res => {
				setGames(res.games)
			})
		return () => socket.disconnect()
	}, [])
    return (
		<>
			<Header />
			<main>
				<div>
					<ul>
						{games.map(game => <Link to={`/game/${game.id}`}><img style={{width: '300px'}} src={game.url} alt="game-level" /></Link>)}
					</ul>
				</div>
				<div>
					<Link to='/multiplayer'>Multiplayer</Link>
				</div>
			</main>
		</>
	);
}

export default App;