import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import Image from "./Image";
import styles from '../Styles/Game.module.css'


export default function Game() {
    const [targets, setTargets] = useState([
        { x: 51.128, y: 49.852, name: "Waldo", url: "https://whereiswaldo.com/assets/icons/waldo.png", found: false},
        { x: 24.511, y: 49.641, name: "Odlaw", url: "https://whereiswaldo.com/assets/icons/odlaw.png", found: false },
        { x: 62.516, y: 49.308, name: "Wizard", url: "https://whereiswaldo.com/assets/icons/wizard.png", found: false },
    ]);
    const imgUrl = 'src/assets/level1-scene.webp';
    const isAllFound = targets.every(target => target.found)
    const dialog = useRef(null)

 
    useEffect(() => {
        if(isAllFound) {
        console.log(`All characters found`)
        dialog.current.showModal()
    }
    }, [isAllFound])

    
    return (
        <>
            <Header />
            <main className={styles.main}>
                <dialog ref={dialog} id="dialog" >
                    <form>
                        <p>
                            <label htmlFor="username">Enter your username:</label>
                            <input type="text" name="username" id="username" />
                        </p>
                        <p>
                            <button value='cancel' formmethod="dialog">Cancel</button>
                            <button value='default'>Enter</button>
                        </p>
                    </form>
                </dialog>
                <ul className={styles.ul}>
                    {targets.map(target => <li key={target.name} style={{outline: target.found ? '3px solid green' : '3px solid black'}} className={styles.li}><img className={styles.img} src={target.url} alt={target.name} /></li>)}
                </ul>
                <Image imgUrl={imgUrl} targets={targets} setTargets={setTargets} />
            </main>
        </>
    )
}