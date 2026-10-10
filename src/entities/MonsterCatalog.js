// Catalog of Monster definitions and archetypes
export const MONSTER_TYPES = {
    // 1. Skeleton Warrior
    SK_WARRIOR: {
        id: 'SK_WARRIOR',
        code: 'SK',
        name: 'Skeleton Warrior',
        title: 'Undead Infantry',
        health: 220,
        damage: 18,
        speed: 7,
        resistance: 10,
        xpReward: 40,
        rarity: 'normal',
        scale: 1.0,
        colorFilter: 'none'
    },
    // 2. Burning Dead / Skeleton Champion
    SK_CHAMPION: {
        id: 'SK_CHAMPION',
        code: 'SK',
        name: 'Burning Dead',
        title: 'Champion - Fire Enchanted',
        health: 520,
        damage: 38,
        speed: 8.5,
        resistance: 25,
        xpReward: 120,
        rarity: 'champion',
        scale: 1.1,
        colorFilter: 'sepia(1) saturate(5) hue-rotate(340deg)' // Fiery red/orange
    },
    // 3. Skeleton King (Leoric Boss)
    SK_KING: {
        id: 'SK_KING',
        code: 'SK',
        name: 'King Leoric',
        title: 'The Skeleton King - Lord of the Undead',
        health: 2200,
        damage: 65,
        speed: 7.5,
        resistance: 40,
        xpReward: 600,
        rarity: 'boss',
        scale: 1.35,
        colorFilter: 'sepia(1) saturate(3) hue-rotate(50deg) brightness(1.2)' // Golden crown / bone
    },
    // 4. Fallen Imp
    FS_IMP: {
        id: 'FS_IMP',
        code: 'FS',
        name: 'Fallen Imp',
        title: 'Lesser Demon',
        health: 140,
        damage: 14,
        speed: 9.5,
        resistance: 5,
        xpReward: 30,
        rarity: 'normal',
        scale: 0.9,
        colorFilter: 'none'
    },
    // 5. Fallen Shaman
    FS_SHAMAN: {
        id: 'FS_SHAMAN',
        code: 'FS',
        name: 'Fallen Shaman',
        title: 'Cultist Spellcaster',
        health: 340,
        damage: 28,
        speed: 7.0,
        resistance: 20,
        xpReward: 95,
        rarity: 'champion',
        scale: 1.05,
        colorFilter: 'hue-rotate(310deg) saturate(2)' // Crimson
    },
    // 6. Fallen Chieftain (Boss)
    FS_CHIEFTAIN: {
        id: 'FS_CHIEFTAIN',
        code: 'FS',
        name: 'Bishibosh',
        title: 'Fallen Chieftain - Fire Lord',
        health: 1600,
        damage: 55,
        speed: 8.5,
        resistance: 35,
        xpReward: 480,
        rarity: 'boss',
        scale: 1.3,
        colorFilter: 'contrast(1.4) hue-rotate(330deg) brightness(1.1)'
    },
    // 7. Dark Sister / Rogue
    SI_SISTER: {
        id: 'SI_SISTER',
        code: 'SI',
        name: 'Dark Sister',
        title: 'Corrupted Huntress',
        health: 260,
        damage: 24,
        speed: 8.0,
        resistance: 15,
        xpReward: 60,
        rarity: 'normal',
        scale: 1.0,
        colorFilter: 'none'
    },
    // 8. Blood Witch / Matron
    SI_MATRON: {
        id: 'SI_MATRON',
        code: 'SI',
        name: 'Blood Witch',
        title: 'Sisterhood Matron - Cold Enchanted',
        health: 650,
        damage: 48,
        speed: 9.0,
        resistance: 30,
        xpReward: 160,
        rarity: 'champion',
        scale: 1.15,
        colorFilter: 'hue-rotate(240deg) saturate(3)' // Icy Violet
    },
    // 9. The Butcher (Demon Boss)
    BA_BUTCHER: {
        id: 'BA_BUTCHER',
        code: 'BA',
        name: 'The Butcher',
        title: 'Greater Demon - "Ah, Fresh Meat!"',
        health: 3000,
        damage: 85,
        speed: 8.5,
        resistance: 45,
        xpReward: 1000,
        rarity: 'boss',
        scale: 1.4,
        colorFilter: 'sepia(1) saturate(6) hue-rotate(320deg) contrast(1.3)' // Blood soaked demonic
    }
};
