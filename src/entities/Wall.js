
import { Entity } from './Entity.js';
import { level } from '../world/levelData.js';
import { load } from '../utils.js';

export class BaseWall extends Entity {
    constructor(sprite, header, x, y) {
        super(sprite, x, y);
        this.name = "Wall";
        this.header = header;
        this.offset_x -= 14;
        this.offset_y += 82;
    }

    isAboveHero() {
        return true;
    }
}

export class Wall extends BaseWall {
    constructor(index, x, y, extraWallsRegistry, levelData = level) {
        const lvl = levelData || level;
        super((lvl.wall.tiles && lvl.wall.tiles[index]) || new Image(), (lvl.wall.header && lvl.wall.header[index]) || { orientation: 0, walk: [] }, x, y);

        if (!this.header) {
            this.header = { orientation: 0, walk: [] };
        }

        switch (this.header.orientation) {
            case 2:
            case 6:
                this.offset_x += 16;
                break;
            case 5:
            case 4:
                this.offset_x -= 16;
                break;
            case 3:
                // Handle the "corner" case
                if (extraWallsRegistry) {
                    for (var inx in lvl.wall.header) {
                        var h = lvl.wall.header[inx];
                        if (h.orientation == 4 && h.main_index == this.header.main_index && h.sub_index == this.header.sub_index) {
                            extraWallsRegistry.push(new Wall(inx, x, y, extraWallsRegistry, lvl));
                            break;
                        }
                    }
                }
                this.offset_x += 16;
                break;
        }
    }
}

export class WallObject extends BaseWall {
    constructor(index, x, y, levelData = level) {
        const lvl = levelData || level;
        super((lvl.object.tiles && lvl.object.tiles[index]) || new Image(), (lvl.object.header && lvl.object.header[index]) || { orientation: 0, walk: [] }, x, y);
        this.name = "Object";
        this.offset_x += 16;
        var self = this;
        // Adjust offset after image loads if needed
        load(this.sprite, function () {
            if (self.sprite.width < 160) {
                self.offset_x -= (160 - self.sprite.width) / 2;
            }
        });
    }
}
