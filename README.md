# Diablo JS Remastered

An isometric hack-and-slash Action RPG engine built with modern JavaScript and HTML5 Canvas.

## 🚀 Features & New Upgrades

1. **Combat & Monster Slaying Fixed**:
   - Pixel-accurate isometric mouse picking without radius restrictions.
   - Barbarian auto-approaches and strikes targeted enemies with authentic weapon swing animations.
   - Full damage formula with Armor mitigation, Critical Strikes, and floating combat numbers.
   - Web Audio API procedural sound synthesizer (swords, hits, crits, monster deaths, coins, potions, level-up).

2. **Ground Item Drops & Loot**:
   - Slain monsters drop gold coins, tiered health & mana potions, and equipment.
   - Procedural equipment generator with item rarities (Common, Magic, Rare, Unique).
   - Dropped loot features pulsing light auras, nameplate labels, and click/proximity auto-pickup.

3. **Expanded Monster Bestiary**:
   - **Skeleton Warrior**: Undead frontline infantry.
   - **Burning Dead**: Fire-enchanted champion skeleton with blazing aura.
   - **King Leoric**: Legendary Skeleton King boss with massive cleave attacks and royal bone armor.
   - **Fallen Imp**: Nimble, erratic demon swarm.
   - **Fallen Shaman**: Spellcasting shaman with crimson robes.
   - **Bishibosh**: Fallen Chieftain boss.
   - **Dark Sister**: Agile corrupted huntress rogue.
   - **Blood Witch**: Cold-enchanted Matron with icy aura.
   - **The Butcher**: Demonic overlord brute ("Ah, Fresh Meat!") with colossal health and unique cleaver drop.

4. **Expanded Dungeon World**:
   - Multi-floor dungeon: Floor 0 (Town of Tristram), Floor 1 (The Cathedral & Skeleton King), Floor 2 (The Catacombs & Bishibosh), Floor 3 (Lair of the Butcher).
   - Interactive Treasure Chests, Shrines (Life, Mana, Power), Breakable Barrels, and Town Portals (`[T]`).
   - Minimap overlay toggled with `[TAB]`.

5. **Town of Tristram (Floor 0 Hub) & Vendors**:
   - Safe starting haven with cobblestone plaza, Town Well (full restore), and Smithy forge.
   - **Griswold the Blacksmith**: Buy weapons, shields, plate armors, set items; sell gear; repair & hone gear.
   - **Adria the Witch**: Buy potions, scrolls, magic rings & amulets, set items; arcane energy infusion.
   - **Deckard Cain**: Horadric wisdom lore ("Stay awhile and listen!") and item identification.
   - **Pepin the Healer**: Divine healing and high-tier rejuvenation potions.

6. **Town Stash (50 Secure Slots)**:
   - Persistent 50-slot vault box in Tristram outside of the player's 40-slot backpack.
   - Seamless one-click deposit and withdrawal between backpack and vault.
   - Persists across game sessions in LocalStorage.

7. **Item Inspection & Gear Dropping**:
   - Right-click any equipment, potion, or stash item to open the detailed Item Inspection Modal.
   - Displays crisp pixel-art graphics, item stats, set checklist, and action buttons (`[Equip]`, `[Drop]`, `[Stash]`, `[Sell]`).
   - Ability to drop any item directly onto the isometric floor as a physical `GroundItem` entity and pick it back up.

8. **Iconic Diablo Set Equipment & Set Bonuses**:
   - 4 Complete Sets: **Sigon's Complete Steel**, **Berserker's Garb**, **Cathan's Traps**, **Isenhart's Armory**.
   - Distinct emerald green styling (`#10b981`), glowing borders, and item checklist tooltips.
   - Wearing multiple set pieces dynamically unlocks powerful tier bonuses (+Damage, +Defense, +Life, +Mana, +Crit).
   - Active set bonuses tracked and displayed directly in the Character Sheet (`[C]`).

9. **Full Diablo Inventory & Menu**:
   - **Equipment Paperdoll**: Head (Helm), Torso (Armor), Main Hand (Weapon), Off Hand (Shield), Boots, Amulet, Left/Right Rings.
   - **40-Slot Backpack Grid**: Left-click to move, right-click to instantly equip or drink potions.
   - **Rich Item Tooltips**: Diablo rarity colored headers, stat affixes, and gold value.
   - **Character Stats Sheet `[C]`**: Barbarian stats (Strength, Dexterity, Vitality, Energy) with stat point allocation upon leveling up!
   - **Game Menu `[ESC]`**: Resume, restart, audio toggle, and LocalStorage Save/Load.
   - **Active Skills Bar `[1-5]`**:
     - `[1]` Bash (Heavy power strike)
     - `[2]` Whirlwind (AoE spinning slash)
     - `[3]` Leap Attack (Leap slam shockwave)
     - `[4]` Battle Cry (Attack & defense buff)
     - `[5]` Quick Potion / Portal

## 🛠️ Controls

- **Left Click**: Move / Attack target / Open chest / Pick up loot
- **Shift + Left Click**: Attack in place
- **[1] - [4]**: Barbarian Skills (Bash, Whirlwind, Leap, War Cry)
- **[5]**: Belt Potion
- **[I]** or **[B]**: Toggle Inventory
- **[C]**: Toggle Character Sheet
- **[TAB]**: Toggle Minimap
- **[ESC]**: Toggle Menu / Pause

## 🛠️ Development

1. **Install Dependencies**: `npm install`
2. **Start Server**: `npm run dev`
3. **Visit**: `http://localhost:3025`
