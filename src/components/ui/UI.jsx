
import { useState, useEffect } from "react";
import useWallsStore from "../../features/wallsStore";

const UI = () => {

    const {
        wallCount, wallPositions, updateWallPositions
    } = useWallsStore();

    // const [wallNumber, setWallNumbers] = useState(wallCount);
    const [walls, setWalls] = useState(wallPositions);

    /* useEffect(() => {
        if(wallNumber !== walls.length) {
            if(wallNumber > walls.length) {
                const newWalls = [...walls];
                for(let i = walls.length; i < wallNumber; i++) {
                    newWalls.push([0, 0, 0, 0]);
                }
                setWalls(newWalls);
            } else {
                const newWalls = [...walls];
                newWalls.splice(wallNumber, walls.length - wallNumber);
                setWalls(newWalls);
            }
        }
    }, [wallNumber]); */

    const invalidWallPositions = () => {
        const bFlag = walls.some(wall => {
            return wall.some(pos => isNaN(pos) || undefined);
        });

        return bFlag;
    }


    const renderInputBoxes = (wall, currentIdx, loopIdx) => {
        return (
            <input
                className="border border-gray-300 p-2 w-12 outline-0"
                type="number"
                value={wall[currentIdx]}
                onChange={(e) => {
                    if (isNaN(e.target.value)) return;
                    const newWalls = [...walls];
                    newWalls[loopIdx][currentIdx] = parseInt(e.target.value);
                    setWalls(newWalls);
                }}
            />
        )
    }

    return (
        <div className="flex-col absolute top-0 right-0 w-80 p-4 bg-gray-200 my-4 mx-2 rounded-sm z-40">
            <h5 className="font-bold font-poppins text-xl">Wall Positions Configurator</h5>

            {/* <div className="flex flex-row items-center justify-between mt-4">
                <label className="block font-bold">Number of Walls</label>
                <input

                    className="border border-gray-300 p-2 w-12 outline-0"
                    type="number"
                    value={wallNumber}
                    onChange={(e) => {
                        if (isNaN(e.target.value)) return;
                        setWallNumbers(parseInt(e.target.value));
                    }}
                />
            </div> */}

            {wallCount > 0 && (
                <div className="flex flex-col mt-4">
                    <div className="flex flex-row items-center justify-between">
                        <span className="block text-center">Wall No</span>
                        <span className="font-semibold text-center">X1</span>
                        <span className="font-semibold text-center">Y1</span>
                        <span className="font-semibold text-center">X2</span>
                        <span className="font-semibold text-center">Y2</span>
                    </div>
                    {walls.map((wall, index) => (
                        <div key={index} className="flex flex-row items-center justify-between">
                            <label className="block font-bold">Wall {index + 1}</label>
                            <div className="flex flex-row">
                                {renderInputBoxes(wall, 0, index)}
                                {renderInputBoxes(wall, 1, index)}
                                {renderInputBoxes(wall, 2, index)}
                                {renderInputBoxes(wall, 3, index)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button
                className={`
                    bg-blue-500 h-8 px-2 py-1 text-white mt-4 rounded-md 
                    ${wallCount === 0 || invalidWallPositions() ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-600'}
                `}
                onClick={() => {
                    updateWallPositions(walls);
                }}
                disabled={wallCount === 0 || invalidWallPositions()}
            >
                <span className="text-sm">Update Walls</span>
            </button>
        </div>
    );
}

export default UI;