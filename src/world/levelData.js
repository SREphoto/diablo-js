import { loadImage } from '../utils.js';

// Shared wall headers & prefixes
const wallHeader = {
    276: { orientation: 8, main_index: 5, sub_index: 2, direction: 1, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0,] },
    372: { orientation: 2, main_index: 5, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,] },
    468: { orientation: 1, main_index: 5, sub_index: 0, direction: 1, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0,] },
    564: { orientation: 2, main_index: 5, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,] },
    660: { orientation: 2, main_index: 5, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1,] },
    756: { orientation: 1, main_index: 5, sub_index: 0, direction: 1, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0,] },
    852: { orientation: 1, main_index: 5, sub_index: 0, direction: 1, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0,] },
    948: { orientation: 3, main_index: 5, sub_index: 0, direction: 3, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1,] },
    1044: { orientation: 4, main_index: 5, sub_index: 0, direction: 3, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1,] },
    1140: { orientation: 7, main_index: 5, sub_index: 0, direction: 4, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0,] },
    1428: { orientation: 8, main_index: 5, sub_index: 0, direction: 1, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,] },
    1524: { orientation: 8, main_index: 5, sub_index: 1, direction: 1, walk: [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0,] },
    2004: { orientation: 6, main_index: 5, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1,] },
    2100: { orientation: 5, main_index: 5, sub_index: 0, direction: 1, walk: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0,] },
};

const objectHeader = {
    4116: { orientation: 2, main_index: 9, sub_index: 1, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,] },
    4212: { orientation: 2, main_index: 9, sub_index: 0, direction: 2, walk: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,] },
};

// --- FLOOR 1: THE CATHEDRAL (Cathedral stone, Monastery halls) ---
function createFloor1() {
    const W = 32, H = 26;
    const floorMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const wallMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const objectMap = Array.from({ length: H }, () => new Array(W).fill(0));

    function carve(x1, y1, x2, y2, tile = 756) {
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                floorMap[y][x] = (x + y) % 6 === 0 ? 1140 : tile;
            }
        }
    }

    // Rooms & Corridors
    carve(2, 2, 10, 8); // Sanctuary
    carve(10, 4, 16, 6); // Corridor East
    carve(16, 2, 29, 10); // Crypt of Bones
    carve(5, 8, 7, 16); // Corridor South
    carve(2, 16, 12, 24); // Tomb Room
    carve(12, 19, 18, 21); // Corridor SE
    carve(18, 14, 30, 24); // Leoric's Chamber
    carve(22, 10, 24, 14); // Corridor NE-SE

    // Perimeter walls
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

    objectMap[4][4] = 4212;
    objectMap[4][8] = 4116;
    objectMap[5][22] = 4212;
    objectMap[5][26] = 4116;
    objectMap[18][22] = 4212;
    objectMap[18][26] = 4116;

    return { floorMap, wallMap, objectMap };
}

// --- FLOOR 2: THE CATACOMBS (Ancient crypt labyrinth) ---
function createFloor2() {
    const W = 32, H = 26;
    const floorMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const wallMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const objectMap = Array.from({ length: H }, () => new Array(W).fill(0));

    function carve(x1, y1, x2, y2) {
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                floorMap[y][x] = (x + y) % 5 === 0 ? 1908 : 660;
            }
        }
    }

    // Catacomb maze chambers
    carve(3, 3, 11, 9); // Entry Tomb
    carve(11, 5, 20, 7); // Hall of Tombs
    carve(20, 2, 29, 12); // Sister Coven
    carve(23, 12, 26, 17); // Sinking Passage
    carve(14, 15, 29, 23); // Bishibosh Den
    carve(8, 18, 14, 20); // Western Passage
    carve(2, 14, 9, 23); // Altar of Skulls
    carve(5, 9, 7, 14); // North-South link

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

    objectMap[6][6] = 4212;
    objectMap[6][24] = 4116;
    objectMap[18][22] = 4212;

    return { floorMap, wallMap, objectMap };
}

// --- FLOOR 3: THE LAIR OF HELL (The Butcher's Blood Sanctuary) ---
function createFloor3() {
    const W = 32, H = 26;
    const floorMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const wallMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const objectMap = Array.from({ length: H }, () => new Array(W).fill(0));

    function carve(x1, y1, x2, y2) {
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                floorMap[y][x] = (x + y) % 4 === 0 ? 372 : 756;
            }
        }
    }

    // Great Hall of Demonic Sacrifice
    carve(2, 2, 8, 8); // Hell Entrance
    carve(8, 4, 14, 6); // Fire Corridor
    carve(14, 2, 29, 11); // Cleaver Chamber
    carve(21, 11, 23, 16); // Descent Passage
    carve(8, 14, 30, 24); // THE BUTCHER'S LAIR (Grand Hall)
    carve(2, 16, 8, 22); // Ritual Pentagram
    carve(4, 8, 6, 16); // West Corridor

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

    // Pillars flanking the Butcher's Throne
    objectMap[16][12] = 4212;
    objectMap[16][26] = 4116;
    objectMap[22][12] = 4212;
    objectMap[22][26] = 4116;

    return { floorMap, wallMap, objectMap };
}

// --- FLOOR 0: THE TOWN OF TRISTRAM (Safe Sanctuary, Vendors & Stash) ---
function createTown() {
    const W = 36, H = 30;
    const floorMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const wallMap = Array.from({ length: H }, () => new Array(W).fill(0));
    const objectMap = Array.from({ length: H }, () => new Array(W).fill(0));

    function carve(x1, y1, x2, y2, tile = 756) {
        for (let y = y1; y <= y2; y++) {
            for (let x = x1; x <= x2; x++) {
                floorMap[y][x] = (x + y) % 3 === 0 ? 1140 : tile;
            }
        }
    }

    // Town Square (Central Cobblestone Plaza)
    carve(10, 10, 24, 22, 1140);
    // West District (Griswold Blacksmith Quarter)
    carve(3, 11, 10, 21, 756);
    // East District (Adria & Pepin Mystic Grove)
    carve(24, 11, 32, 21, 756);
    // North Road (Deckard Cain & Waypoint Portal)
    carve(13, 3, 21, 10, 1140);
    // South Road (Gate towards Cathedral descent)
    carve(13, 22, 21, 27, 1140);

    // Perimeter walls
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

    // Town Square Monuments
    objectMap[10][10] = 4212;
    objectMap[10][24] = 4116;
    objectMap[22][10] = 4212;
    objectMap[22][24] = 4116;

    return { floorMap, wallMap, objectMap };
}

function assembleLevelPackage(mapData) {
    return {
        floor: {
            prefix: "dttool/output/1/",
            map: mapData.floorMap,
            header: {
                372: false,
                660: false,
                756: false,
                1140: false,
                1908: false,
            }
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
export const level = DUNGEON_LEVELS[1];
