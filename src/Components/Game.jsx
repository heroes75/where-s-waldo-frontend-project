import { useState } from "react";
import Header from "./Header";
import Image from "./Image";
import styles from '../Styles/Game.module.css'
export default function Game() {
    
    return (
        <>
            <Header />
            <main className={styles.main}>
                <Image />
            </main>
        </>
    )
}