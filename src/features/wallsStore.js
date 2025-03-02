
import { create } from 'zustand';

import { defaultData } from '../utils/defaultWalls';

const useWallsStore = create((set) => ({
    defaultShape: 'square',
    wallCount: defaultData.square.wallCount,
    wallPositions: defaultData.square.wallPositions,
    updateDefaultShape: (shape) => set({ defaultShape: shape, wallCount: defaultData[shape].wallCount, wallPositions: defaultData[shape].wallPositions }),
    updateWallCount: (count) => set({ wallCount: count }),
    updateWallPositions: (positions) => set({ wallPositions: positions }),
}));

export default useWallsStore;
