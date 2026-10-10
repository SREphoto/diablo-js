import { CONFIG } from '../config.js';
import { level } from './levelData.js';

export class World {
    constructor() {
        this.data = level;
    }

    isWayWall(x, y) {
        var s = CONFIG.s;
        var block_x = Math.floor(x / s);
        var block_y = Math.floor(y / s);

        // Check if outside map or walking into empty void
        if (!this.data.floor.map[block_y] || !this.data.floor.map[block_y][block_x]) {
            return false;
        }
        if (this.data.floor.map[block_y][block_x] === 0) {
            return false;
        }

        var ix = Math.floor((x % s) / (s / 5));
        var iy = 4 - Math.floor((y % s) / (s / 5));
        var w_inx = iy * 5 + ix, idx, h;

        for (var l in this.data) {
            if (this.data[l].map[block_y] && (idx = this.data[l].map[block_y][block_x]) && (h = this.data[l].header[idx])) {
                if (h.walk && h.walk[w_inx] === 1) return false;
                else if (h.orientation === 3) {
                    for (var idx2 in this.data.wall.header) {
                        var tb = this.data.wall.header[idx2];
                        if (tb.main_index === h.main_index && tb.sub_index === h.sub_index && tb.orientation === 4 && h.walk && h.walk[w_inx] === 1) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    randomx() {
        return Math.floor((Math.random() * (this.data.floor.map[0].length - 4) + 2) * CONFIG.s);
    }

    randomy() {
        return Math.floor((Math.random() * (this.data.floor.map.length - 4) + 2) * CONFIG.s);
    }

    // Helper to get random valid floor point
    getRandomWalkablePoint() {
        const s = CONFIG.s;
        for (let tries = 0; tries < 100; tries++) {
            const rx = Math.floor(Math.random() * this.data.floor.map[0].length);
            const ry = Math.floor(Math.random() * this.data.floor.map.length);
            if (this.data.floor.map[ry] && this.data.floor.map[ry][rx] > 0) {
                const wx = rx * s + s / 2;
                const wy = ry * s + s / 2;
                if (this.isWayWall(wx, wy)) {
                    return { x: wx, y: wy };
                }
            }
        }
        return { x: 5 * s, y: 5 * s };
    }
}
