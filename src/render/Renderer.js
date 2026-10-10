import { CONFIG } from '../config.js';

export class Renderer {
    constructor(canvasId, width, height) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.width = width || 980;
        this.canvas.height = height || 661;
        this.w = this.canvas.width;
        this.h = this.canvas.height;

        this.ctx.w = this.w;
        this.ctx.h = this.h;

        // Floating combat texts
        this.floatingTexts = [];
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    addFloatingText(text, x, y, color = '#ffffff') {
        this.floatingTexts.push({
            text: text,
            x: x,
            y: y,
            color: color,
            alpha: 1.0,
            offsetY: 0,
            life: 30
        });
    }

    getZBuffer(scene, order = false, click = false) {
        var hero = scene.hero;
        var tmp_zb = [], zb = [];

        var all = [
            scene.monsters,
            scene.npcs || [],
            scene.potions,
            scene.barrels,
            scene.chests || [],
            scene.shrines || [],
            scene.portals || [],
            scene.stairs || [],
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

        tmp_zb.sort(function (a, b) {
            var val = (b.x + (b.offset_x || 0)) + (b.y + (b.offset_y || 0)) - (a.x + (a.offset_x || 0)) - (a.y + (a.offset_y || 0));
            return order ? val : -val;
        });

        // Add ground items and corpses at bottom layer
        var groundGroups = [scene.coins, scene.items || [], scene.deathmobs];
        for (var i in groundGroups) {
            for (var j in groundGroups[i]) {
                var it = groundGroups[i][j];
                if (it && it.isAboveHero(hero)) {
                    zb.push(it);
                }
            }
        }

        for (var k in tmp_zb) {
            zb.push(tmp_zb[k]);
        }

        return zb;
    }

    renderFloor(scene, level) {
        var ctx = this.ctx;
        var hero = scene.hero;
        var th = CONFIG.th;
        var s = CONFIG.s;
        var visible = CONFIG.visible + 3;

        ctx.save();
        ctx.translate(this.w / 2 - th, this.h / 2);

        var fdx = Math.floor(hero.x / s);
        var fdy = Math.floor(hero.y / s);
        var miny = Math.max(0, fdy - visible);
        var maxy = Math.min(level.floor.map.length - 1, fdy + visible);
        var minx = Math.max(0, fdx - visible);
        var maxx = Math.min(level.floor.map[0].length - 1, fdx + visible);

        var mrx = hero.x * CONFIG.acos - hero.y * CONFIG.asin;
        var mry = hero.x * CONFIG.asin + hero.y * CONFIG.acos;
        mry = mry / 2;

        ctx.translate(-mrx, -mry);

        // Render floor tiles
        for (var y = miny; y <= maxy; y++) {
            for (var x = minx; x <= maxx; x++) {
                if (!level.floor.map[y] || !level.floor.map[y][x]) continue;
                var f = level.floor.map[y][x];
                var tile = level.floor.tiles[f];

                var tx = (x - y) * th;
                var ty = (x + y) * th / 2;

                if (tile && tile.width > 0) {
                    ctx.drawImage(tile, tx, ty, tile.width + 0.707, tile.height + 0.707);
                } else if (f > 0) {
                    // Fallback stone tile pattern
                    ctx.fillStyle = (x + y) % 2 === 0 ? "#1e1e24" : "#282830";
                    ctx.strokeStyle = "#111116";
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(tx, ty + th / 2);
                    ctx.lineTo(tx + th, ty);
                    ctx.lineTo(tx, ty - th / 2);
                    ctx.lineTo(tx - th, ty);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }

        ctx.translate(th, 0);
        this.renderObjects(scene, hero);
        this.renderFloatingTexts(ctx);
        ctx.restore();

        // Render Floor Notification Banner at screen top
        this.renderFloorBanner(scene);

        // Render Boss Banner at screen top if boss is in view
        this.renderBossBanner(scene);
    }

    renderObjects(scene, hero) {
        var ctx = this.ctx;
        var zb = this.getZBuffer(scene, false);

        for (var z in zb) {
            var m = zb[z];
            if (!m) continue;

            ctx.save();
            var sx = (m.x - m.y) * CONFIG.acos + (m.offset_x || 0);
            var sy = (m.x + m.y) / 2 * CONFIG.asin + (m.offset_y || 0);
            var tile = m.sprite;

            // Aura / Shadows for Entities
            if (m === hero) {
                // Hero Spotlight
                ctx.save();
                ctx.globalAlpha = 0.45;
                var gradient = ctx.createRadialGradient(sx, sy, 5, sx, sy, 35);
                gradient.addColorStop(0, "rgba(255, 230, 100, 0.6)");
                gradient.addColorStop(1, "rgba(255, 230, 100, 0)");
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.ellipse(sx, sy, 35, 14, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else if (m.rarity === 'boss') {
                // Boss Hell Aura
                ctx.save();
                ctx.globalAlpha = 0.6;
                var bGrad = ctx.createRadialGradient(sx, sy, 8, sx, sy, 55);
                bGrad.addColorStop(0, "rgba(255, 0, 0, 0.7)");
                bGrad.addColorStop(0.6, "rgba(180, 0, 0, 0.4)");
                bGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = bGrad;
                ctx.beginPath();
                ctx.ellipse(sx, sy, 55, 22, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else if (m.rarity === 'champion') {
                // Champion Fiery Aura
                ctx.save();
                ctx.globalAlpha = 0.5;
                var cGrad = ctx.createRadialGradient(sx, sy, 5, sx, sy, 38);
                cGrad.addColorStop(0, "rgba(255, 140, 0, 0.7)");
                cGrad.addColorStop(1, "rgba(255, 140, 0, 0)");
                ctx.fillStyle = cGrad;
                ctx.beginPath();
                ctx.ellipse(sx, sy, 38, 16, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else if (m.item) {
                // Ground Item Light Beam
                ctx.save();
                const rarityColors = {
                    common: 'rgba(255,255,255,0.4)',
                    magic: 'rgba(75,112,221,0.7)',
                    rare: 'rgba(230,200,75,0.8)',
                    unique: 'rgba(196,125,43,0.9)'
                };
                const col = rarityColors[m.item.rarity] || 'rgba(255,255,255,0.4)';
                var iGrad = ctx.createRadialGradient(sx, sy - 8, 2, sx, sy - 8, 24);
                iGrad.addColorStop(0, col);
                iGrad.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = iGrad;
                ctx.beginPath();
                ctx.arc(sx, sy - 8, 24, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            // Apply Monster Color Filter if defined
            if (m.colorFilter && m.colorFilter !== 'none') {
                ctx.filter = m.colorFilter;
            }

            // Render Sprite
            if (tile && tile.steps && tile.angles) {
                var tw = tile.width / tile.steps;
                var th_img = tile.height / tile.angles;
                var scale = m.scale || 1.0;

                if (tw > 0 && th_img > 0) {
                    ctx.save();
                    if (scale !== 1.0) {
                        ctx.translate(sx, sy);
                        ctx.scale(scale, scale);
                        ctx.translate(-sx, -sy);
                    }
                    ctx.drawImage(tile,
                        tw * m.step, th_img * m.angle, tw, th_img,
                        Math.round(sx - tw / 2 - (tile.offsetX || 0)), Math.round(sy - th_img), tw, th_img);
                    ctx.restore();
                }
            } else if (tile && tile.width > 0) {
                var scale = m.scale || 1.0;
                var tw = tile.width;
                var th_img = tile.height;
                ctx.drawImage(tile, Math.round(sx - (tw * scale) / 2), Math.round(sy - th_img * scale), tw * scale, th_img * scale);
            } else {
                ctx.fillStyle = m.rarity === 'boss' ? '#ffd700' : m.item ? '#6090ff' : '#d32f2f';
                ctx.beginPath();
                ctx.arc(sx, sy - 12, 8, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();

            // Monster Health Bar & Nameplate
            if (m.health && m.origin_health && m !== hero && !m.isDead) {
                ctx.save();
                var barY = sy - 80 * (m.scale || 1.0);
                var barW = Math.max(36, Math.floor(m.origin_health / 25));
                barW = Math.min(barW, 80);
                var healthPct = Math.max(0, m.health / m.origin_health);

                // Background
                ctx.fillStyle = "rgba(0,0,0,0.8)";
                ctx.fillRect(sx - barW / 2 - 1, barY - 1, barW + 2, 7);

                // Health fill (Red or Gold if Boss)
                ctx.fillStyle = m.rarity === 'boss' ? "#ffd700" : m.rarity === 'champion' ? "#ff8800" : "#d32f2f";
                ctx.fillRect(sx - barW / 2, barY, Math.round(barW * healthPct), 5);

                // Monster Title on hover or champion/boss
                if (m.rarity !== 'normal' || m.health < m.origin_health) {
                    ctx.font = "bold 10px 'Cinzel', serif";
                    ctx.textAlign = "center";
                    ctx.fillStyle = m.rarity === 'boss' ? "#ffd700" : m.rarity === 'champion' ? "#ffaa33" : "#dddddd";
                    ctx.shadowColor = "#000";
                    ctx.shadowBlur = 3;
                    ctx.fillText(m.name, sx, barY - 4);
                }
                ctx.restore();
            }

            // Ground Item Title Tag
            if (m.item) {
                ctx.save();
                ctx.font = "11px 'Lato', sans-serif";
                ctx.textAlign = "center";
                const rarityHex = {
                    common: '#ffffff',
                    magic: '#6888ff',
                    rare: '#ffe666',
                    unique: '#e08833',
                    set: '#10b981'
                };
                ctx.fillStyle = rarityHex[m.item.rarity] || '#ffffff';
                ctx.shadowColor = "#000000";
                ctx.shadowBlur = 4;
                ctx.fillText(m.item.name, sx, sy + 14);
                ctx.restore();
            }
        }
    }

    renderFloatingTexts(ctx) {
        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const ft = this.floatingTexts[i];
            const sx = (ft.x - ft.y) * CONFIG.acos;
            const sy = (ft.x + ft.y) / 2 * CONFIG.asin - ft.offsetY;

            ctx.save();
            ctx.globalAlpha = ft.alpha;
            ctx.font = "bold 14px 'Cinzel', serif";
            ctx.fillStyle = ft.color;
            ctx.shadowColor = '#000000';
            ctx.shadowBlur = 4;
            ctx.textAlign = 'center';
            ctx.fillText(ft.text, sx, sy);
            ctx.restore();

            ft.offsetY += 1.2;
            ft.alpha -= 0.03;
            ft.life--;

            if (ft.life <= 0 || ft.alpha <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    renderBossBanner(scene) {
        // Find if any boss is alive within range
        const hero = scene.hero;
        let activeBoss = null;
        for (let m of scene.monsters) {
            if (m.rarity === 'boss' && !m.isDead && m.isAboveHero(hero)) {
                activeBoss = m;
                break;
            }
        }

        if (!activeBoss) return;

        const ctx = this.ctx;
        ctx.save();

        const bw = 420;
        const bh = 22;
        const bx = (this.w - bw) / 2;
        const by = 28;

        // Title
        ctx.font = "bold 15px 'Cinzel', serif";
        ctx.fillStyle = "#ffd700";
        ctx.textAlign = "center";
        ctx.shadowColor = "#000";
        ctx.shadowBlur = 6;
        ctx.fillText(`${activeBoss.name} - ${activeBoss.title || 'Boss'}`, this.w / 2, by - 6);

        // Bar frame
        ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
        ctx.fillRect(bx, by, bw, bh);
        ctx.strokeStyle = "#c8aa6d";
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, bw, bh);

        // Bar fill
        const pct = Math.max(0, activeBoss.health / activeBoss.origin_health);
        const grad = ctx.createLinearGradient(bx, by, bx + bw, by);
        grad.addColorStop(0, "#8a0000");
        grad.addColorStop(0.5, "#d32f2f");
        grad.addColorStop(1, "#ff5252");
        ctx.fillStyle = grad;
        ctx.fillRect(bx + 2, by + 2, (bw - 4) * pct, bh - 4);

        // HP text
        ctx.font = "bold 11px 'Cinzel', serif";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(`${activeBoss.health} / ${activeBoss.origin_health}`, this.w / 2, by + 15);

        ctx.restore();
    }

    renderFloorBanner(scene) {
        if (!scene.floorNotification || scene.floorNotification.timer <= 0) return;

        const notif = scene.floorNotification;
        notif.timer--;
        if (notif.timer < 30) {
            notif.alpha = Math.max(0, notif.timer / 30);
        }

        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = notif.alpha;

        const bw = 460;
        const bh = 52;
        const bx = (this.w - bw) / 2;
        const by = 35;

        // Gothic background slate
        ctx.fillStyle = "rgba(10, 10, 14, 0.9)";
        ctx.fillRect(bx, by, bw, bh);

        // Gold ornamental border
        ctx.strokeStyle = "#c8aa6d";
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, bw, bh);

        ctx.strokeStyle = "#5a4522";
        ctx.lineWidth = 1;
        ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);

        // Gold corner gems
        ctx.fillStyle = "#e6c84b";
        ctx.fillRect(bx - 2, by - 2, 5, 5);
        ctx.fillRect(bx + bw - 3, by - 2, 5, 5);
        ctx.fillRect(bx - 2, by + bh - 3, 5, 5);
        ctx.fillRect(bx + bw - 3, by + bh - 3, 5, 5);

        // Title
        ctx.font = "bold 17px 'Cinzel', serif";
        ctx.fillStyle = "#ffd700";
        ctx.textAlign = "center";
        ctx.shadowColor = "#000000";
        ctx.shadowBlur = 8;
        ctx.fillText(notif.title, this.w / 2, by + 23);

        // Subtitle
        ctx.font = "12px 'Cinzel', serif";
        ctx.fillStyle = "#b8b09e";
        ctx.shadowBlur = 4;
        ctx.fillText(notif.sub, this.w / 2, by + 41);

        ctx.restore();
    }

    renderMap(scene, level) {
        var ctx = this.ctx;
        var hero = scene.hero;
        var s = CONFIG.s;

        ctx.save();
        ctx.translate(this.w / 2, this.h / 2);
        var sc = 0.35;
        ctx.scale(1 * sc, 0.5 * sc);
        ctx.rotate(Math.PI * 0.25);
        ctx.translate(-hero.x, -hero.y);

        // Floor
        ctx.fillStyle = "rgba(40, 40, 50, 0.5)";
        for (let y in level.floor.map) {
            for (let x in level.floor.map[y]) {
                if (level.floor.map[y][x] > 0) {
                    ctx.fillRect(x * s, y * s, s, s);
                }
            }
        }

        // Monsters (red dots)
        ctx.fillStyle = "red";
        for (let m of scene.monsters) {
            if (!m.isDead) ctx.fillRect(m.x - s / 4, m.y - s / 4, s / 2, s / 2);
        }

        // Hero (cyan dot)
        ctx.fillStyle = "cyan";
        ctx.fillRect(hero.x - s / 3, hero.y - s / 3, s * 0.6, s * 0.6);

        ctx.restore();
    }
}
