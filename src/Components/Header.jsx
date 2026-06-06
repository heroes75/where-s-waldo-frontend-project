import { Link } from "react-router";
import styles from '../Styles/Header.module.css'

export default function Header() {
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <ul className={styles.ul}>
                    <li><Link to='/'>HOME</Link></li>
                    <li><Link to='/leadboard'>Leadboard</Link></li>
                </ul>
            </nav>
        </header>
    )
}