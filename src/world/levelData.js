import { loadImage } from '../utils.js';

// All 27 authentic Diablo 1 wall headers with exact orientations and walk collision bitmasks
const wallHeader = {
    276: { orientation: 8, main_index: 5, sub_index: 2, direction: 1, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
    372: { orientation: 2, main_index: 5, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1] },
    468: { orientation: 1, main_index: 5, sub_index: 0, direction: 1, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
    564: { orientation: 2, main_index: 5, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1] },
    660: { orientation: 2, main_index: 5, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1] },
    756: { orientation: 1, main_index: 5, sub_index: 0, direction: 1, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
    852: { orientation: 1, main_index: 5, sub_index: 0, direction: 1, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
    948: { orientation: 3, main_index: 5, sub_index: 0, direction: 3, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1] },
    1044: { orientation: 4, main_index: 5, sub_index: 0, direction: 3, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1] },
    1140: { orientation: 7, main_index: 5, sub_index: 0, direction: 4, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    1236: { orientation: 9, main_index: 5, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1] },
    1332: { orientation: 9, main_index: 5, sub_index: 1, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0] },
    1428: { orientation: 8, main_index: 5, sub_index: 0, direction: 1, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    1524: { orientation: 8, main_index: 5, sub_index: 1, direction: 1, walk: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
    1620: { orientation: 9, main_index: 5, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1] },
    1716: { orientation: 9, main_index: 5, sub_index: 1, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0] },
    1812: { orientation: 8, main_index: 5, sub_index: 1, direction: 1, walk: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
    1908: { orientation: 8, main_index: 5, sub_index: 0, direction: 1, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    2004: { orientation: 6, main_index: 5, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1] },
    2100: { orientation: 5, main_index: 5, sub_index: 0, direction: 1, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    2196: { orientation: 6, main_index: 5, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1] },
    2292: { orientation: 5, main_index: 5, sub_index: 0, direction: 1, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    2388: { orientation: 2, main_index: 5, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1] },
    2484: { orientation: 1, main_index: 5, sub_index: 0, direction: 1, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
    2580: { orientation: 3, main_index: 5, sub_index: 0, direction: 3, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1] },
    2676: { orientation: 4, main_index: 5, sub_index: 0, direction: 3, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1] },
    2772: { orientation: 12, main_index: 5, sub_index: 0, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
};

// All 59 authentic Diablo 1 architectural object headers (columns, tombs, altars, candelabras, gargoyles, statues)
const objectHeader = {
    276: { orientation: 2, main_index: 9, sub_index: 12, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0] },
    372: { orientation: 2, main_index: 9, sub_index: 11, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    468: { orientation: 12, main_index: 50, sub_index: 0, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0] },
    564: { orientation: 12, main_index: 9, sub_index: 33, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0] },
    660: { orientation: 1, main_index: 9, sub_index: 33, direction: 1, walk: [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0] },
    756: { orientation: 7, main_index: 9, sub_index: 33, direction: 4, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0] },
    852: { orientation: 12, main_index: 9, sub_index: 32, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
    948: { orientation: 12, main_index: 9, sub_index: 31, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0] },
    1044: { orientation: 1, main_index: 9, sub_index: 10, direction: 1, walk: [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    1140: { orientation: 1, main_index: 9, sub_index: 9, direction: 1, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    1236: { orientation: 1, main_index: 9, sub_index: 8, direction: 1, walk: [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    1332: { orientation: 12, main_index: 9, sub_index: 11, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
    1428: { orientation: 12, main_index: 9, sub_index: 10, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
    1524: { orientation: 12, main_index: 9, sub_index: 9, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    1620: { orientation: 12, main_index: 9, sub_index: 8, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    1716: { orientation: 12, main_index: 9, sub_index: 7, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0] },
    1812: { orientation: 12, main_index: 9, sub_index: 6, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0] },
    1908: { orientation: 12, main_index: 9, sub_index: 5, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0] },
    2004: { orientation: 12, main_index: 9, sub_index: 4, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0] },
    2100: { orientation: 12, main_index: 9, sub_index: 3, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0] },
    2196: { orientation: 12, main_index: 9, sub_index: 2, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0] },
    2292: { orientation: 12, main_index: 9, sub_index: 1, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0] },
    2388: { orientation: 12, main_index: 9, sub_index: 0, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0] },
    2484: { orientation: 2, main_index: 9, sub_index: 10, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    2580: { orientation: 2, main_index: 9, sub_index: 9, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    2676: { orientation: 2, main_index: 9, sub_index: 8, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    2772: { orientation: 2, main_index: 9, sub_index: 7, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0] },
    2868: { orientation: 2, main_index: 9, sub_index: 6, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0] },
    2964: { orientation: 1, main_index: 9, sub_index: 7, direction: 1, walk: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
    3060: { orientation: 1, main_index: 9, sub_index: 6, direction: 1, walk: [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    3156: { orientation: 2, main_index: 9, sub_index: 5, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0] },
    3252: { orientation: 2, main_index: 9, sub_index: 4, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0] },
    3348: { orientation: 1, main_index: 9, sub_index: 5, direction: 1, walk: [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    3444: { orientation: 1, main_index: 9, sub_index: 4, direction: 1, walk: [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    3540: { orientation: 12, main_index: 9, sub_index: 30, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0] },
    3636: { orientation: 12, main_index: 9, sub_index: 29, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0] },
    3732: { orientation: 1, main_index: 9, sub_index: 3, direction: 1, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    3828: { orientation: 1, main_index: 9, sub_index: 2, direction: 1, walk: [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    3924: { orientation: 2, main_index: 9, sub_index: 3, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1] },
    4020: { orientation: 2, main_index: 9, sub_index: 2, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    4116: { orientation: 2, main_index: 9, sub_index: 1, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    4212: { orientation: 2, main_index: 9, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
    4308: { orientation: 1, main_index: 9, sub_index: 1, direction: 1, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    4404: { orientation: 1, main_index: 9, sub_index: 0, direction: 1, walk: [1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    4500: { orientation: 12, main_index: 9, sub_index: 28, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0] },
    4596: { orientation: 12, main_index: 9, sub_index: 27, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0] },
    4692: { orientation: 12, main_index: 9, sub_index: 24, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    4788: { orientation: 12, main_index: 9, sub_index: 23, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    4884: { orientation: 12, main_index: 9, sub_index: 22, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0] },
    4980: { orientation: 12, main_index: 9, sub_index: 21, direction: 3, walk: [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0] },
    5076: { orientation: 12, main_index: 9, sub_index: 20, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
    5172: { orientation: 12, main_index: 9, sub_index: 17, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    5268: { orientation: 12, main_index: 9, sub_index: 18, direction: 3, walk: [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    5364: { orientation: 12, main_index: 9, sub_index: 19, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0] },
    5460: { orientation: 12, main_index: 9, sub_index: 16, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0] },
    5556: { orientation: 12, main_index: 9, sub_index: 15, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0] },
    5652: { orientation: 12, main_index: 9, sub_index: 13, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0] },
    5748: { orientation: 12, main_index: 9, sub_index: 12, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0] },
    5844: { orientation: 12, main_index: 9, sub_index: 14, direction: 3, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0] },
};

// All 29 authentic Diablo 1 floor tile IDs
const floorHeader = {
    276: false, 372: false, 468: false, 564: false, 660: false,
    756: false, 852: false, 948: false, 1044: false, 1140: false,
    1236: false, 1332: false, 1428: false, 1524: false, 1620: false,
    1716: false, 1812: false, 1908: false, 2004: false, 2100: false,
    2196: false, 2292: false, 2388: false, 2484: false, 2580: false,
    2676: false, 2772: false, 2868: false, 2964: false
};

// Perimeter wall solver
function applyPerimeterWalls(floorMap, wallMap, W, H) {
    for (let y = 1; y < H - 1; y++) {
        for (let x = 1; x < W - 1; x++) {
            if (floorMap[y][x] !== 0) {
                if (floorMap[y - 1][x] === 0) wallMap[y - 1][x] = 372;
                if (floorMap[y + 1][x] === 0) wallMap[y + 1][x] = 2004;
                if (floorMap[y][x - 1] === 0) wallMap[y][x - 1] = 468;
                if (floorMap[y][x + 1] === 0) wallMap[y][x + 1] = 948;
            }
        }
    }
}

// =========================================================================
// FLOOR 0: THE TOWN OF TRISTRAM (48 x 48 Expansive Hub & Sanctum)
// =========================================================================
function createTown() {
    const W = 48, H = 48;
    const floorMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const wallMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const objectMap = Array.from({ length: H }, () => new Array(W).fill(0));

    function carve(x1, y1, x2, y2, baseTile = 756, accentTile = 1140, mod = 4) {
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                floorMap[y][x] = (x + y) % mod === 0 ? accentTile : baseTile;
            }
        }
    }

    // 1. Central Town Square (Cobblestone Grand Plaza)
    carve(16, 16, 32, 32, 1140, 1236, 3);

    // 2. West District: Griswold's Smithy & Forging Yard
    carve(4, 18, 16, 32, 756, 852, 4);
    // Smithy Annex
    carve(6, 12, 14, 18, 756, 1044, 5);

    // 3. East District: Adria's Arcane Grove & Pepin's Healing Glade
    carve(32, 18, 44, 32, 756, 1332, 4);
    // Alchemical Sanctuary
    carve(34, 12, 42, 18, 1140, 1428, 5);

    // 4. North Road & Cathedral Approach (Deckard Cain & Waypoint)
    carve(20, 4, 28, 16, 1140, 1524, 3);
    // Cemetery & Gravesite
    carve(8, 4, 18, 11, 660, 1908, 3);

    // 5. South Road & Riverbank (Cathedral Descent Stairs)
    carve(20, 32, 28, 44, 1140, 1236, 4);
    // River Meadow
    carve(12, 38, 20, 44, 756, 852, 5);
    carve(28, 38, 38, 44, 756, 1044, 5);

    // Build Walls
    applyPerimeterWalls(floorMap, wallMap, W, H);

    // Architectural Monuments & Columns in Town
    // Central Plaza Corners (Ornate Gothic Pillars)
    objectMap[16][16] = 4212;
    objectMap[16][32] = 4116;
    objectMap[32][16] = 4212;
    objectMap[32][32] = 4116;

    // Gate Flanking Columns
    objectMap[5][20] = 4212;
    objectMap[5][28] = 4116;
    objectMap[43][20] = 4212;
    objectMap[43][28] = 4116;

    // Cemetery Tombs
    objectMap[6][10] = 2580;
    objectMap[6][14] = 2676;
    objectMap[9][10] = 2580;
    objectMap[9][14] = 2676;

    // Smithy Anvil Stand & Furnace Pillars
    objectMap[14][10] = 4404;
    objectMap[14][12] = 4308;

    // Witch's Grove Mystic Altars
    objectMap[14][36] = 5652;
    objectMap[14][40] = 5748;

    return { floorMap, wallMap, objectMap };
}

// =========================================================================
// FLOOR 1: THE CATHEDRAL (54 x 54 Monastery Nave, Cloisters & King Leoric)
// =========================================================================
function createFloor1() {
    const W = 54, H = 54;
    const floorMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const wallMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const objectMap = Array.from({ length: H }, () => new Array(W).fill(0));

    function carve(x1, y1, x2, y2, baseTile = 756, accentTile = 1140, mod = 5) {
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                floorMap[y][x] = (x + y) % mod === 0 ? accentTile : baseTile;
            }
        }
    }

    // 1. Entry Vestibule & Monastic Antechamber (Spawn)
    carve(4, 4, 18, 14, 756, 1140, 4);

    // 2. Corridors connecting to Grand Nave
    carve(18, 8, 24, 11, 1140, 1236, 3);

    // 3. The Grand Nave of the Monastery (Vast Central Worship Hall)
    carve(24, 4, 48, 24, 756, 1140, 6);

    // 4. North Crypt & Scriptorium (East Annex)
    carve(34, 4, 50, 14, 852, 1044, 4);

    // 5. West Wing Cloisters & Monk Dormitories
    carve(4, 18, 18, 34, 660, 756, 4);
    carve(10, 14, 14, 18, 1140, 756, 3);

    // 6. Central Transept & Corridor of Martyrs
    carve(18, 26, 30, 30, 1140, 1236, 4);
    carve(26, 24, 30, 36, 1140, 1236, 4);

    // 7. Hall of Sarcophagi (South-West Vault)
    carve(4, 36, 22, 50, 660, 1908, 4);
    carve(12, 34, 16, 36, 1140, 756, 3);

    // 8. THE ROYAL CRYPT: LEORIC'S THRONE ROOM (South-East Grand Chamber)
    carve(28, 32, 50, 50, 756, 1140, 5);

    // 9. Connecting Passages
    carve(22, 42, 28, 46, 1140, 1236, 3);

    applyPerimeterWalls(floorMap, wallMap, W, H);

    // Grand Nave Column Rows (Authentic Gothic Pillars)
    for (let x = 28; x <= 44; x += 6) {
        objectMap[8][x] = 4212;
        objectMap[14][x] = 4116;
        objectMap[20][x] = 4212;
    }

    // Leoric's Crypt Pillars & Sarcophagi
    objectMap[36][34] = 4212;
    objectMap[36][44] = 4116;
    objectMap[44][34] = 4212;
    objectMap[44][44] = 4116;

    // Sarcophagi flanking Leoric
    objectMap[38][40] = 2580;
    objectMap[42][40] = 2676;

    // West Cloister Tombs
    objectMap[40][8] = 2580;
    objectMap[40][14] = 2676;
    objectMap[46][8] = 2580;
    objectMap[46][14] = 2676;

    return { floorMap, wallMap, objectMap };
}

// =========================================================================
// FLOOR 2: THE CATACOMBS (54 x 54 Crypt Maze, Sister Coven & Bishibosh)
// =========================================================================
function createFloor2() {
    const W = 54, H = 54;
    const floorMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const wallMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const objectMap = Array.from({ length: H }, () => new Array(W).fill(0));

    function carve(x1, y1, x2, y2, baseTile = 660, accentTile = 1908, mod = 4) {
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                floorMap[y][x] = (x + y) % mod === 0 ? accentTile : baseTile;
            }
        }
    }

    // 1. Entry Crypt (Spawn from Floor 1)
    carve(4, 4, 16, 14, 660, 1908, 4);

    // 2. Hall of the Dead (North Passage)
    carve(16, 7, 28, 11, 1908, 1812, 3);

    // 3. SISTER COVEN SANCTUARY (North-East Chamber)
    carve(28, 4, 50, 18, 660, 1716, 5);

    // 4. Sinking Corridors (East)
    carve(38, 18, 42, 28, 1908, 660, 3);

    // 5. Central Crypt Maze & Sarcophagus Labyrinth
    carve(16, 18, 36, 34, 660, 1908, 5);
    carve(24, 14, 28, 18, 1908, 660, 3);

    // 6. Desecrated Sacristy (West Wing)
    carve(4, 18, 14, 36, 1812, 660, 4);
    carve(14, 24, 16, 28, 1908, 660, 3);

    // 7. Altar of Skulls (South-West Chamber)
    carve(4, 38, 20, 50, 660, 1908, 4);
    carve(10, 36, 14, 38, 1908, 660, 3);

    // 8. BISHIBOSH'S GOBLIN LAIR (South-East Domain)
    carve(26, 34, 50, 50, 1908, 2004, 4);
    carve(20, 42, 26, 46, 1908, 660, 3);

    applyPerimeterWalls(floorMap, wallMap, W, H);

    // Architectural Props in Catacombs
    // Central Maze Crypt Pillars
    objectMap[22][22] = 4212;
    objectMap[22][30] = 4116;
    objectMap[30][22] = 4212;
    objectMap[30][30] = 4116;

    // Sister Coven Altars & Candelabras
    objectMap[10][34] = 5652;
    objectMap[10][44] = 5748;

    // Bishibosh Camp Sacrificial Stones
    objectMap[42][32] = 4212;
    objectMap[42][44] = 4116;
    objectMap[40][38] = 2580;
    objectMap[44][38] = 2676;

    // Altar of Skulls
    objectMap[44][10] = 5844;
    objectMap[44][14] = 3828;

    return { floorMap, wallMap, objectMap };
}

// =========================================================================
// FLOOR 3: THE LAIR OF HELL (56 x 56 Rivers of Blood & The Butcher)
// =========================================================================
function createFloor3() {
    const W = 56, H = 56;
    const floorMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const wallMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const objectMap = Array.from({ length: H }, () => new Array(W).fill(0));

    function carve(x1, y1, x2, y2, baseTile = 372, accentTile = 756, mod = 3) {
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                floorMap[y][x] = (x + y) % mod === 0 ? accentTile : baseTile;
            }
        }
    }

    // 1. Gateway of Fire (Entrance Vault from Catacombs)
    carve(4, 4, 16, 14, 372, 756, 3);

    // 2. River of Fire / Corridor of Embers
    carve(16, 7, 28, 11, 2388, 372, 4);

    // 3. The Cleaver Chamber & Gibbet Halls (North-East)
    carve(28, 4, 52, 18, 372, 2484, 4);

    // 4. Descent Corridor (East Wall)
    carve(40, 18, 44, 28, 2388, 372, 3);

    // 5. Hall of Pillars & Demonic Sacrifices (Central Core)
    carve(16, 18, 38, 34, 372, 2580, 5);
    carve(24, 14, 28, 18, 2388, 372, 3);

    // 6. The Demonic Pentagram (West Ritual Chamber)
    carve(4, 18, 14, 36, 2676, 372, 4);
    carve(14, 24, 16, 28, 2388, 372, 3);

    // 7. Catwalk of Damnation (South-West Vault)
    carve(4, 38, 20, 52, 372, 2772, 4);
    carve(10, 36, 14, 38, 2388, 372, 3);

    // 8. THE BUTCHER'S GRAND SLAUGHTERHOUSE & THRONE OF BLOOD (Massive SE Lair)
    carve(26, 32, 52, 52, 372, 2964, 4);
    carve(20, 42, 26, 46, 2388, 372, 3);

    applyPerimeterWalls(floorMap, wallMap, W, H);

    // Massive Pillars flanking The Butcher's Domain
    objectMap[38][32] = 4212;
    objectMap[38][46] = 4116;
    objectMap[46][32] = 4212;
    objectMap[46][46] = 4116;

    // Sacrificial Stone Crucibles
    objectMap[42][38] = 5844;
    objectMap[42][40] = 5748;

    // Central Core Pillars
    objectMap[22][22] = 4212;
    objectMap[22][32] = 4116;
    objectMap[30][22] = 4212;
    objectMap[30][32] = 4116;

    // Ritual Pentagram Statues
    objectMap[26][8] = 4404;
    objectMap[28][8] = 4308;

    return { floorMap, wallMap, objectMap };
}

function assembleLevelPackage(mapData) {
    return {
        floor: {
            prefix: "dttool/output/1/",
            map: mapData.floorMap,
            header: floorHeader
        },
        wall: {
            prefix: "dttool/output/0/",
            map: mapData.wallMap,
            header: wallHeader
        },
        object: {
            prefix: "dttool/output/2/",
            map: mapData.objectMap,
            header: objectHeader
        }
    };
}

export const DUNGEON_LEVELS = {
    0: assembleLevelPackage(createTown()),
    1: assembleLevelPackage(createFloor1()),
    2: assembleLevelPackage(createFloor2()),
    3: assembleLevelPackage(createFloor3())
};

// Pre-load tiles across all levels
for (const fl in DUNGEON_LEVELS) {
    const lvl = DUNGEON_LEVELS[fl];
    for (const group in lvl) {
        lvl[group].tiles = {};
        for (const idx in lvl[group].header) {
            lvl[group].tiles[idx] = loadImage(lvl[group].prefix + idx + ".png");
        }
    }
}

// Default initial floor
export const level = DUNGEON_LEVELS[0];
