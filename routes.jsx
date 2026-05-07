import App from "./src/App";
import Game from "./src/Components/Game";

const routes = [
    {
        element: <App/>,
        path: '/'
    },
    {
        element: <Game />,
        path: '/game'
    }
]

export default routes