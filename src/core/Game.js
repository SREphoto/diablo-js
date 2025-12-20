
import { World } from '../world/World.js';
import { Renderer } from '../render/Renderer.js';
import { InputHandler } from './Input.js';
import { HeroBarbarian } from '../entities/Hero.js';
import { AgressiveMob } from '../entities/Mob.js';
import { Wall, WallObject } from '../entities/Wall.js';
import { PotionHealth } from '../entities/Items.js';
import { imageCount, remove } from '../utils.js';
import { CONFIG } from '../config.js';
import { UIManager } from '../ui/UIManager.js';

export class Game {
    constructor() {
        this.world = new World();
        this.renderer = new Renderer("floor", 980, 661);
        this.ui = new UIManager();

        // Game State
        this.monsters = [];
        this.deathmobs = [];
        this.barrels = [];
        this.coins = [];
        this.potions = [];
        this.walls = [];

        this.hero = new HeroBarbarian(CONFIG.s * 3, CONFIG.s * 3);

        this.input = new InputHandler(this, this.renderer.canvas);
        this.showMap = false;

        this.running = false;

        this.init();
    }

    init() {
        // Load Walls
        var s = CONFIG.s;
        var level = this.world.data;

        for (var y in level.wall.map) {
            for (var x in level.wall.map[y]) {
                var index = level.wall.map[y][x];
                if (index > 0) {
                    this.walls.push(new Wall(index, x * s, y * s, this.walls));
                }
            }
        }
        for (var y in level.object.map) {
            for (var x in level.object.map[y]) {
                var index = level.object.map[y][x];
                if (index > 0) {
                    this.walls.push(new WallObject(index, x * s, y * s));
                }
            }
        }

        // Spawn Entities
        for (var i = 0; i < 2; i++) this.monsters.push(new AgressiveMob(this.world.randomx(), this.world.randomy(), 'SK'));
        for (var i = 0; i < 2; i++) this.monsters.push(new AgressiveMob(this.world.randomx(), this.world.randomy(), 'FS'));
        for (var i = 0; i < 2; i++) this.monsters.push(new AgressiveMob(this.world.randomx(), this.world.randomy(), 'SI'));
        // Barrels commented out in original?
        for (var i = 0; i < 2; i++) this.potions.push(new PotionHealth(this.world.randomx(), this.world.randomy()));

        // Start loops
        this.start();
    }

    start() {
        this.running = true;

        // Game Loop
        setInterval(() => this.loop(), 66);

        // Logic Loops (AI)
        setInterval(() => this.aiLoop(), 200);
        setInterval(() => this.regenLoop(), 2000);
    }

    loop() {
        if (imageCount > 0) return;

        // Updates
        var canWalk = (x, y) => this.world.isWayWall(x, y);
        this.hero.nextStep(canWalk);

        for (var i in this.monsters) {
            this.monsters[i].nextStep(canWalk, this.hero);
        }

        // Sync UI
        this.ui.updateHealth(this.hero.health, this.hero.origin_health);
        this.ui.updateBelt(this.hero.belt.items);

        // Render World
        this.renderer.clear();
        this.renderer.renderFloor(this, this.world.data);
        // this.renderer.renderHeroUI(this.hero); // using HTML UI now

        if (this.showMap) this.renderer.renderMap(this, this.world.data);
    }

    aiLoop() {
        if (this.monsters.length == 0) return;

        // Random move logic
        // Original: var m=monsters[Math.ceil(Math.random()*(monsters.length-1))];
        // if(typeof m.attacked != "object"){ m.to_x... }
        var m = this.monsters[Math.floor(Math.random() * this.monsters.length)];
        if (m && !m.attacked) {
            var s = CONFIG.s;
            m.to_x = m.x + (Math.random() * s - s / 2);
            m.to_y = m.y + (Math.random() * s - s / 2);
        }

        // Attack logic is mostly in Entity.nextStep now, but original had some here?
        // Original: "for(var i in monsters) ... if(m.attack && m.isAboveHero())..."
        // I moved this to AgressiveMob.nextStep or doAttack logic.
        // Wait, original AI loop explicitly set target to hero if close.
        for (var i in this.monsters) {
            var m = this.monsters[i];
            var attackDist = 100;
            if (m.isAboveHero(this.hero)) { // In range
                if (Math.abs(this.hero.x - m.x) < attackDist && Math.abs(this.hero.y - m.y) < attackDist) {
                    m.doAttack(this.hero);
                    // Stop moving
                    m.to_x = m.x;
                    m.to_y = m.y;
                } else {
                    // Chase
                    m.to_x = this.hero.x;
                    m.to_y = this.hero.y;
                }
            }
        }
    }

    regenLoop() {
        this.hero.health = Math.min(this.hero.health + 10, this.hero.origin_health);
    }

    // Helper to interact with items
    addItem(item) {
        if (item.constructor.name === 'Coin') this.coins.push(item);
        if (item.constructor.name === 'PotionHealth') this.potions.push(item);
        if (item.constructor.name === 'DeathMob') this.deathmobs.push(item);
        // ...
    }

    removeItem(item) {
        remove(this.coins, item);
        remove(this.potions, item);
        remove(this.barrels, item);
    }

    removeMonster(mob) {
        remove(this.monsters, mob);
    }

    processClick(click_x, click_y) {
        // getZBuffer returns sorted entities. We check front-to-back? 
        // Original `processClick` loaded zbuffer (true, true).
        var zb = this.renderer.getZBuffer(this, true, true);

        var cx = (click_x - click_y) * CONFIG.acos;
        var cy = (click_x + click_y) / 2 * CONFIG.asin;

        for (var i in zb) {
            var m = zb[i];
            var spr = m.sprite;
            var sx = (m.x - m.y) * CONFIG.acos + m.offset_x;
            var sy = (m.x + m.y) / 2 * CONFIG.asin + m.offset_y;

            var spr_w = spr.angles ? spr.width / spr.angles : spr.width;
            var spr_h = spr.steps ? spr.height / spr.steps : spr.height;

            // Intersection check
            if (cx >= sx - spr_w / 2 && cx <= sx + spr_w / 2 && cy >= sy - spr_h && cy <= sy) {
                m.use(this.hero, this); // pass scene (this)
                return true;
            }
        }
        return false;
    }
}
