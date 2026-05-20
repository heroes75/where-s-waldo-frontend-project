import { useEffect, useState } from "react";
import "./App.css";
import Header from "./Components/Header";
import socket from "./socket";

function App() {
	useEffect(() => {
		// socket.connect()
		socket.on('test', () => console.log('succeeded test'))
		socket.emit('test', 'something', () => console.log('succeeded test'))
		return () => socket.disconnect()
	}, [])
    return (
		<>
			<Header />
			<main>
				
			</main>
		</>
	);
}

export default App;