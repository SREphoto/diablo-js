export class UIManager {
    constructor() {
        // Health UI
        this.healthFill = document.getElementById('health-fill');
        this.healthText = document.getElementById('health-text');
        // Mana UI
        this.manaFill = document.getElementById('mana-fill');
        this.manaText = document.querySelector('.mana-orb .orb-text');
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

        this.initSkillIcons();
    }

    initSkillIcons() {
        // Skill 1: Bash SVG icon
        const bashSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%232a1010"/><polygon points="20,4 23,12 22,26 18,26 17,12" fill="%23ff4444"/><circle cx="20" cy="20" r="14" fill="none" stroke="%23ffaa00" stroke-width="2"/><line x1="8" y1="8" x2="32" y2="32" stroke="%23ffdd44" stroke-width="2"/></svg>`;
        
        // Skill 2: Whirlwind SVG icon
        const wwSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23101c2a"/><circle cx="20" cy="20" r="12" fill="none" stroke="%2360a0ff" stroke-width="3" stroke-dasharray="8,4"/><circle cx="20" cy="20" r="6" fill="none" stroke="%23ffffff" stroke-width="2"/></svg>`;
        
        // Skill 3: Leap Attack SVG icon
        const leapSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23221808"/><path d="M10,32 Q20,6 30,32" fill="none" stroke="%23ff9900" stroke-width="3"/><polygon points="30,32 25,24 33,26" fill="%23ffd700"/></svg>`;
        
        // Skill 4: War Cry SVG icon
        const warCrySvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><rect width="40" height="40" fill="%23220808"/><path d="M14,12 L26,12 L26,28 L14,28 Z" fill="%23e03030"/><circle cx="20" cy="18" r="4" fill="%23ffffff"/><path d="M28,8 C34,14 34,26 28,32" fill="none" stroke="%23ffea00" stroke-width="2"/></svg>`;

        if (this.slot1) { this.slot1.src = bashSvg; this.slot1.style.display = 'block'; }
        if (this.slot2) { this.slot2.src = wwSvg; this.slot2.style.display = 'block'; }
        if (this.slot3) { this.slot3.src = leapSvg; this.slot3.style.display = 'block'; }
        if (this.slot4) { this.slot4.src = warCrySvg; this.slot4.style.display = 'block'; }
    }

    updateHealth(current, max) {
        if (!this.healthFill) return;
        const pct = Math.max(0, Math.min(100, (current / max) * 100));
        this.healthFill.style.height = pct + "%";
        if (this.healthText) this.healthText.innerText = `${Math.floor(current)}/${max}`;
    }

    updateMana(current, max) {
        if (!this.manaFill) return;
        const pct = Math.max(0, Math.min(100, (current / max) * 100));
        this.manaFill.style.height = pct + "%";
        if (this.manaText) this.manaText.innerText = `${Math.floor(current)}/${max}`;
    }

    updateGold(amount) {
        if (!this.goldText) return;
        this.goldText.innerText = amount;
    }

    updateXP(currentXP, maxXP, level = 1) {
        if (!this.xpFill) return;
        const pct = Math.max(0, Math.min(100, (currentXP / maxXP) * 100));
        this.xpFill.style.width = pct + "%";
        if (this.xpText) this.xpText.innerText = `LEVEL ${level} - BARBARIAN (${Math.floor(currentXP)}/${maxXP} XP)`;
    }

    updateBelt(items) {
        // Slot 5 is quick potion
        if (this.slot5 && items && items[0]) {
            const item = items[0];
            this.slot5.src = item.icon || (item.sprite && item.sprite.src) || '';
            this.slot5.style.display = 'block';
        } else if (this.slot5) {
            this.slot5.style.display = 'none';
        }
    }
}
