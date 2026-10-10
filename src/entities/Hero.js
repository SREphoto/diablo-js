import { AgressiveMob } from './Mob.js';
import { Item, PotionHealth, PotionMana, GroundItem, SET_DEFINITIONS } from './Items.js';
import { sound } from '../core/Sound.js';

export class HeroBarbarian extends AgressiveMob {
    constructor(x, y, game) {
        super(x, y, "BA");
        this.game = game;
        this.name = "Barbarian";

        this.attackOffset = 40;
        this.normalOffset = 10;
        this.st = 14;

        // Core Attributes
        this.strength = 30;
        this.dexterity = 20;
        this.vitality = 25;
        this.energy = 10;
        this.statPoints = 0;

        // RPG Progression
        this.level = 1;
        this.experience = 0;
        this.nextLevelXP = 300;
        this.monstersSlain = 0;
        this.coins = 150;

        // Base Combat Stats
        this.baseHealth = 1000;
        this.origin_health = this.baseHealth;
        this.health = this.origin_health;

        this.baseMana = 250;
        this.origin_mana = this.baseMana;
        this.mana = this.origin_mana;

        this.baseDamage = 35;
        this.criticalDamage = 0.15; // 15% base crit chance
        this.defense = 15;

        // Target for auto-attack and interaction
        this.targetMonster = null;
        this.targetInteractable = null;
        this.attackRange = 95;

        // Equipment Slots
        this.equipment = {
            weapon: null,
            shield: null,
            armor: null,
            helm: null,
            boots: null,
            ring1: null,
            ring2: null,
            amulet: null
        };

        // Inventory Grid (4 rows x 10 cols = 40 slots)
        this.inventory = {
            size: 40,
            slots: new Array(40).fill(null),
            addItem: (item) => this.addItemToInventory(item),
            removeItem: (index) => {
                const item = this.inventory.slots[index];
                this.inventory.slots[index] = null;
                return item;
            }
        };

        // Town Stash Box (5 rows x 10 cols = 50 slots)
        this.stash = {
            size: 50,
            slots: new Array(50).fill(null)
        };

        // Belt (5 quick slots)
        this.belt = {
            size: 5,
            items: new Array(5).fill(null)
        };

        // Active Set Bonuses
        this.activeSetBonuses = [];

        // Active Buffs
        this.warCryActive = false;
        this.warCryTimer = 0;

        // Equip starter gear
        this.initStarterGear();
        this.recalculateStats();
    }

    initStarterGear() {
        const starterSword = new Item({
            name: "Rusty Short Sword",
            type: "weapon",
            slot: "weapon",
            rarity: "common",
            stats: { damage: 15, crit: 5 },
            value: 20,
            icon: "sprite/item_sword.png",
            description: "A weathered blade from the Arreat Highlands."
        });

        const starterShield = new Item({
            name: "Cracked Buckler",
            type: "shield",
            slot: "shield",
            rarity: "common",
            stats: { defense: 10, health: 30 },
            value: 15,
            icon: "sprite/item_buckler.png",
            description: "A small wooden shield reinforced with rusted iron."
        });

        const starterArmor = new Item({
            name: "Worn Leather Tunic",
            type: "armor",
            slot: "armor",
            rarity: "common",
            stats: { defense: 15, health: 50 },
            value: 25,
            icon: "sprite/item_armor_leather.png",
            description: "Basic leather armor for mountain wanderers."
        });

        this.equipment.weapon = starterSword;
        this.equipment.shield = starterShield;
        this.equipment.armor = starterArmor;

        // Starter Potions placed directly into Adventurer's Backpack
        this.inventory.slots[0] = new PotionHealth(0, 0, 'normal').item;
        this.inventory.slots[1] = new PotionHealth(0, 0, 'normal').item;
        this.inventory.slots[2] = new PotionMana(0, 0, 'normal').item;

        // Starter Potions in Quick Belt
        this.belt.items[0] = new PotionHealth(0, 0, 'normal').item;
        this.belt.items[1] = new PotionMana(0, 0, 'normal').item;
    }

    addItemToInventory(item) {
        // Items and potions go directly into Adventurer's Backpack grid slots
        for (let i = 0; i < this.inventory.size; i++) {
            if (!this.inventory.slots[i]) {
                this.inventory.slots[i] = item;
                return true;
            }
        }

        // Fallback: If backpack is completely full and item is a potion, check belt
        if (item.type === 'potion_health' || item.type === 'potion_mana' || item.type === 'potion_rejuv') {
            for (let i = 0; i < this.belt.size; i++) {
                if (!this.belt.items[i]) {
                    this.belt.items[i] = item;
                    return true;
                }
            }
        }

        return false;
    }

    equip(item, fromSlotIndex = -1) {
        if (!item || !item.slot) return false;
        const targetSlot = item.slot === 'axe' ? 'weapon' : item.slot;

        if (this.equipment.hasOwnProperty(targetSlot)) {
            const previousItem = this.equipment[targetSlot];
            this.equipment[targetSlot] = item;

            if (fromSlotIndex >= 0) {
                this.inventory.slots[fromSlotIndex] = previousItem; // Swap back
            }

            sound.playEquip();
            this.recalculateStats();
            return true;
        }
        return false;
    }

    unequip(slotName) {
        if (this.equipment[slotName]) {
            const item = this.equipment[slotName];
            if (this.addItemToInventory(item)) {
                this.equipment[slotName] = null;
                sound.playEquip();
                this.recalculateStats();
                return true;
            }
        }
        return false;
    }

    recalculateStats() {
        let bonusDmg = 0;
        let bonusDef = 0;
        let bonusHp = 0;
        let bonusMana = 0;
        let bonusCrit = 0;
        let bonusStr = 0;
        let bonusDex = 0;

        // 1. Tally individual equipment stats
        for (const slot in this.equipment) {
            const it = this.equipment[slot];
            if (it && it.stats) {
                if (it.stats.damage) bonusDmg += it.stats.damage;
                if (it.stats.defense) bonusDef += it.stats.defense;
                if (it.stats.health) bonusHp += it.stats.health;
                if (it.stats.mana) bonusMana += it.stats.mana;
                if (it.stats.crit) bonusCrit += it.stats.crit;
                if (it.stats.strength) bonusStr += it.stats.strength;
                if (it.stats.dexterity) bonusDex += it.stats.dexterity;
            }
        }

        // 2. Tally Set Items & Apply Tier Bonuses
        this.activeSetBonuses = [];
        const setCount = {};
        for (const slot in this.equipment) {
            const it = this.equipment[slot];
            if (it && it.setId) {
                setCount[it.setId] = (setCount[it.setId] || 0) + 1;
            }
        }

        for (const sId in setCount) {
            const count = setCount[sId];
            const setDef = SET_DEFINITIONS[sId];
            if (setDef && setDef.bonuses) {
                for (const tierStr in setDef.bonuses) {
                    const tier = parseInt(tierStr);
                    if (count >= tier) {
                        const b = setDef.bonuses[tier];
                        if (b.stats) {
                            if (b.stats.damage) bonusDmg += b.stats.damage;
                            if (b.stats.defense) bonusDef += b.stats.defense;
                            if (b.stats.health) bonusHp += b.stats.health;
                            if (b.stats.mana) bonusMana += b.stats.mana;
                            if (b.stats.crit) bonusCrit += b.stats.crit;
                        }
                        this.activeSetBonuses.push({
                            setId: sId,
                            setName: setDef.name,
                            tier: tier,
                            text: b.text
                        });
                    }
                }
            }
        }

        const effectiveStr = this.strength + bonusStr;
        const effectiveDex = this.dexterity + bonusDex;

        // Damage formula: (Base + Weapon) * (1 + STR * 0.02)
        let totalDmg = Math.round((this.baseDamage + bonusDmg) * (1 + effectiveStr * 0.015));
        let totalDef = Math.round((this.defense + bonusDef) + (effectiveDex * 0.5));

        // War Cry buff
        if (this.warCryActive) {
            totalDmg = Math.round(totalDmg * 1.35);
            totalDef = Math.round(totalDef * 1.35);
        }

        this.currentDamage = totalDmg;
        this.defense = totalDef;
        this.criticalDamage = Math.min(0.75, 0.15 + (effectiveDex * 0.005) + (bonusCrit / 100));

        this.origin_health = this.baseHealth + (this.vitality * 15) + bonusHp;
        this.health = Math.min(this.health, this.origin_health);

        this.origin_mana = this.baseMana + (this.energy * 10) + bonusMana;
        this.mana = Math.min(this.mana, this.origin_mana);
    }

    dropItem(slotIndex, isEquipmentSlot = false, game = null) {
        let item = null;
        if (isEquipmentSlot) {
            item = this.equipment[slotIndex];
            this.equipment[slotIndex] = null;
            this.recalculateStats();
        } else {
            item = this.inventory.slots[slotIndex];
            this.inventory.slots[slotIndex] = null;
        }

        if (!item) return false;

        const effectiveGame = game || this.game;
        if (effectiveGame) {
            const dropX = this.x + (Math.random() * 30 - 15);
            const dropY = this.y + (Math.random() * 30 - 15);
            const groundItem = new GroundItem(item, dropX, dropY);
            effectiveGame.addItem(groundItem);
            effectiveGame.addFloatingText(`Dropped ${item.name}`, dropX, dropY, '#b0b0b0');
            sound.playEquip();
            if (effectiveGame.invUI) effectiveGame.invUI.render();
        }
        return true;
    }

    depositToStash(invIndex) {
        const item = this.inventory.slots[invIndex];
        if (!item) return false;

        for (let i = 0; i < this.stash.size; i++) {
            if (!this.stash.slots[i]) {
                this.stash.slots[i] = item;
                this.inventory.slots[invIndex] = null;
                sound.playEquip();
                return true;
            }
        }
        return false;
    }

    withdrawFromStash(stashIndex) {
        const item = this.stash.slots[stashIndex];
        if (!item) return false;

        for (let i = 0; i < this.inventory.size; i++) {
            if (!this.inventory.slots[i]) {
                this.inventory.slots[i] = item;
                this.stash.slots[stashIndex] = null;
                sound.playEquip();
                return true;
            }
        }
        return false;
    }

    addToBelt(potion) {
        for (let i = 0; i < this.belt.size; i++) {
            if (!this.belt.items[i]) {
                this.belt.items[i] = potion;
                return true;
            }
        }
        return false;
    }

    useBeltSlot(index) {
        const item = this.belt.items[index];
        if (!item) return false;

        if (item.type === 'potion_health' || item.stats && item.stats.heal) {
            item.drink ? item.drink(this) : (this.health = Math.min(this.origin_health, this.health + (item.stats.heal || 500)));
            sound.playPotion();
            this.belt.items[index] = null;
            return true;
        } else if (item.type === 'potion_mana' || item.stats && item.stats.restoreMana) {
            item.drink ? item.drink(this) : (this.mana = Math.min(this.origin_mana, this.mana + (item.stats.restoreMana || 250)));
            sound.playPotion();
            this.belt.items[index] = null;
            return true;
        }
        return false;
    }

    getDamage() {
        const isCrit = Math.random() < this.criticalDamage;
        const multiplier = isCrit ? 2.5 : (0.9 + Math.random() * 0.2);
        return {
            amount: Math.round(this.currentDamage * multiplier),
            isCrit: isCrit
        };
    }

    // Single Target Attack
    doAttack(target) {
        if (!target || target.isDead || target.health <= 0) {
            this.targetMonster = null;
            return;
        }

        this.rotateTo(target);
        this.setState(this.attack);
        this.attacked = target;
        sound.playSwing();
    }

    // Step update
    nextStep(canWalkFunc) {
        // If we have a target monster, approach or attack
        if (this.targetMonster) {
            if (this.targetMonster.isDead || this.targetMonster.health <= 0) {
                this.targetMonster = null;
            } else {
                const dist = Math.hypot(this.targetMonster.x - this.x, this.targetMonster.y - this.y);
                if (dist <= this.attackRange) {
                    // In attack range
                    this.to_x = this.x;
                    this.to_y = this.y;
                    if (this.currentState !== this.attack) {
                        this.doAttack(this.targetMonster);
                    }
                } else {
                    // Run to target
                    this.to_x = this.targetMonster.x;
                    this.to_y = this.targetMonster.y;
                }
            }
        } else if (this.targetInteractable) {
            // Approach interactive object (Chest, Shrine, Stairs, Item) and interact upon arrival
            const dist = Math.hypot(this.targetInteractable.x - this.x, this.targetInteractable.y - this.y);
            const reach = (this.targetInteractable.constructor && this.targetInteractable.constructor.name.includes('Stairs')) ? 110 : 80;
            if (dist <= reach) {
                const target = this.targetInteractable;
                this.targetInteractable = null;
                this.to_x = this.x;
                this.to_y = this.y;
                target.use(this, this.game);
            } else {
                this.to_x = this.targetInteractable.x;
                this.to_y = this.targetInteractable.y;
            }
        }

        // Handle attack animation strike frame
        if (this.currentState === this.attack) {
            const steps = this.attack.steps || 9;
            if (this.step >= steps - 2) {
                this.currentState = this.stay;
                this.step = -1;
                if (this.attacked && this.attacked.health > 0) {
                    const dmgObj = this.getDamage();
                    this.attacked.damage(dmgObj.amount, this.game, this, dmgObj.isCrit);
                    this.attacked = null;
                }
            }
            this.step = (this.step + 1) % steps;
            this.sprite = this.currentState;
        } else {
            super.nextStep(canWalkFunc);
        }

        // War Cry timer decay
        if (this.warCryActive && Date.now() > this.warCryTimer) {
            this.warCryActive = false;
            this.recalculateStats();
        }

        this.offset_y = (this.currentState === this.attack) ? this.attackOffset : this.normalOffset;
    }

    // SKILL 1: Bash / Heavy Strike (Key 1)
    useSkillBash(target) {
        const manaCost = 15;
        if (this.mana < manaCost) {
            if (this.game) this.game.addFloatingText("Not enough mana!", this.x, this.y, '#4488ff');
            return false;
        }
        const effectiveTarget = target || this.targetMonster || this.findNearestMonster(120);
        if (!effectiveTarget) {
            if (this.game) this.game.addFloatingText("No target in range!", this.x, this.y, '#aaa');
            return false;
        }

        this.mana -= manaCost;
        this.rotateTo(effectiveTarget);
        this.setState(this.attack);
        sound.playCrit();

        const bashDmg = Math.round(this.currentDamage * 2.2);
        effectiveTarget.damage(bashDmg, this.game, this, true);
        if (this.game) this.game.addFloatingText("BASH!", effectiveTarget.x, effectiveTarget.y, '#ff4444');
        return true;
    }

    // SKILL 2: Whirlwind / Cleave (Key 2)
    useSkillWhirlwind() {
        const manaCost = 25;
        if (this.mana < manaCost) {
            if (this.game) this.game.addFloatingText("Not enough mana!", this.x, this.y, '#4488ff');
            return false;
        }

        this.mana -= manaCost;
        sound.playWhirlwind();

        if (this.game) {
            this.game.addFloatingText("WHIRLWIND!", this.x, this.y, '#ffd700');
            // Hit all nearby monsters
            let hits = 0;
            const radius = 150;
            for (let m of [...this.game.monsters]) {
                const dist = Math.hypot(m.x - this.x, m.y - this.y);
                if (dist <= radius && !m.isDead) {
                    const dmg = Math.round(this.currentDamage * 1.6);
                    m.damage(dmg, this.game, this, Math.random() < 0.3);
                    hits++;
                }
            }
            if (hits === 0) {
                this.game.addFloatingText("Whiff!", this.x, this.y, '#888');
            }
        }
        return true;
    }

    // SKILL 3: Leap Attack (Key 3)
    useSkillLeap(destX, destY) {
        const manaCost = 20;
        if (this.mana < manaCost) {
            if (this.game) this.game.addFloatingText("Not enough mana!", this.x, this.y, '#4488ff');
            return false;
        }

        this.mana -= manaCost;
        sound.playLeap();

        // Leap to destination
        this.x = destX;
        this.y = destY;
        this.to_x = destX;
        this.to_y = destY;

        if (this.game) {
            this.game.addFloatingText("LEAP SLAM!", this.x, this.y, '#ff9900');
            for (let m of [...this.game.monsters]) {
                const dist = Math.hypot(m.x - this.x, m.y - this.y);
                if (dist <= 120 && !m.isDead) {
                    m.damage(Math.round(this.currentDamage * 1.4), this.game, this, true);
                }
            }
        }
        return true;
    }

    // SKILL 4: War Cry (Key 4)
    useSkillWarCry() {
        const manaCost = 20;
        if (this.mana < manaCost) {
            if (this.game) this.game.addFloatingText("Not enough mana!", this.x, this.y, '#4488ff');
            return false;
        }

        this.mana -= manaCost;
        sound.playWarCry();

        this.warCryActive = true;
        this.warCryTimer = Date.now() + 15000; // 15 seconds
        this.recalculateStats();

        if (this.game) {
            this.game.addFloatingText("BATTLE CRY! +35% ATK & DEF", this.x, this.y, '#ff3333');
        }
        return true;
    }

    // Find nearest monster within a range
    findNearestMonster(range = 150) {
        if (!this.game || !this.game.monsters) return null;
        let nearest = null;
        let bestDist = Infinity;
        for (let m of this.game.monsters) {
            if (m.isDead) continue;
            const dist = Math.hypot(m.x - this.x, m.y - this.y);
            if (dist < bestDist && dist <= range) {
                bestDist = dist;
                nearest = m;
            }
        }
        return nearest;
    }

    // Hero Takes Damage
    damage(rawDamage, scene, attacker) {
        // Armor mitigation formula: damage * (100 / (100 + defense))
        const effectiveDamage = Math.max(2, Math.round(rawDamage * (100 / (100 + this.defense))));
        this.health = Math.max(0, this.health - effectiveDamage);

        sound.playHit();
        if (scene && scene.addFloatingText) {
            scene.addFloatingText(`-${effectiveDamage}`, this.x, this.y, '#ff3333');
        }

        if (this.health <= 0) {
            this.health = 0;
            if (scene && scene.onHeroDied) {
                scene.onHeroDied();
            }
        }
    }

    // Level-up System
    addExperience(amount) {
        this.experience += amount;
        this.monstersSlain++;

        while (this.experience >= this.nextLevelXP) {
            this.experience -= this.nextLevelXP;
            this.level++;
            this.nextLevelXP = Math.floor(this.nextLevelXP * 1.35);

            // Stat growth
            this.statPoints += 5;
            this.baseHealth += 100;
            this.baseMana += 30;
            this.baseDamage += 6;

            // Full heal on level-up
            this.health = this.origin_health;
            this.mana = this.origin_mana;

            sound.playLevelUp();
            this.recalculateStats();

            if (this.game && this.game.addFloatingText) {
                this.game.addFloatingText(`LEVEL UP! (Level ${this.level})`, this.x, this.y - 30, '#ffd700');
            }
        }
    }
}
