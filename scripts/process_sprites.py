import os
import numpy as np
from PIL import Image, ImageDraw

def process_isolated_black_bg(input_path, output_path, target_height=90, threshold=15, blur_edge=True):
    if not os.path.exists(input_path):
        print(f"Skipping {input_path}, file does not exist.")
        return False

    im = Image.open(input_path).convert("RGB")
    arr = np.array(im)

    # Detect foreground
    # Pixels where max(R,G,B) > threshold
    brightness = np.maximum.reduce([arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]])
    mask = brightness > threshold
    coords = np.argwhere(mask)
    if len(coords) == 0:
        print(f"No content found in {input_path}")
        return False

    y0, x0 = coords.min(axis=0)
    y1, x1 = coords.max(axis=0)

    cropped = im.crop((x0, y0, x1 + 1, y1 + 1))
    
    # Scale to target_height preserving aspect ratio
    scale = target_height / float(cropped.height)
    target_width = max(16, int(cropped.width * scale))
    resized = cropped.resize((target_width, target_height), Image.Resampling.LANCZOS)

    r_arr = np.array(resized)
    r_bright = np.maximum.reduce([r_arr[:, :, 0], r_arr[:, :, 1], r_arr[:, :, 2]])

    # Smooth alpha cutoff around black background
    alpha = np.clip((r_bright.astype(float) - threshold) / 18.0 * 255.0, 0, 255).astype(np.uint8)

    rgba = np.dstack([r_arr, alpha])
    out_im = Image.fromarray(rgba, 'RGBA')
    out_im.save(output_path)
    print(f"Saved {output_path}: {out_im.size}")
    return True

# Process NPCs
process_isolated_black_bg(
    '/Users/Samuel/.gemini/antigravity/brain/f59d6075-7ab0-46dc-a4cf-76285f192751/griswold_blacksmith_sprite_1792173965025.jpg',
    'sprite/npc_griswold.png',
    target_height=92
)

process_isolated_black_bg(
    '/Users/Samuel/.gemini/antigravity/brain/f59d6075-7ab0-46dc-a4cf-76285f192751/adria_witch_diablo1_sprite_1792174268720.jpg',
    'sprite/npc_adria.png',
    target_height=92
)

process_isolated_black_bg(
    '/Users/Samuel/.gemini/antigravity/brain/f59d6075-7ab0-46dc-a4cf-76285f192751/deckard_cain_sprite_1792174271406.jpg',
    'sprite/npc_cain.png',
    target_height=92
)

process_isolated_black_bg(
    '/Users/Samuel/.gemini/antigravity/brain/f59d6075-7ab0-46dc-a4cf-76285f192751/pepin_the_healer_sprite_1792174269959.jpg',
    'sprite/npc_pepin.png',
    target_height=92
)

# Process Shrines
process_isolated_black_bg(
    '/Users/Samuel/.gemini/antigravity/brain/f59d6075-7ab0-46dc-a4cf-76285f192751/gothic_health_shrine_d1_1792174270755.jpg',
    'sprite/shrine_healing.png',
    target_height=96
)

# Generate Mana Shrine and Power Shrine from Health Shrine with authentic hue shift
if os.path.exists('sprite/shrine_healing.png'):
    heal_im = Image.open('sprite/shrine_healing.png').convert('RGBA')
    h_arr = np.array(heal_im, dtype=float)
    
    # Mana Shrine: red channeled into intense blue
    mana_arr = h_arr.copy()
    # Where red is dominant over green and blue (the crimson pool & runes)
    is_red = (h_arr[:, :, 0] > h_arr[:, :, 1] + 25) & (h_arr[:, :, 0] > h_arr[:, :, 2] + 25)
    mana_arr[is_red, 2] = np.clip(h_arr[is_red, 0] * 1.2, 0, 255) # High blue
    mana_arr[is_red, 1] = np.clip(h_arr[is_red, 0] * 0.6, 0, 255) # Cyan tint
    mana_arr[is_red, 0] = h_arr[is_red, 2] * 0.4                  # Low red
    Image.fromarray(mana_arr.astype(np.uint8), 'RGBA').save('sprite/shrine_mana.png')
    print("Saved sprite/shrine_mana.png")

    # Power Shrine: red channeled into radiant gold
    power_arr = h_arr.copy()
    power_arr[is_red, 0] = np.clip(h_arr[is_red, 0] * 1.1, 0, 255) # High red
    power_arr[is_red, 1] = np.clip(h_arr[is_red, 0] * 0.9, 0, 255) # High green = gold
    power_arr[is_red, 2] = np.clip(h_arr[is_red, 0] * 0.2, 0, 255) # Low blue
    Image.fromarray(power_arr.astype(np.uint8), 'RGBA').save('sprite/shrine_power.png')
    print("Saved sprite/shrine_power.png")

# Process Stairs Down
process_isolated_black_bg(
    '/Users/Samuel/.gemini/antigravity/brain/f59d6075-7ab0-46dc-a4cf-76285f192751/diablo1_dungeon_stairs_down_1792174267994.jpg',
    'sprite/stairs_down.png',
    target_height=80
)

# If stairs_down exists, we can also create a flipped/modified stairs_up as fallback
if os.path.exists('sprite/stairs_down.png'):
    st_down = Image.open('sprite/stairs_down.png').convert('RGBA')
    # Horizontal flip + brighter ambient
    st_up = st_down.transpose(Image.FLIP_LEFT_RIGHT)
    u_arr = np.array(st_up, dtype=float)
    # Brighten slightly toward daylight
    u_arr[:, :, :3] = np.clip(u_arr[:, :, :3] * 1.15 + 10, 0, 255)
    Image.fromarray(u_arr.astype(np.uint8), 'RGBA').save('sprite/stairs_up.png')
    print("Saved initial sprite/stairs_up.png")

# Process Chest
process_isolated_black_bg(
    '/Users/Samuel/.gemini/antigravity/brain/f59d6075-7ab0-46dc-a4cf-76285f192751/diablo1_isometric_treasure_chest_1792174269806.jpg',
    'sprite/chest_closed.png',
    target_height=56
)

# Open chest variant: top lid tilted up with gold glow inside
if os.path.exists('sprite/chest_closed.png'):
    ch_im = Image.open('sprite/chest_closed.png').convert('RGBA')
    ch_arr = np.array(ch_im)
    # Open lid effect and glowing gold
    open_im = ch_im.copy()
    d = ImageDraw.Draw(open_im)
    # Draw open lid flap
    w, h = open_im.size
    cx, cy = w // 2, h // 2
    d.polygon([(cx - 16, cy - 6), (cx + 16, cy - 6), (cx + 18, cy - 18), (cx - 14, cy - 18)], fill=(85, 55, 30, 255), outline=(170, 180, 195, 255))
    # Glowing gold inside
    d.ellipse([cx - 12, cy - 5, cx + 12, cy + 5], fill=(255, 215, 50, 255))
    open_im.save('sprite/chest_opened.png')
    print("Saved sprite/chest_opened.png")

# Process Well
process_isolated_black_bg(
    '/Users/Samuel/.gemini/antigravity/brain/f59d6075-7ab0-46dc-a4cf-76285f192751/tristram_town_well_1792174271754.jpg',
    'sprite/prop_well.png',
    target_height=76
)
