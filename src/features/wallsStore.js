
import { create } from 'zustand';

import defaultData from '../utils/defaultWalls';

const useWallsStore = create((set) => ({
    wallCount: defaultData.wallCount,
    wallPositions: defaultData.wallPositions,
    updateWallCount: (count) => set({ wallCount: count }),
    updateWallPositions: (positions) => set({ wallPositions: positions }),
}));

export default useWallsStore;
