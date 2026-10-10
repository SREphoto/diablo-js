import { Entity } from './Entity.js';
import { loadImage, remove } from '../utils.js';
import { sound } from '../core/Sound.js';
import { getAuthenticItemGraphic, getAuthenticPotionGraphic } from './ItemGraphics.js';

var barrelSprite = loadImage("sprite/barrel64.png");
var coinSprite = loadImage("sprite/coins10.png");

// Item Base Class
// Iconic Diablo Set Definitions & Bonuses
export const SET_DEFINITIONS = {
    SIGON: {
        id: 'SIGON',
        name: "Sigon's Complete Steel",
        description: "The ancient forged steel of King Sigon.",
        pieces: [
            { pieceId: 'sigon_visor', name: "Sigon's Visor", slot: 'helm', type: 'helm', icon: 'sprite/set_sigon_visor.png', stats: { defense: 25, mana: 50 }, value: 250 },
            { pieceId: 'sigon_shelter', name: "Sigon's Shelter", slot: 'armor', type: 'armor', icon: 'sprite/set_sigon_shelter.png', stats: { defense: 75, health: 100 }, value: 350 },
            { pieceId: 'sigon_guard', name: "Sigon's Guard", slot: 'shield', type: 'shield', icon: 'sprite/set_sigon_guard.png', stats: { defense: 45, strength: 5 }, value: 300 },
            { pieceId: 'sigon_sabatons', name: "Sigon's Sabatons", slot: 'boots', type: 'boots', icon: 'sprite/set_sigon_sabatons.png', stats: { defense: 20, dexterity: 5 }, value: 220 }
        ],
        bonuses: {
            2: { text: "+120 Maximum Life, +25 Defense", stats: { health: 120, defense: 25 } },
            3: { text: "+30 Attack Damage, +15% Critical Strike", stats: { damage: 30, crit: 15 } },
            4: { text: "+60 Attack Damage, +60 Defense, +350 Maximum Life, +25% Critical Strike (Berserker Aura)", stats: { damage: 60, defense: 60, health: 350, crit: 25 } }
        }
    },
    BERSERKER: {
        id: 'BERSERKER',
        name: "Berserker's Garb",
        description: "Brutal Arreat war-regalia steeped in demon ichor.",
        pieces: [
            { pieceId: 'berserker_hatchet', name: "Berserker's Hatchet", slot: 'weapon', type: 'axe', icon: 'sprite/set_berserker_hatchet.png', stats: { damage: 55, crit: 10 }, value: 320 },
            { pieceId: 'berserker_helm', name: "Berserker's Headgear", slot: 'helm', type: 'helm', icon: 'sprite/set_berserker_helm.png', stats: { defense: 28, strength: 8 }, value: 240 },
            { pieceId: 'berserker_armor', name: "Berserker's Hauberk", slot: 'armor', type: 'armor', icon: 'sprite/set_berserker_armor.png', stats: { defense: 55, health: 80 }, value: 280 }
        ],
        bonuses: {
            2: { text: "+35 Attack Damage, +80 Maximum Life", stats: { damage: 35, health: 80 } },
            3: { text: "+75 Attack Damage, +30% Critical Strike, +200 Maximum Life", stats: { damage: 75, crit: 30, health: 200 } }
        }
    },
    CATHAN: {
        id: 'CATHAN',
        name: "Cathan's Traps",
        description: "Fire-imbued regalia of the ancient High Council.",
        pieces: [
            { pieceId: 'cathan_mesh', name: "Cathan's Mesh", slot: 'armor', type: 'armor', icon: 'sprite/set_cathan_mesh.png', stats: { defense: 45, mana: 80 }, value: 260 },
            { pieceId: 'cathan_ring', name: "Cathan's Seal", slot: 'ring1', type: 'ring', icon: 'sprite/set_cathan_ring.png', stats: { damage: 10, mana: 60 }, value: 210 },
            { pieceId: 'cathan_amulet', name: "Cathan's Sigil", slot: 'amulet', type: 'amulet', icon: 'sprite/set_cathan_amulet.png', stats: { health: 70, mana: 70 }, value: 280 }
        ],
        bonuses: {
            2: { text: "+180 Maximum Mana, +20 Attack Damage", stats: { mana: 180, damage: 20 } },
            3: { text: "+400 Maximum Mana, +50 Attack Damage, +25% Critical Strike", stats: { mana: 400, damage: 50, crit: 25 } }
        }
    },
    ISENHART: {
        id: 'ISENHART',
        name: "Isenhart's Armory",
        description: "The blessed armor of the Knightly Order of the Light.",
        pieces: [
            { pieceId: 'isenhart_sword', name: "Isenhart's Lightbrand", slot: 'weapon', type: 'weapon', icon: 'sprite/set_isenhart_sword.png', stats: { damage: 42, dexterity: 6 }, value: 290 },
            { pieceId: 'isenhart_horns', name: "Isenhart's Horns", slot: 'helm', type: 'helm', icon: 'sprite/set_isenhart_horns.png', stats: { defense: 30, health: 50 }, value: 230 },
            { pieceId: 'isenhart_case', name: "Isenhart's Case", slot: 'armor', type: 'armor', icon: 'sprite/set_isenhart_case.png', stats: { defense: 68, strength: 6 }, value: 310 },
            { pieceId: 'isenhart_parry', name: "Isenhart's Parry", slot: 'shield', type: 'shield', icon: 'sprite/set_isenhart_parry.png', stats: { defense: 38, health: 60 }, value: 260 }
        ],
        bonuses: {
            2: { text: "+35 Defense, +12% Critical Strike", stats: { defense: 35, crit: 12 } },
            3: { text: "+30 Attack Damage, +150 Maximum Life", stats: { damage: 30, health: 150 } },
            4: { text: "+65 Attack Damage, +70 Defense, +250 Life, +150 Mana", stats: { damage: 65, defense: 70, health: 250, mana: 150 } }
        }
    }
};

// Helper to create any Set item
export function createSetItem(pieceId) {
    for (const setId in SET_DEFINITIONS) {
        const sDef = SET_DEFINITIONS[setId];
        const pDef = sDef.pieces.find(p => p.pieceId === pieceId);
        if (pDef) {
            return new Item({
                name: pDef.name,
                type: pDef.type,
                slot: pDef.slot,
                rarity: 'set',
                setId: sDef.id,
                setName: sDef.name,
                pieceId: pDef.pieceId,
                icon: pDef.icon,
                stats: Object.assign({}, pDef.stats),
                value: pDef.value,
                description: sDef.description
            });
        }
    }
    return null;
}

// Item Base Class
export class Item {
    constructor(config) {
        this.id = config.id || ('item_' + Math.random().toString(36).substr(2, 9));
        this.name = config.name;
        this.type = config.type; // 'weapon', 'shield', 'armor', 'helm', 'boots', 'ring', 'amulet', 'potion_health', 'potion_mana', 'scroll', 'gold'
        this.slot = config.slot || (config.type === 'axe' ? 'weapon' : config.type);
        this.rarity = config.rarity || 'common'; // 'common', 'magic', 'rare', 'unique', 'set'
        this.stats = config.stats || {};
        this.value = config.value || 10;
        this.description = config.description || '';

        // Set item properties
        this.setId = config.setId || null;
        this.setName = config.setName || null;
        this.pieceId = config.pieceId || null;
        if (this.setId) this.rarity = 'set';

        // Assign authentic Diablo raster graphic
        if (config.icon) {
            this.icon = config.icon;
        } else if (config.type === 'potion_health') {
            this.icon = 'sprite/potion_health_normal.png';
        } else if (config.type === 'potion_mana') {
            this.icon = 'sprite/potion_mana_normal.png';
        } else if (config.type === 'potion_rejuv') {
            this.icon = 'sprite/potion_rejuv.png';
        } else if (config.type === 'gold') {
            this.icon = 'sprite/coins10.png';
        } else if (config.type === 'axe') {
            this.icon = 'sprite/item_axe.png';
        } else if (config.type === 'shield') {
            this.icon = 'sprite/item_shield_kite.png';
        } else if (config.type === 'helm') {
            this.icon = 'sprite/item_helm_horned.png';
        } else if (config.type === 'armor') {
            this.icon = 'sprite/item_armor_plate.png';
        } else if (config.type === 'boots') {
            this.icon = 'sprite/item_boots.png';
        } else if (config.type === 'ring') {
            this.icon = 'sprite/item_ring.png';
        } else if (config.type === 'amulet') {
            this.icon = 'sprite/item_amulet.png';
        } else if (config.type === 'scroll') {
            this.icon = 'sprite/item_scroll.png';
        } else {
            this.icon = 'sprite/item_sword.png';
        }
    }

    getTooltipHTML(hero = null) {
        const rarityClass = `item-${this.rarity}`;
        let statsHtml = '';
        if (this.stats.damage) statsHtml += `<div class="tooltip-stat">Damage: +${this.stats.damage}</div>`;
        if (this.stats.defense) statsHtml += `<div class="tooltip-stat">Defense: +${this.stats.defense}</div>`;
        if (this.stats.health) statsHtml += `<div class="tooltip-stat stat-blue">+${this.stats.health} Maximum Life</div>`;
        if (this.stats.mana) statsHtml += `<div class="tooltip-stat stat-blue">+${this.stats.mana} Maximum Mana</div>`;
        if (this.stats.strength) statsHtml += `<div class="tooltip-stat stat-blue">+${this.stats.strength} Strength</div>`;
        if (this.stats.dexterity) statsHtml += `<div class="tooltip-stat stat-blue">+${this.stats.dexterity} Dexterity</div>`;
        if (this.stats.crit) statsHtml += `<div class="tooltip-stat stat-blue">+${this.stats.crit}% Critical Strike</div>`;
        if (this.stats.heal) statsHtml += `<div class="tooltip-stat stat-heal">Restores ${this.stats.heal} Health</div>`;
        if (this.stats.restoreMana) statsHtml += `<div class="tooltip-stat stat-mana">Restores ${this.stats.restoreMana} Mana</div>`;

        // Set Details section
        let setHtml = '';
        if (this.setId && SET_DEFINITIONS[this.setId]) {
            const setDef = SET_DEFINITIONS[this.setId];
            let activeCount = 0;
            if (hero && hero.equipment) {
                for (const slot in hero.equipment) {
                    const eq = hero.equipment[slot];
                    if (eq && eq.setId === this.setId) activeCount++;
                }
            }

            let piecesHtml = '';
            setDef.pieces.forEach(p => {
                let isEquipped = false;
                if (hero && hero.equipment) {
                    for (const s in hero.equipment) {
                        const eq = hero.equipment[s];
                        if (eq && eq.pieceId === p.pieceId) isEquipped = true;
                    }
                }
                piecesHtml += `<div class="set-piece-entry ${isEquipped ? 'piece-active' : 'piece-inactive'}">${isEquipped ? '✔' : '✖'} ${p.name}</div>`;
            });

            let bonusesHtml = '';
            for (const tierStr in setDef.bonuses) {
                const tier = parseInt(tierStr);
                const b = setDef.bonuses[tier];
                const isActive = activeCount >= tier;
                bonusesHtml += `<div class="set-bonus-entry ${isActive ? 'bonus-active' : 'bonus-inactive'}">(${tier} Items) ${b.text}</div>`;
            }

            setHtml = `
                <div class="tooltip-set-block">
                    <div class="set-title">${setDef.name} (${activeCount}/${setDef.pieces.length} Equipped)</div>
                    <div class="set-pieces-list">${piecesHtml}</div>
                    <div class="set-bonuses-list">${bonusesHtml}</div>
                </div>
            `;
        }

        return `
            <div class="item-tooltip ${rarityClass}">
                <div class="tooltip-title">${this.name}</div>
                <div class="tooltip-type">${this.rarity.toUpperCase()} ${this.type.toUpperCase()}</div>
                <div class="tooltip-stats">${statsHtml}</div>
                ${setHtml}
                ${this.description ? `<div class="tooltip-desc">${this.description}</div>` : ''}
                <div class="tooltip-value"><span class="gold-icon">💰</span> ${this.value} Gold</div>
            </div>
        `;
    }
}

// Ground Item (Rendered on dungeon floor)
export class GroundItem extends Entity {
    constructor(itemData, x, y) {
        const itemObj = itemData instanceof Item ? itemData : new Item(itemData);
        const img = new Image();
        img.src = itemObj.icon;
        super(img, x, y);

        this.item = itemObj;
        this.name = this.item.name;
        this.type = this.item.type;
        this.icon = this.item.icon;
        this.stats = this.item.stats;
        this.rarity = this.item.rarity;
        this.pulse = 0;
    }

    use(hero, scene) {
        const dist = Math.hypot(hero.x - this.x, hero.y - this.y);
        if (dist > 85) {
            hero.to_x = this.x;
            hero.to_y = this.y;
            return false;
        }

        if (this.item.type === 'gold') {
            hero.coins += (this.item.value || 50);
            scene.addFloatingText(`+${this.item.value} Gold`, this.x, this.y, '#ffd700');
            scene.removeItem(this);
            return true;
        }

        const added = hero.inventory.addItem(this.item);
        if (added) {
            scene.addFloatingText(`+${this.item.name}`, this.x, this.y, '#ffffff');
            scene.removeItem(this);
            return true;
        } else {
            scene.addFloatingText("Inventory Full!", hero.x, hero.y, '#ff4444');
            return false;
        }
    }
}

// DeathMob / Corpse (Retained for visual corpses)
export class DeathMob extends Entity {
    constructor(mob) {
        super(mob.death || mob.stay, mob.x, mob.y);
        this.name = `${mob.name || 'Monster'} Corpse`;
        this.step = 0;
        this.angle = mob.angle || 0;
        this.used = false;
        this.offset_x = mob.offset_x || 0;
        this.offset_y = mob.offset_y || 0;
    }

    use(mob, scene) {
        const dist = Math.hypot(mob.x - this.x, mob.y - this.y);
        if (dist > 85) {
            mob.to_x = this.x;
            mob.to_y = this.y;
            return;
        }

        if (!this.used) {
            this.used = true;
            scene.addFloatingText("Looted Corpse", this.x, this.y, '#aaa');
            if (Math.random() > 0.4) {
                scene.addItem(createRandomDrop(scene.hero.level || 1, this.x + 30, this.y + 30));
            }
        }
    }
}

// Breakable Barrel
export class Barrel extends Entity {
    constructor(x, y) {
        super(barrelSprite, x, y);
        this.name = "Barrel";
        this.health = 1;
        this.origin_health = 1;
    }

    use(mob, scene) {
        const dist = Math.hypot(mob.x - this.x, mob.y - this.y);
        if (dist > 90) {
            mob.to_x = this.x;
            mob.to_y = this.y;
            return;
        }

        if (mob.doAttack) {
            mob.doAttack(this);
        } else {
            this.damage(100, scene);
        }
    }

    damage(damage, scene) {
        scene.removeBarrel(this);
        scene.addFloatingText("Smashed!", this.x, this.y, '#c9a227');
        if (Math.random() > 0.3) {
            scene.addItem(createRandomDrop(scene.hero ? scene.hero.level : 1, this.x, this.y));
        }
    }
}

// Gold Coin Drop
export class Coin extends GroundItem {
    constructor(x, y, amount) {
        const goldVal = amount || Math.floor(Math.random() * 80 + 20);
        super({
            name: `${goldVal} Gold Coins`,
            type: 'gold',
            rarity: 'common',
            value: goldVal,
            icon: 'sprite/coins10.png'
        }, x, y);
        this.coins = goldVal;
    }

    use(hero, scene) {
        const dist = Math.hypot(hero.x - this.x, hero.y - this.y);
        if (dist > 85) {
            hero.to_x = this.x;
            hero.to_y = this.y;
            return false;
        }

        hero.coins += this.coins;
        scene.addFloatingText(`+${this.coins} Gold`, this.x, this.y, '#ffd700');
        scene.removeItem(this);
        return true;
    }
}

// Potions (Using authentic sliced potions from sprite/potions.png)
export class PotionHealth extends GroundItem {
    constructor(x, y, tier = 'normal') {
        const tiers = {
            minor: { name: 'Minor Health Potion', heal: 250, value: 25, icon: 'sprite/potion_health_minor.png' },
            normal: { name: 'Health Potion', heal: 500, value: 60, icon: 'sprite/potion_health_normal.png' },
            greater: { name: 'Greater Health Potion', heal: 1000, value: 140, icon: 'sprite/potion_health_greater.png' },
            super: { name: 'Super Health Potion', heal: 2000, value: 300, icon: 'sprite/potion_health_super.png' }
        };
        const cfg = tiers[tier] || tiers.normal;
        super({
            name: cfg.name,
            type: 'potion_health',
            slot: 'belt',
            rarity: 'common',
            stats: { heal: cfg.heal },
            value: cfg.value,
            description: `Restores ${cfg.heal} life points.`,
            icon: cfg.icon
        }, x, y);
        this.health = cfg.heal;
    }

    drink(hero) {
        hero.health = Math.min(hero.origin_health, hero.health + this.health);
    }
}

export class PotionMana extends GroundItem {
    constructor(x, y, tier = 'normal') {
        const tiers = {
            minor: { name: 'Minor Mana Potion', mana: 100, value: 25, icon: 'sprite/potion_mana_minor.png' },
            normal: { name: 'Mana Potion', mana: 250, value: 60, icon: 'sprite/potion_mana_normal.png' },
            greater: { name: 'Greater Mana Potion', mana: 500, value: 140, icon: 'sprite/potion_mana_greater.png' },
            super: { name: 'Super Mana Potion', mana: 1000, value: 300, icon: 'sprite/potion_mana_super.png' }
        };
        const cfg = tiers[tier] || tiers.normal;
        super({
            name: cfg.name,
            type: 'potion_mana',
            slot: 'belt',
            rarity: 'common',
            stats: { restoreMana: cfg.mana },
            value: cfg.value,
            description: `Restores ${cfg.mana} mana points.`,
            icon: cfg.icon
        }, x, y);
        this.mana = cfg.mana;
    }

    drink(hero) {
        hero.mana = Math.min(hero.origin_mana, hero.mana + this.mana);
    }
}

// Procedural Item Generator with authentic Diablo raster graphics
export function createRandomDrop(heroLevel = 1, x, y, bossDrop = false) {
    const rand = Math.random();

    // 40% chance Gold
    if (rand < 0.40 && !bossDrop) {
        const goldAmt = Math.floor((Math.random() * 50 + 25) * (1 + heroLevel * 0.3));
        return new Coin(x, y, goldAmt);
    }

    // 25% chance Potion (Authentic graphic)
    if (rand < 0.65 && !bossDrop) {
        if (Math.random() < 0.6) {
            return new PotionHealth(x, y, heroLevel > 3 ? 'greater' : 'normal');
        } else {
            return new PotionMana(x, y, heroLevel > 3 ? 'greater' : 'normal');
        }
    }

    // Check for Set Item Drop (32% on Bosses, 12% on regular monsters)
    if ((bossDrop && Math.random() < 0.32) || (!bossDrop && Math.random() < 0.12)) {
        const allSetPieces = [];
        for (const setId in SET_DEFINITIONS) {
            SET_DEFINITIONS[setId].pieces.forEach(p => allSetPieces.push(p.pieceId));
        }
        const pickedPieceId = allSetPieces[Math.floor(Math.random() * allSetPieces.length)];
        const setItem = createSetItem(pickedPieceId);
        if (setItem) return new GroundItem(setItem, x, y);
    }

    // Equipment Drop
    let rarity = 'common';
    const rarityRoll = Math.random();
    if (bossDrop) {
        rarity = rarityRoll < 0.45 ? 'unique' : 'rare';
    } else if (rarityRoll < 0.08) {
        rarity = 'unique';
    } else if (rarityRoll < 0.28) {
        rarity = 'rare';
    } else if (rarityRoll < 0.60) {
        rarity = 'magic';
    }

    const equipmentCatalog = [
        // Weapons
        { name: 'Short Sword', type: 'weapon', icon: 'sprite/item_sword.png', baseDmg: 18, value: 45 },
        { name: 'Broad Sword', type: 'weapon', icon: 'sprite/item_broadsword.png', baseDmg: 32, value: 90 },
        { name: 'Battle Axe', type: 'axe', icon: 'sprite/item_axe.png', baseDmg: 48, value: 150 },
        { name: 'Executioner Blade', type: 'weapon', icon: 'sprite/item_broadsword.png', baseDmg: 75, value: 280 },
        // Shields
        { name: 'Buckler', type: 'shield', icon: 'sprite/item_buckler.png', baseDef: 14, value: 40 },
        { name: 'Kite Shield', type: 'shield', icon: 'sprite/item_shield_kite.png', baseDef: 32, value: 110 },
        { name: 'Tower Shield', type: 'shield', icon: 'sprite/item_shield_kite.png', baseDef: 60, value: 240 },
        // Helmets
        { name: 'Cap', type: 'helm', icon: 'sprite/item_helm_cap.png', baseDef: 8, value: 30 },
        { name: 'Skull Cap', type: 'helm', icon: 'sprite/item_helm_cap.png', baseDef: 18, value: 75 },
        { name: 'Horned Great Helm', type: 'helm', icon: 'sprite/item_helm_horned.png', baseDef: 40, value: 200 },
        // Armors
        { name: 'Studded Leather', type: 'armor', icon: 'sprite/item_armor_leather.png', baseDef: 22, value: 65 },
        { name: 'Ring Mail', type: 'armor', icon: 'sprite/item_armor_leather.png', baseDef: 48, value: 150 },
        { name: 'Gothic Plate', type: 'armor', icon: 'sprite/item_armor_plate.png', baseDef: 95, value: 380 },
        // Boots & Accessories
        { name: 'Plated Greaves', type: 'boots', icon: 'sprite/item_boots.png', baseDef: 12, value: 50 },
        { name: 'Ruby Ring', type: 'ring', icon: 'sprite/item_ring.png', baseHp: 35, value: 95 },
        { name: 'Sapphire Amulet', type: 'amulet', icon: 'sprite/item_amulet.png', baseHp: 70, value: 180 },
        { name: 'Scroll of Town Portal', type: 'scroll', icon: 'sprite/item_scroll.png', value: 80 }
    ];

    const template = equipmentCatalog[Math.floor(Math.random() * equipmentCatalog.length)];
    const mult = (1 + heroLevel * 0.25) * (rarity === 'unique' ? 2.5 : rarity === 'rare' ? 1.8 : rarity === 'magic' ? 1.3 : 1.0);

    const stats = {};
    if (template.baseDmg) stats.damage = Math.round(template.baseDmg * mult);
    if (template.baseDef) stats.defense = Math.round(template.baseDef * mult);
    if (template.baseHp || rarity !== 'common') stats.health = Math.round((template.baseHp || 25) * mult);
    if (rarity === 'rare' || rarity === 'unique') {
        stats.crit = Math.floor(Math.random() * 10 + 5);
        stats.strength = Math.floor(Math.random() * 10 + 5);
    }

    let finalName = template.name;
    if (rarity === 'magic') finalName = `Fine ${template.name}`;
    if (rarity === 'rare') finalName = `King's ${template.name} of Carnage`;
    if (rarity === 'unique') {
        const uniqueTitles = {
            weapon: 'The Grandfather',
            axe: 'The Butcher\'s Cleaver',
            shield: 'Stormshield',
            armor: 'Arkaine\'s Valor',
            helm: 'Crown of the Undead King',
            boots: 'Gorefoot',
            ring: 'Stone of Jordan',
            amulet: 'Eye of Etlich',
            scroll: 'Tome of Arcane Wisdom'
        };
        finalName = uniqueTitles[template.type] || `Ancestral ${template.name}`;
    }

    const item = new Item({
        name: finalName,
        type: template.type,
        slot: template.type === 'axe' ? 'weapon' : template.type,
        icon: template.icon,
        rarity: rarity,
        stats: stats,
        value: Math.round(template.value * mult * 1.5),
        description: rarity === 'unique' ? 'An ancient relic imbued with demonic fury.' : ''
    });

    return new GroundItem(item, x, y);
}
