import { Link } from "react-router";

export default function Header() {
    return (
        <header>
            <nav>
                <ul>
                    <li><Link to='/'>HOME</Link></li>
                    <li><Link to='/leadboard'>Leadboard</Link></li>
                </ul>
            </nav>
        </header>
    )
}