// Authentic Diablo-style raster graphics generator for items, potions, and equipment

let potionSheetImage = null;
const cachedGraphics = {};

// Helper to get or load the authentic potions spritesheet
export function getPotionSheet() {
    if (!potionSheetImage) {
        potionSheetImage = new Image();
        potionSheetImage.src = 'sprite/potions.png';
    }
    return potionSheetImage;
}

// Slice authentic potion sprite from sprite/potions.png
export function getAuthenticPotionGraphic(col = 1, row = 0) {
    const key = `potion_${col}_${row}`;
    if (cachedGraphics[key]) return cachedGraphics[key];

    const canvas = document.createElement('canvas');
    canvas.width = 36;
    canvas.height = 36;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    const img = getPotionSheet();

    function renderSlice() {
        const sw = 175 / 6;
        const sh = 117 / 4;
        // Ground drop shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.ellipse(18, 30, 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Draw cropped authentic potion sprite scaled up slightly to 32x32
        ctx.drawImage(img, col * sw, row * sh, sw, sh, 4, 2, 28, 28);
    }

    if (img.complete && img.naturalWidth > 0) {
        renderSlice();
        cachedGraphics[key] = canvas.toDataURL('image/png');
        return cachedGraphics[key];
    } else {
        img.addEventListener('load', () => {
            renderSlice();
            cachedGraphics[key] = canvas.toDataURL('image/png');
        });
        // Immediate fallback while loading
        drawFallbackPotion(ctx, row === 0 ? '#cc1111' : row === 1 ? '#1144cc' : '#aa11cc');
        return canvas.toDataURL('image/png');
    }
}

function drawFallbackPotion(ctx, liquidColor) {
    // Glass flask bottle
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(18, 30, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Cork
    ctx.fillStyle = '#8c6030';
    ctx.fillRect(16, 6, 4, 4);

    // Glass body
    ctx.fillStyle = liquidColor;
    ctx.beginPath();
    ctx.arc(18, 20, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#222226';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Glass sheen
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.fillRect(14, 14, 3, 5);
}

// Draw authentic 90s Diablo pixel art items onto canvas
export function getAuthenticItemGraphic(type) {
    if (cachedGraphics[type]) return cachedGraphics[type];

    const canvas = document.createElement('canvas');
    canvas.width = 44;
    canvas.height = 44;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Helper to draw single pixel or pixel block
    const p = (x, y, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
    };

    switch (type) {
        case 'weapon':
        case 'sword':
            // Authentic Diablo Longsword / Broadsword lying diagonally
            // Cast shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.beginPath();
            ctx.ellipse(22, 24, 16, 5, -Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();

            // Blade (Steel / Iron)
            for (let i = 0; i < 22; i++) {
                const bx = 12 + i;
                const by = 30 - i;
                p(bx, by, '#48505e'); // dark edge
                p(bx - 1, by, '#828d9d'); // mid steel
                p(bx, by - 1, '#b0bbcc'); // steel sheen
                p(bx - 1, by - 1, '#eaf0f8'); // white glint
            }
            // Crossguard (Brass / Gold)
            for (let g = -4; g <= 4; g++) {
                ctx.fillStyle = '#3a2e16';
                ctx.fillRect(12 + g, 30 + g, 2, 2);
                ctx.fillStyle = '#e6c442';
                ctx.fillRect(11 + g, 29 + g, 2, 2);
            }
            // Leather Grip & Gold Pommel
            ctx.fillStyle = '#553018';
            ctx.fillRect(8, 33, 4, 4);
            ctx.fillStyle = '#f0d060';
            ctx.fillRect(6, 35, 3, 3);
            break;

        case 'axe':
            // Authentic Diablo Double-Bitted Battle Axe
            // Cast shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath();
            ctx.ellipse(22, 24, 14, 6, -Math.PI / 4, 0, Math.PI * 2);
            ctx.fill();

            // Ash Wood Shaft
            for (let i = 0; i < 26; i++) {
                const sx = 8 + i;
                const sy = 34 - i;
                ctx.fillStyle = '#3a2010';
                ctx.fillRect(sx, sy, 2, 2);
                ctx.fillStyle = '#6a4220';
                ctx.fillRect(sx - 1, sy - 1, 1, 1);
            }
            // Steel Crescent Axe Head
            ctx.fillStyle = '#2a3038';
            ctx.beginPath();
            ctx.arc(28, 14, 10, -0.8, 1.8);
            ctx.arc(24, 18, 7, 1.8, -0.8, true);
            ctx.fill();
            ctx.fillStyle = '#8a96a8';
            ctx.beginPath();
            ctx.arc(28, 14, 9, -0.8, 1.8);
            ctx.arc(25, 17, 7, 1.8, -0.8, true);
            ctx.fill();
            // Sharp steel edge
            ctx.strokeStyle = '#e0ecf8';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.arc(28, 14, 9, -0.8, 1.8);
            ctx.stroke();
            // Golden brass collar
            ctx.fillStyle = '#e6c442';
            ctx.fillRect(25, 16, 4, 4);
            break;

        case 'shield':
            // Authentic Gothic Kite Shield with Iron Rim and Cross
            // Cast shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            ctx.beginPath();
            ctx.ellipse(22, 36, 12, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Dark Wood Shield Backing
            ctx.fillStyle = '#1e222a';
            ctx.beginPath();
            ctx.moveTo(12, 8);
            ctx.lineTo(32, 8);
            ctx.lineTo(32, 24);
            ctx.lineTo(22, 38);
            ctx.lineTo(12, 24);
            ctx.closePath();
            ctx.fill();

            // Iron/Steel Rim
            ctx.strokeStyle = '#8a94a6';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Dark Hardened Leather Face
            ctx.fillStyle = '#301814';
            ctx.beginPath();
            ctx.moveTo(14, 10);
            ctx.lineTo(30, 10);
            ctx.lineTo(30, 23);
            ctx.lineTo(22, 35);
            ctx.lineTo(14, 23);
            ctx.closePath();
            ctx.fill();

            // Golden Boss & Heraldic Cross
            ctx.fillStyle = '#e6c84b';
            ctx.fillRect(20, 10, 4, 22);
            ctx.fillRect(14, 17, 16, 4);
            ctx.fillStyle = '#991111';
            ctx.fillRect(21, 18, 2, 2);
            break;

        case 'armor':
            // Authentic Gothic Full Plate Mail
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(22, 37, 13, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Cuirass base
            ctx.fillStyle = '#20242e';
            ctx.fillRect(13, 10, 18, 26);

            // Steel breastplate plates
            ctx.fillStyle = '#556070';
            ctx.beginPath();
            ctx.moveTo(13, 10);
            ctx.lineTo(22, 6);
            ctx.lineTo(31, 10);
            ctx.lineTo(35, 18);
            ctx.lineTo(30, 24);
            ctx.lineTo(30, 36);
            ctx.lineTo(14, 36);
            ctx.lineTo(14, 24);
            ctx.lineTo(9, 18);
            ctx.closePath();
            ctx.fill();

            // Steel highlight ridge
            ctx.strokeStyle = '#c0ccdc';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(22, 8);
            ctx.lineTo(22, 34);
            ctx.stroke();

            // Brass rivets & gorget
            ctx.fillStyle = '#e6c84b';
            ctx.fillRect(18, 10, 8, 3);
            p(15, 14, '#ffd700');
            p(29, 14, '#ffd700');
            p(16, 26, '#ffd700');
            p(28, 26, '#ffd700');
            break;

        case 'helm':
            // Barbarian Horned Great Helm
            // Shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(22, 35, 10, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Helm Dome
            ctx.fillStyle = '#384050';
            ctx.beginPath();
            ctx.arc(22, 20, 11, Math.PI, 0);
            ctx.lineTo(33, 30);
            ctx.lineTo(22, 33);
            ctx.lineTo(11, 30);
            ctx.closePath();
            ctx.fill();

            // Metallic Sheen
            ctx.fillStyle = '#8290a4';
            ctx.beginPath();
            ctx.arc(22, 20, 9, Math.PI, -0.4);
            ctx.lineTo(22, 20);
            ctx.fill();

            // Horns (Ivory / Bone)
            ctx.strokeStyle = '#dfd8c0';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(12, 18);
            ctx.quadraticCurveTo(6, 12, 8, 6);
            ctx.moveTo(32, 18);
            ctx.quadraticCurveTo(38, 12, 36, 6);
            ctx.stroke();

            // Visor slit
            ctx.fillStyle = '#08080a';
            ctx.fillRect(15, 23, 14, 2);
            ctx.fillRect(21, 20, 2, 8);
            break;

        case 'boots':
            // Plated Iron Greaves
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(22, 35, 11, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Left Boot
            ctx.fillStyle = '#404858';
            ctx.fillRect(13, 12, 7, 18);
            ctx.fillRect(10, 27, 10, 6);
            // Right Boot
            ctx.fillStyle = '#606c80';
            ctx.fillRect(24, 12, 7, 18);
            ctx.fillRect(24, 27, 10, 6);
            // Straps & buckles
            ctx.fillStyle = '#c09830';
            ctx.fillRect(12, 18, 8, 2);
            ctx.fillRect(24, 18, 8, 2);
            break;

        case 'ring':
            // Gold Band with Faceted Crimson Ruby
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(22, 30, 9, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Golden Ring Loop
            ctx.strokeStyle = '#e6c030';
            ctx.lineWidth = 3.5;
            ctx.beginPath();
            ctx.arc(22, 22, 9, 0, Math.PI * 2);
            ctx.stroke();

            // Gold Highlights
            ctx.strokeStyle = '#fff080';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(22, 22, 9, -Math.PI / 2, 0);
            ctx.stroke();

            // Cut Red Ruby
            ctx.fillStyle = '#cc1111';
            ctx.beginPath();
            ctx.moveTo(22, 10);
            ctx.lineTo(26, 14);
            ctx.lineTo(22, 18);
            ctx.lineTo(18, 14);
            ctx.closePath();
            ctx.fill();
            p(21, 13, '#ffffff'); // glint
            break;

        case 'amulet':
            // Gold Chain with Sapphire Talisman
            ctx.strokeStyle = '#c8a020';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.arc(22, 16, 11, 0, Math.PI);
            ctx.stroke();

            // Gold Setting & Blue Gem
            ctx.fillStyle = '#e6c442';
            ctx.beginPath();
            ctx.arc(22, 28, 7, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#1050cc';
            ctx.beginPath();
            ctx.arc(22, 28, 5, 0, Math.PI * 2);
            ctx.fill();
            p(21, 26, '#ffffff');
            break;

        case 'scroll':
            // Rolled Ancient Papyrus Parchment with Red Wax Seal
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.beginPath();
            ctx.ellipse(22, 32, 12, 4, 0, 0, Math.PI * 2);
            ctx.fill();

            // Parchment
            ctx.fillStyle = '#d8c494';
            ctx.fillRect(12, 12, 20, 20);
            ctx.strokeStyle = '#705830';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(12, 12, 20, 20);

            // Text lines
            ctx.fillStyle = '#553e1a';
            ctx.fillRect(15, 16, 14, 2);
            ctx.fillRect(15, 21, 14, 2);
            ctx.fillRect(15, 26, 10, 2);

            // Red Wax Seal
            ctx.fillStyle = '#991111';
            ctx.beginPath();
            ctx.arc(22, 22, 4, 0, Math.PI * 2);
            ctx.fill();
            break;

        case 'stairs_down':
            // Stone Dungeon Stairs Descending into Darkness
            ctx.fillStyle = '#101014';
            ctx.fillRect(4, 4, 36, 36);
            ctx.strokeStyle = '#5a4830';
            ctx.lineWidth = 2;
            ctx.strokeRect(4, 4, 36, 36);

            // Steps
            const steps = [
                { y: 8, h: 6, col: '#404550' },
                { y: 14, h: 6, col: '#303440' },
                { y: 20, h: 6, col: '#20222a' },
                { y: 26, h: 6, col: '#121418' },
                { y: 32, h: 6, col: '#060608' }
            ];
            steps.forEach(st => {
                ctx.fillStyle = st.col;
                ctx.fillRect(8, st.y, 28, st.h);
                ctx.fillStyle = '#657080';
                ctx.fillRect(8, st.y, 28, 1);
            });
            break;

        case 'stairs_up':
            // Stone Stairs Ascending
            ctx.fillStyle = '#101014';
            ctx.fillRect(4, 4, 36, 36);
            ctx.strokeStyle = '#c8aa6d';
            ctx.lineWidth = 2;
            ctx.strokeRect(4, 4, 36, 36);

            const upSteps = [
                { y: 8, h: 6, col: '#9098a8' },
                { y: 14, h: 6, col: '#707888' },
                { y: 20, h: 6, col: '#505868' },
                { y: 26, h: 6, col: '#383e4a' },
                { y: 32, h: 6, col: '#20242c' }
            ];
            upSteps.forEach(st => {
                ctx.fillStyle = st.col;
                ctx.fillRect(8, st.y, 28, st.h);
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(8, st.y, 28, 1);
            });
            break;

        default:
            // Gold coins pile (uses sprite/coins10.png or drawn pile)
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.beginPath();
            ctx.ellipse(22, 28, 12, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            for (let i = 0; i < 7; i++) {
                const cx = 16 + (i * 3) % 12;
                const cy = 24 - Math.floor(i / 3) * 3;
                ctx.fillStyle = '#c89820';
                ctx.beginPath();
                ctx.arc(cx, cy, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#ffd700';
                ctx.beginPath();
                ctx.arc(cx, cy, 3, 0, Math.PI * 2);
                ctx.fill();
            }
    }

    cachedGraphics[type] = canvas.toDataURL('image/png');
    return cachedGraphics[type];
}
