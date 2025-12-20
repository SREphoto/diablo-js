export class UIManager {
    constructor() {
        // Health UI
        this.healthFill = document.getElementById('health-fill');
        this.healthText = document.getElementById('health-text');
        // Mana UI
        this.manaFill = document.getElementById('mana-fill');
        // Gold and XP UI
        this.goldText = document.getElementById('gold-text');
        this.xpFill = document.getElementById('xp-fill');
        this.xpText = document.querySelector('.xp-text');
        // Skill slot icons (up to 5 slots)
        this.slot1 = document.getElementById('slot-1-icon');
        this.slot2 = document.getElementById('slot-2-icon');
        this.slot3 = document.getElementById('slot-3-icon');
        this.slot4 = document.getElementById('slot-4-icon');
        this.slot5 = document.getElementById('slot-5-icon');
    }

    // Health updates
    updateHealth(current, max) {
        if (!this.healthFill) return;
        const pct = Math.max(0, Math.min(100, (current / max) * 100));
        this.healthFill.style.height = pct + "%";
        if (this.healthText) this.healthText.innerText = `${Math.floor(current)}/${max}`;
    }

    // Mana updates
    updateMana(current, max) {
        if (!this.manaFill) return;
        const pct = Math.max(0, Math.min(100, (current / max) * 100));
        this.manaFill.style.height = pct + "%";
    }

    // Gold counter
    updateGold(amount) {
        if (!this.goldText) return;
        this.goldText.innerText = amount;
    }

    // XP bar
    updateXP(currentXP, maxXP) {
        if (!this.xpFill) return;
        const pct = Math.max(0, Math.min(100, (currentXP / maxXP) * 100));
        this.xpFill.style.width = pct + "%";
        if (this.xpText) this.xpText.innerText = `LEVEL ${Math.floor(currentXP / maxXP) + 1}`;
    }

    // Belt / skill icons
    updateBelt(items) {
        // Expect items array with up to 5 items
        this.updateSlot(this.slot1, items[0]);
        this.updateSlot(this.slot2, items[1]);
        this.updateSlot(this.slot3, items[2]);
        this.updateSlot(this.slot4, items[3]);
        this.updateSlot(this.slot5, items[4]);
    }

    updateSlot(element, item) {
        if (!element) return;
        if (item && item.sprite && item.sprite.src) {
            element.src = item.sprite.src;
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    }
}
