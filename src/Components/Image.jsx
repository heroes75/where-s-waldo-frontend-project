import { useEffect, useRef, useState } from "react";
import styles from "../Styles/styleImage.module.css";

export default function Image({ targets, imgUrl, unknownFunction }) {
    const [scale, setScale] = useState(1);
    const [cursorPosition, setCursorPosition] = useState({x:0, y:0});
    const [prevCursorScrollPosition, setPrevCursorScrollPosition] = useState({x:0, y:0});
    const [mvt, setMvt] = useState({x:0, y:0});
    const [startTranslatePosition, setStartTranslatePosition] = useState({x:0, y:0});
    const [prevCursorTranslatePosition, setPrevCursorTranslatePosition] = useState({x:0, y:0});
    const [vectorTranslation, setVectorTranslation] = useState({x:0, y:0});
    const [clientPosition, setClientPosition] = useState({x:0, y:0});
    const [onMove, setOnMove] = useState(false);
    const [isPressedCtrl, setIsPressedCtrl] = useState(false);
    const img = useRef(null)
    const prevIsPressedCtrl = useRef()
    // const [pageYOffset, setPageYOffset] = useState(0);
    

    // useEffect(() => {
    //     window.addEventListener('scroll', (e) => {
    //         console.log('img.scrollTop', img.current.scrollTop)
    //         console.log('document.documentElement.scrollTop', document.documentElement.scrollTop)
    //     })
    // }, []);

    function HandlePosition(e) {
        const rect = e.target.getBoundingClientRect();
        // console.log('rect.top:', rect.top)
        // console.log('rect.height:', rect.height)
        // console.log('rect.right:', rect.right)
        // console.log('rect.width:', rect.width)
        // console.log('rect.x:', rect.x)
        // console.log('rect.left:', rect.left)
        // console.log('rect.y:', rect.y)
        // console.log('e.clientX:', e.clientX)
        // console.log('e.clientY:', e.clientY)
        // console.log('img.scrollHeight:', img.current.scrollHeight)
        // console.log('img.scrollHeight:', img.current.scrollWidth)
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        console.log('{x, y}:', {x, y})
        setClientPosition({x: (e.clientX / rect.width) * 100, y: (e.clientY / rect.height) * 100})
        setCursorPosition({x, y})
        setOnMove(true)
        console.log('e.ctrlKey:', e.ctrlKey)
        // setIsPressedCtrl(prev => {
        //     prevIsPressedCtrl.current = prev
        //     return e.ctrlKey
        // }) 
        
        // console.log("e.pageX", e.pageX, "e.pageY", e.pageY);
    }


    function handleZoom(e) {
        // e.preventDefault()
        setOnMove(false)
        // console.log('e.deltaY:', e.deltaY)
        // console.log('scale', scale)
        console.log('cursorPosition', cursorPosition)
        setPrevCursorScrollPosition({x: cursorPosition.x, y: cursorPosition.y})
        setScale(prev => Math.min(Math.max(prev + e.deltaY * -0.01, 1), 8))
    }

    function handleMvtImage(e) {
        const rect = e.target.getBoundingClientRect()
        const x = (e.clientX / rect.width) * 100;
        const y = (e.clientY / rect.height) * 100;
        setMvt({x, y})
        console.log('x: e.clientX, y: e.clientY:', x, y)
        // if(isPressedCtrl) {
            
        //     if(prevIsPressedCtrl.current === false) {
        //         setStartTranslatePosition({x, y})
        //     }
        //     console.log('x startTranslation, y startTranslation:', startTranslatePosition.x, startTranslatePosition.y)
        //     console.log('x - startTranslatePosition.x, y - startTranslatePosition.y', x - startTranslatePosition.x, y - startTranslatePosition.y)
        // } 
        // else {
        //     setStartTranslatePosition({x:0, y:0})
        // }
    }

    function handleMouseDown(e) {
        e.preventDefault()
        setIsPressedCtrl(true)
        console.log('mouse down')
        setStartTranslatePosition({x: mvt.x - 1, y: mvt.y - 1})
        console.log('tartTranslatePosition.x , tartTranslatePosition.y', mvt.x, mvt.y)
        
    }

    function handleMouseUp() {
        console.log('Mouse Up')
        setIsPressedCtrl(false)
        setPrevCursorTranslatePosition({x: mvt.x - startTranslatePosition.x, y: mvt.y - startTranslatePosition.y})
        console.log('mvt.y - startTranslatePosition.y:', mvt.y - startTranslatePosition.y)
        console.log('mvt.x - startTranslatePosition.x:', mvt.x - startTranslatePosition.x)
    }
    // function handlePressedKey(e) {
    //     console.log('e.code:', e.code)
        
    // }
    
    return (
        <>
            {/* <span style={{position: 'absolute', left: `${clientPosition.x}%`, top: `${cursorPosition.y}%`, zIndex: 2}}>{cursorPosition.x}:{cursorPosition.y}</span> */}
            <div onMouseMove={handleMvtImage} className={styles.imgContainer} style={{ padding: "0", position: 'relative', margin:0}}>
                <img
                    ref={img}
                    className={styles.img}
                    style={!onMove ? {
                        margin: 0,
                        padding: 0,
                        width: "90%",
                        transform: `translate(${prevCursorTranslatePosition.x}%, ${prevCursorTranslatePosition.y}%) scale(${scale})`,
                        transformOrigin: `${cursorPosition.x}% ${cursorPosition.y}%`
                    } : {
                        margin: 0,
                        padding: 0,
                        width: "90%",
                        transform: isPressedCtrl ? `translate(${mvt.x - startTranslatePosition.x + prevCursorTranslatePosition.x}%, ${mvt.y - startTranslatePosition.y + prevCursorTranslatePosition.y}%) scale(${scale}) ` : `translate(${prevCursorTranslatePosition.x}%, ${prevCursorTranslatePosition.y}%) scale(${scale}) `,
                        transformOrigin: `${prevCursorScrollPosition.x}% ${prevCursorScrollPosition.y}%`
                    }}
                    onMouseMove={HandlePosition}
                    src="src/assets/level2-scene.webp"
                    alt="image of level 2"
                    onWheel={handleZoom}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    // onKeyDown={handlePressedKey}
                />
            </div>
        </>
    );
}
