import { useRef } from "react";
import { useEffect } from "react";
import { Sketch } from "./experience/Sketch";


const App = () => {

    const sketch = useRef(null);

    useEffect(() => {
        sketch.current = new Sketch(document.querySelector('.webgl'));
    }, []);

    return (
        <div>
            <canvas className="webgl"></canvas>
        </div>
    )
}

export default App;