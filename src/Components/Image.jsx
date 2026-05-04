import { useEffect, useRef, useState } from "react";
import styles from "../Styles/styleImage.module.css";

export default function Image({ targets, imgUrl, unknownFunction }) {
    const [scale, setScale] = useState(1);
    const [cursorPosition, setCursorPosition] = useState({x:0, y:0});
    const [prevCursorPosition, setPrevCursorPosition] = useState({x:0, y:0});
    const [clientPosition, setClientPosition] = useState({x:0, y:0});
    const [onMove, setOnMove] = useState(false);
    const img = useRef(null)
    // const [pageYOffset, setPageYOffset] = useState(0);
    

    // useEffect(() => {
    //     if (isCursorOnImage) {
    //         console.log('isCursorOnImage:', isCursorOnImage)
    //         window.addEventListener("wheel", handleZoom, false);
    //     } else {
    //     return () => window.removeEventListener("wheel", handleZoom, false);

    //     }
    // }, [isCursorOnImage]);

    function HandlePosition(e) {
        const rect = e.target.getBoundingClientRect();
        console.log('rect.top:', rect.top)
        console.log('rect.height:', rect.height)
        console.log('rect.right:', rect.right)
        console.log('rect.width:', rect.width)
        console.log('rect.x:', rect.x)
        console.log('rect.left:', rect.left)
        console.log('rect.y:', rect.y)
        console.log('e.clientX:', e.clientX)
        console.log('e.clientY:', e.clientY)
        console.log('img.scrollTop:', img.scrollTop)
        console.log('img:', img)
        const x = (((e.clientX- (rect.left < 0 ? 0 : rect.left) / scale) / rect.width) * 100)
        const y = (((e.clientY- (rect.top < 0 ? 0 : rect.top) / scale) / rect.height) * 100)
        // const x = e.clientX + document.body.scrollLeft - document.body.clientLeft;
        // const y= e.clientY + document.body.scrollTop  - document.body.clientTop
        console.log('{x, y}:', {x, y})
        setClientPosition({x: e.clientX, y: e.clientY})
        setCursorPosition({x, y})
        setOnMove(true)
        // console.log("e.pageX", e.pageX, "e.pageY", e.pageY);
    }

    function handleZoom(e) {
        // e.preventDefault()
        setOnMove(false)
        console.log('e.deltaY:', e.deltaY)
        console.log('scale', scale)
        console.log('cursorPosition', cursorPosition)
        setPrevCursorPosition({x: cursorPosition.x, y: cursorPosition.y})
        setScale(prev => Math.min(Math.max(prev + e.deltaY * -0.01, 1), 8))
    }
    
    return (
        <>
            {/* <span style={{position: 'relative', left: `${clientPosition.x}%`, top: `${cursorPosition.y}%`, zIndex: 2}}>{cursorPosition.x}:{cursorPosition.y}</span> */}
            <div className={styles.imgContainer} style={{ padding: "0", position: 'relative', margin:0}}>
                <img
                    ref={img}
                    className={styles.img}
                    style={!onMove ? {
                        margin: 0,
                        padding: 0,
                        width: "1000px",
                        transform: `scale(${scale})`,
                        transformOrigin: `${cursorPosition.x }% ${cursorPosition.y }%`
                    } : {
                        margin: 0,
                        padding: 0,
                        width: "1000px",
                        transform: `scale(${scale})`,
                        transformOrigin: `${prevCursorPosition.x}% ${prevCursorPosition.y}%`
                    }}
                    onMouseMove={HandlePosition}
                    src="src/assets/level2-scene.webp"
                    alt="image of level 2"
                    onWheel={handleZoom}
                />
            </div>
        </>
    );
}
