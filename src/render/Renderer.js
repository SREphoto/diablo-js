
import { CONFIG } from '../config.js';

export class Renderer {
    constructor(canvasId, width, height) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = width || 980;
        this.canvas.height = height || 661;
        this.w = this.canvas.width;
        this.h = this.canvas.height;

        // Context properties used in original
        this.ctx.w = this.w;
        this.ctx.h = this.h;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Helper to gather objects for rendering or clicking
    // scene: { hero, monsters, potions, barrels, walls, coins, deathmobs }
    getZBuffer(scene, order = false, click = false) {
        var hero = scene.hero;
        var tmp_zb = [], zb = [];

        // Groups that are partially occluded or sorted
        // Original: var all=[monsters,potions,barrels,click?[]:[hero],click?[]:walls];
        var all = [
            scene.monsters,
            scene.potions,
            scene.barrels,
            click ? [] : [hero],
            click ? [] : scene.walls
        ];

        for (var t in all) {
            for (var m in all[t]) {
                var entity = all[t][m];
                if (entity && entity.isAboveHero(hero)) {
                    tmp_zb.push(entity);
                }
            }
        }

        // Sort by depth (isometric depth basically y+x)
        // b.x+b.y vs a.x+a.y with offsets
        // Original: (b.x+b.offset_x)+(b.y+b.offset_y)-(a.x+a.offset_x)-(a.y+a.offset_y)
        tmp_zb.sort(function (a, b) {
            var val = (b.x + b.offset_x) + (b.y + b.offset_y) - (a.x + a.offset_x) - (a.y + a.offset_y);
            return order ? val : -val; // Descending for Z-buffer if order false? Wait.
            // Original: return order?c:0-c
            // if order=false (default renderObjects), it returns 0-c (ascending? a-b)
            // if c > 0 (b > a), 0-c is negative (a < b). So a comes before b.
        });

        // Add background/flat items?
        // Original: var all=[coins,deathmobs,tmp_zb];
        var finalGroups = [scene.coins, scene.deathmobs, tmp_zb];
        for (var i in finalGroups) {
            for (var j in finalGroups[i]) {
                zb.push(finalGroups[i][j]);
            }
        }
        return zb;
    }

    renderFloor(scene, level) {
        var ctx = this.ctx;
        var hero = scene.hero;
        var th = CONFIG.th;
        var s = CONFIG.s;
        var visible = CONFIG.visible;

        ctx.save();
        ctx.translate(this.w / 2 - th, this.h / 2); // translate to center

        var fdx = Math.floor(hero.x / s); // hero tile
        var fdy = Math.floor(hero.y / s);
        var miny = Math.max(0, fdy - visible);
        var maxy = Math.min(level.floor.map.length - 1, fdy + visible);
        var minx = Math.max(0, fdx - visible);
        var maxx = Math.min(level.floor.map[0].length - 1, fdx + visible);

        // Translate camera to hero
        var mrx = hero.x * CONFIG.acos - hero.y * CONFIG.asin;
        var mry = hero.x * CONFIG.asin + hero.y * CONFIG.acos;
        mry = mry / 2;

        ctx.translate(-mrx, -mry);

        // Render floor tiles
        for (var y = miny; y <= maxy; y++) {
            for (var x = minx; x <= maxx; x++) {
                // We need a helper for getFloorTile
                // assuming scene has it or level object has it. 
                // Creating quick inline helper or expect level to have tiles loaded
                // levelData.js structure: level.floor.map[y][x] -> index -> tiles[index]
                if (!level.floor.map[y] || !level.floor.map[y][x]) continue;
                var f = level.floor.map[y][x];
                var tile = level.floor.tiles[f];

                if (tile) {
                    // if (Math.random() < 0.001) console.log("Drawing tile at", tx, ty, tile.src,                if (tile) {
                    var tx = (x - y) * th;
                    var ty = (x + y) * th / 2;

                    if (tile.width > 0) {
                        ctx.drawImage(tile, tx, ty, tile.width + 0.707, tile.height + 0.707);
                    } else {
                        // Fallback: Asset loaded but no dimensions yet? or broken.
                        // Draw a placeholder floor tile
                        ctx.fillStyle = "#222";
                        ctx.strokeStyle = "#444";
                        ctx.beginPath();
                        ctx.moveTo(tx, ty + th / 2); // Top
                        ctx.lineTo(tx + th, ty); // Right
                        ctx.lineTo(tx, ty - th / 2); // Bottom
                        ctx.lineTo(tx - th, ty); // Left
                        ctx.closePath();
                        ctx.fill();
                        ctx.stroke();
                    }
                } else {
                    // if (Math.random() < 0.001) console.log("Missing tile for", f);
                }
            }
        }

        ctx.translate(th, 0);
        this.renderObjects(scene, hero);
        ctx.restore();
    }

    renderObjects(scene, hero) {
        var ctx = this.ctx;
        var zb = this.getZBuffer(scene, false); // false = sort back-to-front

        for (var z in zb) {
            var m = zb[z];
            if (!m) continue;

            ctx.save();
            var sx = (m.x - m.y) * CONFIG.acos + m.offset_x;
            var sy = (m.x + m.y) / 2 * CONFIG.asin + m.offset_y;
            var tile = m.sprite;

            // render sprite
            var tw = tile.width;
            var th_img = tile.height;
            if (tile.steps && tile.angles) {
                tw /= tile.steps;
                th_img /= tile.angles;

                if (tw > 0 && th_img > 0) {
                    ctx.drawImage(tile,
                        tw * m.step, th_img * m.angle, tw, th_img,
                        Math.round(sx - tw / 2 - (tile.offsetX || 0)), Math.round(sy - th_img), tw, th_img);
                } else {
                    // Fallback for missing sprite
                    ctx.fillStyle = (m === hero) ? "cyan" : "red";
                    ctx.fillRect(sx - 10, sy - 40, 20, 40);
                }
            } else {
                if (tile.width > 0) {
                    ctx.drawImage(tile, Math.round(sx - tile.width / 2) + 1, Math.round(sy - tile.height) + 1);
                } else {
                    ctx.fillStyle = "yellow";
                    ctx.fillRect(sx - 5, sy - 5, 10, 10);
                }
            }

            // Entity Spotlight / Selection
            if (m === hero) {
                ctx.save();
                ctx.globalAlpha = 0.4;
                var gradient = ctx.createRadialGradient(sx, sy, 5, sx, sy, 30);
                gradient.addColorStop(0, "rgba(255, 255, 0, 0.5)");
                gradient.addColorStop(1, "rgba(255, 255, 0, 0)");
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(sx, sy, 35, 12, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
            ctx.restore();

            // Health bars
            if (m.health && m.origin_health && m !== hero && m.health < m.origin_health) {
                ctx.save();
                ctx.globalAlpha = 0.7;
                sy -= 90;
                var lm = Math.floor(m.origin_health / 20);
                var lr = Math.floor(m.health / 20);
                ctx.fillStyle = "black";
                ctx.fillRect(sx - lm / 2 - 1, sy, lm + 2, 6);
                ctx.fillStyle = "red";
                ctx.fillRect(sx - lm / 2, sy + 1, lr, 4);
                ctx.restore();
            }
        }
    }

    renderMap(scene, level) {
        var ctx = this.ctx;
        var hero = scene.hero;
        var s = CONFIG.s;

        ctx.save();
        ctx.translate(this.w / 2, this.h / 2);
        var sc = 0.5;
        ctx.scale(1 * sc, 0.5 * sc);
        ctx.rotate(Math.PI * 0.25);
        ctx.translate(-hero.x, -hero.y);
        ctx.fillStyle = "rgba(0,0,0,0.5)";

        // Caching offsets or calculating
        var wallOffset = [];
        for (var y = 4; y >= 0; y--) for (var x = 0; x <= 4; x++) wallOffset.push({ x: x * s / 5, y: y * s / 5 });

        for (var i in scene.walls) {
            var v = scene.walls[i];
            var walk = v.header.walk;
            if (v.header.orientation == 4) continue;
            for (var j = 0; j < 25; j++) if (walk[j] == 1) ctx.fillRect(v.x + wallOffset[j].x, v.y + wallOffset[j].y, s / 5, s / 5);
        }
        ctx.fillRect(hero.x, hero.y, s / 5, s / 5);
        ctx.restore();
    }
}
