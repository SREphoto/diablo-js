
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
    constructor(index, x, y, extraWallsRegistry) {
        super(level.wall.tiles[index], level.wall.header[index], x, y);

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
                // Handle the "corner" case or whatever this is
                if (extraWallsRegistry) {
                    for (var inx in level.wall.header) {
                        var h = level.wall.header[inx];
                        if (h.orientation == 4 && h.main_index == this.header.main_index && h.sub_index == this.header.sub_index) {
                            // Recursively create the new wall and add it
                            // We need to be careful not to infinite loop if that was possible, but original code did this.
                            extraWallsRegistry.push(new Wall(inx, x, y, extraWallsRegistry));
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
    constructor(index, x, y) {
        super(level.object.tiles[index], level.object.header[index], x, y);
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
