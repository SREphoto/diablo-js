import math
from PIL import Image, ImageDraw

def create_base(w=56, h=56):
    return Image.new("RGBA", (w, h), (0, 0, 0, 0))

def add_drop_shadow(draw, cx, cy, rx, ry, alpha=110):
    for i in range(ry, 0, -1):
        a = int(alpha * (i / ry))
        cur_rx = int(rx * (i / ry))
        draw.ellipse([cx - cur_rx, cy - i, cx + cur_rx, cy + i], fill=(0, 0, 0, a))

# --- WEAPONS ---
def draw_sword():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 48, 18, 5)
    # Blade running from (12, 12) down-right to (42, 42) or vertical
    # Longsword oriented diagonally from top-left to bottom-right
    # Blade: 28px long
    for t in range(32):
        # Center of blade
        bx = 10 + t
        by = 10 + t
        # Edge highlights & core
        d.line([(bx, by-1), (bx, by+1)], fill=(220, 225, 235, 255), width=1)
        d.point((bx, by), fill=(255, 255, 255, 255) if t%2==0 else (190, 195, 205, 255))
        d.point((bx-1, by), fill=(140, 150, 165, 255))
        d.point((bx, by+2), fill=(80, 90, 105, 255)) # Shadow under blade

    # Crossguard at t=26
    gx, gy = 36, 36
    d.line([(gx - 7, gy + 7), (gx + 7, gy - 7)], fill=(215, 175, 45, 255), width=3)
    d.line([(gx - 8, gy + 8), (gx - 6, gy + 6)], fill=(255, 225, 100, 255), width=2)
    d.line([(gx + 6, gy - 6), (gx + 8, gy - 8)], fill=(150, 110, 25, 255), width=2)

    # Hilt grip
    for t in range(7):
        hx = gx + 2 + t
        hy = gy + 2 + t
        d.point((hx, hy), fill=(100, 45, 20, 255) if t%2==0 else (160, 85, 40, 255))
        d.point((hx+1, hy), fill=(60, 25, 10, 255))

    # Pommel
    px, py = gx + 9, gy + 9
    d.ellipse([px-3, py-3, px+3, py+3], fill=(215, 175, 45, 255), outline=(130, 95, 20, 255))
    d.point((px, py), fill=(220, 30, 30, 255)) # Ruby gem in pommel
    return im

def draw_broadsword():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 48, 18, 5)
    # Wider heavy blade
    for t in range(30):
        bx = 9 + t
        by = 9 + t
        d.line([(bx-2, by+1), (bx+1, by-2)], fill=(210, 215, 225, 255), width=1)
        d.line([(bx-1, by+2), (bx+2, by-1)], fill=(160, 170, 185, 255), width=1)
        d.point((bx, by), fill=(245, 250, 255, 255))
        d.point((bx-2, by+3), fill=(70, 75, 85, 255))

    # Blood groove / fuller
    for t in range(6, 24):
        d.point((10 + t, 10 + t), fill=(90, 100, 115, 255))

    # Heavy iron crossguard
    gx, gy = 36, 36
    d.line([(gx - 8, gy + 8), (gx + 8, gy - 8)], fill=(90, 95, 105, 255), width=4)
    d.line([(gx - 9, gy + 9), (gx - 7, gy + 7)], fill=(170, 180, 195, 255), width=2)
    d.line([(gx + 7, gy - 7), (gx + 9, gy - 9)], fill=(50, 55, 60, 255), width=2)

    # Leather cord grip
    for t in range(8):
        hx, hy = gx + 2 + t, gy + 2 + t
        d.line([(hx-1, hy+1), (hx+1, hy-1)], fill=(75, 50, 30, 255) if t%2==0 else (120, 80, 45, 255), width=2)

    # Skull / spiked pommel
    px, py = gx + 10, gy + 10
    d.ellipse([px-4, py-4, px+4, py+4], fill=(130, 140, 150, 255), outline=(50, 55, 60, 255))
    d.point((px-1, py-1), fill=(30, 30, 35, 255))
    d.point((px+1, py-1), fill=(30, 30, 35, 255))
    return im

def draw_axe():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 48, 16, 5)
    # Haft
    for t in range(40):
        hx = 8 + t
        hy = 46 - t
        d.line([(hx, hy), (hx+1, hy+1)], fill=(130, 85, 45, 255) if t%3!=0 else (175, 120, 65, 255), width=2)

    # Double-crescent steel axe heads around (18, 36)
    ax, ay = 18, 36
    # Left crescent
    d.polygon([(ax, ay), (ax-14, ay-8), (ax-16, ay+4), (ax-10, ay+14), (ax-2, ay+8)], fill=(180, 190, 205, 255), outline=(70, 80, 95, 255))
    d.line([(ax-14, ay-8), (ax-16, ay+4), (ax-10, ay+14)], fill=(245, 250, 255, 255), width=2)

    # Right crescent
    d.polygon([(ax, ay), (ax+8, ay-14), (ax+16, ay-8), (ax+14, ay+6), (ax+4, ay+4)], fill=(160, 170, 185, 255), outline=(60, 70, 85, 255))
    d.line([(ax+8, ay-14), (ax+16, ay-8), (ax+14, ay+6)], fill=(230, 240, 255, 255), width=2)

    # Center socket & brass rivets
    d.ellipse([ax-4, ay-4, ax+4, ay+4], fill=(110, 115, 125, 255), outline=(40, 45, 55, 255))
    d.point((ax, ay), fill=(220, 180, 50, 255))
    return im

def draw_set_berserker_hatchet():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 48, 16, 5)
    # Heavy dark notched wooden haft
    for t in range(36):
        hx = 10 + t
        hy = 44 - t
        d.line([(hx, hy), (hx+1, hy+1)], fill=(80, 50, 30, 255) if t%2==0 else (115, 75, 45, 255), width=2)

    # Heavy notched bearded bronze/green axe head
    ax, ay = 20, 34
    d.polygon([(ax, ay), (ax-16, ay-10), (ax-18, ay+6), (ax-14, ay+16), (ax-4, ay+10)], fill=(170, 130, 65, 255), outline=(75, 50, 20, 255))
    # Blood edge
    d.line([(ax-16, ay-10), (ax-18, ay+6), (ax-14, ay+16)], fill=(210, 40, 40, 255), width=2)
    # Spikes on back
    d.polygon([(ax, ay), (ax+10, ay-8), (ax+4, ay+4)], fill=(120, 125, 135, 255))
    return im

def draw_set_isenhart_sword():
    im = draw_sword()
    d = ImageDraw.Draw(im)
    # Add holy glowing cyan/blue rune aura
    for t in range(6, 26):
        bx = 10 + t
        by = 10 + t
        d.point((bx+1, by-1), fill=(100, 220, 255, 230))
        d.point((bx-1, by+1), fill=(60, 160, 255, 200))
    # Glowing crossguard
    d.ellipse([34, 34, 38, 38], fill=(120, 230, 255, 255), outline=(255, 255, 255, 255))
    return im

# --- SHIELDS ---
def draw_buckler():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 46, 18, 6)
    cx, cy = 28, 26
    # Wooden core
    d.ellipse([cx-18, cy-18, cx+18, cy+18], fill=(95, 60, 35, 255), outline=(50, 30, 15, 255))
    # Iron rim
    d.ellipse([cx-18, cy-18, cx+18, cy+18], outline=(150, 160, 175, 255), width=3)
    # Studs on rim
    for deg in range(0, 360, 45):
        rad = math.radians(deg)
        sx = int(cx + 15 * math.cos(rad))
        sy = int(cy + 15 * math.sin(rad))
        d.point((sx, sy), fill=(240, 245, 255, 255))
    # Heavy central iron boss
    d.ellipse([cx-8, cy-8, cx+8, cy+8], fill=(170, 180, 195, 255), outline=(60, 65, 75, 255))
    d.ellipse([cx-5, cy-5, cx+5, cy+5], fill=(210, 220, 235, 255))
    d.point((cx-2, cy-2), fill=(255, 255, 255, 255))
    return im

def draw_kite_shield():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 48, 16, 5)
    cx, cy = 28, 24
    # Kite shield polygon: arched top, tapered bottom
    pts = [(cx-15, cy-14), (cx+15, cy-14), (cx+15, cy+6), (cx, cy+22), (cx-15, cy+6)]
    d.polygon(pts, fill=(160, 30, 30, 255), outline=(60, 15, 15, 255))
    # Steel border
    d.polygon(pts, outline=(190, 200, 215, 255), width=3)
    # Golden cross / heraldry
    d.line([(cx, cy-12), (cx, cy+16)], fill=(235, 195, 55, 255), width=3)
    d.line([(cx-10, cy-4), (cx+10, cy-4)], fill=(235, 195, 55, 255), width=3)
    d.point((cx, cy-4), fill=(255, 240, 150, 255))
    return im

def draw_set_sigon_guard():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 50, 18, 5)
    cx, cy = 28, 25
    # Tower shield: tall rectangle with rounded corners & notched top
    pts = [(cx-16, cy-18), (cx-6, cy-21), (cx+6, cy-21), (cx+16, cy-18), (cx+16, cy+18), (cx, cy+23), (cx-16, cy+18)]
    d.polygon(pts, fill=(175, 185, 200, 255), outline=(50, 55, 65, 255))
    d.polygon(pts, outline=(230, 240, 255, 255), width=2)
    # Golden Sigon lion emblem
    d.ellipse([cx-7, cy-8, cx+7, cy+6], fill=(225, 185, 45, 255), outline=(130, 95, 20, 255))
    d.point((cx-3, cy-3), fill=(40, 20, 10, 255))
    d.point((cx+3, cy-3), fill=(40, 20, 10, 255))
    d.line([(cx-4, cy+1), (cx+4, cy+1)], fill=(120, 80, 20, 255))
    return im

def draw_set_isenhart_parry():
    im = draw_kite_shield()
    d = ImageDraw.Draw(im)
    # Divine cyan/white aura & sapphire gem
    cx, cy = 28, 24
    d.ellipse([cx-5, cy-9, cx+5, cy+1], fill=(40, 140, 240, 255), outline=(200, 240, 255, 255))
    d.point((cx-1, cy-5), fill=(255, 255, 255, 255))
    return im

# --- ARMOR ---
def draw_leather_armor():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 48, 18, 5)
    # Studded leather vest
    # Torso: shoulders (14, 12)-(42, 12), waist (18, 42)-(38, 42)
    pts = [(20, 14), (28, 19), (36, 14), (43, 18), (41, 30), (37, 42), (19, 42), (15, 30), (13, 18)]
    d.polygon(pts, fill=(125, 75, 40, 255), outline=(55, 30, 15, 255))
    # Quilted leather creases
    d.line([(28, 19), (28, 42)], fill=(80, 45, 25, 255), width=2)
    d.line([(20, 28), (36, 28)], fill=(80, 45, 25, 255), width=1)
    d.line([(22, 35), (34, 35)], fill=(80, 45, 25, 255), width=1)
    # Brass studs
    for y in [24, 32, 38]:
        for x in [23, 33]:
            d.point((x, y), fill=(235, 195, 50, 255))
            d.point((x+1, y), fill=(140, 100, 20, 255))
    return im

def draw_plate_armor():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 50, 19, 5)
    # Polished steel breastplate
    pts = [(20, 14), (28, 18), (36, 14), (44, 17), (42, 32), (38, 44), (18, 44), (14, 32), (12, 17)]
    d.polygon(pts, fill=(185, 195, 210, 255), outline=(60, 65, 75, 255))
    # Pauldrons (shoulders)
    d.ellipse([10, 14, 20, 26], fill=(160, 170, 185, 255), outline=(50, 55, 65, 255))
    d.ellipse([36, 14, 46, 26], fill=(140, 150, 165, 255), outline=(50, 55, 65, 255))
    # Fluted chest ridge
    d.line([(28, 18), (28, 42)], fill=(245, 250, 255, 255), width=2)
    d.line([(21, 26), (28, 30), (35, 26)], fill=(130, 140, 155, 255), width=2)
    # Highlights
    d.line([(24, 20), (24, 38)], fill=(225, 235, 250, 255), width=1)
    # Gold trim buckles
    d.point((28, 42), fill=(220, 180, 50, 255))
    return im

def draw_set_sigon_shelter():
    im = draw_plate_armor()
    d = ImageDraw.Draw(im)
    # Ornate golden trims along neck and waist
    d.line([(20, 14), (28, 18), (36, 14)], fill=(235, 195, 55, 255), width=2)
    d.line([(18, 44), (38, 44)], fill=(235, 195, 55, 255), width=2)
    # Sigon royal crest on chest
    d.ellipse([25, 24, 31, 30], fill=(225, 185, 45, 255), outline=(120, 85, 20, 255))
    return im

def draw_set_berserker_armor():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 48, 18, 5)
    # Dark beast hide & iron chain
    pts = [(20, 14), (28, 18), (36, 14), (43, 18), (41, 32), (37, 44), (19, 44), (15, 32), (13, 18)]
    d.polygon(pts, fill=(70, 50, 35, 255), outline=(35, 25, 15, 255))
    # Chain links
    for y in range(20, 42, 3):
        for x in range(20, 37, 3):
            d.point((x, y), fill=(170, 175, 185, 255) if (x+y)%2==0 else (90, 95, 105, 255))
    # Demon bone pauldrons with spikes
    d.polygon([(11, 14), (18, 10), (19, 22), (8, 22)], fill=(215, 205, 180, 255), outline=(90, 80, 60, 255))
    d.polygon([(45, 14), (38, 10), (37, 22), (48, 22)], fill=(195, 185, 160, 255), outline=(90, 80, 60, 255))
    d.line([(8, 14), (4, 10)], fill=(240, 235, 215, 255), width=2)
    d.line([(48, 14), (52, 10)], fill=(240, 235, 215, 255), width=2)
    return im

def draw_set_cathan_mesh():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 48, 18, 5)
    pts = [(20, 14), (28, 18), (36, 14), (43, 18), (41, 32), (37, 44), (19, 44), (15, 32), (13, 18)]
    d.polygon(pts, fill=(160, 40, 25, 255), outline=(65, 15, 10, 255))
    # Glowing ember chainlinks
    for y in range(20, 42, 3):
        for x in range(20, 37, 3):
            col = (255, 160, 40, 255) if (x*y)%3==0 else (210, 60, 20, 255)
            d.point((x, y), fill=col)
    # Gold collar & flame sigil
    d.line([(20, 14), (28, 18), (36, 14)], fill=(240, 200, 60, 255), width=2)
    d.polygon([(28, 25), (25, 32), (31, 32)], fill=(255, 220, 80, 255))
    return im

def draw_set_isenhart_case():
    im = draw_plate_armor()
    d = ImageDraw.Draw(im)
    # Silver with sacred sunburst
    cx, cy = 28, 28
    d.ellipse([cx-4, cy-4, cx+4, cy+4], fill=(255, 245, 180, 255), outline=(210, 170, 40, 255))
    for deg in range(0, 360, 45):
        rad = math.radians(deg)
        d.line([(cx, cy), (int(cx + 7*math.cos(rad)), int(cy + 7*math.sin(rad)))], fill=(255, 220, 90, 255), width=1)
    return im

# --- HELMS ---
def draw_cap():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 44, 15, 5)
    cx, cy = 28, 26
    # Leather coif with iron brow band
    d.ellipse([cx-14, cy-14, cx+14, cy+14], fill=(120, 75, 40, 255), outline=(50, 30, 15, 255))
    d.line([(cx-14, cy+4), (cx+14, cy+4)], fill=(160, 170, 185, 255), width=3)
    d.point((cx-8, cy+4), fill=(235, 195, 50, 255))
    d.point((cx, cy+4), fill=(235, 195, 50, 255))
    d.point((cx+8, cy+4), fill=(235, 195, 50, 255))
    return im

def draw_horned_helm():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 46, 17, 5)
    cx, cy = 28, 28
    # Steel skullcap
    d.ellipse([cx-13, cy-12, cx+13, cy+12], fill=(175, 185, 200, 255), outline=(60, 65, 75, 255))
    # Nasal guard & eye slits
    d.line([(cx, cy), (cx, cy+12)], fill=(120, 130, 145, 255), width=3)
    d.line([(cx-8, cy+4), (cx-2, cy+4)], fill=(20, 20, 25, 255), width=2)
    d.line([(cx+2, cy+4), (cx+8, cy+4)], fill=(20, 20, 25, 255), width=2)
    # Curved ram horns on sides
    d.line([(cx-12, cy-4), (cx-20, cy-12), (cx-22, cy-4)], fill=(210, 195, 160, 255), width=3)
    d.line([(cx+12, cy-4), (cx+20, cy-12), (cx+22, cy-4)], fill=(185, 170, 135, 255), width=3)
    return im

def draw_set_sigon_visor():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 48, 16, 5)
    cx, cy = 28, 28
    # Full great helm
    pts = [(cx-13, cy-15), (cx+13, cy-15), (cx+14, cy+14), (cx, cy+18), (cx-14, cy+14)]
    d.polygon(pts, fill=(190, 200, 215, 255), outline=(60, 65, 75, 255))
    # Brass cross visor
    d.line([(cx-11, cy-1), (cx+11, cy-1)], fill=(230, 190, 45, 255), width=4)
    d.line([(cx, cy-10), (cx, cy+14)], fill=(230, 190, 45, 255), width=3)
    # Breathing holes
    for hx in [cx-6, cx-3, cx+3, cx+6]:
        d.point((hx, cy+7), fill=(20, 20, 25, 255))
    # Plume crest at top
    d.line([(cx, cy-15), (cx, cy-24)], fill=(210, 30, 30, 255), width=4)
    return im

def draw_set_berserker_helm():
    im = draw_horned_helm()
    d = ImageDraw.Draw(im)
    # Red barbarian warpaint across eyes
    cx, cy = 28, 28
    d.line([(cx-10, cy+1), (cx+10, cy+1)], fill=(190, 30, 30, 255), width=2)
    return im

def draw_set_isenhart_horns():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 46, 16, 5)
    cx, cy = 28, 28
    # Blessed winged silver bascinet
    d.ellipse([cx-13, cy-14, cx+13, cy+10], fill=(215, 225, 240, 255), outline=(70, 75, 90, 255))
    # Golden forehead tiara with sapphire
    d.line([(cx-11, cy-3), (cx+11, cy-3)], fill=(235, 195, 50, 255), width=2)
    d.ellipse([cx-3, cy-6, cx+3, cy], fill=(40, 140, 240, 255))
    # Silver angelic wings
    d.line([(cx-12, cy-6), (cx-20, cy-18), (cx-16, cy-22)], fill=(235, 240, 250, 255), width=3)
    d.line([(cx+12, cy-6), (cx+20, cy-18), (cx+16, cy-22)], fill=(210, 220, 235, 255), width=3)
    return im

# --- BOOTS ---
def draw_boots():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 48, 18, 5)
    # Pair of leather/iron greave boots
    # Left boot
    pts_l = [(18, 18), (25, 18), (25, 36), (14, 40), (14, 34), (18, 30)]
    d.polygon(pts_l, fill=(115, 70, 35, 255), outline=(50, 30, 15, 255))
    d.line([(18, 24), (25, 24)], fill=(160, 170, 185, 255), width=2)
    # Right boot
    pts_r = [(31, 18), (38, 18), (42, 30), (42, 40), (31, 36)]
    d.polygon(pts_r, fill=(130, 80, 40, 255), outline=(55, 30, 15, 255))
    d.line([(31, 24), (38, 24)], fill=(180, 190, 205, 255), width=2)
    return im

def draw_set_sigon_sabatons():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 48, 18, 5)
    # Articulated knight steel sabatons
    pts_l = [(18, 16), (25, 16), (25, 36), (12, 40), (13, 33), (18, 28)]
    d.polygon(pts_l, fill=(180, 190, 205, 255), outline=(55, 60, 70, 255))
    pts_r = [(31, 16), (38, 16), (43, 28), (44, 40), (31, 36)]
    d.polygon(pts_r, fill=(160, 170, 185, 255), outline=(50, 55, 65, 255))
    # Steel segment ridges
    for y in [22, 28, 34]:
        d.line([(18, y), (25, y)], fill=(230, 240, 255, 255), width=1)
        d.line([(31, y), (39, y)], fill=(210, 220, 240, 255), width=1)
    # Gold trim rivets
    d.point((21, 38), fill=(230, 190, 45, 255))
    d.point((35, 38), fill=(230, 190, 45, 255))
    return im

# --- JEWELRY & SCROLLS ---
def draw_ring():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 44, 15, 5)
    cx, cy = 28, 26
    # Gold band
    d.ellipse([cx-13, cy-13, cx+13, cy+13], outline=(235, 195, 50, 255), width=4)
    d.ellipse([cx-13, cy-13, cx+13, cy+13], outline=(150, 110, 20, 255), width=1)
    # Polished ruby setting
    d.ellipse([cx-6, cy-15, cx+6, cy-3], fill=(225, 30, 30, 255), outline=(130, 10, 10, 255))
    d.point((cx-2, cy-11), fill=(255, 220, 220, 255))
    return im

def draw_amulet():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 48, 16, 5)
    cx, cy = 28, 28
    # Braided gold chain
    d.arc([cx-14, cy-18, cx+14, cy+6], start=0, end=180, fill=(235, 195, 50, 255), width=2)
    # Sapphire talisman
    d.polygon([(cx, cy-2), (cx+11, cy+10), (cx, cy+22), (cx-11, cy+10)], fill=(30, 120, 230, 255), outline=(15, 60, 140, 255))
    d.polygon([(cx, cy+1), (cx+7, cy+10), (cx, cy+18), (cx-7, cy+10)], fill=(70, 170, 255, 255))
    d.point((cx-2, cy+7), fill=(255, 255, 255, 255))
    return im

def draw_set_cathan_ring():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 44, 15, 5)
    cx, cy = 28, 26
    d.ellipse([cx-13, cy-13, cx+13, cy+13], outline=(245, 150, 30, 255), width=4)
    # Fire ruby surrounded by gold flames
    d.ellipse([cx-7, cy-16, cx+7, cy-2], fill=(255, 50, 20, 255), outline=(140, 20, 10, 255))
    d.point((cx, cy-9), fill=(255, 230, 100, 255))
    return im

def draw_set_cathan_amulet():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 48, 16, 5)
    cx, cy = 28, 28
    d.arc([cx-14, cy-18, cx+14, cy+6], start=0, end=180, fill=(245, 180, 40, 255), width=2)
    # Solar medallion radiating fire
    d.ellipse([cx-10, cy-1, cx+10, cy+19], fill=(255, 80, 20, 255), outline=(235, 195, 50, 255), width=2)
    d.ellipse([cx-5, cy+4, cx+5, cy+14], fill=(255, 220, 60, 255))
    d.point((cx-1, cy+7), fill=(255, 255, 255, 255))
    return im

def draw_scroll():
    im = create_base(56, 56)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 28, 46, 17, 5)
    # Rolled papyrus parchment diagonally
    pts = [(16, 16), (36, 16), (40, 38), (20, 38)]
    d.polygon(pts, fill=(225, 210, 175, 255), outline=(110, 95, 70, 255))
    # Rolled ends
    d.ellipse([13, 14, 19, 20], fill=(240, 225, 190, 255), outline=(90, 75, 50, 255))
    d.ellipse([37, 34, 43, 40], fill=(200, 185, 150, 255), outline=(90, 75, 50, 255))
    # Runic scrawl lines
    for y in [22, 27, 32]:
        d.line([(22, y), (34, y)], fill=(80, 60, 40, 255), width=1)
    # Scarlet ribbon with wax seal
    d.line([(23, 16), (33, 38)], fill=(180, 30, 30, 255), width=2)
    d.ellipse([25, 24, 31, 30], fill=(160, 20, 20, 255), outline=(90, 10, 10, 255))
    d.point((28, 27), fill=(240, 180, 50, 255))
    return im

def draw_blue_portal():
    im = create_base(64, 80)
    d = ImageDraw.Draw(im)
    add_drop_shadow(d, 32, 72, 22, 6, 140)
    cx, cy = 32, 40
    # Outer mystic blue aura
    for r in range(24, 0, -2):
        a = int(180 * (1.0 - r / 24.0))
        d.ellipse([cx - int(r*0.65), cy - r, cx + int(r*0.65), cy + r], fill=(40, 120, 240, a))
    # Bright electric blue swirls
    d.ellipse([cx-12, cy-22, cx+12, cy+22], fill=(80, 190, 255, 200), outline=(200, 240, 255, 255), width=2)
    # Dark gothic abyss center
    d.ellipse([cx-6, cy-15, cx+6, cy+15], fill=(10, 20, 60, 240))
    # Electric lightning sparks
    d.line([(cx-10, cy-10), (cx-4, cy-4), (cx-6, cy+6)], fill=(255, 255, 255, 255), width=1)
    d.line([(cx+8, cy+8), (cx+2, cy+2), (cx+5, cy-8)], fill=(220, 245, 255, 255), width=1)
    return im

items_to_generate = {
    "sprite/item_sword.png": draw_sword,
    "sprite/item_broadsword.png": draw_broadsword,
    "sprite/item_axe.png": draw_axe,
    "sprite/set_berserker_hatchet.png": draw_set_berserker_hatchet,
    "sprite/set_isenhart_sword.png": draw_set_isenhart_sword,
    "sprite/item_buckler.png": draw_buckler,
    "sprite/item_shield_kite.png": draw_kite_shield,
    "sprite/set_sigon_guard.png": draw_set_sigon_guard,
    "sprite/set_isenhart_parry.png": draw_set_isenhart_parry,
    "sprite/item_armor_leather.png": draw_leather_armor,
    "sprite/item_armor_plate.png": draw_plate_armor,
    "sprite/set_sigon_shelter.png": draw_set_sigon_shelter,
    "sprite/set_berserker_armor.png": draw_set_berserker_armor,
    "sprite/set_cathan_mesh.png": draw_set_cathan_mesh,
    "sprite/set_isenhart_case.png": draw_set_isenhart_case,
    "sprite/item_helm_cap.png": draw_cap,
    "sprite/item_helm_horned.png": draw_horned_helm,
    "sprite/set_sigon_visor.png": draw_set_sigon_visor,
    "sprite/set_berserker_helm.png": draw_set_berserker_helm,
    "sprite/set_isenhart_horns.png": draw_set_isenhart_horns,
    "sprite/item_boots.png": draw_boots,
    "sprite/set_sigon_sabatons.png": draw_set_sigon_sabatons,
    "sprite/item_ring.png": draw_ring,
    "sprite/item_amulet.png": draw_amulet,
    "sprite/set_cathan_ring.png": draw_set_cathan_ring,
    "sprite/set_cathan_amulet.png": draw_set_cathan_amulet,
    "sprite/item_scroll.png": draw_scroll,
    "sprite/portal_blue.png": draw_blue_portal
}

for path, fn in items_to_generate.items():
    img = fn()
    img.save(path)
    print(f"Generated {path}: {img.size}")
