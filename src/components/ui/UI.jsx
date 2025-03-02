
import { useState, useEffect } from "react";
import { ChevronDown } from "react-feather";
import useWallsStore from "../../features/wallsStore";
import { defaultData } from "../../utils/defaultWalls";

const UI = () => {

    const {
        wallCount, wallPositions, updateWallPositions, updateWallCount
    } = useWallsStore();

    const [wallNumber, setWallNumbers] = useState(wallCount);
    const [walls, setWalls] = useState(wallPositions);
    const [showUI, setShowUI] = useState(true);

    useEffect(() => {
        if (wallNumber !== walls.length) {
            if (wallNumber > walls.length) {
                const newWalls = [...walls];
                for (let i = walls.length; i < wallNumber; i++) {
                    newWalls.push([0, 0, 0, 0]);
                }
                setWalls(newWalls);
            } else {
                const newWalls = [...walls];
                newWalls.splice(wallNumber, walls.length - wallNumber);
                setWalls(newWalls);
            }
        }
    }, [wallNumber]);

    const invalidWallPositions = () => {
        const bFlag = walls.some(wall => {
            return wall.some(pos => isNaN(pos) || undefined);
        });

        return bFlag;
    }


    const renderInputBoxes = (wall, currentIdx, loopIdx) => {
        return (
            <input
                className="border border-gray-300 p-2 w-12 outline-0 font-[poppins]"
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
            <div className="flex flex-row items-center justify-between">
                <h5 className="font-bold font-[poppins] text-lg">Wall Positions Configurator</h5>
                <ChevronDown className={`cursor-pointer ${showUI ? "rotate-0" : "rotate-180"}`} onClick={() => setShowUI(prev => !prev)} />
            </div>

            {(showUI) && (
                <>
                    <div className="flex flex-row items-center justify-between mt-4">
                        <label className="block font-bold">Number of Walls</label>
                        <input
                            className="border border-gray-300 p-2 w-12 outline-0 font-[poppins]"
                            type="number"
                            value={wallNumber}
                            onChange={(e) => {
                                if (isNaN(e.target.value)) return;
                                setWallNumbers(parseInt(e.target.value));
                            }}
                        />
                    </div>

                    {wallCount > 0 && (
                        <div className="flex flex-col mt-4">
                            <div className="flex flex-row items-center justify-between">
                                <span className="block text-center">Wall No</span>
                                <span className="font-[poppins] font-semibold text-center">X1</span>
                                <span className="font-[poppins] font-semibold text-center">Y1</span>
                                <span className="font-[poppins] font-semibold text-center">X2</span>
                                <span className="font-[poppins] font-semibold text-center">Y2</span>
                            </div>
                            {walls.map((wall, index) => (
                                <div key={index} className="flex flex-row items-center justify-between">
                                    <label className="block font-bold font-[poppins]">Wall {index + 1}</label>
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

                    <div className="flex flex-row items-center justify-between mt-4">
                        <button
                            className={`
                    bg-blue-500 h-8 px-2 py-1 text-white mt-4 rounded-md font-[poppins] 
                    ${wallCount === 0 || invalidWallPositions() ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-600'}
                `}
                            onClick={() => {
                                updateWallCount(wallNumber);
                                updateWallPositions(walls);
                            }}
                            disabled={wallCount === 0 || invalidWallPositions()}
                        >
                            <span className="text-sm">Update Walls</span>
                        </button>
                        <button
                            className={`
                    bg-blue-500 h-8 px-2 py-1 text-white mt-4 rounded-md font-[poppins] 
                    ${wallCount === 0 || invalidWallPositions() ? 'bg-gray-300 cursor-not-allowed' : 'cursor-pointer hover:bg-blue-600'}
                `}
                            onClick={() => {
                                updateWallCount(defaultData.square.wallCount);
                                updateWallPositions(defaultData.square.wallPositions);
                                setWallNumbers(defaultData.square.wallCount);
                                setWalls(defaultData.square.wallPositions);
                            }}
                            disabled={wallCount === 0 || invalidWallPositions()}
                        >
                            <span className="text-sm">Reset Shape</span>
                        </button>
                    </div>
                </>
            )}

            <h5 className="font-bold font-[poppins] text-lg mt-4">Default Shapes</h5>
            <div className="flex flex-col mt-2">
                {Object.keys(defaultData).map((shape, index) => (
                    <button
                        key={index}
                        className="bg-blue-500 h-8 px-2 py-1 text-white mt-2 rounded-md font-[poppins] cursor-pointer hover:bg-blue-600"
                        onClick={() => {
                            updateWallCount(defaultData[shape].wallCount);
                            updateWallPositions(defaultData[shape].wallPositions);
                            setWallNumbers(defaultData[shape].wallCount);
                            setWalls(defaultData[shape].wallPositions);
                        }}
                    >
                        <span className="text-sm capitalize">{shape}</span>
                    </button>
                ))}
            </div>

        </div>
    );
}

export default UI;