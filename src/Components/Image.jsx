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
    const prevScale = useRef(1)
    
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
        console.log('prevCursorTranslation', prevCursorTranslatePosition)
        setClientPosition({x: (e.clientX / rect.width) * 100, y: (e.clientY / rect.height) * 100})
        setCursorPosition({x, y})
        setOnMove(true)
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
        console.log('scale', scale)
        console.log('cursorPosition', cursorPosition)
        console.log('prevTranslateCursorPosition', prevCursorTranslatePosition)
        setPrevCursorScrollPosition({x: cursorPosition.x, y: cursorPosition.y})
        console.log('prevScale:', prevScale.current)
        setScale(prev => {
            console.log('prev:', prev)
            const newScale = Math.min(Math.max(prev + e.deltaY * -0.01 * prevScale.current, 1), 8)
            setPrevCursorTranslatePosition(prev => ({x: prev.x / newScale, y: prev.y / newScale}))
            setVectorTranslation(prev => ({x: prev.x / newScale, y: prev.y / newScale}))
            console.log('newScale:', newScale)
            return newScale
        })
        
    }

    function handleMvtImage(e) {
        const rect = e.target.getBoundingClientRect()
        console.log('rect.width: on imageContainer', rect.width)
        console.log('e.clientX: on imageContainer', e.clientX)
        const x = (((e.clientX) / rect.width) * 100) ;
        const y = (((e.clientY) / rect.height) * 100);
        setMvt({x, y})
        console.log('x: e.clientX, y: e.clientY:', x, y)
        if(isPressedCtrl) {
            console.log('x - startTranslatePosition.x:', x - startTranslatePosition.x)
            console.log('y - startTranslatePosition.y:', y - startTranslatePosition.y)
            console.log('scale', scale)
            setVectorTranslation({x: x - startTranslatePosition.x, y: y - startTranslatePosition.y})
        } 
        // else {
        //     setStartTranslatePosition({x:0, y:0})
        // }
    }
 
    function handleMouseDown(e) {
        e.preventDefault()
        setIsPressedCtrl(true)
        console.log('MOUSE DOWN')
        console.log('scale', scale)
        prevScale.current = scale
        setStartTranslatePosition({x: mvt.x - vectorTranslation.x, y: mvt.y - vectorTranslation.y})
        console.log('tartTranslatePosition.x , tartTranslatePosition.y', mvt.x - vectorTranslation.x, mvt.y - vectorTranslation.y)
        
    }

    function handleMouseUp() {
        console.log('MOUSE UP')
        setIsPressedCtrl(false)
        setPrevCursorTranslatePosition({x: vectorTranslation.x, y: vectorTranslation.y})
        // console.log('mvt.y - startTranslatePosition.y:', mvt.y - startTranslatePosition.y)
        // console.log('mvt.x - startTranslatePosition.x:', mvt.x - startTranslatePosition.x)
    }
    // function handlePressedKey(e) {
    //     console.log('e.code:', e.code)
        
    // }
    
    return (
        <>
            <div style={{position: 'absolute', transform: `translate(${cursorPosition.x}%, ${cursorPosition.y}%)`, zIndex: 2, margin: 0, padding: 0, color: 'black', fontWeight: 'bolder'}}>{cursorPosition.x.toFixed(3)}:{cursorPosition.y.toFixed(3)}</div>
            <div onMouseMove={handleMvtImage} className={styles.imgContainer} style={{ padding: 0, position: 'relative', margin:0}}>
                <img
                    ref={img}
                    className={styles.img}
                    style={!onMove ? {
                        margin: 0,
                        padding: 0,
                        width: "100%",
                        transform: `translate(${prevCursorTranslatePosition.x}%, ${prevCursorTranslatePosition.y}%) scale(${scale}) `,
                        transformOrigin: `${cursorPosition.x}% ${cursorPosition.y}%`
                    } : {
                        margin: 0,
                        padding: 0,
                        width: "100%",
                        transform: isPressedCtrl ? `translate(${vectorTranslation.x}%, ${vectorTranslation.y}%) scale(${scale}) ` : `translate(${prevCursorTranslatePosition.x}%, ${prevCursorTranslatePosition.y }%) scale(${scale}) `,
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
