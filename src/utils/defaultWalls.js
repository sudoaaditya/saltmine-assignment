
const triangleData = {
    wallCount: 3,
    wallPositions: [
        [0, 0, 10, 0],
        [10, 0, 5, 10],
        [5, 10, 0, 0]
    ]
}

const squareData = {
    wallCount: 4,
    wallPositions: [
        [0, 0, 10, 0],
        [10, 0, 10, 10],
        [10, 10, 0, 10],
        [0, 10, 0, 0]
    ]
}

const reactangleData = {
    wallCount: 4,
    wallPositions: [
        [0, 0, 15, 0],
        [15, 0, 15, 10],
        [15, 10, 0, 10],
        [0, 10, 0, 0]
    ]
}

const pentagonData = {
    wallCount: 5,
    wallPositions: [
        [5, 0, 10, 3],
        [10, 3, 8, 8],
        [8, 8, 2, 8],
        [2, 8, 0, 3],
        [0, 3, 5, 0]
    ]
}

const hexagonData = {
    wallCount: 6,
    wallPositions: [
        [3, 0, 7, 0],
        [7, 0, 10, 5],
        [10, 5, 7, 10],
        [7, 10, 3, 10],
        [3, 10, 0, 5],
        [0, 5, 3, 0]
    ]
}


const defaultData = {
    triangle: triangleData,
    square: squareData,
    rectangle: reactangleData,
    pentagon: pentagonData,
    hexagon: hexagonData
}

export { defaultData };