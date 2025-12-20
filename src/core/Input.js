
import { CONFIG } from '../config.js';
import { PotionHealth } from '../entities/Items.js';
import { remove } from '../utils.js';

export class InputHandler {
    constructor(game, canvas) {
        this.game = game;
        this.canvas = canvas;

        // Bind events
        this.canvas.onclick = (e) => this.onClick(e);
        window.onkeydown = (e) => this.onKeyDown(e);
    }

    onClick(e) {
        var floor = this.game.renderer; // Access renderer dimensions
        var hero = this.game.hero;

        var mx = (e.offsetX == undefined ? e.layerX : e.offsetX) - floor.w / 2;
        var my = (e.offsetY == undefined ? e.layerY : e.offsetY) - floor.h / 2;
        var isCanClick = Math.abs(mx) < 100 && Math.abs(my) < 100;

        my *= 2; // unscale
        var click_x = hero.x + mx * Math.cos(-CONFIG.a) - my * Math.sin(-CONFIG.a);
        var click_y = hero.y + mx * Math.sin(-CONFIG.a) + my * Math.cos(-CONFIG.a);

        // Process click on objects
        if (isCanClick) {
            if (this.game.processClick(click_x, click_y)) return;
        }

        hero.to_x = click_x;
        hero.to_y = click_y;
    }

    onKeyDown(e) {
        var hero = this.game.hero;
        var beltKeys = [49, 50, 51, 52, 53, 54, 55, 56, 57, 48]; // 1-9, 0
        var beltIndex = beltKeys.indexOf(e.keyCode);

        if (beltIndex >= 0) {
            if (hero.belt.items[beltIndex] instanceof PotionHealth) {
                hero.belt.items[beltIndex].drink(hero);
                remove(hero.belt.items, hero.belt.items[beltIndex]);
            }
            return false;
        }

        if (e.keyCode == 9) { // Tab
            this.game.showMap = !this.game.showMap;
            e.preventDefault();
            return false;
        }
    }
}
