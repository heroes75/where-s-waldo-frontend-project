import { Link } from "react-router";

export default function Header() {
    return (
        <header>
            <nav>
                <ul>
                    <li><Link to='/'>HOME</Link></li>
                    <li><Link to='/signup'>Signup</Link></li>
                    <li><Link to='/login'>Login</Link></li>
                </ul>
            </nav>
        </header>
    )
}