import { AgressiveMob } from './Mob.js';

export class HeroBarbarian extends AgressiveMob {
    constructor(x, y) {
        super(x, y, "BA");
        this.attackOffset = 40;
        this.normalOffset = 10;
        this.health = this.origin_health = 1000;
        this.belt = { items: [], size: 10 };
        this.st = 16;
        this.criticalDamage = 0.4;
        this.currentDamage = 120;
        // New RPG stats
        this.coins = 0;
        this.experience = 0;
        this.level = 1;
        this.nextLevelXP = 1000;
    }

    addToBelt(potion) {
        for (var i = 0; i < this.belt.size; i++) {
            if (typeof this.belt.items[i] == "undefined") {
                this.belt.items[i] = potion;
                return true;
            }
        }
        return false;
    }

    getDamage() {
        return this.currentDamage * (Math.random() <= this.criticalDamage ? 4 : 1);
    }

    // Simple attack method – target must be a Mob
    attack(target) {
        if (!target) return;
        const dmg = this.getDamage();
        target.damage(dmg, this.game);
    }

    // Find nearest monster within a range (used by input)
    findNearestMonster(range = 150) {
        let nearest = null;
        let bestDist = Infinity;
        for (let m of this.game.monsters) {
            const dx = m.x - this.x;
            const dy = m.y - this.y;
            const dist = Math.hypot(dx, dy);
            if (dist < bestDist && dist <= range) {
                bestDist = dist;
                nearest = m;
            }
        }
        return nearest;
    }

    // Level‑up helper
    tryLevelUp() {
        while (this.experience >= this.nextLevelXP) {
            this.experience -= this.nextLevelXP;
            this.level++;
            this.nextLevelXP = Math.floor(this.nextLevelXP * 1.2);
            // Simple stat bump
            this.origin_health += 200;
            this.health = this.origin_health;
        }
    }
}
