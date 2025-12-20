
import { Entity } from './Entity.js';
import { loadImage, remove } from '../utils.js';
import { DeathMob } from './Items.js'; // Circular dependency warning? JS handles it usually ok if not immediate execution.

export var monsterMap = {
    SK: {
        A1: loadImage("monsters/SK/A1/map.png", 8, 16, true), // true for offsetX
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
    }
};

export class Mob extends Entity {
    constructor(x, y, name) {
        // Init state from map
        var startState = monsterMap[name].NU;
        super(startState, x, y);

        this.name = name;
        this.to_x = x;
        this.to_y = y;
        this.stay = monsterMap[name].NU;
        this.run = monsterMap[name].WL;
        this.death = monsterMap[name].DD;
        this.currentState = this.stay;
        this.step = 0;
        this.angle = 0;
        this.st = 8;

        this.origin_health = this.health = 1000;
        this.resistance = 10;
        this.coins = 0; // Added for hero inheritance
    }

    rotate(sx, sy) {
        var l = this.currentState.angles;
        this.angle = Math.round((Math.atan2(sy, sx) / Math.PI + 2.75) * l / 2 + l / 2) % l;
    }

    rotateTo(point) {
        this.rotate(point.x - this.x, point.y - this.y);
    }

    setState(state) {
        if (this.currentState != state) {
            this.currentState = state;
            this.step = -1;
        }
    }

    // Move logic needs collision check callback
    nextStep(canWalkFunc) {
        var dx = (this.to_x - this.x);
        var dy = (this.to_y - this.y);

        if ((Math.sqrt((dx * dx) + (dy * dy))) > this.st) { // run
            var tx = 0, ty = 0;
            // Raycast / step-check for simplified pathfinding
            for (var st = 0; st < this.st; st += 0.01) {
                var sx = st * dx / Math.sqrt((dx * dx) + (dy * dy));
                var sy = sx * dy / dx;
                if (canWalkFunc(this.x + sx, this.y + sy)) {
                    tx = sx; ty = sy;
                } else {
                    break;
                }
            }
            this.rotate(tx, ty);
            if (Math.sqrt((tx * tx) + (ty * ty)) >= this.st / 2) {
                this.x += tx;
                this.y += ty;
                this.setState(this.run);
            } else {
                this.setState(this.stay);
                // Force stop if blocked
                this.x += tx;
                this.y += ty;
                this.to_x = this.x;
                this.to_y = this.y;
            }
        } else {
            this.setState(this.stay);
            this.to_x = this.x;
            this.to_y = this.y;
        }
        this.step = (this.step + 1) % (this.currentState.steps);
        this.sprite = this.currentState;
    }

    use(mob) {
        if (mob.doAttack) mob.doAttack(this);
    }

    damage(damage, scene) {
        var health = this.health - damage * 1000 / (1000 - this.resistance);
        if (health <= 0) {
            this.health = 0;
            scene.removeMonster(this);
            if (this.death) scene.addItem(new DeathMob(this));
        } else {
            this.health = health;
        }
    }
}

export class AgressiveMob extends Mob {
    constructor(x, y, name) {
        super(x, y, name);
        this.attack = monsterMap[name].A1;
        this.attackOffset = monsterMap[name].attackOffset || 0;
        this.normalOffset = 0;
        this.currentDamage = 30;
        this.attacked = null; // target
    }

    // Override nextStep
    nextStep(canWalkFunc, hero) {
        if (hero && !this.isAboveHero(hero)) return; // Optimization: don't update if far away?

        if (this.currentState == this.attack) {
            if (this.step == (this.attack.steps - 1)) {
                this.currentState = this.stay;
                this.step = -1;
                if (this.attacked) {
                    // Deal damage
                    // We need to confirm attacked is still valid?
                    this.attacked.damage(this.getDamage(), { removeMonster: () => { } }); // Mock scene for hero damage?
                    this.attacked = null;
                }
            }
            this.step = (this.step + 1) % (this.currentState.steps);
            this.sprite = this.currentState;
        } else {
            super.nextStep(canWalkFunc);
        }
        this.offset_y = (this.currentState == this.attack) ? this.attackOffset : this.normalOffset;
    }

    getDamage() {
        return this.currentDamage;
    }

    doAttack(mob) {
        if (this.attacked != mob) {
            this.rotateTo(mob);
            this.setState(this.attack);
            this.attacked = mob;
        }
    }
}
