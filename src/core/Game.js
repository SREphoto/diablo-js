import { World } from '../world/World.js';
import { Renderer } from '../render/Renderer.js';
import { InputHandler } from './Input.js';
import { HeroBarbarian } from '../entities/Hero.js';
import { Mob, AgressiveMob } from '../entities/Mob.js';
import { Wall, WallObject } from '../entities/Wall.js';
import { Barrel, Coin, PotionHealth, PotionMana, createRandomDrop, Item } from '../entities/Items.js';
import { Chest, Shrine, DungeonPortal, StairsDown, StairsUp, GriswoldNPC, AdriaNPC, CainNPC, PepinNPC, TownStashChest, PropAnvil, PropWell, TownHouse } from '../entities/DungeonObjects.js';
import { imageCount, resetImageCount, remove } from '../utils.js';
import { CONFIG } from '../config.js';
import { UIManager } from '../ui/UIManager.js';
import { InventoryUI } from '../ui/InventoryUI.js';
import { sound } from './Sound.js';
import { DUNGEON_LEVELS } from '../world/levelData.js';

export class Game {
    constructor() {
        this.world = new World();
        this.renderer = new Renderer("floor", 980, 661);
        this.ui = new UIManager();
        this.invUI = new InventoryUI(this);

        // Game Entities
        this.monsters = [];
        this.npcs = [];
        this.deathmobs = [];
        this.barrels = [];
        this.coins = [];
        this.potions = [];
        this.items = [];
        this.chests = [];
        this.shrines = [];
        this.portals = [];
        this.stairs = [];
        this.walls = [];
        this.floorNotification = null;

        // Hero initial spawn
        const spawnX = CONFIG.s * 17;
        const spawnY = CONFIG.s * 15;
        this.hero = new HeroBarbarian(spawnX, spawnY, this);

        this.input = new InputHandler(this, this.renderer.canvas);
        this.showMap = false;
        this.currentFloor = 0;
        this.running = false;

        this.init();
    }

    buildWalls() {
        this.walls = [];
        const s = CONFIG.s;
        const level = this.world.data;

        for (var y in level.wall.map) {
            for (var x in level.wall.map[y]) {
                var index = level.wall.map[y][x];
                if (index > 0) {
                    this.walls.push(new Wall(index, x * s, y * s, this.walls, level));
                }
            }
        }
        for (var y in level.object.map) {
            for (var x in level.object.map[y]) {
                var index = level.object.map[y][x];
                if (index > 0) {
                    this.walls.push(new WallObject(index, x * s, y * s, level));
                }
            }
        }
    }

    init() {
        // Load initial floor 0: The Town of Tristram
        this.changeFloor(0, { x: CONFIG.s * 17, y: CONFIG.s * 15 });

        // Safety timeout: If any external asset fails to load, force game loop start after 1.5s
        setTimeout(() => {
            if (imageCount > 0) {
                console.log("Forcing game start, pending images bypassed.");
                resetImageCount();
            }
        }, 1500);

        this.start();
    }

    spawnDungeonContent(floorNum = 0) {
        const s = CONFIG.s;

        if (floorNum === 0) {
            // ============================================
            // FLOOR 0: THE TOWN OF TRISTRAM (Safe Haven)
            // ============================================
            // Town Square Central Plaza:
            this.npcs.push(new TownStashChest(s * 15, s * 13));
            this.npcs.push(new PropWell(s * 17, s * 16));
            this.npcs.push(new CainNPC(s * 17, s * 6));

            // West Quarter: Griswold's Smithy & Forge
            this.npcs.push(new TownHouse(s * 5, s * 12));
            this.npcs.push(new GriswoldNPC(s * 7, s * 17));
            this.npcs.push(new PropAnvil(s * 8, s * 16));

            // East Quarter: Adria & Pepin Mystic Grove
            this.npcs.push(new AdriaNPC(s * 27, s * 14));
            this.npcs.push(new PepinNPC(s * 27, s * 18));
            this.shrines.push(new Shrine(s * 29, s * 16, 'healing'));

            // North Waypoint: Town Portal leading to Cathedral
            this.portals.push(new DungeonPortal(s * 17, s * 8, 1, { x: s * 5, y: s * 5 }));

            // South Gate: Stone Descent Stairs into Floor 1: The Cathedral
            this.stairs.push(new StairsDown(s * 17, s * 25, 1, { x: s * 6, y: s * 5 }));

            // Town Barrels & Decorative Chest
            this.barrels.push(new Barrel(s * 6, s * 19));
            this.barrels.push(new Barrel(s * 9, s * 19));
            this.chests.push(new Chest(s * 28, s * 12));

        } else if (floorNum === 1) {
            // ============================================
            // FLOOR 1: THE CATHEDRAL (The Skeleton King)
            // ============================================

            // Ascent back to Town of Tristram
            this.stairs.push(new StairsUp(s * 3, s * 4, 0, { x: s * 17, y: s * 23 }));
            this.portals.push(new DungeonPortal(s * 5, s * 3, 0, { x: s * 17, y: s * 15 }));

            // Room 1: Sanctuary (Safe Spawn Area)
            this.chests.push(new Chest(s * 7, s * 4));
            this.shrines.push(new Shrine(s * 4, s * 6, 'healing'));
            this.barrels.push(new Barrel(s * 8, s * 7));
            this.barrels.push(new Barrel(s * 9, s * 7));

            // Room 2: Crypt of Bones (Skeleton Army & King Leoric)
            this.monsters.push(new AgressiveMob(s * 18, s * 5, 'SK_WARRIOR'));
            this.monsters.push(new AgressiveMob(s * 20, s * 4, 'SK_WARRIOR'));
            this.monsters.push(new AgressiveMob(s * 23, s * 7, 'SK_WARRIOR'));
            this.monsters.push(new AgressiveMob(s * 25, s * 5, 'SK_WARRIOR'));
            this.monsters.push(new AgressiveMob(s * 21, s * 8, 'SK_CHAMPION'));
            this.monsters.push(new AgressiveMob(s * 27, s * 5, 'SK_KING')); // Boss Leoric!
            this.chests.push(new Chest(s * 28, s * 4));
            this.barrels.push(new Barrel(s * 17, s * 3));
            this.barrels.push(new Barrel(s * 28, s * 8));

            // Room 3: South Hall & Tomb
            this.monsters.push(new AgressiveMob(s * 5, s * 18, 'SK_WARRIOR'));
            this.monsters.push(new AgressiveMob(s * 8, s * 21, 'SK_CHAMPION'));
            this.monsters.push(new AgressiveMob(s * 10, s * 18, 'FS_IMP'));
            this.shrines.push(new Shrine(s * 3, s * 20, 'mana'));
            this.barrels.push(new Barrel(s * 11, s * 18));

            // Room 4: Leoric's Antechamber & Descent
            this.monsters.push(new AgressiveMob(s * 21, s * 17, 'SK_WARRIOR'));
            this.monsters.push(new AgressiveMob(s * 25, s * 18, 'SK_WARRIOR'));
            this.monsters.push(new AgressiveMob(s * 23, s * 22, 'SK_CHAMPION'));
            this.chests.push(new Chest(s * 28, s * 22));

            // Stairs Down to Floor 2 (The Catacombs)
            this.stairs.push(new StairsDown(s * 26, s * 20, 2, { x: s * 6, y: s * 5 }));

        } else if (floorNum === 2) {
            // ============================================
            // FLOOR 2: THE CATACOMBS (Sisters & Bishibosh)
            // ============================================

            // Entrance: Stairs Up back to Floor 1
            this.stairs.push(new StairsUp(s * 4, s * 5, 1, { x: s * 25, y: s * 20 }));
            this.shrines.push(new Shrine(s * 8, s * 4, 'healing'));
            this.barrels.push(new Barrel(s * 9, s * 7));
            this.barrels.push(new Barrel(s * 10, s * 7));

            // Hall of Tombs (East Corridor)
            this.monsters.push(new AgressiveMob(s * 13, s * 6, 'FS_IMP'));
            this.monsters.push(new AgressiveMob(s * 15, s * 6, 'FS_IMP'));
            this.monsters.push(new AgressiveMob(s * 17, s * 6, 'FS_SHAMAN'));
            this.chests.push(new Chest(s * 18, s * 5));

            // Sister Coven (NE Chamber)
            this.monsters.push(new AgressiveMob(s * 22, s * 4, 'SI_SISTER'));
            this.monsters.push(new AgressiveMob(s * 25, s * 5, 'SI_SISTER'));
            this.monsters.push(new AgressiveMob(s * 27, s * 7, 'SI_SISTER'));
            this.monsters.push(new AgressiveMob(s * 24, s * 9, 'SI_MATRON')); // Sister Matron!
            this.chests.push(new Chest(s * 28, s * 4));
            this.barrels.push(new Barrel(s * 22, s * 10));
            this.barrels.push(new Barrel(s * 27, s * 11));

            // Altar of Skulls (SW Chamber)
            this.monsters.push(new AgressiveMob(s * 4, s * 17, 'FS_IMP'));
            this.monsters.push(new AgressiveMob(s * 6, s * 20, 'FS_IMP'));
            this.monsters.push(new AgressiveMob(s * 8, s * 17, 'FS_SHAMAN'));
            this.shrines.push(new Shrine(s * 3, s * 20, 'power'));
            this.chests.push(new Chest(s * 8, s * 21));

            // Bishibosh Den (SE Chamber)
            this.monsters.push(new AgressiveMob(s * 17, s * 18, 'FS_IMP'));
            this.monsters.push(new AgressiveMob(s * 20, s * 20, 'FS_IMP'));
            this.monsters.push(new AgressiveMob(s * 23, s * 17, 'FS_SHAMAN'));
            this.monsters.push(new AgressiveMob(s * 22, s * 21, 'FS_CHIEFTAIN')); // Boss Bishibosh!
            this.barrels.push(new Barrel(s * 25, s * 16));
            this.barrels.push(new Barrel(s * 28, s * 17));
            this.chests.push(new Chest(s * 27, s * 22));

            // Stairs Down to Floor 3 (Lair of Hell)
            this.stairs.push(new StairsDown(s * 27, s * 19, 3, { x: s * 6, y: s * 5 }));

        } else if (floorNum === 3) {
            // ============================================
            // FLOOR 3: THE LAIR OF HELL (The Butcher)
            // ============================================

            // Entrance: Stairs Up back to Floor 2
            this.stairs.push(new StairsUp(s * 4, s * 5, 2, { x: s * 26, y: s * 19 }));
            this.shrines.push(new Shrine(s * 7, s * 5, 'healing'));

            // Fire Corridor & Cleaver Chamber (North)
            this.monsters.push(new AgressiveMob(s * 11, s * 5, 'SK_CHAMPION'));
            this.monsters.push(new AgressiveMob(s * 16, s * 4, 'SI_MATRON'));
            this.monsters.push(new AgressiveMob(s * 20, s * 5, 'SI_SISTER'));
            this.monsters.push(new AgressiveMob(s * 24, s * 6, 'FS_SHAMAN'));
            this.monsters.push(new AgressiveMob(s * 26, s * 4, 'SK_CHAMPION'));
            this.chests.push(new Chest(s * 28, s * 4));
            this.barrels.push(new Barrel(s * 18, s * 8));
            this.barrels.push(new Barrel(s * 27, s * 9));

            // Ritual Pentagram (SW Chamber)
            this.monsters.push(new AgressiveMob(s * 4, s * 18, 'SI_MATRON'));
            this.monsters.push(new AgressiveMob(s * 6, s * 20, 'FS_SHAMAN'));
            this.shrines.push(new Shrine(s * 3, s * 20, 'power'));
            this.chests.push(new Chest(s * 7, s * 20));

            // THE BUTCHER'S LAIR (Grand Hall of Blood)
            this.monsters.push(new AgressiveMob(s * 12, s * 17, 'SK_CHAMPION'));
            this.monsters.push(new AgressiveMob(s * 15, s * 21, 'SI_MATRON'));
            this.monsters.push(new AgressiveMob(s * 18, s * 16, 'FS_SHAMAN'));
            this.monsters.push(new AgressiveMob(s * 26, s * 16, 'SK_CHAMPION'));

            // Boss: THE BUTCHER!
            this.monsters.push(new AgressiveMob(s * 22, s * 19, 'BA_BUTCHER'));

            // Royal Treasure Hoard
            this.chests.push(new Chest(s * 27, s * 22));
            this.chests.push(new Chest(s * 28, s * 22));
            this.chests.push(new Chest(s * 29, s * 20));
            this.barrels.push(new Barrel(s * 14, s * 16));
            this.barrels.push(new Barrel(s * 20, s * 23));
            this.barrels.push(new Barrel(s * 28, s * 16));
        }
    }

    start() {
        this.running = true;

        // Render & Update Loop (60 FPS)
        setInterval(() => this.loop(), 33);

        // AI Loop
        setInterval(() => this.aiLoop(), 180);

        // Regeneration Loop
        setInterval(() => this.regenLoop(), 2000);
    }

    loop() {
        if (imageCount > 0) return;

        // Updates
        var canWalk = (x, y) => this.world.isWayWall(x, y);
        this.hero.nextStep(canWalk);

        for (var i = this.monsters.length - 1; i >= 0; i--) {
            var m = this.monsters[i];
            if (m.isDead) {
                this.monsters.splice(i, 1);
            } else {
                m.nextStep(canWalk, this.hero, this);
            }
        }

        // Auto-pickup gold nearby
        for (let i = this.coins.length - 1; i >= 0; i--) {
            const coin = this.coins[i];
            if (Math.hypot(coin.x - this.hero.x, coin.y - this.hero.y) < 50) {
                coin.use(this.hero, this);
            }
        }

        // Sync UI
        this.ui.updateHealth(this.hero.health, this.hero.origin_health);
        this.ui.updateMana(this.hero.mana, this.hero.origin_mana);
        this.ui.updateGold(this.hero.coins);
        this.ui.updateXP(this.hero.experience, this.hero.nextLevelXP, this.hero.level);
        this.ui.updateBelt(this.hero.belt.items);

        // Render World
        this.renderer.clear();
        this.renderer.renderFloor(this, this.world.data);

        if (this.showMap) {
            this.renderer.renderMap(this, this.world.data);
        }
    }

    aiLoop() {
        if (this.monsters.length === 0) return;

        const hero = this.hero;
        const attackDist = 85;
        const agroDist = 280;

        for (let i = 0; i < this.monsters.length; i++) {
            const m = this.monsters[i];
            if (m.isDead) continue;

            const dist = Math.hypot(hero.x - m.x, hero.y - m.y);

            if (dist < agroDist) {
                // In aggro range
                if (dist <= attackDist) {
                    m.doAttack(hero);
                    m.to_x = m.x;
                    m.to_y = m.y;
                } else {
                    // Chase hero
                    m.to_x = hero.x;
                    m.to_y = hero.y;
                }
            } else if (Math.random() < 0.2 && !m.attacked) {
                // Idle wander
                const s = CONFIG.s;
                const wx = m.x + (Math.random() * s - s / 2);
                const wy = m.y + (Math.random() * s - s / 2);
                if (this.world.isWayWall(wx, wy)) {
                    m.to_x = wx;
                    m.to_y = wy;
                }
            }
        }
    }

    regenLoop() {
        this.hero.health = Math.min(this.hero.health + 15, this.hero.origin_health);
        this.hero.mana = Math.min(this.hero.mana + 10, this.hero.origin_mana);
    }

    addFloatingText(text, x, y, color = '#ffffff') {
        this.renderer.addFloatingText(text, x, y, color);
    }

    addItem(item) {
        if (item.constructor.name === 'Coin') this.coins.push(item);
        else if (item.constructor.name === 'PotionHealth' || item.constructor.name === 'PotionMana') this.potions.push(item);
        else if (item.constructor.name === 'DeathMob') this.deathmobs.push(item);
        else if (item.constructor.name === 'GroundItem') this.items.push(item);
        else this.items.push(item);
    }

    removeItem(item) {
        remove(this.coins, item);
        remove(this.potions, item);
        remove(this.items, item);
        remove(this.barrels, item);
        remove(this.stairs, item);
    }

    removeMonster(mob) {
        remove(this.monsters, mob);
    }

    removeBarrel(barrel) {
        remove(this.barrels, barrel);
    }

    // Precise Isometric Screen Picking
    getEntityAtCanvasPoint(canvasX, canvasY) {
        const hero = this.hero;
        const w = this.renderer.w;
        const h = this.renderer.h;

        // Get sorted list of interactive entities (front to back)
        const zb = this.renderer.getZBuffer(this, true, true);

        for (let i = 0; i < zb.length; i++) {
            const m = zb[i];
            if (!m || m.isDead) continue;

            // Compute canvas screen coordinates for entity
            const screenX = w / 2 + ((m.x - hero.x) - (m.y - hero.y)) * CONFIG.acos + (m.offset_x || 0);
            const screenY = h / 2 + ((m.x - hero.x) + (m.y - hero.y)) / 2 * CONFIG.asin + (m.offset_y || 0);

            // Sprite dimensions
            let sprW = 48;
            let sprH = 64;
            const spr = m.sprite;

            if (spr) {
                if (spr.steps && spr.angles) {
                    sprW = (spr.width / spr.steps) * (m.scale || 1.0);
                    sprH = (spr.height / spr.angles) * (m.scale || 1.0);
                } else if (spr.width > 0) {
                    sprW = (spr.width) * (m.scale || 1.0);
                    sprH = (spr.height) * (m.scale || 1.0);
                }
            }

            // Hitbox check with 14px padding for comfort
            const pad = 14;
            const left = screenX - sprW / 2 - pad;
            const right = screenX + sprW / 2 + pad;
            const top = screenY - sprH - pad;
            const bottom = screenY + pad;

            if (canvasX >= left && canvasX <= right && canvasY >= top && canvasY <= bottom) {
                return m;
            }
        }
        return null;
    }

    toggleInventory() {
        this.invUI.toggleInventory();
    }

    toggleCharacterSheet() {
        this.invUI.toggleCharacterSheet();
    }

    toggleMenu() {
        this.invUI.toggleMenu();
    }

    onHeroDied() {
        this.invUI.showGameOver();
    }

    resurrectHero() {
        const s = CONFIG.s;
        this.hero.x = s * 5;
        this.hero.y = s * 5;
        this.hero.to_x = this.hero.x;
        this.hero.to_y = this.hero.y;
        this.hero.health = this.hero.origin_health;
        this.hero.mana = this.hero.origin_mana;
        sound.playLevelUp();
        this.addFloatingText("Resurrected in Sanctuary", this.hero.x, this.hero.y, '#ffd700');
    }

    restartFloor() {
        this.changeFloor(this.currentFloor);
        this.resurrectHero();
    }

    changeFloor(floorNum, spawnPos = null) {
        if (!DUNGEON_LEVELS[floorNum]) return;
        this.currentFloor = floorNum;

        // Switch world data
        this.world.data = DUNGEON_LEVELS[floorNum];

        // Rebuild collision walls
        this.buildWalls();

        // Clear all previous floor entities
        this.monsters = [];
        this.npcs = [];
        this.deathmobs = [];
        this.coins = [];
        this.potions = [];
        this.items = [];
        this.barrels = [];
        this.chests = [];
        this.shrines = [];
        this.portals = [];
        this.stairs = [];

        // Spawn floor content
        this.spawnDungeonContent(floorNum);

        // Position Hero
        const s = CONFIG.s;
        if (spawnPos) {
            this.hero.x = spawnPos.x;
            this.hero.y = spawnPos.y;
        } else {
            this.hero.x = floorNum === 0 ? s * 17 : s * 5;
            this.hero.y = floorNum === 0 ? s * 15 : s * 5;
        }
        this.hero.to_x = this.hero.x;
        this.hero.to_y = this.hero.y;
        this.hero.targetMonster = null;

        // Floor Banner Announcement
        const floorNames = {
            0: { title: "TOWN OF TRISTRAM", sub: "Sanctuary of the Wandering Hero" },
            1: { title: "FLOOR 1: THE CATHEDRAL", sub: "Monastery of Tristram" },
            2: { title: "FLOOR 2: THE CATACOMBS", sub: "Ancient Crypt of the Sisters" },
            3: { title: "FLOOR 3: LAIR OF THE BUTCHER", sub: "Sanctum of Blood and Ash" }
        };
        const info = floorNames[floorNum] || { title: `FLOOR ${floorNum}`, sub: "Dungeon Depths" };
        this.floorNotification = {
            title: info.title,
            sub: info.sub,
            alpha: 1.0,
            timer: 150
        };

        this.addFloatingText(`Entered ${info.title}!`, this.hero.x, this.hero.y, '#ffd700');
    }

    castTownPortal() {
        if (this.currentFloor === 0) {
            this.addFloatingText("Already in Tristram!", this.hero.x, this.hero.y, '#ffd700');
            return;
        }
        const s = CONFIG.s;
        const portal = new DungeonPortal(this.hero.x + 35, this.hero.y, 0, { x: s * 17, y: s * 15 });
        this.portals.push(portal);
        sound.playLevelUp();
        this.addFloatingText("Town Portal to Tristram Opened!", this.hero.x, this.hero.y, '#60a0ff');
    }

    saveGame() {
        const saveData = {
            level: this.hero.level,
            experience: this.hero.experience,
            nextLevelXP: this.hero.nextLevelXP,
            coins: this.hero.coins,
            strength: this.hero.strength,
            dexterity: this.hero.dexterity,
            vitality: this.hero.vitality,
            energy: this.hero.energy,
            statPoints: this.hero.statPoints,
            monstersSlain: this.hero.monstersSlain,
            currentFloor: this.currentFloor,
            equipment: this.hero.equipment,
            inventorySlots: this.hero.inventory.slots,
            stashSlots: this.hero.stash ? this.hero.stash.slots : []
        };
        try {
            localStorage.setItem('diablo_js_save', JSON.stringify(saveData));
        } catch (e) {
            console.error("Save game error:", e);
        }
    }

    loadGame() {
        try {
            const raw = localStorage.getItem('diablo_js_save');
            if (!raw) {
                alert("No saved game found!");
                return;
            }
            const data = JSON.parse(raw);
            this.hero.level = data.level || 1;
            this.hero.experience = data.experience || 0;
            this.hero.nextLevelXP = data.nextLevelXP || 300;
            this.hero.coins = data.coins || 0;
            this.hero.strength = data.strength || 30;
            this.hero.dexterity = data.dexterity || 20;
            this.hero.vitality = data.vitality || 25;
            this.hero.energy = data.energy || 10;
            this.hero.statPoints = data.statPoints || 0;
            this.hero.monstersSlain = data.monstersSlain || 0;
            this.currentFloor = data.currentFloor || 0;

            if (data.equipment) {
                this.hero.equipment = {};
                for (const k in data.equipment) {
                    this.hero.equipment[k] = data.equipment[k] ? new Item(data.equipment[k]) : null;
                }
            }
            if (data.inventorySlots) {
                this.hero.inventory.slots = data.inventorySlots.map(s => s ? new Item(s) : null);
            }
            if (data.stashSlots && this.hero.stash) {
                this.hero.stash.slots = data.stashSlots.map(s => s ? new Item(s) : null);
            }

            this.hero.recalculateStats();
            this.hero.health = this.hero.origin_health;
            this.hero.mana = this.hero.origin_mana;
            this.changeFloor(this.currentFloor, { x: this.hero.x, y: this.hero.y });
            this.addFloatingText("Game Loaded!", this.hero.x, this.hero.y, '#ffd700');
        } catch (e) {
            console.error("Load game error:", e);
        }
    }
}
