import { useRef } from "react";
import { useEffect } from "react";

import UI from "./ui/UI";
import { Sketch } from "./experience/Sketch";

import useWallsStore from "../features/wallsStore";

const App = () => {

    const sketch = useRef(null);

    const { wallPositions } = useWallsStore();

    useEffect(() => {
        if(sketch.current) {
            sketch.current.updateWalls(wallPositions);
        }
    }, [wallPositions]);

    useEffect(() => {
        sketch.current = new Sketch(document.querySelector('.webgl'));
    }, []);

    return (
        <div className="w-full">
            <UI />
            <canvas className="webgl"></canvas>
        </div>
    )
}

export default App;