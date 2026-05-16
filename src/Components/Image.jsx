import { useEffect, useRef, useState } from "react";
import styles from "../Styles/styleImage.module.css";

export default function Image({ targets, imgUrl, setTargets }) {
    const [scale, setScale] = useState(1);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [prevCursorScrollPosition, setPrevCursorScrollPosition] = useState({
        x: 0,
        y: 0,
    });
    const [mvt, setMvt] = useState({ x: 0, y: 0 });
    const [startTranslatePosition, setStartTranslatePosition] = useState({
        x: 0,
        y: 0,
    });
    const [prevCursorTranslatePosition, setPrevCursorTranslatePosition] =
        useState({ x: 0, y: 0 });
    const [vectorTranslation, setVectorTranslation] = useState({ x: 0, y: 0 });
    const [clientPosition, setClientPosition] = useState({ x: 0, y: 0 });
    const [targetingBox, setTargetingBox] = useState({x: 0, y:0});
    const [selectedPoint, setSelectedPoint] = useState({x: 0, y: 0})
    const [isShowTargetingBox, setIsShowTargetingBox] = useState(false)
    const [onMove, setOnMove] = useState(false);
    const [isPressedCtrl, setIsPressedCtrl] = useState(false);
    const [oupout, setOupout] = useState('')
    const img = useRef(null);
    const imgContainer = useRef(null);
    const prevIsPressedCtrl = useRef();
    const prevScale = useRef(1);
    // const targets = [
    //     { x: 84.855, y: 30.859, name: "Waldo", url: "" },
    //     { x: 3, y: 3, name: "emmanuel", url: "" },
    // ];

    function HandlePosition(e) {
        const rect = e.target.getBoundingClientRect();
        const rectImage = img.current.getBoundingClientRect();
        const rectImageContainer = imgContainer.current.getBoundingClientRect();
        // console.log('rect.top:', rect.top)
        // console.log('rect.height:', rect.height)
        // console.log('rect.right:', rect.right)
        console.log("e.clientX:", e.clientX);
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        const xImg =
            ((rectImage.x - rectImageContainer.x) / rectImage.width) * 100;
        const yImg =
            ((rectImage.y - rectImageContainer.y) / rectImage.height) * 100;
        console.log("xImg: in handle position", xImg);
        console.log("yImg: in handle position", yImg);
        setClientPosition({ x: (x + xImg) * scale, y: (y + yImg) * scale });

        console.log("{x, y}:", { x, y });
        console.log("prevCursorTranslation", prevCursorTranslatePosition);
        // setClientPosition({x: (e.clientX / rect.width) * 100, y: (e.clientY / rect.height) * 100})
        setCursorPosition({ x, y });
        setOnMove(true);
        // setIsPressedCtrl(prev => {
        //     prevIsPressedCtrl.current = prev
        //     return e.ctrlKey
        // })

        // console.log("e.pageX", e.pageX, "e.pageY", e.pageY);
    }

    function handleZoom(e) {
        // e.preventDefault()
        setOnMove(false);
        // console.log('e.deltaY:', e.deltaY)
        // console.log('scale', scale)
        // console.log('cursorPosition', cursorPosition)
        // console.log('prevTranslateCursorPosition', prevCursorTranslatePosition)
        setPrevCursorScrollPosition({
            x: cursorPosition.x,
            y: cursorPosition.y,
        });
        // console.log('prevScale:', prevScale.current)
        setScale((prev) => {
            // console.log('prev:', prev)
            const newScale = Math.min(
                Math.max(prev + e.deltaY * -0.01 * prevScale.current, 1),
                8,
            );
            setPrevCursorTranslatePosition((prev) => ({
                x: prev.x / newScale,
                y: prev.y / newScale,
            }));
            setVectorTranslation((prev) => ({
                x: prev.x / newScale,
                y: prev.y / newScale,
            }));
            // console.log('newScale:', newScale)
            return newScale;
        });
    }

    function handleMvtImage(e) {
        const rect = e.target.getBoundingClientRect();
        const rectImage = img.current.getBoundingClientRect();
        const rectImageContainer = imgContainer.current.getBoundingClientRect();
        // console.log('rectImage.x - rect.x', rectImage.x - rect.x)
        // console.log('rect.x:', rect.x)
        // console.log('rectImage.x - rectImgContainer.x', rectImage.x - rectImageContainer.x)
        // console.log('rectImage.y - rectImgContainer.y', rectImage.y - rectImageContainer.y)
        // console.log('rect.width: on imageContainer', rect.width)
        // console.log('e.clientX: on imageContainer', e.clientX)
        const x = (e.clientX / rect.width) * 100;
        const xImg =
            ((e.clientX - (rectImage.x - rectImageContainer.x)) /
                rectImage.width) *
            100;
        // console.log('xImg:', xImg)
        const yImg =
            ((e.clientY - (rectImage.top - rectImageContainer.top)) /
                rectImage.height) *
            100;
        // console.log('yImg:', yImg)
        const y = (e.clientY / rect.height) * 100;
        setMvt({ x, y });
        // setClientPosition({x: xImg, y: yImg})
        console.log("x: e.clientX, y: e.clientY:", x, y);
        // console.log('x: e.Img, y: e.Img:', xImg, yImg)
        if (isPressedCtrl) {
            // console.log('x - startTranslatePosition.x:', x - startTranslatePosition.x)
            // console.log('y - startTranslatePosition.y:', y - startTranslatePosition.y)
            // console.log('scale', scale)
            setVectorTranslation({
                x: x - startTranslatePosition.x,
                y: y - startTranslatePosition.y,
            });
        }
        // else {
        //     setStartTranslatePosition({x:0, y:0})
        // }
    }

    function handleMouseDown(e) {
        e.preventDefault();
        setIsPressedCtrl(true);
        setIsShowTargetingBox(false)
        console.log("MOUSE DOWN");
        console.log("scale", scale);
        prevScale.current = scale;
        setStartTranslatePosition({
            x: mvt.x - vectorTranslation.x,
            y: mvt.y - vectorTranslation.y,
        });
        console.log(
            "tartTranslatePosition.x , tartTranslatePosition.y",
            mvt.x - vectorTranslation.x,
            mvt.y - vectorTranslation.y,
        );
    }

    function handleMouseUp() {
        console.log("MOUSE UP");
        setIsPressedCtrl(false);
        setPrevCursorTranslatePosition({
            x: vectorTranslation.x,
            y: vectorTranslation.y,
        });
        // console.log('mvt.y - startTranslatePosition.y:', mvt.y - startTranslatePosition.y)
        // console.log('mvt.x - startTranslatePosition.x:', mvt.x - startTranslatePosition.x)
    }

    function handleClick() {
        // const r = 3;
        // const isTargetClicked =
        //     Math.sqrt(
        //         (cursorPosition.x - target.x) ** 2 +
        //             (cursorPosition.y - target.y) ** 2,
        //     ) <= r;
        // console.log("isTargetClicked:", isTargetClicked);
        setSelectedPoint({x: cursorPosition.x, y: cursorPosition.y})
        setTargetingBox({x: clientPosition.x, y: clientPosition.y})
        setIsShowTargetingBox(!isShowTargetingBox)
        console.log('!isShowTargetingBox:', !isShowTargetingBox)
    }

    function handleSelect(e) {
        const r = 2.5;
        // const [{x, y, name}] = targets.filter(target => target.name === e.target.dataset.value)
        // const newTargets = [...targets]
        // const isTargetClicked = (selectedPoint.x - x)**2 + (selectedPoint.y - y)**2 <= r*r
        // console.log('isTargetClicked:', isTargetClicked)
        setIsShowTargetingBox(false)
        setTargets(targets.map(target => {
            if(target.name === e.target.dataset.value) {
                const isTargetClicked = (selectedPoint.x - target.x)**2 + (selectedPoint.y - target.y)**2 <= r*r
                if(isTargetClicked) {
                    setOupout(`${target.name} Found`)
                    target.found = true
                } else {
                    setOupout(`${target.name} Is Not Here`)
                }
            }
            return target
        }))
        // setOupout(`${name} ${isTargetClicked ? 'Found' : 'is not here'}`)
    }

    function handleReset() {
        setScale(1)
        setClientPosition({x: 0, y: 0})
        setCursorPosition({x: 0, y: 0})
        setMvt({x: 0, y: 0})
        setCursorPosition({x:0, y: 0})
        setPrevCursorScrollPosition({x:0,y:0})
        setPrevCursorTranslatePosition({x:0,y:0})
        setSelectedPoint({x:0,y:0})
        setTargetingBox({x:0, y:0})
        setStartTranslatePosition({x:0,y:0})
        setVectorTranslation({x:0,y:0})
        setIsPressedCtrl(false)
        setOnMove(false)
        setIsShowTargetingBox(false)
        setOupout('')
        prevScale.current = 1
    }

    return (
        <>
            <div className={styles.gameSection}>
                <output className={styles.oupout}>{oupout}</output>
                <div
                    ref={imgContainer}
                    onMouseMove={handleMvtImage}
                    className={styles.imgContainer}
                    style={{ padding: 0, position: "relative", margin: 0 }}
                >
                    <div
                        style={{
                            display: isShowTargetingBox ? 'flex' : 'none',
                            position: "absolute",
                            left: `${targetingBox.x}%`,
                            top: `${targetingBox.y}%`,
                            zIndex: 2,
                            margin: 0,
                            padding: 0,
                            color: "black",
                            fontWeight: "600",
                            backgroundColor: "#eee",
                        }}
                        // onClick={() => handleClick}
                    >
                        <ul className={styles.ul} onClick={handleSelect} id="target">
                            {targets.map((target) => (
                                <li key={target.name} className={styles.li} data-value={target.name}>
                                    <img data-value={target.name} src="src/assets/level-scene.png" className={styles.imageTarget} src={target.url} alt={target.name} />{" "}
                                    <div data-value={target.name}>{target.name}</div>
                                </li>
                            ))}
                        </ul>
                        {/* {targetingBox.x.toFixed(3)}:{targetingBox.y.toFixed(3)} */}
                    </div>
                        <div style={{position: 'absolute', zIndex: 3, top: clientPosition.y + '%', left: clientPosition.x + '%', backgroundColor: 'red'}}>{cursorPosition.x.toFixed(3) + ':' + cursorPosition.y.toFixed(3)}</div>

                    <img
                        ref={img}
                        className={styles.img}
                        style={
                            !onMove
                                ? {
                                      margin: 0,
                                      padding: 0,
                                      width: "100%",
                                      transform: `translate(${prevCursorTranslatePosition.x}%, ${prevCursorTranslatePosition.y}%) scale(${scale}) `,
                                      transformOrigin: `${cursorPosition.x}% ${cursorPosition.y}%`,
                                  }
                                : {
                                      margin: 0,
                                      padding: 0,
                                      width: "100%",
                                      transform: isPressedCtrl
                                          ? `translate(${vectorTranslation.x}%, ${vectorTranslation.y}%) scale(${scale}) `
                                          : `translate(${prevCursorTranslatePosition.x}%, ${prevCursorTranslatePosition.y}%) scale(${scale}) `,
                                      transformOrigin: `${prevCursorScrollPosition.x}% ${prevCursorScrollPosition.y}%`,
                                  }
                        }
                        onMouseMove={HandlePosition}
                        src={imgUrl}
                        alt="image of level 2"
                        onWheel={handleZoom}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onDoubleClick={handleClick}
                        // onKeyDown={handlePressedKey}
                    />
                </div>
                <button onClick={handleReset}>Reset view</button>
            </div>
        </>
    );
}
