import { useEffect, useState } from "react";
import styles from "../Styles/styleImage.module.css";

export default function Image({ targets, imgUrl, unknownFunction }) {
    const [scale, setScale] = useState(1);
    const [lastScrollTop, setLastScrollTop] = useState(document.documentElement.scrollTop);
    // const [pageYOffset, setPageYOffset] = useState(0);
    

    // useEffect(() => {
    //     window.addEventListener("scroll", handleZoom);
    //     return () => window.removeEventListener("scroll", handleZoom);
    // });
    function HandlePosition(e) {
        // console.log('e:', e)
        const rect = e.target.getBoundingClientRect();
        // console.log("rect.x:", rect.x, "rect.y", rect.y);
        // console.log("rect.height:", rect.height, "rect.width", rect.width);
        // console.log("rect.top:", rect.top, "rect.left", rect.left);
        // console.log("rect.right:", rect.right, "rect.bottom", rect.bottom);
        // console.log("e.clientX", e.clientX, "e.clientY", e.clientY);
        // console.log(
        //     " e.clientX- rect.x",
        //     e.clientX - Math.floor(rect.x),
        //     " e.clientY- rect.y",
        //     e.clientY - Math.floor(rect.y),
        // );
        // console.log("e.pageX", e.pageX, "e.pageY", e.pageY);
    }

    function handleZoom() {
        // console.log('window.pageYOffset:', window.pageYOffset)
        // console.log('lastScrollTop:', lastScrollTop)
        const currentScroll = document.documentElement.scrollTop 

        if (currentScroll > lastScrollTop) {
            console.log('Down')
        } else {
            console.log('Up')
        }
        setLastScrollTop(document.documentElement.scrollTop)
        // let st = window.pageYOffset || document.documentElement.scrollTop;
        // if (st > lastScrollTop) {
        //     console.log("defilement vers le bas");
        //     setScale(prev => prev - .005)
        // } else if (st < lastScrollTop) {
        //     setScale(prev => prev + .005)
        //     console.log("defilement vers le haut");
        // }

        // setLastScrollTop(st <= 0 ? 0 : st);
    }
    function addZoom() {
        window.addEventListener("scroll", handleZoom, false);
    }

    function deleteZoom() {
        window.removeEventListener("scroll", handleZoom, false);
        console.log('done')
    }

    // handleZoom()
    return (
        <>
            <div className={styles.imgContainer} style={{ padding: "30px" }}>
                <img
                    className={styles.img}
                    style={{
                        margin: 0,
                        padding: 0,
                        width: "1000px",
                        transform: `scale(${scale})`,
                    }}
                    onMouseMove={HandlePosition}
                    src="src/assets/level2-scene.webp"
                    alt="image of level 2"
                    // onPointerEnter={addZoom}
                    // onPointerLeave={deleteZoom}
                    onMouseEnter={addZoom}
                    onMouseLeave={deleteZoom}
                    // onScroll={handleZoom}
                />
            </div>
        </>
    );
}
