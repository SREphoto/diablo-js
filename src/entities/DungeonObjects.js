import { Entity } from './Entity.js';
import { createRandomDrop } from './Items.js';
import { loadImage } from '../utils.js';
import { sound } from '../core/Sound.js';

var chestClosedSprite = loadImage("sprite/chest_closed.png");
var chestOpenedSprite = loadImage("sprite/chest_opened.png");
var shrineHealingSprite = loadImage("sprite/shrine_healing.png");
var shrineManaSprite = loadImage("sprite/shrine_mana.png");
var shrinePowerSprite = loadImage("sprite/shrine_power.png");
var stairsDownSprite = loadImage("sprite/stairs_down.png");
var stairsUpSprite = loadImage("sprite/stairs_up.png");
var portalBlueSprite = loadImage("sprite/portal_blue.png");

// Interactive Isometric Treasure Chest
export class Chest extends Entity {
    constructor(x, y) {
        super(chestClosedSprite, x, y);
        this.name = "Treasure Chest";
        this.opened = false;
        this.offset_x = 0;
        this.offset_y = 6;
    }

    use(hero, scene) {
        const dist = Math.hypot(hero.x - this.x, hero.y - this.y);
        if (dist > 100) {
            hero.to_x = this.x;
            hero.to_y = this.y;
            return;
        }
        if (this.opened) return;
        this.opened = true;
        this.sprite = chestOpenedSprite;
        this.name = "Opened Chest";
        sound.playCoin();
        scene.addFloatingText("Chest Opened!", this.x, this.y, '#ffd700');

        // Spawn 2-4 items/gold
        const dropCount = Math.floor(Math.random() * 3 + 2);
        for (let i = 0; i < dropCount; i++) {
            const dropX = this.x + (Math.random() * 80 - 40);
            const dropY = this.y + (Math.random() * 80 - 40);
            scene.addItem(createRandomDrop(hero.level || 1, dropX, dropY, i === 0));
        }
    }
}

// Magic Shrine with authentic gothic monolithic pillar sprite
export class Shrine extends Entity {
    constructor(x, y, type = 'healing') {
        const sprite = type === 'healing' ? shrineHealingSprite : type === 'mana' ? shrineManaSprite : shrinePowerSprite;
        super(sprite, x, y);

        this.type = type;
        this.name = type === 'healing' ? "Shrine of Life" : type === 'mana' ? "Shrine of Mana" : "Shrine of Power";
        this.used = false;
        this.offset_x = 0;
        this.offset_y = 10;
    }

    use(hero, scene) {
        const dist = Math.hypot(hero.x - this.x, hero.y - this.y);
        if (dist > 100) {
            hero.to_x = this.x;
            hero.to_y = this.y;
            return;
        }
        if (this.used) {
            scene.addFloatingText("Shrine is depleted", this.x, this.y, '#888');
            return;
        }
        this.used = true;

        if (this.type === 'healing') {
            hero.health = hero.origin_health;
            sound.playPotion();
            scene.addFloatingText("Full Health Restored!", this.x, this.y, '#44ff44');
            if (scene.ui) scene.ui.updateHealth(hero.health, hero.origin_health);
        } else if (this.type === 'mana') {
            hero.mana = hero.origin_mana;
            sound.playPotion();
            scene.addFloatingText("Full Mana Restored!", this.x, this.y, '#4488ff');
            if (scene.ui) scene.ui.updateMana(hero.mana, hero.origin_mana);
        } else {
            hero.currentDamage += 15;
            sound.playHit();
            scene.addFloatingText("Attack Power Boosted!", this.x, this.y, '#ffff44');
        }
    }
}

// Stone Dungeon Stairs Descending
export class StairsDown extends Entity {
    constructor(x, y, targetFloor = 2, spawnPos = null) {
        super(stairsDownSprite, x, y);

        this.targetFloor = targetFloor;
        this.spawnPos = spawnPos;
        this.name = `Stairs Down (to Floor ${targetFloor})`;
        this.offset_x = 0;
        this.offset_y = 10;
    }

    use(hero, scene) {
        const dist = Math.hypot(hero.x - this.x, hero.y - this.y);
        if (dist > 120) {
            hero.to_x = this.x;
            hero.to_y = this.y;
            return;
        }
        scene.changeFloor(this.targetFloor, this.spawnPos);
    }
}

// Stone Dungeon Stairs Ascending
export class StairsUp extends Entity {
    constructor(x, y, targetFloor = 1, spawnPos = null) {
        super(stairsUpSprite, x, y);

        this.targetFloor = targetFloor;
        this.spawnPos = spawnPos;
        this.name = `Stairs Up (to Floor ${targetFloor})`;
        this.offset_x = 0;
        this.offset_y = 10;
    }

    use(hero, scene) {
        const dist = Math.hypot(hero.x - this.x, hero.y - this.y);
        if (dist > 120) {
            hero.to_x = this.x;
            hero.to_y = this.y;
            return;
        }
        scene.changeFloor(this.targetFloor, this.spawnPos);
    }
}

// Blue Town Portal / Mystic Portal
export class DungeonPortal extends StairsDown {
    constructor(x, y, targetFloor = 0, spawnPos = null) {
        super(x, y, targetFloor, spawnPos);
        this.sprite = portalBlueSprite;
        this.name = targetFloor === 0 ? "Town Portal (to Tristram)" : `Dungeon Portal (to Floor ${targetFloor})`;
        this.offset_x = 0;
        this.offset_y = 12;
    }
}

// Town NPCs
var griswoldSprite = loadImage("sprite/npc_griswold.png");
var adriaSprite = loadImage("sprite/npc_adria.png");
var cainSprite = loadImage("sprite/npc_cain.png");
var pepinSprite = loadImage("sprite/npc_pepin.png");
var stashChestSprite = loadImage("sprite/chest_closed.png");
var propAnvilSprite = loadImage("sprite/prop_anvil.png");
var propWellSprite = loadImage("sprite/prop_well.png");
var houseSprite = loadImage("sprite/house.png");

export class GriswoldNPC extends Entity {
    constructor(x, y) {
        super(griswoldSprite, x, y);
        this.name = "Griswold the Blacksmith";
        this.title = "Weaponsmith & Armorer";
        this.offset_x = 0;
        this.offset_y = 6;
    }

    use(hero, scene) {
        const dist = Math.hypot(hero.x - this.x, hero.y - this.y);
        if (dist > 110) {
            hero.to_x = this.x;
            hero.to_y = this.y;
            return;
        }
        sound.playClick();
        if (scene.invUI && scene.invUI.openVendor) {
            scene.invUI.openVendor('griswold');
        }
    }
}

export class AdriaNPC extends Entity {
    constructor(x, y) {
        super(adriaSprite, x, y);
        this.name = "Adria the Witch";
        this.title = "Alchemist & Arcane Vendor";
        this.offset_x = 0;
        this.offset_y = 6;
    }

    use(hero, scene) {
        const dist = Math.hypot(hero.x - this.x, hero.y - this.y);
        if (dist > 110) {
            hero.to_x = this.x;
            hero.to_y = this.y;
            return;
        }
        sound.playClick();
        if (scene.invUI && scene.invUI.openVendor) {
            scene.invUI.openVendor('adria');
        }
    }
}

export class CainNPC extends Entity {
    constructor(x, y) {
        super(cainSprite, x, y);
        this.name = "Deckard Cain";
        this.title = "Elder of Tristram";
        this.offset_x = 0;
        this.offset_y = 6;
    }

    use(hero, scene) {
        const dist = Math.hypot(hero.x - this.x, hero.y - this.y);
        if (dist > 110) {
            hero.to_x = this.x;
            hero.to_y = this.y;
            return;
        }
        sound.playClick();
        scene.addFloatingText('"Stay awhile and listen!"', this.x, this.y - 30, '#ffd700');
        if (scene.invUI && scene.invUI.openVendor) {
            scene.invUI.openVendor('cain');
        }
    }
}

export class PepinNPC extends Entity {
    constructor(x, y) {
        super(pepinSprite, x, y);
        this.name = "Pepin the Healer";
        this.title = "Town Cleric";
        this.offset_x = 0;
        this.offset_y = 6;
    }

    use(hero, scene) {
        const dist = Math.hypot(hero.x - this.x, hero.y - this.y);
        if (dist > 110) {
            hero.to_x = this.x;
            hero.to_y = this.y;
            return;
        }
        hero.health = hero.origin_health;
        hero.mana = hero.origin_mana;
        sound.playPotion();
        scene.addFloatingText("Full Health & Mana Restored!", hero.x, hero.y, '#44ff44');
        if (scene.ui) {
            scene.ui.updateHealth(hero.health, hero.origin_health);
            scene.ui.updateMana(hero.mana, hero.origin_mana);
        }
        if (scene.invUI && scene.invUI.openVendor) {
            scene.invUI.openVendor('pepin');
        }
    }
}

export class TownStashChest extends Entity {
    constructor(x, y) {
        super(stashChestSprite, x, y);
        this.name = "Adventurer's Town Stash";
        this.offset_x = 0;
        this.offset_y = 6;
    }

    use(hero, scene) {
        const dist = Math.hypot(hero.x - this.x, hero.y - this.y);
        if (dist > 110) {
            hero.to_x = this.x;
            hero.to_y = this.y;
            return;
        }
        sound.playClick();
        if (scene.invUI && scene.invUI.openStash) {
            scene.invUI.openStash();
        }
    }
}

export class PropAnvil extends Entity {
    constructor(x, y) {
        super(propAnvilSprite, x, y);
        this.name = "Blacksmith's Anvil & Forge";
    }
    use(hero, scene) {
        scene.addFloatingText("Griswold's Forge", this.x, this.y - 20, '#ff9900');
    }
}

export class PropWell extends Entity {
    constructor(x, y) {
        super(propWellSprite, x, y);
        this.name = "Tristram Town Well";
    }
    use(hero, scene) {
        hero.health = hero.origin_health;
        hero.mana = hero.origin_mana;
        sound.playPotion();
        scene.addFloatingText("Refreshing Well Water: Restored!", hero.x, hero.y, '#60a0ff');
        if (scene.ui) {
            scene.ui.updateHealth(hero.health, hero.origin_health);
            scene.ui.updateMana(hero.mana, hero.origin_mana);
        }
    }
}

export class TownHouse extends Entity {
    constructor(x, y) {
        super(houseSprite, x, y);
        this.name = "Tristram Smithy";
        this.scale = 0.55;
    }
    use(hero, scene) {}
}
