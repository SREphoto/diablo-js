
import { Entity } from './Entity.js';
import { loadImage, remove } from '../utils.js';

var barrelSprite = loadImage("sprite/barrel64.png");
var coinSprite = loadImage("sprite/coins10.png");
var potionSprite = loadImage("sprite/potions.png");

export class DeathMob extends Entity {
    constructor(mob) {
        super(mob.death, mob.x, mob.y);
        this.name = "Corpse";
        this.step = 0;
        this.angle = mob.angle;
        this.used = false;
    }

    use(mob, scene) {
        if (!this.used && Math.random() > 0.5) scene.addItem(new Coin(this.x + 50, this.y + 50));
        if (!this.used && Math.random() > 0.5) scene.addItem(new PotionHealth(this.x + 50, this.y));
        this.used = true;
    }
}

export class Barrel extends Entity {
    constructor(x, y) {
        super(barrelSprite, x, y);
        this.name = "Barrel";
    }

    use(mob) {
        if (mob.doAttack) mob.doAttack(this);
    }

    damage(damage, scene) {
        // remove self from barrels list? 
        // In this architecture, the scene should handle removal if marked dead, 
        // or we pass the list. Original passed 'barrels' global.
        scene.removeBarrel(this);
        if (Math.random() > 0.7) scene.addItem(new Coin(this.x, this.y));
    }
}

export class Coin extends Entity {
    constructor(x, y) {
        super(coinSprite, x, y);
        this.name = "Gold Coins";
        this.coins = Math.floor(Math.random() * 1000);
    }

    use(mob, scene) {
        scene.removeItem(this);
        mob.coins += this.coins;
    }
}

export class Potion extends Entity {
    constructor(x, y) {
        super(potionSprite, x, y);
        this.name = "Health Potion";
        this.sprite.steps = 6; // Warning: modifying shared sprite object? 
        // Original code did this. It might be safe if all potions use same steps/angles.
        this.sprite.angles = 4;
    }

    use(mob, scene) {
        if (mob.addToBelt(this)) scene.removeItem(this);
    }
}

export class PotionHealth extends Potion {
    constructor(x, y) {
        super(x, y);
        this.step = 0;
        this.angle = 0;
        this.health = 1000;
    }

    // drink is distinct from use (use = pickup)
    drink(mob) {
        mob.health = Math.min(mob.origin_health, mob.health + this.health);
    }
}
