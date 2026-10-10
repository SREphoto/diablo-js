import { sound } from '../core/Sound.js';
import { Item, createSetItem, GroundItem, SET_DEFINITIONS } from '../entities/Items.js';

// Town Vendor Wares Catalogs
export const VENDOR_CATALOGS = {
    griswold: {
        id: 'griswold',
        npcName: "Griswold the Blacksmith",
        title: "Weaponsmith & Armorer of Tristram",
        portrait: "sprite/npc_griswold.png",
        quote: '"What can I do for ya? I\'ve got the finest forged steel in Khanduras."',
        serviceName: "⚒️ HONE & REPAIR GEAR (25g)",
        serviceDesc: "Sharpen weapon edges and reinforce plate (+5 Attack Power)",
        serviceCost: 25,
        items: [
            { name: "Broad Sword", type: "weapon", slot: "weapon", rarity: "magic", stats: { damage: 24, crit: 6 }, value: 120, icon: "sprite/item_broadsword.png", description: "Heavy double-edged blade tempered in forge fires." },
            { name: "Plate Mail", type: "armor", slot: "armor", rarity: "magic", stats: { defense: 48, health: 80 }, value: 180, icon: "sprite/item_armor_plate.png", description: "Interlocking steel plates forged to withstand demon claws." },
            { name: "Kite Shield", type: "shield", slot: "shield", rarity: "magic", stats: { defense: 28, health: 40 }, value: 130, icon: "sprite/item_shield_kite.png", description: "Sturdy pointed shield bearing heraldic crests." },
            { name: "Horned Great Helm", type: "helm", slot: "helm", rarity: "magic", stats: { defense: 22, strength: 6 }, value: 110, icon: "sprite/item_helm_horned.png", description: "Heavy iron helmet crowned with fierce bull horns." },
            { name: "Heavy Greaves", type: "boots", slot: "boots", rarity: "magic", stats: { defense: 16, dexterity: 5 }, value: 95, icon: "sprite/item_boots.png", description: "Steel-plated marching boots reinforced with leather straps." },
            'sigon_visor',
            'sigon_shelter',
            'berserker_hatchet',
            'isenhart_sword'
        ]
    },
    adria: {
        id: 'adria',
        npcName: "Adria the Witch",
        title: "Alchemist & Arcane Vendor",
        portrait: "sprite/npc_adria.png",
        quote: '"I sense a soul in search of answers... and arcane mysteries."',
        serviceName: "✨ ARCANE INFUSION (40g)",
        serviceDesc: "Channels arcane leylines to grant +3 Energy and restore Mana",
        serviceCost: 40,
        items: [
            { name: "Health Potion", type: "potion_health", rarity: "common", stats: { heal: 500 }, value: 50, icon: "sprite/potion_health_normal.png", description: "Restores 500 points of Life." },
            { name: "Mana Potion", type: "potion_mana", rarity: "common", stats: { restoreMana: 250 }, value: 50, icon: "sprite/potion_mana_normal.png", description: "Restores 250 points of Mana." },
            { name: "Full Rejuvenation Potion", type: "potion_rejuv", rarity: "rare", stats: { heal: 9999, restoreMana: 9999 }, value: 160, icon: "sprite/potion_rejuv.png", description: "Instantly restores all Life and Mana." },
            { name: "Town Portal Scroll", type: "scroll", rarity: "magic", stats: { tp: true }, value: 80, icon: "sprite/item_scroll.png", description: "Teleports the bearer safely back to Tristram." },
            { name: "Band of Warding", type: "ring", slot: "ring1", rarity: "rare", stats: { mana: 90, defense: 15 }, value: 220, icon: "sprite/item_ring.png", description: "An obsidian ring engraved with warding runes." },
            { name: "Talisman of Embers", type: "amulet", slot: "amulet", rarity: "rare", stats: { damage: 18, mana: 80 }, value: 260, icon: "sprite/item_amulet.png", description: "A fiery talisman that pulses with arcane heat." },
            'cathan_mesh',
            'cathan_ring',
            'cathan_amulet'
        ]
    },
    cain: {
        id: 'cain',
        npcName: "Deckard Cain",
        title: "Elder of Tristram",
        portrait: "sprite/npc_cain.png",
        quote: '"Stay awhile and listen! The Horadrim forged mighty relics in ages past."',
        serviceName: "📜 IDENTIFY ALL ITEMS (Free)",
        serviceDesc: "Reveal the magical properties of all carried artifacts (Free)",
        serviceCost: 0,
        items: [
            { name: "Horadric Wisdom Scroll", type: "scroll", rarity: "unique", stats: { crit: 5, damage: 10 }, value: 300, icon: "sprite/item_scroll.png", description: "Ancient parchment detailing forgotten Horadric combat rites." },
            'sigon_guard',
            'sigon_sabatons',
            'isenhart_horns',
            'isenhart_case',
            'isenhart_parry'
        ]
    },
    pepin: {
        id: 'pepin',
        npcName: "Pepin the Healer",
        title: "Town Cleric",
        portrait: "sprite/npc_pepin.png",
        quote: '"May the Light watch over you, traveler. Let me tend to your wounds."',
        serviceName: "💖 DIVINE BLESSING (Free)",
        serviceDesc: "Full restoration of Health and Mana (Free)",
        serviceCost: 0,
        items: [
            { name: "Health Potion", type: "potion_health", rarity: "common", stats: { heal: 500 }, value: 50, icon: "sprite/potion_health_normal.png", description: "Restores 500 points of Life." },
            { name: "Mana Potion", type: "potion_mana", rarity: "common", stats: { restoreMana: 250 }, value: 50, icon: "sprite/potion_mana_normal.png", description: "Restores 250 points of Mana." },
            { name: "Greater Health Potion", type: "potion_health", rarity: "magic", stats: { heal: 800 }, value: 75, icon: "sprite/potion_health_greater.png", description: "Restores 800 points of Life." },
            { name: "Full Rejuvenation Potion", type: "potion_rejuv", rarity: "rare", stats: { heal: 9999, restoreMana: 9999 }, value: 160, icon: "sprite/potion_rejuv_full.png", description: "Instantly restores all Life and Mana." }
        ]
    }
};

export class InventoryUI {
    constructor(game) {
        this.game = game;
        this.isOpen = false;
        this.isCharSheetOpen = false;
        this.isMenuOpen = false;
        this.isGameOver = false;
        this.isStashOpen = false;
        this.currentVendor = null;

        this.inspectingItem = null;
        this.inspectContext = null;

        this.createDOM();
        this.setupEventListeners();
    }

    createDOM() {
        const uiLayer = document.getElementById('ui-layer') || document.body;

        const windowsContainer = document.createElement('div');
        windowsContainer.id = 'diablo-windows';
        windowsContainer.innerHTML = `
            <!-- Top Controls Buttons -->
            <div class="top-nav-buttons">
                <button id="btn-inventory" class="diablo-btn">🎒 Inventory [I]</button>
                <button id="btn-char" class="diablo-btn">👤 Character [C]</button>
                <button id="btn-menu" class="diablo-btn">📜 Menu [ESC]</button>
            </div>

            <!-- INVENTORY & BACKPACK WINDOW -->
            <div id="inventory-window" class="diablo-panel backpack-panel" style="display: none;">
                <div class="panel-header backpack-panel-header">
                    <div class="backpack-rivet left-top"></div>
                    <div class="backpack-rivet right-top"></div>
                    <span class="backpack-crest">⚔️</span>
                    <span class="panel-title">ADVENTURER'S BACKPACK</span>
                    <span class="backpack-crest">🛡️</span>
                    <button class="btn-close" id="close-inv">✕</button>
                </div>
                <div class="inventory-body backpack-body">
                    <!-- Equipment Doll -->
                    <div class="equipment-section">
                        <div class="section-title-tag">EQUIPPED GEAR</div>
                        <div class="equip-row">
                            <div class="equip-slot slot-helm" data-slot="helm" title="Head / Helm">
                                <span class="slot-watermark">🪖</span>
                            </div>
                        </div>
                        <div class="equip-row">
                            <div class="equip-slot slot-weapon" data-slot="weapon" title="Main Hand / Weapon">
                                <span class="slot-watermark">⚔️</span>
                            </div>
                            <div class="equip-slot slot-armor" data-slot="armor" title="Torso / Armor">
                                <span class="slot-watermark">🛡️</span>
                            </div>
                            <div class="equip-slot slot-shield" data-slot="shield" title="Off Hand / Shield">
                                <span class="slot-watermark">🔰</span>
                            </div>
                        </div>
                        <div class="equip-row accessories-row">
                            <div class="equip-slot slot-ring" data-slot="ring1" title="Left Ring">
                                <span class="slot-watermark">💍</span>
                            </div>
                            <div class="equip-slot slot-amulet" data-slot="amulet" title="Neck / Amulet">
                                <span class="slot-watermark">📿</span>
                            </div>
                            <div class="equip-slot slot-ring" data-slot="ring2" title="Right Ring">
                                <span class="slot-watermark">💍</span>
                            </div>
                        </div>
                        <div class="equip-row">
                            <div class="equip-slot slot-boots" data-slot="boots" title="Feet / Boots">
                                <span class="slot-watermark">👢</span>
                            </div>
                        </div>
                    </div>

                    <!-- Leather Gold Pouch -->
                    <div class="gold-pouch-bar">
                        <div class="gold-pouch-left">
                            <img src="sprite/coins10.png" class="gold-pouch-icon" alt="Gold">
                            <span class="gold-pouch-label">GOLD POUCH</span>
                        </div>
                        <div class="gold-pouch-right">
                            <span id="inv-gold-count" class="val-gold">150</span>
                            <span class="gold-unit">GOLD</span>
                        </div>
                    </div>

                    <!-- 4x10 Knapsack Grid -->
                    <div class="backpack-section">
                        <div class="backpack-header-bar">
                            <span class="backpack-header-title">🎒 KNAPSACK (40 SLOTS)</span>
                            <span class="backpack-header-hint">[Click] Action • [Right-Click] Inspect / Drop</span>
                        </div>
                        <div class="backpack-grid-container">
                            <div class="backpack-grid" id="backpack-grid">
                                <!-- 40 slots generated in JS -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- TOWN STASH WINDOW (50 SLOTS) -->
            <div id="stash-window" class="diablo-panel stash-panel" style="display: none;">
                <div class="panel-header stash-panel-header">
                    <span class="backpack-crest">🏰</span>
                    <span class="panel-title">TRISTRAM VAULT - TOWN STASH</span>
                    <span class="backpack-crest">🗝️</span>
                    <button class="btn-close" id="close-stash">✕</button>
                </div>
                <div class="stash-body">
                    <div class="stash-info-bar">
                        <span class="stash-capacity-tag">SECURE STORAGE (50 SLOTS)</span>
                        <span class="stash-hint-tag">[Left-Click] Withdraw to Pack • [Right-Click] Inspect</span>
                    </div>
                    <div class="stash-grid-container">
                        <div class="stash-grid" id="stash-grid">
                            <!-- 50 slots generated in JS -->
                        </div>
                    </div>
                </div>
            </div>

            <!-- VENDOR SHOP WINDOW -->
            <div id="vendor-window" class="diablo-panel vendor-panel" style="display: none;">
                <div class="panel-header vendor-panel-header">
                    <span class="backpack-crest">🪙</span>
                    <span class="panel-title" id="vendor-window-title">TOWN MERCHANT</span>
                    <span class="backpack-crest">📜</span>
                    <button class="btn-close" id="close-vendor">✕</button>
                </div>
                <div class="vendor-body">
                    <!-- NPC Profile & Greeting -->
                    <div class="vendor-profile-card">
                        <div class="vendor-portrait-box">
                            <img id="vendor-portrait-img" src="sprite/npc_griswold.png" class="vendor-portrait" alt="Merchant">
                        </div>
                        <div class="vendor-profile-text">
                            <div class="vendor-npc-name" id="vendor-npc-name">Griswold the Blacksmith</div>
                            <div class="vendor-npc-sub" id="vendor-npc-sub">Weaponsmith & Armorer</div>
                            <div class="vendor-speech-bubble" id="vendor-speech-bubble">"What can I do for ya?"</div>
                        </div>
                    </div>

                    <!-- Vendor Special Service -->
                    <div class="vendor-service-box">
                        <div class="vendor-service-desc" id="vendor-service-desc">Sharpen weapons and repair armor plates</div>
                        <button class="vendor-service-btn" id="btn-vendor-service">⚒️ REPAIR & HONE GEAR (25g)</button>
                    </div>

                    <!-- Wares Catalog -->
                    <div class="vendor-catalog-header">
                        <span class="catalog-title">WARES FOR SALE</span>
                        <span class="catalog-hint">[Click item] Buy for Gold</span>
                    </div>
                    <div class="vendor-catalog-scroll">
                        <div class="vendor-catalog-list" id="vendor-catalog-list">
                            <!-- Populated dynamically -->
                        </div>
                    </div>

                    <!-- Sell Assistance Banner -->
                    <div class="vendor-sell-banner">
                        <span class="sell-banner-icon">💰</span>
                        <span class="sell-banner-text"><b>SELL GEAR:</b> Left-Click items in your Backpack to sell for Gold!</span>
                    </div>
                </div>
            </div>

            <!-- ITEM INSPECTION MODAL -->
            <div id="item-inspect-modal" class="diablo-modal" style="display: none;">
                <div class="inspect-box" id="inspect-card-box">
                    <div class="inspect-header-bar">
                        <div class="inspect-title-group">
                            <h3 class="inspect-item-name" id="inspect-item-name">Rusty Short Sword</h3>
                            <div class="inspect-item-type" id="inspect-item-type">COMMON WEAPON</div>
                        </div>
                        <button class="btn-close" id="close-inspect">✕</button>
                    </div>

                    <div class="inspect-icon-frame">
                        <img id="inspect-item-img" src="sprite/item_sword.png" class="inspect-big-icon" alt="Item">
                    </div>

                    <div class="inspect-stats-block" id="inspect-stats-block">
                        <!-- Stats rendered here -->
                    </div>

                    <div class="inspect-set-block" id="inspect-set-block" style="display: none;">
                        <!-- Set Details rendered here -->
                    </div>

                    <div class="inspect-desc-text" id="inspect-desc-text">
                        A weathered blade from the Arreat Highlands.
                    </div>

                    <div class="inspect-value-tag" id="inspect-value-tag">
                        💰 Value: 20 Gold
                    </div>

                    <div class="inspect-actions-row" id="inspect-actions-row">
                        <button class="inspect-action-btn btn-equip" id="btn-inspect-equip">EQUIP GEAR</button>
                        <button class="inspect-action-btn btn-drop" id="btn-inspect-drop">DROP ON GROUND</button>
                        <button class="inspect-action-btn btn-stash" id="btn-inspect-stash" style="display: none;">DEPOSIT TO STASH</button>
                        <button class="inspect-action-btn btn-sell" id="btn-inspect-sell" style="display: none;">SELL ITEM</button>
                        <button class="inspect-action-btn btn-close-modal" id="btn-inspect-close">CLOSE</button>
                    </div>
                </div>
            </div>

            <!-- CHARACTER STATS WINDOW -->
            <div id="character-window" class="diablo-panel" style="display: none;">
                <div class="panel-header">
                    <span class="panel-title">CHARACTER SHEET</span>
                    <button class="btn-close" id="close-char">✕</button>
                </div>
                <div class="char-sheet-body">
                    <div class="char-hero-name" id="char-hero-name">LEVEL 1 BARBARIAN</div>
                    <div class="char-stat-row"><span>Health:</span> <span id="stat-hp" class="val-hp">1000/1000</span></div>
                    <div class="char-stat-row"><span>Mana:</span> <span id="stat-mana" class="val-mana">250/250</span></div>
                    <div class="char-stat-row"><span>Attack Damage:</span> <span id="stat-dmg" class="val-dmg">35</span></div>
                    <div class="char-stat-row"><span>Defense:</span> <span id="stat-def" class="val-def">15</span></div>
                    <div class="char-stat-row"><span>Critical Hit:</span> <span id="stat-crit" class="val-blue">15%</span></div>
                    <hr class="panel-divider">
                    <div class="char-stat-row">
                        <span>Strength: <b id="stat-str">30</b></span>
                        <button class="stat-plus-btn" data-stat="str">+</button>
                    </div>
                    <div class="char-stat-row">
                        <span>Dexterity: <b id="stat-dex">20</b></span>
                        <button class="stat-plus-btn" data-stat="dex">+</button>
                    </div>
                    <div class="char-stat-row">
                        <span>Vitality: <b id="stat-vit">25</b></span>
                        <button class="stat-plus-btn" data-stat="vit">+</button>
                    </div>
                    <div class="char-stat-row">
                        <span>Energy: <b id="stat-ene">10</b></span>
                        <button class="stat-plus-btn" data-stat="ene">+</button>
                    </div>
                    <div class="stat-points-remaining">
                        Unspent Points: <span id="stat-unspent" class="val-gold">0</span>
                    </div>
                    <hr class="panel-divider">
                    <div class="char-stat-row"><span>Monsters Slain:</span> <span id="stat-slain">0</span></div>
                    <div class="char-stat-row"><span>Gold Stash:</span> <span id="stat-gold" class="val-gold">0</span></div>

                    <!-- Active Set Bonuses Section -->
                    <div id="char-set-bonuses" class="char-set-bonuses" style="display: none;">
                        <!-- Rendered dynamically -->
                    </div>
                </div>
            </div>

            <!-- GAME MENU MODAL -->
            <div id="game-menu-modal" class="diablo-modal" style="display: none;">
                <div class="menu-box">
                    <div class="menu-header">DIABLO JS REMASTERED</div>
                    <button class="menu-btn" id="btn-resume">RESUME GAME</button>
                    <button class="menu-btn" id="btn-restart">RESTART DUNGEON</button>
                    <button class="menu-btn" id="btn-save">SAVE GAME</button>
                    <button class="menu-btn" id="btn-load">LOAD GAME</button>
                    <button class="menu-btn" id="btn-sound">AUDIO SFX: ON</button>
                    
                    <div class="menu-controls-help">
                        <h4>KEYBOARD CONTROLS</h4>
                        <p><b>[Left Click]</b> Move, Attack, Pick up loot, Interact</p>
                        <p><b>[Right Click]</b> Inspect item & drop gear</p>
                        <p><b>[Shift + Click]</b> Attack in place</p>
                        <p><b>[1]</b> Bash &nbsp; <b>[2]</b> Whirlwind &nbsp; <b>[3]</b> Leap</p>
                        <p><b>[4]</b> War Cry &nbsp; <b>[5]</b> Potion / Portal</p>
                        <p><b>[I]</b> Inventory &nbsp; <b>[C]</b> Character &nbsp; <b>[T]</b> Town Portal</p>
                    </div>
                </div>
            </div>

            <!-- GAME OVER MODAL -->
            <div id="game-over-modal" class="diablo-modal" style="display: none;">
                <div class="game-over-box">
                    <h1 class="dead-title">YOU HAVE DIED</h1>
                    <p class="dead-desc">Your soul is claimed by the depths of the Burning Hells...</p>
                    <button class="menu-btn btn-danger" id="btn-resurrect">RESURRECT IN SANCTUARY</button>
                </div>
            </div>

            <!-- Floating Tooltip Box -->
            <div id="item-hover-tooltip" style="display: none; position: fixed; z-index: 9999; pointer-events: none;"></div>
        `;

        uiLayer.appendChild(windowsContainer);

        // Generate 40 backpack slots (4 rows x 10 cols)
        const backpackGrid = document.getElementById('backpack-grid');
        for (let i = 0; i < 40; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.index = i;
            backpackGrid.appendChild(slot);
        }

        // Generate 50 stash slots (5 rows x 10 cols)
        const stashGrid = document.getElementById('stash-grid');
        for (let i = 0; i < 50; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot stash-slot';
            slot.dataset.stashIndex = i;
            stashGrid.appendChild(slot);
        }
    }

    setupEventListeners() {
        const tooltip = document.getElementById('item-hover-tooltip');

        // Nav Buttons
        document.getElementById('btn-inventory').onclick = () => this.toggleInventory();
        document.getElementById('btn-char').onclick = () => this.toggleCharacterSheet();
        document.getElementById('btn-menu').onclick = () => this.toggleMenu();

        document.getElementById('close-inv').onclick = () => this.toggleInventory(false);
        document.getElementById('close-char').onclick = () => this.toggleCharacterSheet(false);
        document.getElementById('close-stash').onclick = () => this.openStash(false);
        document.getElementById('close-vendor').onclick = () => this.closeVendor();
        document.getElementById('close-inspect').onclick = () => this.closeInspect();
        document.getElementById('btn-inspect-close').onclick = () => this.closeInspect();
        document.getElementById('btn-resume').onclick = () => this.toggleMenu(false);

        // Restart
        document.getElementById('btn-restart').onclick = () => {
            sound.playClick();
            this.game.restartFloor();
            this.toggleMenu(false);
        };

        // Save & Load
        document.getElementById('btn-save').onclick = () => {
            this.game.saveGame();
            sound.playCoin();
            alert("Game saved successfully!");
        };

        document.getElementById('btn-load').onclick = () => {
            this.game.loadGame();
            sound.playLevelUp();
            this.toggleMenu(false);
            this.render();
        };

        // Audio Toggle
        const sfxBtn = document.getElementById('btn-sound');
        sfxBtn.onclick = () => {
            const isEnabled = sound.toggle();
            sfxBtn.innerText = `AUDIO SFX: ${isEnabled ? 'ON' : 'OFF'}`;
            sound.playClick();
        };

        // Resurrect Button
        document.getElementById('btn-resurrect').onclick = () => {
            this.game.resurrectHero();
            document.getElementById('game-over-modal').style.display = 'none';
        };

        // Vendor Service Button
        document.getElementById('btn-vendor-service').onclick = () => {
            this.performVendorService();
        };

        // Stat Point Buttons
        document.querySelectorAll('.stat-plus-btn').forEach(btn => {
            btn.onclick = (e) => {
                const stat = e.target.dataset.stat;
                const hero = this.game.hero;
                if (hero.statPoints > 0) {
                    hero.statPoints--;
                    if (stat === 'str') hero.strength++;
                    if (stat === 'dex') hero.dexterity++;
                    if (stat === 'vit') hero.vitality++;
                    if (stat === 'ene') hero.energy++;
                    sound.playClick();
                    hero.recalculateStats();
                    this.render();
                }
            };
        });

        // Backpack Grid Click & Contextmenu
        const backpackGrid = document.getElementById('backpack-grid');

        backpackGrid.addEventListener('click', (e) => {
            const slot = e.target.closest('.inventory-slot');
            if (!slot) return;
            const index = parseInt(slot.dataset.index);
            const hero = this.game.hero;
            const item = hero.inventory.slots[index];
            if (!item) return;

            // If Vendor shop is open: Left-click sells item
            if (this.currentVendor) {
                this.sellItem(index);
                return;
            }

            // If Stash is open: Left-click deposits item to stash
            if (this.isStashOpen) {
                if (hero.depositToStash(index)) {
                    this.render();
                } else {
                    this.game.addFloatingText("Town Stash is Full!", hero.x, hero.y, '#ff4444');
                }
                return;
            }

            // Standard Left-Click: Use potion or equip gear
            this.useOrEquipItem(item, index);
        });

        // Right-Click on Backpack -> Open Item Inspection
        backpackGrid.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const slot = e.target.closest('.inventory-slot');
            if (!slot) return;
            const index = parseInt(slot.dataset.index);
            const hero = this.game.hero;
            const item = hero.inventory.slots[index];
            if (item) {
                this.openInspect(item, { source: 'inventory', index });
            }
        });

        // Equipment Slots (Left-click unequips, Right-click inspects)
        document.querySelectorAll('.equip-slot').forEach(slot => {
            slot.addEventListener('click', () => {
                const slotName = slot.dataset.slot;
                const hero = this.game.hero;
                if (hero.equipment[slotName]) {
                    hero.unequip(slotName);
                    this.render();
                }
            });

            slot.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                const slotName = slot.dataset.slot;
                const hero = this.game.hero;
                const item = hero.equipment[slotName];
                if (item) {
                    this.openInspect(item, { source: 'equipment', slot: slotName });
                }
            });
        });

        // Stash Slots (Left-click withdraws, Right-click inspects)
        const stashGrid = document.getElementById('stash-grid');
        stashGrid.addEventListener('click', (e) => {
            const slot = e.target.closest('.stash-slot');
            if (!slot) return;
            const stashIdx = parseInt(slot.dataset.stashIndex);
            const hero = this.game.hero;
            const item = hero.stash.slots[stashIdx];
            if (!item) return;

            if (hero.withdrawFromStash(stashIdx)) {
                this.render();
            } else {
                this.game.addFloatingText("Backpack is Full!", hero.x, hero.y, '#ff4444');
            }
        });

        stashGrid.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const slot = e.target.closest('.stash-slot');
            if (!slot) return;
            const stashIdx = parseInt(slot.dataset.stashIndex);
            const hero = this.game.hero;
            const item = hero.stash.slots[stashIdx];
            if (item) {
                this.openInspect(item, { source: 'stash', index: stashIdx });
            }
        });

        // Inspect Modal Action Buttons
        document.getElementById('btn-inspect-equip').onclick = () => {
            if (!this.inspectingItem || !this.inspectContext) return;
            const hero = this.game.hero;
            const ctx = this.inspectContext;

            if (ctx.source === 'inventory') {
                this.useOrEquipItem(this.inspectingItem, ctx.index);
            } else if (ctx.source === 'equipment') {
                hero.unequip(ctx.slot);
            }
            this.closeInspect();
            this.render();
        };

        document.getElementById('btn-inspect-drop').onclick = () => {
            if (!this.inspectingItem || !this.inspectContext) return;
            const hero = this.game.hero;
            const ctx = this.inspectContext;

            if (ctx.source === 'inventory') {
                hero.dropItem(ctx.index, false, this.game);
            } else if (ctx.source === 'equipment') {
                hero.dropItem(ctx.slot, true, this.game);
            } else if (ctx.source === 'stash') {
                const it = hero.stash.slots[ctx.index];
                if (it) {
                    hero.stash.slots[ctx.index] = null;
                    const dropX = hero.x + (Math.random() * 30 - 15);
                    const dropY = hero.y + (Math.random() * 30 - 15);
                    this.game.addItem(new GroundItem(it, dropX, dropY));
                    this.game.addFloatingText(`Dropped ${it.name}`, dropX, dropY, '#b0b0b0');
                    sound.playEquip();
                }
            }
            this.closeInspect();
            this.render();
        };

        document.getElementById('btn-inspect-stash').onclick = () => {
            if (!this.inspectingItem || !this.inspectContext) return;
            const hero = this.game.hero;
            const ctx = this.inspectContext;

            if (ctx.source === 'inventory') {
                hero.depositToStash(ctx.index);
            } else if (ctx.source === 'stash') {
                hero.withdrawFromStash(ctx.index);
            }
            this.closeInspect();
            this.render();
        };

        document.getElementById('btn-inspect-sell').onclick = () => {
            if (!this.inspectingItem || !this.inspectContext) return;
            const ctx = this.inspectContext;
            if (ctx.source === 'inventory') {
                this.sellItem(ctx.index);
            }
            this.closeInspect();
        };

        // Tooltip hover handling
        document.addEventListener('mousemove', (e) => {
            const slot = e.target.closest('.inventory-slot, .equip-slot, .vendor-item-card');
            if (slot) {
                let item = null;
                const hero = this.game.hero;

                if (slot.classList.contains('stash-slot')) {
                    const idx = parseInt(slot.dataset.stashIndex);
                    item = hero.stash ? hero.stash.slots[idx] : null;
                } else if (slot.classList.contains('inventory-slot')) {
                    const idx = parseInt(slot.dataset.index);
                    item = hero.inventory.slots[idx];
                } else if (slot.classList.contains('equip-slot')) {
                    const slotName = slot.dataset.slot;
                    item = hero.equipment[slotName];
                } else if (slot.classList.contains('vendor-item-card')) {
                    const vIndex = parseInt(slot.dataset.vendorItemIndex);
                    if (this.currentVendor && VENDOR_CATALOGS[this.currentVendor]) {
                        const rawItem = VENDOR_CATALOGS[this.currentVendor].items[vIndex];
                        item = typeof rawItem === 'string' ? createSetItem(rawItem) : (rawItem instanceof Item ? rawItem : new Item(rawItem));
                    }
                }

                if (item && item.getTooltipHTML) {
                    tooltip.innerHTML = item.getTooltipHTML(hero);
                    tooltip.style.display = 'block';
                    tooltip.style.left = (e.clientX + 16) + 'px';
                    tooltip.style.top = (e.clientY + 16) + 'px';
                    return;
                }
            }
            tooltip.style.display = 'none';
        });
    }

    useOrEquipItem(item, index) {
        const hero = this.game.hero;
        if (!item) return;

        // Health Potion
        if (item.type === 'potion_health' || (item.stats && item.stats.heal)) {
            const healAmt = (item.stats && item.stats.heal) || 500;
            hero.health = Math.min(hero.origin_health, hero.health + healAmt);
            this.game.addFloatingText(`+${healAmt} Life`, hero.x, hero.y, '#2ecc71');
            hero.inventory.slots[index] = null;
            sound.playPotion();
            if (this.game.ui) this.game.ui.updateHealth(hero.health, hero.origin_health);
            this.render();
            return;
        }

        // Mana Potion
        if (item.type === 'potion_mana' || (item.stats && item.stats.restoreMana)) {
            const manaAmt = (item.stats && item.stats.restoreMana) || 250;
            hero.mana = Math.min(hero.origin_mana, hero.mana + manaAmt);
            this.game.addFloatingText(`+${manaAmt} Mana`, hero.x, hero.y, '#3498db');
            hero.inventory.slots[index] = null;
            sound.playPotion();
            if (this.game.ui) this.game.ui.updateMana(hero.mana, hero.origin_mana);
            this.render();
            return;
        }

        // Rejuvenation Potion
        if (item.type === 'potion_rejuv') {
            hero.health = hero.origin_health;
            hero.mana = hero.origin_mana;
            this.game.addFloatingText(`Full Rejuvenation!`, hero.x, hero.y, '#9b59b6');
            hero.inventory.slots[index] = null;
            sound.playPotion();
            if (this.game.ui) {
                this.game.ui.updateHealth(hero.health, hero.origin_health);
                this.game.ui.updateMana(hero.mana, hero.origin_mana);
            }
            this.render();
            return;
        }

        // Town Portal Scroll
        if (item.type === 'scroll' && item.stats && item.stats.tp) {
            hero.inventory.slots[index] = null;
            sound.playLevelUp();
            this.game.castTownPortal();
            this.render();
            return;
        }

        // Equipment item
        if (item.slot) {
            hero.equip(item, index);
            this.render();
        }
    }

    openStash(force) {
        this.isStashOpen = force !== undefined ? force : !this.isStashOpen;
        const stashWin = document.getElementById('stash-window');
        stashWin.style.display = this.isStashOpen ? 'flex' : 'none';
        sound.playChest();

        // When stash is opened, open backpack side-by-side
        if (this.isStashOpen) {
            this.isOpen = true;
            document.getElementById('inventory-window').style.display = 'flex';
        }
        this.render();
    }

    openVendor(vendorId) {
        const vendor = VENDOR_CATALOGS[vendorId];
        if (!vendor) return;

        this.currentVendor = vendorId;
        const vendorWin = document.getElementById('vendor-window');
        vendorWin.style.display = 'flex';

        // Update vendor details
        document.getElementById('vendor-window-title').innerText = vendor.npcName.toUpperCase();
        document.getElementById('vendor-npc-name').innerText = vendor.npcName;
        document.getElementById('vendor-npc-sub').innerText = vendor.title;
        document.getElementById('vendor-speech-bubble').innerText = vendor.quote;
        document.getElementById('vendor-portrait-img').src = vendor.portrait;

        // Update service
        document.getElementById('vendor-service-desc').innerText = vendor.serviceDesc;
        const srvBtn = document.getElementById('btn-vendor-service');
        srvBtn.innerText = vendor.serviceName;

        // Render catalog
        const catalogList = document.getElementById('vendor-catalog-list');
        catalogList.innerHTML = '';

        vendor.items.forEach((itemDef, idx) => {
            const item = typeof itemDef === 'string' ? createSetItem(itemDef) : (itemDef instanceof Item ? itemDef : new Item(itemDef));
            if (!item) return;

            const card = document.createElement('div');
            card.className = `vendor-item-card rarity-${item.rarity}`;
            card.dataset.vendorItemIndex = idx;

            // Stats snippet
            let statSnippet = '';
            if (item.stats.damage) statSnippet = `+${item.stats.damage} DMG`;
            else if (item.stats.defense) statSnippet = `+${item.stats.defense} DEF`;
            else if (item.stats.heal) statSnippet = `+${item.stats.heal} Life`;
            else if (item.stats.restoreMana) statSnippet = `+${item.stats.restoreMana} Mana`;
            else if (item.stats.tp) statSnippet = `Town Portal`;

            card.innerHTML = `
                <div class="vendor-card-icon-frame">
                    <img src="${item.icon}" class="vendor-card-icon" />
                </div>
                <div class="vendor-card-info">
                    <div class="vendor-card-name ${item.rarity === 'set' ? 'set-color' : ''}">${item.name}</div>
                    <div class="vendor-card-stats">${statSnippet}</div>
                </div>
                <button class="vendor-buy-btn">
                    <span>🪙</span> ${item.value}g
                </button>
            `;

            card.querySelector('.vendor-buy-btn').onclick = (e) => {
                e.stopPropagation();
                this.buyVendorItem(item);
            };

            catalogList.appendChild(card);
        });

        // Open backpack side-by-side
        this.isOpen = true;
        document.getElementById('inventory-window').style.display = 'flex';
        sound.playClick();
        this.render();
    }

    closeVendor() {
        this.currentVendor = null;
        document.getElementById('vendor-window').style.display = 'none';
        sound.playClick();
    }

    buyVendorItem(item) {
        const hero = this.game.hero;
        if (hero.coins < item.value) {
            this.game.addFloatingText("Not enough Gold!", hero.x, hero.y, '#ff4444');
            sound.playClick();
            return;
        }

        // Clone item instance so each purchase is distinct
        const boughtItem = new Item({
            name: item.name,
            type: item.type,
            slot: item.slot,
            rarity: item.rarity,
            stats: Object.assign({}, item.stats),
            value: item.value,
            icon: item.icon,
            description: item.description,
            setId: item.setId,
            setName: item.setName,
            pieceId: item.pieceId
        });

        if (hero.addItemToInventory(boughtItem)) {
            hero.coins -= item.value;
            sound.playCoin();
            this.game.addFloatingText(`Purchased ${boughtItem.name}!`, hero.x, hero.y, '#ffd700');
            this.render();
        } else {
            this.game.addFloatingText("Backpack is Full!", hero.x, hero.y, '#ff4444');
        }
    }

    sellItem(invIndex) {
        const hero = this.game.hero;
        const item = hero.inventory.slots[invIndex];
        if (!item) return;

        const sellGold = Math.max(1, Math.floor(item.value * 0.75));
        hero.coins += sellGold;
        hero.inventory.slots[invIndex] = null;
        sound.playCoin();
        this.game.addFloatingText(`+${sellGold} Gold (Sold ${item.name})`, hero.x, hero.y, '#ffd700');
        this.render();
    }

    performVendorService() {
        const hero = this.game.hero;
        const vKey = this.currentVendor;
        if (!vKey || !VENDOR_CATALOGS[vKey]) return;

        const vendor = VENDOR_CATALOGS[vKey];
        if (hero.coins < vendor.serviceCost) {
            this.game.addFloatingText("Not enough Gold for service!", hero.x, hero.y, '#ff4444');
            sound.playClick();
            return;
        }

        hero.coins -= vendor.serviceCost;

        if (vKey === 'griswold') {
            hero.baseDamage += 5;
            hero.recalculateStats();
            sound.playEquip();
            this.game.addFloatingText("Gear Polished & Repaired! (+5 Attack)", hero.x, hero.y, '#ffd700');
        } else if (vKey === 'adria') {
            hero.energy += 3;
            hero.mana = hero.origin_mana;
            hero.recalculateStats();
            sound.playPotion();
            this.game.addFloatingText("Arcane Infusion: +3 Energy & Mana Restored!", hero.x, hero.y, '#9b59b6');
        } else if (vKey === 'cain') {
            sound.playLevelUp();
            this.game.addFloatingText('"All items identified! Stay awhile and listen."', hero.x, hero.y, '#ffd700');
        } else if (vKey === 'pepin') {
            hero.health = hero.origin_health;
            hero.mana = hero.origin_mana;
            sound.playPotion();
            this.game.addFloatingText("Divine Blessing: Full Health & Mana!", hero.x, hero.y, '#44ff44');
        }

        this.render();
    }

    openInspect(item, context) {
        this.inspectingItem = item;
        this.inspectContext = context;

        const modal = document.getElementById('item-inspect-modal');
        const hero = this.game.hero;

        // Card Border Glow & Colors
        const cardBox = document.getElementById('inspect-card-box');
        cardBox.className = `inspect-box card-rarity-${item.rarity}`;

        // Header Title & Sub
        const nameEl = document.getElementById('inspect-item-name');
        nameEl.innerText = item.name;
        nameEl.className = `inspect-item-name rarity-${item.rarity}`;

        const typeEl = document.getElementById('inspect-item-type');
        typeEl.innerText = `${item.rarity.toUpperCase()} ${item.type.toUpperCase()} [${(item.slot || 'ITEM').toUpperCase()}]`;

        // Big Icon
        document.getElementById('inspect-item-img').src = item.icon;

        // Stats Display
        const statsEl = document.getElementById('inspect-stats-block');
        let statsHtml = '';
        if (item.stats.damage) statsHtml += `<div class="inspect-stat-row">⚔️ Attack Damage: <b>+${item.stats.damage}</b></div>`;
        if (item.stats.defense) statsHtml += `<div class="inspect-stat-row">🛡️ Defense: <b>+${item.stats.defense}</b></div>`;
        if (item.stats.health) statsHtml += `<div class="inspect-stat-row stat-hp-text">❤️ Maximum Life: <b>+${item.stats.health}</b></div>`;
        if (item.stats.mana) statsHtml += `<div class="inspect-stat-row stat-mana-text">🔷 Maximum Mana: <b>+${item.stats.mana}</b></div>`;
        if (item.stats.strength) statsHtml += `<div class="inspect-stat-row">💪 Strength: <b>+${item.stats.strength}</b></div>`;
        if (item.stats.dexterity) statsHtml += `<div class="inspect-stat-row">🏹 Dexterity: <b>+${item.stats.dexterity}</b></div>`;
        if (item.stats.crit) statsHtml += `<div class="inspect-stat-row">⚡ Critical Strike: <b>+${item.stats.crit}%</b></div>`;
        if (item.stats.heal) statsHtml += `<div class="inspect-stat-row stat-hp-text">🧪 Restores ${item.stats.heal} Health</div>`;
        if (item.stats.restoreMana) statsHtml += `<div class="inspect-stat-row stat-mana-text">🧪 Restores ${item.stats.restoreMana} Mana</div>`;
        statsEl.innerHTML = statsHtml || '<div class="inspect-stat-row">Standard Item</div>';

        // Set Details Block
        const setEl = document.getElementById('inspect-set-block');
        if (item.setId && SET_DEFINITIONS[item.setId]) {
            const setDef = SET_DEFINITIONS[item.setId];
            let activeCount = 0;
            for (const s in hero.equipment) {
                if (hero.equipment[s] && hero.equipment[s].setId === item.setId) activeCount++;
            }

            let piecesHtml = '';
            setDef.pieces.forEach(p => {
                let isEquipped = false;
                for (const s in hero.equipment) {
                    if (hero.equipment[s] && hero.equipment[s].pieceId === p.pieceId) isEquipped = true;
                }
                piecesHtml += `<div class="set-piece-entry ${isEquipped ? 'piece-active' : 'piece-inactive'}">${isEquipped ? '✔' : '✖'} ${p.name}</div>`;
            });

            let bonusesHtml = '';
            for (const tierStr in setDef.bonuses) {
                const tier = parseInt(tierStr);
                const b = setDef.bonuses[tier];
                const isActive = activeCount >= tier;
                bonusesHtml += `<div class="set-bonus-entry ${isActive ? 'bonus-active' : 'bonus-inactive'}">(${tier} Items) ${b.text}</div>`;
            }

            setEl.innerHTML = `
                <div class="set-title">${setDef.name} (${activeCount}/${setDef.pieces.length} Equipped)</div>
                <div class="set-pieces-list">${piecesHtml}</div>
                <div class="set-bonuses-list">${bonusesHtml}</div>
            `;
            setEl.style.display = 'block';
        } else {
            setEl.style.display = 'none';
        }

        // Flavor Lore & Value
        document.getElementById('inspect-desc-text').innerText = item.description || 'An artifact of Sanctuary.';
        document.getElementById('inspect-value-tag').innerHTML = `💰 Gold Value: <b>${item.value} Gold</b>`;

        // Configure Context Action Buttons
        const equipBtn = document.getElementById('btn-inspect-equip');
        const dropBtn = document.getElementById('btn-inspect-drop');
        const stashBtn = document.getElementById('btn-inspect-stash');
        const sellBtn = document.getElementById('btn-inspect-sell');

        if (context.source === 'inventory') {
            equipBtn.style.display = 'inline-block';
            equipBtn.innerText = item.slot ? 'EQUIP GEAR' : 'USE POTION';
            dropBtn.style.display = 'inline-block';

            if (this.isStashOpen) {
                stashBtn.style.display = 'inline-block';
                stashBtn.innerText = 'DEPOSIT TO STASH';
            } else {
                stashBtn.style.display = 'none';
            }

            if (this.currentVendor) {
                sellBtn.style.display = 'inline-block';
                sellBtn.innerText = `SELL (${Math.max(1, Math.floor(item.value * 0.75))}g)`;
            } else {
                sellBtn.style.display = 'none';
            }
        } else if (context.source === 'equipment') {
            equipBtn.style.display = 'inline-block';
            equipBtn.innerText = 'UNEQUIP GEAR';
            dropBtn.style.display = 'inline-block';
            stashBtn.style.display = 'none';
            sellBtn.style.display = 'none';
        } else if (context.source === 'stash') {
            equipBtn.style.display = 'none';
            dropBtn.style.display = 'inline-block';
            stashBtn.style.display = 'inline-block';
            stashBtn.innerText = 'WITHDRAW TO PACK';
            sellBtn.style.display = 'none';
        }

        modal.style.display = 'flex';
        sound.playClick();
    }

    closeInspect() {
        this.inspectingItem = null;
        this.inspectContext = null;
        document.getElementById('item-inspect-modal').style.display = 'none';
    }

    toggleInventory(force) {
        this.isOpen = force !== undefined ? force : !this.isOpen;
        const invWin = document.getElementById('inventory-window');
        invWin.style.display = this.isOpen ? 'flex' : 'none';
        sound.playClick();
        if (this.isOpen) this.render();
    }

    toggleCharacterSheet(force) {
        this.isCharSheetOpen = force !== undefined ? force : !this.isCharSheetOpen;
        const charWin = document.getElementById('character-window');
        charWin.style.display = this.isCharSheetOpen ? 'block' : 'none';
        sound.playClick();
        if (this.isCharSheetOpen) this.render();
    }

    toggleMenu(force) {
        this.isMenuOpen = force !== undefined ? force : !this.isMenuOpen;
        const menuModal = document.getElementById('game-menu-modal');
        menuModal.style.display = this.isMenuOpen ? 'flex' : 'none';
        sound.playClick();
    }

    showGameOver() {
        sound.playMonsterDeath();
        document.getElementById('game-over-modal').style.display = 'flex';
    }

    render() {
        const hero = this.game.hero;
        if (!hero) return;

        const watermarks = {
            helm: '🪖',
            weapon: '⚔️',
            armor: '🛡️',
            shield: '🔰',
            amulet: '📿',
            ring1: '💍',
            ring2: '💍',
            boots: '👢'
        };

        // Render Equipment Slots
        document.querySelectorAll('.equip-slot').forEach(slot => {
            const slotName = slot.dataset.slot;
            const item = hero.equipment[slotName];
            if (item) {
                slot.innerHTML = `<img src="${item.icon}" class="slot-item-icon" />`;
                slot.className = `equip-slot has-item rarity-${item.rarity}`;
            } else {
                const mark = watermarks[slotName] || '';
                slot.innerHTML = `<span class="slot-watermark">${mark}</span>`;
                slot.className = `equip-slot slot-${slotName}`;
            }
        });

        // Render Backpack Grid Slots
        const slotsDOM = document.querySelectorAll('#backpack-grid .inventory-slot');
        slotsDOM.forEach(slot => {
            const idx = parseInt(slot.dataset.index);
            const item = hero.inventory.slots[idx];
            if (item) {
                slot.innerHTML = `<img src="${item.icon}" class="slot-item-icon" />`;
                slot.className = `inventory-slot has-item rarity-${item.rarity}`;
            } else {
                slot.innerHTML = '';
                slot.className = 'inventory-slot';
            }
        });

        // Render Stash Grid Slots
        if (hero.stash) {
            const stashSlotsDOM = document.querySelectorAll('#stash-grid .stash-slot');
            stashSlotsDOM.forEach(slot => {
                const idx = parseInt(slot.dataset.stashIndex);
                const item = hero.stash.slots[idx];
                if (item) {
                    slot.innerHTML = `<img src="${item.icon}" class="slot-item-icon" />`;
                    slot.className = `inventory-slot stash-slot has-item rarity-${item.rarity}`;
                } else {
                    slot.innerHTML = '';
                    slot.className = 'inventory-slot stash-slot';
                }
            });
        }

        // Update Backpack Gold Pouch
        const invGoldEl = document.getElementById('inv-gold-count');
        if (invGoldEl) invGoldEl.innerText = hero.coins;

        // Sync Belt Quick Slot in HUD
        if (this.game.ui && this.game.ui.updateBelt) {
            this.game.ui.updateBelt(hero.belt.items);
        }

        // Render Character Sheet Stats
        const hpEl = document.getElementById('stat-hp');
        if (hpEl) hpEl.innerText = `${Math.floor(hero.health)} / ${hero.origin_health}`;
        const manaEl = document.getElementById('stat-mana');
        if (manaEl) manaEl.innerText = `${Math.floor(hero.mana)} / ${hero.origin_mana}`;
        const dmgEl = document.getElementById('stat-dmg');
        if (dmgEl) dmgEl.innerText = hero.currentDamage;
        const defEl = document.getElementById('stat-def');
        if (defEl) defEl.innerText = hero.defense;
        const critEl = document.getElementById('stat-crit');
        if (critEl) critEl.innerText = `${Math.round(hero.criticalDamage * 100)}%`;

        const strEl = document.getElementById('stat-str');
        if (strEl) strEl.innerText = hero.strength;
        const dexEl = document.getElementById('stat-dex');
        if (dexEl) dexEl.innerText = hero.dexterity;
        const vitEl = document.getElementById('stat-vit');
        if (vitEl) vitEl.innerText = hero.vitality;
        const eneEl = document.getElementById('stat-ene');
        if (eneEl) eneEl.innerText = hero.energy;

        const unspentEl = document.getElementById('stat-unspent');
        if (unspentEl) unspentEl.innerText = hero.statPoints;
        const heroNameEl = document.getElementById('char-hero-name');
        if (heroNameEl) heroNameEl.innerText = `LEVEL ${hero.level} BARBARIAN`;

        const slainEl = document.getElementById('stat-slain');
        if (slainEl) slainEl.innerText = hero.monstersSlain;
        const goldEl = document.getElementById('stat-gold');
        if (goldEl) goldEl.innerText = hero.coins;

        // Render Active Set Bonuses in Character Sheet
        const setBonusesEl = document.getElementById('char-set-bonuses');
        if (setBonusesEl) {
            if (hero.activeSetBonuses && hero.activeSetBonuses.length > 0) {
                let html = '<div class="char-section-title">ACTIVE SET BONUSES</div>';
                hero.activeSetBonuses.forEach(b => {
                    html += `
                        <div class="char-set-bonus-badge">
                            <span class="set-bonus-star">★</span> <b>${b.setName} (${b.tier} Pc):</b> ${b.text}
                        </div>
                    `;
                });
                setBonusesEl.innerHTML = html;
                setBonusesEl.style.display = 'block';
            } else {
                setBonusesEl.innerHTML = '';
                setBonusesEl.style.display = 'none';
            }
        }
    }
}
