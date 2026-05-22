import App from "./src/App";
import Game from "./src/Components/Game";
import GameOffline from "./src/Components/GameOffline";
import Leadboard from "./src/Components/Leadboard";
import Multiplayer from "./src/Components/Multiplayer";

const routes = [
    {
        element: <App/>,
        path: '/'
    },
    {
        element: <Game />,
        path: '/game/:id'
    },
    {
        element: <GameOffline />,
        path: '/offline'
    },
    {
        element: <Leadboard />,
        path: '/leadboard'
    },
    {
        element: <Multiplayer />,
        path: '/multiplayer'
    }
]

export default routes