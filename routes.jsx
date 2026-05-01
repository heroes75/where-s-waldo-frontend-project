import App from "./src/App";
import GameTime from "./src/Components/GameTime";

const routes = [
    {
        element: <App/>,
        path: '/'
    },
    {
        element: <GameTime />,
        path: '/game'
    }
]

export default routes