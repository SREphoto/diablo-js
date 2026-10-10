// Sound Manager - Silenced synthetic audio to eliminate oscillator noise
class SoundManager {
    constructor() {
        this.ctx = null;
        this.enabled = false; // Disabled by default
        this.volume = 0;
    }

    init() {}
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // Completely silent no-ops to eliminate harsh synthesizer buzzes and beeps
    playSwing() {}
    playHit() {}
    playCrit() {}
    playMonsterDeath() {}
    playCoin() {}
    playPotion() {}
    playEquip() {}
    playLevelUp() {}
    playWarCry() {}
    playWhirlwind() {}
    playLeap() {}
    playClick() {}
    playChest() {}
}

export const sound = new SoundManager();
