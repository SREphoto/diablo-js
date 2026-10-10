import { CONFIG } from '../config.js';

export class InputHandler {
    constructor(game, canvas) {
        this.game = game;
        this.canvas = canvas;
        this.isMouseDown = false;
        this.lastMousePos = { x: 0, y: 0 };

        // Bind mouse events
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mouseup', () => this.onMouseUp());
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        // Keyboard events
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
    }

    getCanvasPos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    onMouseDown(e) {
        this.isMouseDown = true;
        const pos = this.getCanvasPos(e);
        this.lastMousePos = pos;
        this.processPointer(pos.x, pos.y, e.shiftKey, e.button === 2);
    }

    onMouseUp() {
        this.isMouseDown = false;
    }

    onMouseMove(e) {
        const pos = this.getCanvasPos(e);
        this.lastMousePos = pos;
        if (this.isMouseDown) {
            this.processPointer(pos.x, pos.y, e.shiftKey, false);
        }
    }

    processPointer(canvasX, canvasY, shiftKey = false, isRightClick = false) {
        const hero = this.game.hero;
        const floor = this.game.renderer;

        // 1. Check for entity click (Monster, Ground Item, Barrel, Chest, Shrine, Portal, Stairs)
        const clickedEntity = this.game.getEntityAtCanvasPoint(canvasX, canvasY);

        if (clickedEntity) {
            if (clickedEntity.constructor && clickedEntity.constructor.name.includes('Mob')) {
                hero.targetInteractable = null;
            } else {
                hero.targetMonster = null;
                hero.targetInteractable = clickedEntity;
            }
            clickedEntity.use(hero, this.game);
            return;
        }

        // 2. Click on empty ground -> Walk to target point
        const mx_rel = canvasX - floor.w / 2;
        const my_rel = canvasY - floor.h / 2;

        const u = mx_rel / CONFIG.acos;
        const v = (2 * my_rel) / CONFIG.asin;

        const click_x = hero.x + (v + u) / 2;
        const click_y = hero.y + (v - u) / 2;

        if (shiftKey) {
            // Shift-Click: Attack in place towards mouse direction
            hero.targetMonster = null;
            hero.targetInteractable = null;
            hero.to_x = hero.x;
            hero.to_y = hero.y;
            hero.rotateTo({ x: click_x, y: click_y });
            hero.setState(hero.attack);
            return;
        }

        hero.targetMonster = null;
        hero.targetInteractable = null;
        hero.to_x = click_x;
        hero.to_y = click_y;
    }

    onKeyDown(e) {
        const hero = this.game.hero;

        // [ESC] -> Toggle Game Menu
        if (e.key === 'Escape') {
            this.game.toggleMenu();
            e.preventDefault();
            return;
        }

        // [I] or [B] -> Toggle Inventory
        if (e.key === 'i' || e.key === 'I' || e.key === 'b' || e.key === 'B') {
            this.game.toggleInventory();
            e.preventDefault();
            return;
        }

        // [C] -> Toggle Character Stats
        if (e.key === 'c' || e.key === 'C') {
            this.game.toggleCharacterSheet();
            e.preventDefault();
            return;
        }

        // [TAB] or [M] -> Toggle Minimap
        if (e.key === 'Tab' || e.key === 'm' || e.key === 'M') {
            this.game.showMap = !this.game.showMap;
            e.preventDefault();
            return;
        }

        // [T] -> Town Portal
        if (e.key === 't' || e.key === 'T') {
            this.game.castTownPortal();
            e.preventDefault();
            return;
        }

        // Skills / Belt Slots: 1, 2, 3, 4, 5
        if (e.key === '1') {
            // Skill 1: Bash
            if (!hero.useSkillBash()) {
                hero.useBeltSlot(0);
            }
            e.preventDefault();
            return;
        }

        if (e.key === '2') {
            // Skill 2: Whirlwind
            if (!hero.useSkillWhirlwind()) {
                hero.useBeltSlot(1);
            }
            e.preventDefault();
            return;
        }

        if (e.key === '3') {
            // Skill 3: Leap Attack towards cursor
            const floor = this.game.renderer;
            const mx_rel = this.lastMousePos.x - floor.w / 2;
            const my_rel = this.lastMousePos.y - floor.h / 2;
            const u = mx_rel / CONFIG.acos;
            const v = (2 * my_rel) / CONFIG.asin;
            const leapX = hero.x + (v + u) / 2;
            const leapY = hero.y + (v - u) / 2;

            if (!hero.useSkillLeap(leapX, leapY)) {
                hero.useBeltSlot(2);
            }
            e.preventDefault();
            return;
        }

        if (e.key === '4') {
            // Skill 4: War Cry
            if (!hero.useSkillWarCry()) {
                hero.useBeltSlot(3);
            }
            e.preventDefault();
            return;
        }

        if (e.key === '5') {
            // Potion / Belt Slot 5
            hero.useBeltSlot(4);
            e.preventDefault();
            return;
        }
    }
}
