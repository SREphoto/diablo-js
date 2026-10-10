import { Entity } from './Entity.js';
import { loadImage, remove } from '../utils.js';
import { DeathMob, Coin, createRandomDrop } from './Items.js';
import { MONSTER_TYPES } from './MonsterCatalog.js';
import { sound } from '../core/Sound.js';

export var monsterMap = {
    SK: {
        A1: loadImage("monsters/SK/A1/map.png", 8, 16, true),
        NU: loadImage("monsters/SK/NU/map.png", 8, 8, true),
        WL: loadImage("monsters/SK/WL/map.png", 8, 8, true),
        DD: loadImage("monsters/SK/DD/map.png", 8, 1),
        attackOffset: 10,
    },
    FS: {
        A1: loadImage("monsters/FS/A1/map.png", 8, 17, true),
        NU: loadImage("monsters/FS/NU/map.png", 8, 12, true),
        WL: loadImage("monsters/FS/WL/map.png", 8, 14, true),
        DD: loadImage("monsters/FS/DD/map.png", 8, 1),
    },
    SI: {
        A1: loadImage("monsters/SI/A1/map.png", 8, 16, true),
        NU: loadImage("monsters/SI/NU/map.png", 8, 8, true),
        WL: loadImage("monsters/SI/WL/map.png", 8, 9, true),
        DD: loadImage("monsters/SI/DD/map.png", 8, 1),
    },
    BA: {
        A1: loadImage("monsters/BA/A1/map.png", 16, 9, true),
        NU: loadImage("monsters/BA/NU/map.png", 16, 8, true),
        WL: loadImage("monsters/BA/WL/map.png", 16, 8, true),
        DD: loadImage("monsters/BA/NU/map.png", 16, 1),
    }
};

export class Mob extends Entity {
    constructor(x, y, typeIdOrName = 'SK') {
        const config = MONSTER_TYPES[typeIdOrName] || {
            code: typeIdOrName,
            name: typeIdOrName === 'SK' ? 'Skeleton' : typeIdOrName === 'FS' ? 'Fallen' : typeIdOrName === 'SI' ? 'Sister' : 'Barbarian',
            health: 200,
            damage: 20,
            speed: 7,
            resistance: 10,
            xpReward: 40,
            rarity: 'normal',
            scale: 1.0,
            colorFilter: 'none'
        };

        const code = config.code || 'SK';
        const startState = monsterMap[code] ? monsterMap[code].NU : monsterMap.SK.NU;
        super(startState, x, y);

        this.typeId = typeIdOrName;
        this.code = code;
        this.name = config.name || "Monster";
        this.title = config.title || "";
        this.rarity = config.rarity || 'normal'; // 'normal', 'champion', 'boss'
        this.scale = config.scale || 1.0;
        this.colorFilter = config.colorFilter || 'none';

        this.to_x = x;
        this.to_y = y;
        this.stay = monsterMap[code] ? monsterMap[code].NU : monsterMap.SK.NU;
        this.run = monsterMap[code] ? monsterMap[code].WL : monsterMap.SK.WL;
        this.death = monsterMap[code] ? monsterMap[code].DD : monsterMap.SK.DD;
        this.currentState = this.stay;
        this.step = 0;
        this.angle = 0;
        this.st = config.speed || 7;

        this.origin_health = this.health = config.health || 200;
        this.resistance = config.resistance || 10;
        this.currentDamage = config.damage || 20;
        this.xpReward = config.xpReward || 40;
        this.isDead = false;
        this.coins = 0;
    }

    rotate(sx, sy) {
        var l = this.currentState.angles || 8;
        this.angle = Math.round((Math.atan2(sy, sx) / Math.PI + 2.75) * l / 2 + l / 2) % l;
    }

    rotateTo(point) {
        this.rotate(point.x - this.x, point.y - this.y);
    }

    setState(state) {
        if (this.currentState !== state) {
            this.currentState = state;
            this.step = -1;
        }
    }

    nextStep(canWalkFunc) {
        if (this.isDead) return;

        var dx = (this.to_x - this.x);
        var dy = (this.to_y - this.y);
        var dist = Math.sqrt((dx * dx) + (dy * dy));

        if (dist > this.st) {
            var tx = 0, ty = 0;
            for (var st = 0; st < this.st; st += 0.5) {
                var sx = st * dx / dist;
                var sy = st * dy / dist;
                if (canWalkFunc(this.x + sx, this.y + sy)) {
                    tx = sx;
                    ty = sy;
                } else {
                    break;
                }
            }
            if (tx !== 0 || ty !== 0) {
                this.rotate(tx, ty);
            }
            if (Math.sqrt((tx * tx) + (ty * ty)) >= this.st / 2) {
                this.x += tx;
                this.y += ty;
                this.setState(this.run);
            } else {
                this.setState(this.stay);
                this.to_x = this.x;
                this.to_y = this.y;
            }
        } else {
            this.setState(this.stay);
            this.to_x = this.x;
            this.to_y = this.y;
        }

        const steps = this.currentState.steps || 8;
        this.step = (this.step + 1) % steps;
        this.sprite = this.currentState;
    }

    use(mob, scene) {
        // Player clicked on this monster to attack
        if (mob.targetMonster !== this) {
            mob.targetMonster = this;
        }
        const dist = Math.hypot(mob.x - this.x, mob.y - this.y);
        if (dist <= 100) {
            if (mob.doAttack) mob.doAttack(this);
        } else {
            // Approach monster
            mob.to_x = this.x;
            mob.to_y = this.y;
        }
    }

    damage(damageAmount, scene, attacker, isCrit = false) {
        if (this.isDead) return;

        // Apply resistance
        var actualDamage = Math.max(1, Math.round(damageAmount * (1000 - this.resistance) / 1000));
        this.health = Math.max(0, this.health - actualDamage);

        // Sound & Floating combat text
        if (isCrit) {
            sound.playCrit();
            if (scene && scene.addFloatingText) {
                scene.addFloatingText(`CRIT! -${actualDamage}`, this.x, this.y, '#ffea00');
            }
        } else {
            sound.playHit();
            if (scene && scene.addFloatingText) {
                scene.addFloatingText(`-${actualDamage}`, this.x, this.y, '#ffffff');
            }
        }

        // Check if dead
        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
            this.onDeath(scene, attacker);
        }
    }

    onDeath(scene, attacker) {
        sound.playMonsterDeath();

        // Award XP to Hero
        if (attacker && attacker.addExperience) {
            attacker.addExperience(this.xpReward);
        } else if (scene && scene.hero && scene.hero.addExperience) {
            scene.hero.addExperience(this.xpReward);
        }

        // Floating XP notification
        if (scene && scene.addFloatingText) {
            scene.addFloatingText(`+${this.xpReward} XP`, this.x, this.y - 20, '#ba68c8');
        }

        // Leave corpse sprite
        if (scene && scene.addItem) {
            scene.addItem(new DeathMob(this));
        }

        // Loot Drops!
        if (scene && scene.addItem) {
            const heroLevel = (scene.hero ? scene.hero.level : 1);

            if (this.rarity === 'boss') {
                // Boss Drops: 3 to 5 items with guaranteed unique/rare!
                const numDrops = Math.floor(Math.random() * 2 + 3);
                for (let i = 0; i < numDrops; i++) {
                    const ox = (Math.random() * 80 - 40);
                    const oy = (Math.random() * 80 - 40);
                    scene.addItem(createRandomDrop(heroLevel, this.x + ox, this.y + oy, true));
                }
                scene.addFloatingText("BOSS DEFEATED!", this.x, this.y - 40, '#ffd700');
            } else if (this.rarity === 'champion') {
                // Champion Drops: 2-3 drops
                const numDrops = Math.floor(Math.random() * 2 + 2);
                for (let i = 0; i < numDrops; i++) {
                    const ox = (Math.random() * 60 - 30);
                    const oy = (Math.random() * 60 - 30);
                    scene.addItem(createRandomDrop(heroLevel, this.x + ox, this.y + oy, i === 0));
                }
            } else {
                // Normal monster drops: Gold or potion/gear
                if (Math.random() < 0.55) {
                    const ox = (Math.random() * 40 - 20);
                    const oy = (Math.random() * 40 - 20);
                    scene.addItem(createRandomDrop(heroLevel, this.x + ox, this.y + oy, false));
                }
            }
        }

        // Remove from scene monsters list
        if (scene && scene.removeMonster) {
            scene.removeMonster(this);
        }
    }
}

export class AgressiveMob extends Mob {
    constructor(x, y, typeIdOrName = 'SK') {
        super(x, y, typeIdOrName);
        const code = this.code;
        this.attack = monsterMap[code] ? monsterMap[code].A1 : monsterMap.SK.A1;
        this.attackOffset = (monsterMap[code] && monsterMap[code].attackOffset) || 0;
        this.normalOffset = 0;
        this.attacked = null; // target
        this.attackCooldown = 0;
    }

    nextStep(canWalkFunc, hero, scene) {
        if (this.isDead) return;
        if (hero && !this.isAboveHero(hero)) return;

        if (this.currentState === this.attack) {
            const steps = this.attack.steps || 16;
            if (this.step >= steps - 2) {
                this.currentState = this.stay;
                this.step = -1;
                if (this.attacked && this.attacked.health > 0) {
                    // Deal damage to hero
                    const effectiveScene = scene || (hero && hero.game) || { removeMonster: () => {} };
                    this.attacked.damage(this.getDamage(), effectiveScene, this);
                    this.attacked = null;
                }
            }
            this.step = (this.step + 1) % steps;
            this.sprite = this.currentState;
        } else {
            super.nextStep(canWalkFunc);
        }
        this.offset_y = (this.currentState === this.attack) ? this.attackOffset : this.normalOffset;
    }

    getDamage() {
        return Math.round(this.currentDamage * (0.8 + Math.random() * 0.4));
    }

    doAttack(target) {
        if (this.isDead || !target || target.health <= 0) return;
        if (this.attacked !== target) {
            this.rotateTo(target);
            this.setState(this.attack);
            this.attacked = target;
            sound.playSwing();
        }
    }
}
