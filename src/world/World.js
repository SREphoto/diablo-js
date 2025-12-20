
import { CONFIG } from '../config.js';
import { level } from './levelData.js';

export class World {
    constructor() {
        this.data = level;
    }

    isWayWall(x, y) {
        var s = CONFIG.s;
        var block_x = Math.floor(x / s),
            block_y = Math.floor(y / s),
            ix = Math.floor((x % s) / (s / 5)),
            iy = 4 - Math.floor((y % s) / (s / 5)), // Original: 4-Math.floor...
            w_inx = iy * 5 + ix, idx, h;

        for (var l in this.data) {
            if (this.data[l].map[block_y] && (idx = this.data[l].map[block_y][block_x]) && (h = this.data[l].header[idx])) {
                if (h.walk[w_inx] == 1) return false;
                else if (h.orientation == 3) {
                    for (var idx2 in this.data.wall.header) {
                        var tb = this.data.wall.header[idx2];
                        if (tb.main_index == h.main_index && tb.sub_index == h.sub_index && tb.orientation == 4 && h.walk[w_inx] == 1) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }

    randomx() {
        return Math.floor(Math.random() * (this.data.floor.map[0].length) * CONFIG.s);
    }

    randomy() {
        return Math.floor(Math.random() * (this.data.floor.map.length) * CONFIG.s);
    }
}
